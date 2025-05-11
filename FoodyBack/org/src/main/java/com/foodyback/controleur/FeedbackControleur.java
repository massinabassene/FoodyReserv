package com.foodyback.controleur;

import com.foodyback.modele.Feedback;
import com.foodyback.repository.FeedbackRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Contrôleur pour gérer les feedbacks des clients.
 */
@RestController
@RequestMapping("/api/feedbacks")
public class FeedbackControleur {
    private final FeedbackRepository feedbackRepository;

    public FeedbackControleur(FeedbackRepository feedbackRepository) {
        this.feedbackRepository = feedbackRepository;
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENT')")
    public ResponseEntity<Feedback> creerFeedback(@RequestBody Feedback feedback) {
        Feedback savedFeedback = feedbackRepository.save(feedback);
        return ResponseEntity.ok(savedFeedback);
    }

    @GetMapping("/commande/{commandeId}")
    @PreAuthorize("hasRole('CLIENT') or hasRole('MANAGER')")
    public ResponseEntity<List<Feedback>> obtenirFeedbacksParCommande(@PathVariable Long commandeId) {
        return ResponseEntity.ok(feedbackRepository.findByCommandeId(commandeId));
    }
}