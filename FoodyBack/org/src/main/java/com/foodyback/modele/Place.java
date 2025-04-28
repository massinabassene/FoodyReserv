package com.foodyback.modele;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * Entité représentant une table dans le restaurant.
 */
@Entity
@Data
public class Place {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "La capacité est requise")
    @Positive(message = "La capacité doit être positive")
    private Integer capacite;

    @NotNull(message = "Le numero est requise")
    @Positive(message = "Le numero doit être positive")
    private Integer numero;

    @Column(name = "est_disponible")
    private Boolean estDisponible = true;

    @Size(max = 50, message = "L'emplacement doit avoir moins de 50 caractères")
    private String emplacement;
}