package com.foodyback.repository;

import com.foodyback.modele.Commande;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Référentiel pour gérer les commandes avec tri.
 */
public interface CommandeRepository extends JpaRepository<Commande, Long> {
    List<Commande> findByClientId(Long clientId, Sort sort);
    List<Commande> findByStatut(Commande.Statut statut, Sort sort);
    List<Commande> findByLivreurId(Long livreurId, Sort sort);
}