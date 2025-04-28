package com.foodyback.controleur;

import com.foodyback.modele.Place;
import com.foodyback.repository.PlaceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur pour gérer les places (tables) du restaurant.
 */
@RestController
@RequestMapping("/api/tables")
public class PlaceControleur {
    private final PlaceRepository placeRepository;

    public PlaceControleur(PlaceRepository placeRepository) {
        this.placeRepository = placeRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Place> creerPlace(@RequestBody Place place) {
        Place savedPlace = placeRepository.save(place);
        return ResponseEntity.ok(savedPlace);
    }

    @GetMapping
    public ResponseEntity<List<Place>> listerPlaces() {
        return ResponseEntity.ok(placeRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Place> obtenirPlaceParId(@PathVariable Long id) {
        return placeRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Place> mettreAJourPlace(@PathVariable Long id, @RequestBody Place placeDetails) {
        return placeRepository.findById(id)
                .map(place -> {
                    place.setNumero(placeDetails.getNumero());
                    place.setCapacite(placeDetails.getCapacite());
                    place.setEstDisponible(placeDetails.getEstDisponible());
                    Place updatedPlace = placeRepository.save(place);
                    return ResponseEntity.ok(updatedPlace);
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> supprimerPlace(@PathVariable Long id) {
        return placeRepository.findById(id)
                .map(place -> {
                    placeRepository.delete(place);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}