package com.foodyback.controleur;

import com.foodyback.modele.Commande;
import com.foodyback.service.CommandeService;
import com.foodyback.service.CommandeService.DemandeCommande;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur pour gérer les opérations liées aux commandes.
 */
@RestController
@RequestMapping("/api/commandes")
public class CommandeControleur {
    private final CommandeService commandeService;

    public CommandeControleur(CommandeService commandeService) {
        this.commandeService = commandeService;
    }

    @PostMapping("/{idClient}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Commande> creerCommande(@PathVariable long idClient , @RequestBody  DemandeCommande demande) {
        // À remplacer par l'ID de l'utilisateur authentifié en production
        Commande commande = commandeService.creerCommande(idClient, demande); // Remplacer 1L par l'ID de l'utilisateur authentifié
        return ResponseEntity.ok(commande);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MANAGER')")
    public ResponseEntity<Commande> obtenirCommandeParId(@PathVariable Long id) {
        return commandeService.obtenirCommandeParId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<Commande>> obtenirCommandesParClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(commandeService.obtenirCommandesParClient(clientId));
    }

    @PutMapping("/{id}/statut")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Commande> mettreAJourStatutCommande(@PathVariable Long id, @RequestBody DemandeStatut demande) {
        Commande commande = commandeService.mettreAJourStatutCommande(id, demande.getStatut());
        return ResponseEntity.ok(commande);
    }

    @GetMapping("/statut/{statut}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<Commande>> obtenirCommandesParStatut(@PathVariable String statut) {
        return ResponseEntity.ok(commandeService.obtenirCommandesParStatut(statut));
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
}