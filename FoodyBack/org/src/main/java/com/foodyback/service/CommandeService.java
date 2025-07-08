package com.foodyback.service;

import com.foodyback.modele.Commande;
import com.foodyback.modele.ArticleCommande;
import com.foodyback.modele.Menu;
import com.foodyback.modele.Utilisateur;
import com.foodyback.repository.CommandeRepository;
import com.foodyback.repository.MenuRepository;
import com.foodyback.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service pour la gestion des commandes avec intégrations Paydunya, notifications JMS et tri.
 */
@Service
public class CommandeService {
    private final CommandeRepository commandeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final MenuRepository menuRepository;
    private final PaydunyaService paydunyaService;
    private final NotificationService notificationService;

    @Value("${livraison.frais:5.0}")
    private Double fraisLivraison;

    public CommandeService(CommandeRepository commandeRepository, UtilisateurRepository utilisateurRepository,
                           MenuRepository menuRepository, PaydunyaService paydunyaService,
                           NotificationService notificationService) {
        this.commandeRepository = commandeRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.menuRepository = menuRepository;
        this.paydunyaService = paydunyaService;
        this.notificationService = notificationService;
    }

    @Transactional
    public Commande creerCommande(Long clientId, DemandeCommande demande) {
        Utilisateur client = utilisateurRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client introuvable"));

        Commande commande = new Commande();
        commande.setClient(client);
        commande.setOptionLivraison(Commande.OptionLivraison.valueOf(demande.getOptionLivraison()));
        commande.setAdresse(demande.getOptionLivraison().equals("LIVRAISON") ? demande.getAdresse() : null);
        commande.setStatut(Commande.Statut.EN_PREPARATION);

        double prixTotal = 0.0;
        for (DemandeArticleCommande articleDemande : demande.getArticles()) {
            Menu menu = menuRepository.findById(articleDemande.getMenuId())
                    .orElseThrow(() -> new IllegalArgumentException("Article du menu introuvable : " + articleDemande.getMenuId()));
            if (!menu.getEstActif()) {
                throw new IllegalArgumentException("Article du menu inactif : " + menu.getNom());
            }
            ArticleCommande article = new ArticleCommande();
            article.setCommande(commande);
            article.setMenu(menu);
            article.setQuantite(articleDemande.getQuantite());
            article.setPrix(menu.getPrix());
            commande.getArticles().add(article);
            prixTotal += menu.getPrix() * articleDemande.getQuantite();
        }

        if (demande.getOptionLivraison().equals("LIVRAISON")) {
            commande.setCodeConfirmation(UUID.randomUUID().toString().substring(0, 8));
            commande.setFraisLivraison(fraisLivraison);
            prixTotal += fraisLivraison;
        }
        commande.setPrixTotal(prixTotal);

        String paymentUrl = paydunyaService.initierPaiement(prixTotal, commande.getId() != null ? commande.getId().toString() : UUID.randomUUID().toString(), client.getEmail());

        Commande savedCommande = commandeRepository.save(commande);

        notificationService.notifyClient(savedCommande, "Commande prise en charge. Code de confirmation: " + savedCommande.getCodeConfirmation());
        notificationService.notifyManager(savedCommande);
        if (savedCommande.getOptionLivraison() == Commande.OptionLivraison.LIVRAISON) {
            notificationService.notifyLivreursDisponibles(savedCommande);
        }

        return savedCommande;
    }

    public Optional<Commande> obtenirCommandeParId(Long id) {
        return commandeRepository.findById(id);
    }

    public List<Commande> obtenirCommandesParClient(Long clientId, String sortBy, String sortDir) {
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        return commandeRepository.findByClientId(clientId, sort);
    }

    @Transactional
    public Commande mettreAJourCommande(Long id, DemandeCommande demande) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Commande introuvable"));
        
        if (commande.getStatut() != Commande.Statut.EN_PREPARATION) {
            throw new IllegalArgumentException("Seules les commandes en préparation peuvent être modifiées");
        }

