package com.foodyback.modele;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Entité représentant une réservation dans le restaurant.
 */
@Entity
@Table(name = "reservations")
@Data
public class Reservation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La date de réservation est requise")
    @Column(name = "date_reservation")
    private LocalDate dateReservation;

    @NotNull(message = "L'heure de réservation est requise")
    @Column(name = "heure_reservation")
    private LocalTime heureReservation;

    @NotNull(message = "La taille du groupe est requise")
    @Positive(message = "La taille du groupe doit être positive")
    @Column(name = "taille_groupe")
    private Integer tailleGroupe;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le statut est requis")
    private Statut statut;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_id", nullable = false)
    @NotNull(message = "Le client est requis")
    private Utilisateur client;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id", nullable = false)
    @NotNull(message = "La place est requise")
    private Place place;

    public enum Statut {
        EN_ATTENTE, CONFIRMEE, ANNULEE, TERMINEE
    }
    
}