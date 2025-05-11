package com.foodyback.repository;

import com.foodyback.modele.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

/**
 * Dépôt pour gérer les opérations CRUD sur les réservations.
 */
public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    List<Reservation> findByDateReservationAndHeureReservation(LocalDate date, LocalTime heure);
    List<Reservation> findByClientId(Long clientId);
}