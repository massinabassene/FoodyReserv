package com.foodyback.modele;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * Entité représentant un feedback d'un client sur un menu, une livraison ou le restaurant.
 */
@Entity
@Data
public class Feedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Utilisateur client;

    @ManyToOne
    @JoinColumn(name = "commande_id")
    private Commande commande;

    @NotBlank(message = "Le type est requis")
    @Size(max = 50, message = "Le type doit avoir moins de 50 caractères")
    private String type; // Ex. "Menu", "Livraison", "Restaurant"

    @NotNull(message = "La note est requise")
    @Min(value = 1, message = "La note doit être entre 1 et 5")
    @Max(value = 5, message = "La note doit être entre 1 et 5")
    private Integer note;

    @Size(max = 500, message = "Le commentaire doit avoir moins de 500 caractères")
    private String commentaire;
}