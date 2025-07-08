package com.foodyback.repository;

import com.foodyback.modele.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Dépôt pour gérer les opérations CRUD sur les utilisateurs.
 */
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByNomUtilisateur(String nomUtilisateur);
    Optional<Utilisateur> findByEmail(String email);
    
    // Trouver tous les utilisateurs par rôle (ex: LIVREUR pour ManagerCommandes)
    List<Utilisateur> findByRole(Utilisateur.Role role);
    
    // Trouver un utilisateur par ID (pour récupération ou mise à jour des données)
    Optional<Utilisateur> findById(Long id);

}