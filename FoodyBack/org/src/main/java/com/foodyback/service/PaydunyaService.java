package com.foodyback.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

/**
 * Service pour intégrer l'API de paiement Paydunya.
 */
@Service
public class PaydunyaService {
    @Value("${paydunya.api.key}")
    private String apiKey;

    @Value("${paydunya.api.master-key}")
    private String apiKeyMaster;

    @Value("${paydunya.api.token}")
    private String apiToken;

    @Value("${paydunya.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;

    public PaydunyaService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String initierPaiement(Double montant, String commandeId, String clientEmail) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("PAYDUNYA-MASTER-KEY", apiKeyMaster);
        headers.set("PAYDUNYA-PRIVATE-KEY", apiKey); // Paydunya utilise la même clé pour master et private
        headers.set("PAYDUNYA-TOKEN", apiToken);
        headers.setContentType(org.springframework.http.MediaType.APPLICATION_JSON);

        String body = String.format("""
            {
                "invoice": {
                    "total_amount": %.2f,
                    "description": "Paiement pour commande %s",
                    "currency": "XOF"
                },
                "store": {
                    "name": "FoodyBack",
                    "tagline": "Livraison de repas",
                    "phone": "123456789",
                    "email": "support@foodyback.com",
                    "logo_url": "https://foodyback.com/logo.png",
                    "website_url": "https://foodyback.com"
                },
                "custom_data": {
                    "commande_id": "%s"
                },
                "actions": {
                    "cancel_url": "http://localhost:8080/paiement/cancel",
                    "return_url": "http://localhost:8080/paiement/success",
                    "callback_url": "http://localhost:8080/api/paiements/callback"
                },
                "customer": {
                    "name": "Client FoodyBack",
                    "email": "%s",
                    "phone": "123456789"
                }
            }
            """, montant, commandeId, commandeId, clientEmail);

        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                apiUrl + "/checkout-invoice/create", HttpMethod.POST, entity, String.class
            );
            // Paydunya retourne un JSON avec un champ "response_text" et "token"
            // Exemple : {"response_code": "00", "response_text": "Success", "token": "abc123"}
            return extractPaymentUrl(response.getBody());
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Erreur Paydunya: " + e.getResponseBodyAsString(), e);
        }
    }

    private String extractPaymentUrl(String responseBody) {
        // Simplifié : suppose que la réponse contient un champ "token"
        // En production, parsez le JSON avec Jackson ou Gson
        String token = responseBody.contains("\"token\":") ? responseBody.split("\"token\":\"")[1].split("\"")[0] : "";
        return "https://app.paydunya.com/sandbox-api/v1/checkout-invoice/create/" + token;
    }

    public boolean verifierPaiement(String transactionId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("PAYDUNYA-MASTER-KEY", apiKeyMaster);
        headers.set("PAYDUNYA-PRIVATE-KEY", apiKey);
        headers.set("PAYDUNYA-TOKEN", apiToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                apiUrl + "/checkout-invoice/confirm/" + transactionId, HttpMethod.GET, entity, String.class
            );
            return response.getBody().contains("\"status\": \"completed\"");
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Erreur de vérification Paydunya: " + e.getResponseBodyAsString(), e);
        }
    }
}