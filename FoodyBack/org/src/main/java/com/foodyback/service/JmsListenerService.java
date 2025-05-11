package com.foodyback.service;

import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

/**
 * Écouteur JMS pour traiter les notifications.
 */
@Component
public class JmsListenerService {
    @JmsListener(destination = "client-notifications")
    public void onClientNotification(String message) {
        // Implémenter l'envoi d'email/SMS (ex. JavaMail, Twilio)
        System.out.println("Notification client reçue: " + message);
    }

    @JmsListener(destination = "manager-notifications")
    public void onManagerNotification(String message) {
        System.out.println("Notification manager reçue: " + message);
    }

    @JmsListener(destination = "livreur-notifications")
    public void onLivreurNotification(String message) {
        System.out.println("Notification livreur reçue: " + message);
    }
}