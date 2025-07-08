package com.foodyback.controleur;

import com.foodyback.modele.Commande;
import com.foodyback.service.CommandeService;
import com.foodyback.service.CommandeService.DemandeCommande;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Contrôleur pour gérer toutes les opérations liées aux commandes par rôle avec tri et calculs.
 */
@RestController
@RequestMapping("/api/commandes")
public class CommandeControleur {
    private final CommandeService commandeService;

    public CommandeControleur(CommandeService commandeService) {
        this.commandeService = commandeService;
    }

    // CLIENT: Créer une commande
    @PostMapping("/{idClient}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Commande> creerCommande(@PathVariable long idClient, @RequestBody DemandeCommande demande) {
        Commande commande = commandeService.creerCommande(idClient, demande);
        return ResponseEntity.ok(commande);
    }

    // CLIENT: Consulter ses commandes avec tri
    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<Commande>> obtenirCommandesParClient(
            @PathVariable Long clientId,
            @RequestParam(defaultValue = "dateCreation") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(commandeService.obtenirCommandesParClient(clientId, sortBy, sortDir));
    }

    // CLIENT: Consulter une commande spécifique
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MANAGER') or hasRole('LIVREUR')")
    public ResponseEntity<Commande> obtenirCommandeParId(@PathVariable Long id) {
        return commandeService.obtenirCommandeParId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CLIENT: Mettre à jour une commande (avant préparation)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Commande> mettreAJourCommande(@PathVariable Long id, @RequestBody DemandeCommande demande) {
        Commande commande = commandeService.mettreAJourCommande(id, demande);
        return ResponseEntity.ok(commande);
    }

    // CLIENT: Annuler une commande
    @DeleteMapping("/{commandeId}/annuler")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> annulerCommande(@PathVariable Long commandeId) {
        commandeService.annulerCommande(commandeId);
        return ResponseEntity.noContent().build();
    }

    // CLIENT: Calculer le total des commandes
    @GetMapping("/client/{clientId}/total")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Double> calculerTotalCommandesClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(commandeService.calculerTotalCommandesClient(clientId));
    }

    // CLIENT: Compter les commandes par statut
    @GetMapping("/client/{clientId}/count/statut/{statut}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Long> compterCommandesParStatutClient(@PathVariable Long clientId, @PathVariable String statut) {
        return ResponseEntity.ok(commandeService.compterCommandesParStatutClient(clientId, statut));
    }

    // MANAGER: Consulter toutes les commandes avec tri
    @GetMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<Commande>> obtenirToutesCommandes(
            @RequestParam(defaultValue = "dateCreation") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(commandeService.obtenirToutesCommandes(sortBy, sortDir));
    }

    // MANAGER: Mettre à jour le statut
    @PutMapping("/{id}/statut")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Commande> mettreAJourStatutCommande(@PathVariable Long id, @RequestBody DemandeStatut demande) {
        Commande commande = commandeService.mettreAJourStatutCommande(id, demande.getStatut());
        return ResponseEntity.ok(commande);
    }

    // MANAGER: Supprimer une commande
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> supprimerCommande(@PathVariable Long id) {
        commandeService.supprimerCommande(id);
        return ResponseEntity.noContent().build();
    }

    // MANAGER: Consulter les commandes par statut
    @GetMapping("/statut/{statut}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('LIVREUR')")
    public ResponseEntity<List<Commande>> obtenirCommandesParStatut(
            @PathVariable String statut,
            @RequestParam(defaultValue = "dateCreation") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(commandeService.obtenirCommandesParStatut(statut, sortBy, sortDir));
    }

    // MANAGER: Assigner un livreur
    @PostMapping("/{commandeId}/assigner")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Commande> assignerLivreur(@PathVariable Long commandeId, @RequestBody DemandeLivreur demande) {
        Commande commande = commandeService.assignerLivreur(commandeId, demande.getLivreurId());
        return ResponseEntity.ok(commande);
    }

    // MANAGER: Consulter les commandes par livreur
    @GetMapping("/livreur/{livreurId:[0-9]+}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<Commande>> obtenirCommandesParLivreur(
            @PathVariable Long livreurId,
            @RequestParam(defaultValue = "dateCreation") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(commandeService.obtenirCommandesParLivreur(livreurId, sortBy, sortDir));
    }

    // MANAGER: Calculer le total des commandes
    @GetMapping("/total")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Double> calculerTotalToutesCommandes() {
        return ResponseEntity.ok(commandeService.calculerTotalToutesCommandes());
    }

    // MANAGER: Compter toutes les commandes
    @GetMapping("/count")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Long> compterToutesCommandes() {
        return ResponseEntity.ok(commandeService.compterToutesCommandes());
    }

    // MANAGER: Compter les commandes par statut
    @GetMapping("/count/statut/{statut}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Long> compterCommandesParStatut(@PathVariable String statut) {
        return ResponseEntity.ok(commandeService.compterCommandesParStatut(statut));
    }

    // LIVREUR: Accepter une livraison
    @PostMapping("/{commandeId}/accepter")
    @PreAuthorize("hasRole('LIVREUR')")
    public ResponseEntity<Commande> accepterLivraison(@PathVariable Long commandeId, @RequestBody DemandeLivreur demande) {
        Commande commande = commandeService.assignerLivreur(commandeId, demande.getLivreurId());
        return ResponseEntity.ok(commande);
    }

    // LIVREUR: Marquer comme livré
    @PostMapping("/{commandeId}/livrer")
    @PreAuthorize("hasRole('LIVREUR')")
    public ResponseEntity<Commande> marquerCommeLivre(@PathVariable Long commandeId, @RequestBody DemandeCodeConfirmation demande) {
        Commande commande = commandeService.marquerCommeLivre(commandeId, demande.getCodeConfirmation());
        return ResponseEntity.ok(commande);
    }

    // LIVREUR: Consulter ses commandes avec tri
    @GetMapping("/livreur/self")
    @PreAuthorize("hasRole('LIVREUR')")
    public ResponseEntity<List<Commande>> obtenirCommandesLivreurConnecte(
            @RequestParam(defaultValue = "creeLe") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
            
        List<Commande> commandes = commandeService.obtenirCommandesParLivreurAuthentifie(sortBy, sortDir);
        return ResponseEntity.ok(commandes);
    }


    // LIVREUR: Compter ses commandes par statut
    @GetMapping("/livreur/self/count/statut/{statut}")
    @PreAuthorize("hasRole('LIVREUR')")
    public ResponseEntity<Long> compterCommandesLivreurParStatut(@PathVariable String statut) {
        return ResponseEntity.ok(commandeService.compterCommandesLivreurParStatutAuthentifie(statut));
    }

    public static class DemandeStatut {
        private String statut;

        public String getStatut() {
            return statut;
        }

        public void setStatut(String statut) {
            this.statut = statut;
        }
    }

    public static class DemandeLivreur {
        private Long livreurId;

        public Long getLivreurId() {
            return livreurId;
        }

        public void setLivreurId(Long livreurId) {
            this.livreurId = livreurId;
        }
    }

    public static class DemandeCodeConfirmation {
        private String codeConfirmation;

        public String getCodeConfirmation() {
            return codeConfirmation;
        }

        public void setCodeConfirmation(String codeConfirmation) {
            this.codeConfirmation = codeConfirmation;
        }
    }
}