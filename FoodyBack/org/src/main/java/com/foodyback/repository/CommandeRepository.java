package com.foodyback.repository;

import com.foodyback.modele.Commande;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Référentiel pour gérer les commandes avec tri et calculs statistiques.
 */
@Repository
public interface CommandeRepository extends JpaRepository<Commande, Long> {
    
    // Méthodes de recherche avec tri
    List<Commande> findByClientId(Long clientId, Sort sort);
    List<Commande> findByStatut(Commande.Statut statut, Sort sort);
    List<Commande> findByLivreurId(Long livreurId, Sort sort);
    
    // Méthodes de comptage
    Long countByClientIdAndStatut(Long clientId, Commande.Statut statut);
    Long countByStatut(Commande.Statut statut);
    Long countByLivreurIdAndStatut(Long livreurId, Commande.Statut statut);
    
    // Méthodes de calcul des totaux
    @Query("SELECT COALESCE(SUM(c.prixTotal), 0.0) FROM Commande c WHERE c.client.id = :clientId")
    Double calculerTotalCommandesParClient(@Param("clientId") Long clientId);
    
    @Query("SELECT COALESCE(SUM(c.prixTotal), 0.0) FROM Commande c")
    Double calculerTotalToutesCommandes();
    
    @Query("SELECT COALESCE(SUM(c.prixTotal), 0.0) FROM Commande c WHERE c.livreur.id = :livreurId")
    Double calculerTotalCommandesParLivreur(@Param("livreurId") Long livreurId);
    
    @Query("SELECT COALESCE(SUM(c.prixTotal), 0.0) FROM Commande c WHERE c.statut = :statut")
    Double calculerTotalCommandesParStatut(@Param("statut") Commande.Statut statut);
    
    // Méthodes de recherche par critères multiples
    @Query("SELECT c FROM Commande c WHERE c.client.id = :clientId AND c.statut = :statut ORDER BY c.creeLe DESC")
    List<Commande> findByClientIdAndStatut(@Param("clientId") Long clientId, @Param("statut") Commande.Statut statut);
    
    @Query("SELECT c FROM Commande c WHERE c.livreur.id = :livreurId AND c.statut = :statut ORDER BY c.creeLe DESC")
    List<Commande> findByLivreurIdAndStatut(@Param("livreurId") Long livreurId, @Param("statut") Commande.Statut statut);
    
    @Query("SELECT c FROM Commande c WHERE c.optionLivraison = :optionLivraison ORDER BY c.creeLe DESC")
    List<Commande> findByOptionLivraison(@Param("optionLivraison") Commande.OptionLivraison optionLivraison);
    
    // Méthodes pour les statistiques avancées
    @Query("SELECT COUNT(c) FROM Commande c WHERE c.client.id = :clientId")
    Long countByClientId(@Param("clientId") Long clientId);
    
    @Query("SELECT COUNT(c) FROM Commande c WHERE c.livreur.id = :livreurId")
    Long countByLivreurId(@Param("livreurId") Long livreurId);
    
    @Query("SELECT COUNT(c) FROM Commande c WHERE c.optionLivraison = :optionLivraison")
    Long countByOptionLivraison(@Param("optionLivraison") Commande.OptionLivraison optionLivraison);
    
    // Méthodes pour les commandes en attente de livraison
    @Query("SELECT c FROM Commande c WHERE c.statut = 'PRET' AND c.optionLivraison = 'LIVRAISON' AND c.livreur IS NULL ORDER BY c.creeLe ASC")
    List<Commande> findCommandesEnAttenteLivraison();
    
    @Query("SELECT c FROM Commande c WHERE c.statut = 'EN_LIVRAISON' AND c.livreur.id = :livreurId ORDER BY c.creeLe ASC")
    List<Commande> findCommandesEnLivraisonParLivreur(@Param("livreurId") Long livreurId);
    
    // Méthodes pour les recherches par date
    @Query("SELECT c FROM Commande c WHERE DATE(c.creeLe) = CURRENT_DATE ORDER BY c.creeLe DESC")
    List<Commande> findCommandesDuJour();
    
    @Query("SELECT c FROM Commande c WHERE c.client.id = :clientId AND DATE(c.creeLe) = CURRENT_DATE ORDER BY c.creeLe DESC")
    List<Commande> findCommandesDuJourParClient(@Param("clientId") Long clientId);
    
    @Query("SELECT c FROM Commande c WHERE c.livreur.id = :livreurId AND DATE(c.creeLe) = CURRENT_DATE ORDER BY c.creeLe DESC")
    List<Commande> findCommandesDuJourParLivreur(@Param("livreurId") Long livreurId);
    
    // Méthodes pour les statistiques par période
    @Query("SELECT COUNT(c) FROM Commande c WHERE DATE(c.creeLe) = CURRENT_DATE")
    Long countCommandesDuJour();
    
    @Query("SELECT COALESCE(SUM(c.prixTotal), 0.0) FROM Commande c WHERE DATE(c.creeLe) = CURRENT_DATE")
    Double calculerChiffreAffairesDuJour();
    
    @Query("SELECT COUNT(c) FROM Commande c WHERE WEEK(c.creeLe) = WEEK(CURRENT_DATE) AND YEAR(c.creeLe) = YEAR(CURRENT_DATE)")
    Long countCommandesDeLaSemaine();
    
    @Query("SELECT COALESCE(SUM(c.prixTotal), 0.0) FROM Commande c WHERE WEEK(c.creeLe) = WEEK(CURRENT_DATE) AND YEAR(c.creeLe) = YEAR(CURRENT_DATE)")
    Double calculerChiffreAffairesDeLaSemaine();
    
    @Query("SELECT COUNT(c) FROM Commande c WHERE MONTH(c.creeLe) = MONTH(CURRENT_DATE) AND YEAR(c.creeLe) = YEAR(CURRENT_DATE)")
    Long countCommandesDuMois();
    
    @Query("SELECT COALESCE(SUM(c.prixTotal), 0.0) FROM Commande c WHERE MONTH(c.creeLe) = MONTH(CURRENT_DATE) AND YEAR(c.creeLe) = YEAR(CURRENT_DATE)")
    Double calculerChiffreAffairesDuMois();
    
    // Méthodes pour la validation et la sécurité
    @Query("SELECT c FROM Commande c WHERE c.id = :commandeId AND c.client.id = :clientId")
    Optional<Commande> findByIdAndClientId(@Param("commandeId") Long commandeId, @Param("clientId") Long clientId);
    
    @Query("SELECT c FROM Commande c WHERE c.id = :commandeId AND c.livreur.id = :livreurId")
    Optional<Commande> findByIdAndLivreurId(@Param("commandeId") Long commandeId, @Param("livreurId") Long livreurId);
    
    @Query("SELECT c FROM Commande c WHERE c.codeConfirmation = :codeConfirmation AND c.statut = 'EN_LIVRAISON'")
    Optional<Commande> findByCodeConfirmationAndStatutEnLivraison(@Param("codeConfirmation") String codeConfirmation);
}