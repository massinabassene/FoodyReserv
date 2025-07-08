package com.foodyback.controleur;

import com.foodyback.modele.Reservation;
import com.foodyback.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Contrôleur pour gérer les opérations liées aux réservations par rôle avec tri et calculs.
 */
@RestController
@RequestMapping("/api/reservations")
public class ReservationControleur {
    private final ReservationService reservationService;

    public ReservationControleur(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    // CLIENT: Créer une réservation
    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Reservation> creerReservation(@RequestBody DemandeReservation demande) {
        Reservation reservation = reservationService.creerReservation(demande.getClientId(), demande.getDate(), demande.getHeure(), demande.getTailleGroupe());
        return ResponseEntity.ok(reservation);
    }

    // CLIENT: Consulter ses réservations avec tri
    @GetMapping("/client/{clientId}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<List<Reservation>> obtenirReservationsParClient(
            @PathVariable Long clientId,
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(reservationService.obtenirReservationsParClient(clientId, sortBy, sortDir));
    }

    // CLIENT: Consulter une réservation spécifique
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MANAGER')")
    public ResponseEntity<Reservation> obtenirReservationParId(@PathVariable Long id) {
        return reservationService.obtenirReservationParId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // CLIENT: Mettre à jour une réservation
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Reservation> mettreAJourReservation(@PathVariable Long id, @RequestBody DemandeReservation demande) {
        Reservation reservation = reservationService.mettreAJourReservation(id, demande.getDate(), demande.getHeure(), demande.getTailleGroupe());
        return ResponseEntity.ok(reservation);
    }

    // CLIENT: Annuler une réservation
    @PutMapping("/{id}/annuler")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> annulerReservation(@PathVariable Long id) {
        reservationService.annulerReservation(id);
        return ResponseEntity.noContent().build();
    }

    // CLIENT: Compter ses réservations
    @GetMapping("/client/{clientId}/count")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Long> compterReservationsParClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(reservationService.compterReservationsParClient(clientId));
    }

    // CLIENT: Calculer la somme des tailles de groupe
    @GetMapping("/client/{clientId}/total-group-size")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Integer> calculerTotalTailleGroupeClient(@PathVariable Long clientId) {
        return ResponseEntity.ok(reservationService.calculerTotalTailleGroupeClient(clientId));
    }

    // MANAGER: Consulter toutes les réservations avec tri
    @GetMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<Reservation>> obtenirToutesReservations(
            @RequestParam(defaultValue = "date") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        return ResponseEntity.ok(reservationService.obtenirToutesReservations(sortBy, sortDir));
    }

    // MANAGER: Mettre à jour le statut d'une réservation
    @PutMapping("/{id}/statut")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Reservation> mettreAJourStatutReservation(@PathVariable Long id, @RequestBody DemandeStatutReservation demande) {
        Reservation reservation = reservationService.mettreAJourStatutReservation(id, demande.getStatut());
        return ResponseEntity.ok(reservation);
    }

    // MANAGER: Supprimer une réservation
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> supprimerReservation(@PathVariable Long id) {
        reservationService.supprimerReservation(id);
        return ResponseEntity.noContent().build();
    }

    // MANAGER: Consulter les réservations par date
    @GetMapping("/date/{date}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<Reservation>> obtenirReservationsParDate(
            @PathVariable LocalDate date,
            @RequestParam(defaultValue = "heure") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {
        return ResponseEntity.ok(reservationService.obtenirReservationsParDate(date, sortBy, sortDir));
    }

    // MANAGER: Compter toutes les réservations
    @GetMapping("/count")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Long> compterToutesReservations() {
        return ResponseEntity.ok(reservationService.compterToutesReservations());
    }

    // MANAGER: Compter les réservations par date
    @GetMapping("/count/date/{date}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Long> compterReservationsParDate(@PathVariable LocalDate date) {
        return ResponseEntity.ok(reservationService.compterReservationsParDate(date));
    }

    // MANAGER: Calculer la somme totale des tailles de groupe
    @GetMapping("/total-group-size")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Integer> calculerTotalTailleGroupe() {
        return ResponseEntity.ok(reservationService.calculerTotalTailleGroupe());
    }

    // MANAGER: Compter les réservations par statut
    @GetMapping("/count/statut/{statut}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Long> compterReservationsParStatut(@PathVariable String statut) {
        return ResponseEntity.ok(reservationService.compterReservationsParStatut(statut));
    }

    public static class DemandeReservation {
        private Long clientId;
        private LocalDate date;
        private LocalTime heure;
        private Integer tailleGroupe;

        public Long getClientId() { return clientId; }
        public void setClientId(Long clientId) { this.clientId = clientId; }
        public LocalDate getDate() { return date; }
        public void setDate(LocalDate date) { this.date = date; }
        public LocalTime getHeure() { return heure; }
        public void setHeure(LocalTime heure) { this.heure = heure; }
        public Integer getTailleGroupe() { return tailleGroupe; }
        public void setTailleGroupe(Integer tailleGroupe) { this.tailleGroupe = tailleGroupe; }
    }

    public static class DemandeStatutReservation {
        private String statut;

        public String getStatut() { return statut; }
        public void setStatut(String statut) { this.statut = statut; }
    }
}