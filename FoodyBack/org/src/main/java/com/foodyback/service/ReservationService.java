package com.foodyback.service;

import com.foodyback.modele.Reservation;
import com.foodyback.modele.Utilisateur;
import com.foodyback.modele.Place;
import com.foodyback.repository.ReservationRepository;
import com.foodyback.repository.UtilisateurRepository;
import com.foodyback.repository.PlaceRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class ReservationService {
    private final ReservationRepository reservationRepository;
    private final UtilisateurRepository utilisateurRepository;
    private final PlaceRepository placeRepository;

    public ReservationService(ReservationRepository reservationRepository, UtilisateurRepository utilisateurRepository, PlaceRepository placeRepository) {
        this.reservationRepository = reservationRepository;
        this.utilisateurRepository = utilisateurRepository;
        this.placeRepository = placeRepository;
    }

    @Transactional
    public Reservation creerReservation(Long clientId, LocalDate date, LocalTime heure, Integer tailleGroupe) {
        Utilisateur client = utilisateurRepository.findById(clientId)
                .orElseThrow(() -> new IllegalArgumentException("Client introuvable"));

        List<Place> placesDisponibles = placeRepository.findByEstDisponibleTrue().stream()
                .filter(place -> place.getCapacite() >= tailleGroupe)
                .filter(place -> reservationRepository.findByDateReservationAndHeureReservation(date, heure).stream()
                        .noneMatch(r -> r.getPlace().getId().equals(place.getId())))
                .toList();

        if (placesDisponibles.isEmpty()) {
            throw new IllegalStateException("Aucune table disponible pour la date et l'heure sélectionnées");
        }

        Reservation reservation = new Reservation();
        reservation.setClient(client);
        reservation.setDateReservation(date);
        reservation.setHeureReservation(heure);
        reservation.setTailleGroupe(tailleGroupe);
        reservation.setPlace(placesDisponibles.get(0));
        reservation.setStatut(Reservation.Statut.EN_ATTENTE);

        return reservationRepository.save(reservation);
    }

    @Transactional
    public void annulerReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Réservation introuvable"));
        reservation.setStatut(Reservation.Statut.ANNULEE);
        reservationRepository.save(reservation);
    }
}