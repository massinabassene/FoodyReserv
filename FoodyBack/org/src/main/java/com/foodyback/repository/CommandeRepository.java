package com.foodyback.repository;

import com.foodyback.modele.Commande;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Dépôt pour gérer les opérations CRUD sur les commandes.
 */
public interface CommandeRepository extends JpaRepository<Commande, Long> {
    List<Commande> findByClientId(Long clientId);
    List<Commande> findByStatut(Commande.Statut statut);
}