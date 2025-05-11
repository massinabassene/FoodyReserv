package com.foodyback.modele;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Entité représentant une commande passée par un client.
 */
@Entity
@Data
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Utilisateur client;

    @Column(name = "prix_total", nullable = false)
    private Double prixTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Statut statut = Statut.EN_PREPARATION;

    @Enumerated(EnumType.STRING)
    @Column(name = "option_livraison", nullable = false)
    private OptionLivraison optionLivraison;

    private String adresse;

    @Column(name = "code_confirmation")
    private String codeConfirmation; // Généré pour livraison

    @Column(name = "frais_livraison")
    private Double fraisLivraison; // Basé sur la zone

    @ManyToOne
    @JoinColumn(name = "livreur_id")
    private Utilisateur livreur; // Livreur assigné

    @Column(name = "cree_le")
    private LocalDateTime creeLe = LocalDateTime.now();

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArticleCommande> articles = new ArrayList<>();

    public enum Statut {
        EN_PREPARATION, PRET, EN_LIVRAISON, LIVRE, ANNULE
    }

    public enum OptionLivraison {
        RECUPERATION, LIVRAISON
    }
}