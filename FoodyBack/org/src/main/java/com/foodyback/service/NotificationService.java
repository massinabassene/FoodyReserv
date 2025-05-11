package com.foodyback.service;

import com.foodyback.modele.Commande;
import com.foodyback.modele.Utilisateur;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Service;

/**
 * Service pour envoyer des notifications via JMS.
 */
@Service
public class NotificationService {
    private final JmsTemplate jmsTemplate;

    public NotificationService(JmsTemplate jmsTemplate) {
        this.jmsTemplate = jmsTemplate;
    }

    public void notifyClient(Commande commande, String message) {
        String notification = String.format("Client %s: %s", commande.getClient().getEmail(), message);
        jmsTemplate.convertAndSend("client-notifications", notification);
    }

    public void notifyManager(Commande commande) {
        String notification = String.format("Nouvelle commande %s", commande.getId());
        jmsTemplate.convertAndSend("manager-notifications", notification);
    }

    public void notifyLivreursDisponibles(Commande commande) {
        String notification = String.format("Nouvelle mission pour commande %s", commande.getId());
        jmsTemplate.convertAndSend("livreur-notifications", notification);
    }

    public void notifyLivreur(Utilisateur livreur, Commande commande, String message) {
        String notification = String.format("Livreur %s: %s", livreur.getEmail(), message);
        jmsTemplate.convertAndSend("livreur-notifications", notification);
    }
}