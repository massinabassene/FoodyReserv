package com.foodyback.modele;

import jakarta.persistence.*;
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
    private Utilisateur client; // Référence à l'utilisateur (client)

    @Column(name = "prix_total", nullable = false)
    private Double prixTotal;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Statut statut = Statut.EN_PREPARATION;

    @Enumerated(EnumType.STRING)
    @Column(name = "option_livraison", nullable = false)
    private OptionLivraison optionLivraison;

    private String adresse;

    @Column(name = "cree_le")
    private LocalDateTime creeLe = LocalDateTime.now();

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ArticleCommande> articles = new ArrayList<>();

    /**
     * Statuts possibles d'une commande.
     */
    public enum Statut {
        EN_PREPARATION, PRET, EN_LIVRAISON, LIVRE, ANNULE
    }

    /**
     * Options de livraison possibles.
     */
    public enum OptionLivraison {
        RECUPERATION, LIVRAISON
    }
}