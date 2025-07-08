package com.foodyback.repository;

import com.foodyback.modele.Reservation;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Dépôt pour gérer les opérations CRUD sur les réservations.
 */
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    
    // Méthodes de base pour les requêtes simples
    List<Reservation> findByDateReservationAndHeureReservation(LocalDate date, LocalTime heure);
    List<Reservation> findByClientId(Long clientId);
    List<Reservation> findByClientId(Long clientId, Sort sort);
    List<Reservation> findByDateReservation(LocalDate date, Sort sort);
    
    // Méthodes de comptage
    Long countByClientId(Long clientId);
    Long countByDateReservation(LocalDate date);
    Long countByStatut(Reservation.Statut statut);
    
    // Méthodes personnalisées avec des requêtes JPQL pour les calculs de somme
    @Query("SELECT COALESCE(SUM(r.tailleGroupe), 0) FROM Reservation r WHERE r.client.id = :clientId")
    Integer sumTailleGroupeByClientId(@Param("clientId") Long clientId);
    
    @Query("SELECT COALESCE(SUM(r.tailleGroupe), 0) FROM Reservation r")
    Integer sumTailleGroupe();
}