        // Vider les anciens articles
        commande.getArticles().clear();
        
        // Mettre à jour les détails de la commande
        commande.setOptionLivraison(Commande.OptionLivraison.valueOf(demande.getOptionLivraison()));
        commande.setAdresse(demande.getOptionLivraison().equals("LIVRAISON") ? demande.getAdresse() : null);

        double prixTotal = 0.0;
        for (DemandeArticleCommande articleDemande : demande.getArticles()) {
            Menu menu = menuRepository.findById(articleDemande.getMenuId())
                    .orElseThrow(() -> new IllegalArgumentException("Article du menu introuvable : " + articleDemande.getMenuId()));
            if (!menu.getEstActif()) {
                throw new IllegalArgumentException("Article du menu inactif : " + menu.getNom());
            }
            ArticleCommande article = new ArticleCommande();
            article.setCommande(commande);
            article.setMenu(menu);
            article.setQuantite(articleDemande.getQuantite());
            article.setPrix(menu.getPrix());
            commande.getArticles().add(article);
            prixTotal += menu.getPrix() * articleDemande.getQuantite();
        }

        if (demande.getOptionLivraison().equals("LIVRAISON")) {
            if (commande.getCodeConfirmation() == null) {
                commande.setCodeConfirmation(UUID.randomUUID().toString().substring(0, 8));
            }
            commande.setFraisLivraison(fraisLivraison);
            prixTotal += fraisLivraison;
        } else {
            commande.setCodeConfirmation(null);
            commande.setFraisLivraison(null);
        }
        commande.setPrixTotal(prixTotal);

        Commande savedCommande = commandeRepository.save(commande);
        notificationService.notifyClient(savedCommande, "Commande mise à jour avec succès");
        
