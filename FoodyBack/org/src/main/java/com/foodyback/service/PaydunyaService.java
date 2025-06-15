package com.foodyback.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Service pour intégrer l'API de paiement Paydunya.
 */
@Service
public class PaydunyaService {
    private static final Logger logger = LoggerFactory.getLogger(PaydunyaService.class);

    @Value("${paydunya.api.master-key}")
    private String apiKeyMaster;

    @Value("${paydunya.api.private-key}")
    private String apiKeyPrivate;

    @Value("${paydunya.api.token}")
    private String apiToken;

    @Value("${paydunya.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public PaydunyaService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public String initierPaiement(Double montant, String commandeId, String clientEmail) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("PAYDUNYA-MASTER-KEY", apiKeyMaster);
        headers.set("PAYDUNYA-PRIVATE-KEY", apiKeyPrivate);
        headers.set("PAYDUNYA-TOKEN", apiToken);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = new HashMap<>();
        Map<String, Object> invoice = new HashMap<>();
        invoice.put("total_amount", montant.intValue()); // Paydunya attend un entier
        invoice.put("description", "Paiement pour commande #" + commandeId);
        invoice.put("currency", "XOF");
        body.put("invoice", invoice);

        Map<String, Object> store = new HashMap<>();
        store.put("name", "FoodyBack");
        store.put("tagline", "Livraison de repas");
        store.put("phone", "123456789");
        store.put("email", "support@foodyback.com");
        store.put("logo_url", "https://foodyback.com/logo.png");
        store.put("website_url", "https://foodyback.com");
        body.put("store", store);

        Map<String, Object> customData = new HashMap<>();
        customData.put("commande_id", commandeId);
        body.put("custom_data", customData);

        Map<String, Object> actions = new HashMap<>();
        actions.put("cancel_url", "http://localhost:8080/paiement/cancel");
        actions.put("return_url", "http://localhost:8080/paiement/success");
        actions.put("callback_url", "http://localhost:8080/api/paiements/callback");
        body.put("actions", actions);

        Map<String, Object> customer = new HashMap<>();
        customer.put("name", "Client FoodyBack");
        customer.put("email", clientEmail);
        customer.put("phone", "123456789");
        body.put("customer", customer);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);
        try {
            logger.debug("Requête Paydunya: headers={}, body={}", headers, body);
            ResponseEntity<String> response = restTemplate.exchange(
                apiUrl + "/sandbox-api/v1/checkout-invoice/create",
                HttpMethod.POST,
                entity,
                String.class
            );
            logger.debug("Réponse Paydunya: {}", response.getBody());
            return extractPaymentUrl(response.getBody());
        } catch (HttpClientErrorException e) {
            logger.error("Erreur Paydunya: status={}, response={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Erreur Paydunya: " + e.getResponseBodyAsString(), e);
        }
    }

    @SuppressWarnings("unchecked")
    private String extractPaymentUrl(String responseBody) {
        try {
            Map<String, Object> response = objectMapper.readValue(responseBody, Map.class);
            String token = (String) response.get("token");
            if (token == null || token.isEmpty()) {
                logger.error("Token Paydunya manquant dans la réponse: {}", responseBody);
                throw new RuntimeException("Token Paydunya manquant");
            }
            return "https://app.paydunya.com/sandbox/checkout-invoice/" + token;
        } catch (Exception e) {
            logger.error("Erreur lors du parsing de la réponse Paydunya: {}", responseBody, e);
            throw new RuntimeException("Erreur lors du parsing de la réponse Paydunya", e);
        }
    }

    public boolean verifierPaiement(String transactionId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("PAYDUNYA-MASTER-KEY", apiKeyMaster);
        headers.set("PAYDUNYA-PRIVATE-KEY", apiKeyPrivate);
        headers.set("PAYDUNYA-TOKEN", apiToken);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        try {
            ResponseEntity<String> response = restTemplate.exchange(
                apiUrl + "/sandbox-api/v1/checkout-invoice/confirm/" + transactionId,
                HttpMethod.GET,
                entity,
                String.class
            );
            logger.debug("Réponse vérification Paydunya: {}", response.getBody());
            return response.getBody().contains("\"status\": \"completed\"");
        } catch (HttpClientErrorException e) {
            logger.error("Erreur vérification Paydunya: status={}, response={}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("Erreur de vérification Paydunya: " + e.getResponseBodyAsString(), e);
        }
    }
}