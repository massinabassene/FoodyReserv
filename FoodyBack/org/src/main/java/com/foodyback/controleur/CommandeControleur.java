package com.foodyback.controleur;

import com.foodyback.modele.Commande;
import com.foodyback.service.CommandeService;
import com.foodyback.service.CommandeService.DemandeCommande;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur pour gérer toutes les opérations liées aux commandes par rôle avec tri.
 */
@RestController
@RequestMapping("/api/commandes")
public class CommandeControleur {
    private final CommandeService commandeService;

    public CommandeControleur(CommandeService commandeService) {
        this.commandeService = commandeService;
    }

    // Client : Créer une commande
    @PostMapping("/{idClient}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Commande> creerCommande(@PathVariable long idClient, @RequestBody DemandeCommande demande) {
        Commande commande = commandeService.creerCommande(idClient, demande);
        return ResponseEntity.ok(commande);
    }

    // Client, Manager, Livreur : Consulter une commande spécifique
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MANAGER') or hasRole('LIVREUR')")
    public ResponseEntity<Commande> obtenirCommandeParId(@PathVariable Long id) {
        return commandeService.obtenirCommandeParId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Client : Consulter ses commandes avec tri
    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<Commande>> obtenirCommandesParClient(
            @PathVariable Long clientId,
            @RequestParam(defaultValue = "dateCreation") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(commandeService.obtenirCommandesParClient(clientId, sortBy, sortDir));
    }

    // Client : Annuler une commande
    @DeleteMapping("/{commandeId}/annuler")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> annulerCommande(@PathVariable Long commandeId) {
        commandeService.annulerCommande(commandeId);
        return ResponseEntity.noContent().build();
    }

    // Manager : Consulter toutes les commandes avec tri
    @GetMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<Commande>> obtenirToutesCommandes(
            @RequestParam(defaultValue = "dateCreation") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(commandeService.obtenirToutesCommandes(sortBy, sortDir));
    }

    // Manager : Mettre à jour le statut
    @PutMapping("/{id}/statut")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Commande> mettreAJourStatutCommande(@PathVariable Long id, @RequestBody DemandeStatut demande) {
        Commande commande = commandeService.mettreAJourStatutCommande(id, demande.getStatut());
        return ResponseEntity.ok(commande);
    }

    // Manager, Livreur : Consulter les commandes par statut
    @GetMapping("/statut/{statut}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('LIVREUR')")
    public ResponseEntity<List<Commande>> obtenirCommandesParStatut(
            @PathVariable String statut,
            @RequestParam(defaultValue = "dateCreation") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(commandeService.obtenirCommandesParStatut(statut, sortBy, sortDir));
    }

    // Manager : Assigner un livreur
    @PostMapping("/{commandeId}/assigner")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Commande> assignerLivreur(@PathVariable Long commandeId, @RequestBody DemandeLivreur demande) {
        Commande commande = commandeService.assignerLivreur(commandeId, demande.getLivreurId());
        return ResponseEntity.ok(commande);
    }

    // Manager : Consulter les commandes par livreur
    @GetMapping("/livreur/{livreurId}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<Commande>> obtenirCommandesParLivreur(
            @PathVariable Long livreurId,
            @RequestParam(defaultValue = "dateCreation") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(commandeService.obtenirCommandesParLivreur(livreurId, sortBy, sortDir));
    }

    // Livreur : Accepter une livraison
    @PostMapping("/{commandeId}/accepter")
    @PreAuthorize("hasRole('LIVREUR')")
    public ResponseEntity<Commande> accepterLivraison(@PathVariable Long commandeId, @RequestBody DemandeLivreur demande) {
        Commande commande = commandeService.assignerLivreur(commandeId, demande.getLivreurId());
        return ResponseEntity.ok(commande);
    }

    // Livreur : Marquer comme livré
    @PostMapping("/{commandeId}/livrer")
    @PreAuthorize("hasRole('LIVREUR')")
    public ResponseEntity<Commande> marquerCommeLivre(@PathVariable Long commandeId, @RequestBody DemandeCodeConfirmation demande) {
        Commande commande = commandeService.marquerCommeLivre(commandeId, demande.getCodeConfirmation());
        return ResponseEntity.ok(commande);
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