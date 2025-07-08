package com.foodyback.service;

import com.foodyback.modele.Reservation;
import com.foodyback.modele.Utilisateur;
import com.foodyback.modele.Place;
import com.foodyback.repository.ReservationRepository;
import com.foodyback.repository.UtilisateurRepository;
import com.foodyback.repository.PlaceRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

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

    public List<Reservation> obtenirReservationsParClient(Long clientId, String sortBy, String sortDir) {
        Sort sort = createSort(sortBy, sortDir);
        return reservationRepository.findByClientId(clientId, sort);
    }

    public Optional<Reservation> obtenirReservationParId(Long id) {
        return reservationRepository.findById(id);
    }

    @Transactional
    public Reservation mettreAJourReservation(Long id, LocalDate date, LocalTime heure, Integer tailleGroupe) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Réservation introuvable"));

        // Vérifier la disponibilité si la date/heure change
        if (!reservation.getDateReservation().equals(date) || !reservation.getHeureReservation().equals(heure)) {
            List<Place> placesDisponibles = placeRepository.findByEstDisponibleTrue().stream()
                    .filter(place -> place.getCapacite() >= tailleGroupe)
                    .filter(place -> reservationRepository.findByDateReservationAndHeureReservation(date, heure).stream()
                            .noneMatch(r -> r.getPlace().getId().equals(place.getId()) && !r.getId().equals(id)))
                    .toList();

            if (placesDisponibles.isEmpty()) {
                throw new IllegalStateException("Aucune table disponible pour la nouvelle date et heure");
            }
            
            reservation.setPlace(placesDisponibles.get(0));
        }

        reservation.setDateReservation(date);
        reservation.setHeureReservation(heure);
        reservation.setTailleGroupe(tailleGroupe);

        return reservationRepository.save(reservation);
    }

    @Transactional
    public void annulerReservation(Long id) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Réservation introuvable"));
        reservation.setStatut(Reservation.Statut.ANNULEE);
        reservationRepository.save(reservation);
    }

    public Long compterReservationsParClient(Long clientId) {
        return reservationRepository.countByClientId(clientId);
    }

    public Integer calculerTotalTailleGroupeClient(Long clientId) {
        return reservationRepository.sumTailleGroupeByClientId(clientId);
    }

    public List<Reservation> obtenirToutesReservations(String sortBy, String sortDir) {
        Sort sort = createSort(sortBy, sortDir);
        return reservationRepository.findAll(sort);
    }

    @Transactional
    public Reservation mettreAJourStatutReservation(Long id, String statut) {
        Reservation reservation = reservationRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Réservation introuvable"));
        
        try {
            Reservation.Statut nouveauStatut = Reservation.Statut.valueOf(statut.toUpperCase());
            reservation.setStatut(nouveauStatut);
            return reservationRepository.save(reservation);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Statut invalide: " + statut);
        }
    }

    @Transactional
    public void supprimerReservation(Long id) {
        if (!reservationRepository.existsById(id)) {
            throw new IllegalArgumentException("Réservation introuvable");
        }
        reservationRepository.deleteById(id);
    }

    public List<Reservation> obtenirReservationsParDate(LocalDate date, String sortBy, String sortDir) {
        Sort sort = createSort(sortBy, sortDir);
        return reservationRepository.findByDateReservation(date, sort);
    }

    public Long compterToutesReservations() {
        return reservationRepository.count();
    }

    public Long compterReservationsParDate(LocalDate date) {
        return reservationRepository.countByDateReservation(date);
    }

    public Integer calculerTotalTailleGroupe() {
        return reservationRepository.sumTailleGroupe();
    }

    public Long compterReservationsParStatut(String statut) {
        try {
            Reservation.Statut statutEnum = Reservation.Statut.valueOf(statut.toUpperCase());
            return reservationRepository.countByStatut(statutEnum);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Statut invalide: " + statut);
        }
    }

    // Méthode utilitaire pour créer les objets Sort
    private Sort createSort(String sortBy, String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
        
        // Mappage des noms de champs pour éviter les erreurs
        String fieldName = switch (sortBy.toLowerCase()) {
            case "date" -> "dateReservation";
            case "heure" -> "heureReservation";
            case "statut" -> "statut";
            case "client" -> "client.nom";
            case "taillegroupe" -> "tailleGroupe";
            default -> "dateReservation";
        };
        
        return Sort.by(direction, fieldName);
    }
}