package com.foodyback.controleur;

import com.foodyback.modele.Reservation;
import com.foodyback.service.ReservationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;

@RestController
@RequestMapping("/api/reservations")
public class ReservationControleur {
    private final ReservationService reservationService;

    public ReservationControleur(ReservationService reservationService) {
        this.reservationService = reservationService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Reservation> creerReservation(@RequestBody DemandeReservation demande) {
        Reservation reservation = reservationService.creerReservation(demande.getClientId(), demande.getDate(), demande.getHeure(), demande.getTailleGroupe());
        return ResponseEntity.ok(reservation);
    }

    @PutMapping("/{id}/annuler")
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Void> annulerReservation(@PathVariable Long id) {
        reservationService.annulerReservation(id);
        return ResponseEntity.ok().build();
    }
}

class DemandeReservation {
    private Long clientId;
    private LocalDate date;
    private LocalTime heure;
    private Integer tailleGroupe;

    // Getters et setters
    public Long getClientId() { return clientId; }
    public void setClientId(Long clientId) { this.clientId = clientId; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public LocalTime getHeure() { return heure; }
    public void setHeure(LocalTime heure) { this.heure = heure; }
    public Integer getTailleGroupe() { return tailleGroupe; }
    public void setTailleGroupe(Integer tailleGroupe) { this.tailleGroupe = tailleGroupe; }
}