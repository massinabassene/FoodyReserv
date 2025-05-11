package com.foodyback.modele;

import jakarta.persistence.*;
import lombok.Data;

/**
 * Entité représentant un article dans une commande.
 */
@Entity
@Data
public class ArticleCommande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "commande_id", nullable = false)
    private Commande commande;

    @ManyToOne
    @JoinColumn(name = "menu_id", nullable = false)
    private Menu menu; // Référence à l'article du menu

    @Column(nullable = false)
    private Integer quantite;

    @Column(nullable = false)
    private Double prix;
}