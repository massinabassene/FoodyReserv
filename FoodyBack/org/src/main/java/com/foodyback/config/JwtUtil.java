package com.foodyback.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtParser;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.SignatureException;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import com.foodyback.modele.Utilisateur;

import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import javax.crypto.SecretKey;

/**
 * Utilitaire pour gérer la création et la validation des tokens JWT.
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretString;

    @Value("${jwt.expiration}")
    private Long expiration;

    private SecretKey secretKey;
    private JwtParser jwtParser;

    @PostConstruct
    public void init() {
        this.secretKey = Keys.hmacShaKeyFor(secretString.getBytes(StandardCharsets.UTF_8));
        this.jwtParser = Jwts.parser().verifyWith(secretKey).build();
    }

    /**
     * Génère un token JWT avec toutes les informations de l'utilisateur
     */
    public String generateToken(Utilisateur utilisateur) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", utilisateur.getId());
        claims.put("role", utilisateur.getRole().name());
        claims.put("email", utilisateur.getEmail());
        claims.put("telephone", utilisateur.getTelephone());
        
        return Jwts.builder()
                .claims(claims)
                .subject(utilisateur.getNomUtilisateur())
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey)
                .compact();
    }

    /**
     * Méthode de compatibilité (optionnelle si vous voulez garder l'ancienne signature)
     */
    public String generateToken(String username, String role, Long userId, String email, String telephone) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("userId", userId);
        claims.put("email", email);
        claims.put("telephone", telephone);
        
        
        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(secretKey)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        Claims claims = jwtParser.parseSignedClaims(token).getPayload();
        return claims.getSubject();
    }

    public Long getUserIdFromToken(String token) {
        Claims claims = jwtParser.parseSignedClaims(token).getPayload();
        return claims.get("userId", Long.class);
    }

    public String getRoleFromToken(String token) {
        Claims claims = jwtParser.parseSignedClaims(token).getPayload();
        return claims.get("role", String.class);
    }

    public String getEmailFromToken(String token) {
        Claims claims = jwtParser.parseSignedClaims(token).getPayload();
        return claims.get("email", String.class);
    }

    public String getTelephoneFromToken(String token) {
        Claims claims = jwtParser.parseSignedClaims(token).getPayload();
        return claims.get("telephone", String.class);
    }

    /**
     * Extrait toutes les informations utilisateur du token
     */
    public UserTokenInfo getUserInfoFromToken(String token) {
        Claims claims = jwtParser.parseSignedClaims(token).getPayload();
        
        return new UserTokenInfo(
            claims.get("userId", Long.class),
            claims.getSubject(), // username
            claims.get("role", String.class),
            claims.get("email", String.class),
            claims.get("telephone", String.class)
        );
    }

    public boolean validateToken(String token, String username) {
        try {
            String extractedUsername = getUsernameFromToken(token);
            return extractedUsername.equals(username) && !isTokenExpired(token);
        } catch (SignatureException e) {
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {
        Claims claims = jwtParser.parseSignedClaims(token).getPayload();
        return claims.getExpiration().before(new Date());
    }

    /**
     * Classe interne pour encapsuler les informations utilisateur extraites du token
     */
    public static class UserTokenInfo {
        private final Long userId;
        private final String username;
        private final String role;
        private final String email;
        private final String telephone;

        public UserTokenInfo(Long userId, String username, String role, String email, String telephone) {
            this.userId = userId;
            this.username = username;
            this.role = role;
            this.email = email;
            this.telephone = telephone;
        }

        // Getters
        public Long getUserId() { return userId; }
        public String getUsername() { return username; }
        public String getRole() { return role; }
        public String getEmail() { return email; }
        public String getTelephone() { return telephone; }
    }
}