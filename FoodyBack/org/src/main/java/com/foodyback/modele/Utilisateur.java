package com.foodyback.modele;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

/**
 * Entité représentant un utilisateur (client, gérant ou livreur).
 */
@Entity
@Data
public class Utilisateur {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Le nom d'utilisateur est requis")
    @Size(min = 3, max = 50, message = "Le nom d'utilisateur doit avoir entre 3 et 50 caractères")
    @Column(unique = true)
    private String nomUtilisateur;

    @NotBlank(message = "Le mot de passe est requis")
    @Size(min = 6, message = "Le mot de passe doit avoir au moins 6 caractères")
    private String motDePasse;

    @NotBlank(message = "L'email est requis")
    @Email(message = "L'email doit être valide")
    @Column(unique = true)
    private String email;

    @Size(max = 20, message = "Le numéro de téléphone doit avoir moins de 20 caractères")
    private String telephone;

    @Enumerated(EnumType.STRING)
    @NotNull(message = "Le rôle est requis")
    private Role role;

    public enum Role {
        CLIENT, MANAGER, LIVREUR
    }
}