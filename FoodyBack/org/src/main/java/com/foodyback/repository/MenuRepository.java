package com.foodyback.repository;

import com.foodyback.modele.Menu;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Dépôt pour gérer les opérations CRUD sur les articles du menu.
 */
public interface MenuRepository extends JpaRepository<Menu, Long> {
    List<Menu> findByCategorie(String categorie);
    List<Menu> findByEstActifTrue();
}