package com.foodyback.repository;

import com.foodyback.modele.Place;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Dépôt pour gérer les opérations CRUD sur les Places.
 */
public interface PlaceRepository extends JpaRepository<Place, Long> {
    List<Place> findByEstDisponibleTrue();
}