        return savedCommande;
    }

    @Transactional
    public void annulerCommande(Long commandeId) {
        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new IllegalArgumentException("Commande introuvable"));
        if (commande.getStatut() != Commande.Statut.EN_PREPARATION) {
            throw new IllegalArgumentException("Seules les commandes en préparation peuvent être annulées");
        }
        commande.setStatut(Commande.Statut.ANNULE);
        commandeRepository.save(commande);
        notificationService.notifyClient(commande, "Commande annulée avec succès");
        notificationService.notifyManager(commande);
    }

    public Double calculerTotalCommandesClient(Long clientId) {
        return commandeRepository.calculerTotalCommandesParClient(clientId);
    }

    public Long compterCommandesParStatutClient(Long clientId, String statut) {
        return commandeRepository.countByClientIdAndStatut(clientId, Commande.Statut.valueOf(statut));
    }

    public List<Commande> obtenirToutesCommandes(String sortBy, String sortDir) {
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        return commandeRepository.findAll(sort);
    }

    @Transactional
    public Commande mettreAJourStatutCommande(Long id, String statut) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Commande introuvable"));
        commande.setStatut(Commande.Statut.valueOf(statut));
        Commande updatedCommande = commandeRepository.save(commande);
        if (statut.equals("PRET") && commande.getOptionLivraison() == Commande.OptionLivraison.LIVRAISON) {
            notificationService.notifyLivreursDisponibles(updatedCommande);
        }
        return updatedCommande;
    }

    @Transactional
    public void supprimerCommande(Long id) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Commande introuvable"));
        
        if (commande.getStatut() == Commande.Statut.EN_LIVRAISON) {
            throw new IllegalArgumentException("Impossible de supprimer une commande en cours de livraison");
        }
        
        commandeRepository.delete(commande);
    }

    public List<Commande> obtenirCommandesParStatut(String statut, String sortBy, String sortDir) {
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        return commandeRepository.findByStatut(Commande.Statut.valueOf(statut), sort);
    }

    @Transactional
    public Commande assignerLivreur(Long commandeId, Long livreurId) {
        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new IllegalArgumentException("Commande introuvable"));
        if (commande.getStatut() != Commande.Statut.PRET || commande.getOptionLivraison() != Commande.OptionLivraison.LIVRAISON) {
            throw new IllegalArgumentException("Commande non disponible pour livraison");
        }
        Utilisateur livreur = utilisateurRepository.findById(livreurId)
                .orElseThrow(() -> new IllegalArgumentException("Livreur introuvable"));
        commande.setLivreur(livreur);
        commande.setStatut(Commande.Statut.EN_LIVRAISON);
        Commande savedCommande = commandeRepository.save(commande);
        notificationService.notifyLivreur(livreur, savedCommande, "Nouvelle livraison assignée.");
        return savedCommande;
    }

    public List<Commande> obtenirCommandesParLivreur(Long livreurId, String sortBy, String sortDir) {
        // 👇 Ajoute cette ligne pour vérifier que le livreur existe
        if (!utilisateurRepository.existsById(livreurId)) {
            throw new IllegalArgumentException("Livreur introuvable");
        }

        Sort sort = Sort.by(sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        return commandeRepository.findByLivreurId(livreurId, sort);
    }

    public Double calculerTotalToutesCommandes() {
        return commandeRepository.calculerTotalToutesCommandes();
    }

    public Long compterToutesCommandes() {
        return commandeRepository.count();
    }

    public Long compterCommandesParStatut(String statut) {
        return commandeRepository.countByStatut(Commande.Statut.valueOf(statut));
    }

    @Transactional
    public Commande marquerCommeLivre(Long commandeId, String codeConfirmation) {
        Commande commande = commandeRepository.findById(commandeId)
                .orElseThrow(() -> new IllegalArgumentException("Commande introuvable"));
        if (commande.getOptionLivraison() == Commande.OptionLivraison.LIVRAISON &&
                codeConfirmation.equals(commande.getCodeConfirmation())) {
            commande.setStatut(Commande.Statut.LIVREE);
            Commande savedCommande = commandeRepository.save(commande);
            notificationService.notifyClient(savedCommande, "Commande livrée avec succès");
            return savedCommande;
        } else {
            throw new IllegalArgumentException("Code de confirmation invalide");
        }
    }

    public List<Commande> obtenirCommandesParLivreurAuthentifie(String sortBy, String sortDir) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Utilisateur livreur = utilisateurRepository.findByNomUtilisateur(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Livreur introuvable"));
        
        Sort sort = Sort.by(sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC, sortBy);
        return commandeRepository.findByLivreurId(livreur.getId(), sort);
    }

    public Long compterCommandesLivreurParStatutAuthentifie(String statut) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Utilisateur livreur = utilisateurRepository.findByNomUtilisateur(userDetails.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Livreur introuvable"));
        
        return commandeRepository.countByLivreurIdAndStatut(livreur.getId(), Commande.Statut.valueOf(statut));
    }

    // Classes internes pour les demandes
    public static class DemandeCommande {
        private String optionLivraison;
        private String adresse;
        private List<DemandeArticleCommande> articles;

        public String getOptionLivraison() {
            return optionLivraison;
        }

        public void setOptionLivraison(String optionLivraison) {
            this.optionLivraison = optionLivraison;
        }

        public String getAdresse() {
            return adresse;
        }

        public void setAdresse(String adresse) {
            this.adresse = adresse;
        }

        public List<DemandeArticleCommande> getArticles() {
            return articles;
        }

        public void setArticles(List<DemandeArticleCommande> articles) {
            this.articles = articles;
        }
    }

    public static class DemandeArticleCommande {
        private Long menuId;
        private Integer quantite;

        public Long getMenuId() {
            return menuId;
        }

        public void setMenuId(Long menuId) {
            this.menuId = menuId;
        }

        public Integer getQuantite() {
            return quantite;
        }

        public void setQuantite(Integer quantite) {
            this.quantite = quantite;
        }
    }
}