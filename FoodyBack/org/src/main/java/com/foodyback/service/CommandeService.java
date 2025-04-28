package com.foodyback.service;

import com.foodyback.modele.Commande;
import com.foodyback.modele.ArticleCommande;
import com.foodyback.modele.Menu;
import com.foodyback.modele.Utilisateur;
import com.foodyback.repository.CommandeRepository;
import com.foodyback.repository.MenuRepository;
import com.foodyback.repository.UtilisateurRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service pour la gestion des commandes.
 */
@Service
public class CommandeService {
    private final CommandeRepository commandeRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final MenuRepository menuRepository;

    public CommandeService(CommandeRepository commandeRepository, UtilisateurRepository utilisateurRepository, MenuRepository menuRepository) {
        this.commandeRepository = commandeRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.menuRepository = menuRepository;
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
        commande.setPrixTotal(prixTotal);

        return commandeRepository.save(commande);
    }

    public Optional<Commande> obtenirCommandeParId(Long id) {
        return commandeRepository.findById(id);
    }

    public List<Commande> obtenirCommandesParClient(Long clientId) {
        return commandeRepository.findByClientId(clientId);
    }

    @Transactional
    public Commande mettreAJourStatutCommande(Long id, String statut) {
        Commande commande = commandeRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Commande introuvable"));
        commande.setStatut(Commande.Statut.valueOf(statut));
        return commandeRepository.save(commande);
    }

    public List<Commande> obtenirCommandesParStatut(String statut) {
        return commandeRepository.findByStatut(Commande.Statut.valueOf(statut));
    }

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