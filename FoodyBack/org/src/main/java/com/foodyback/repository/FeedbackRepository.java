package com.foodyback.repository;

import com.foodyback.modele.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * Référentiel pour gérer les feedbacks.
 */
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {
    List<Feedback> findByCommandeId(Long commandeId);
}