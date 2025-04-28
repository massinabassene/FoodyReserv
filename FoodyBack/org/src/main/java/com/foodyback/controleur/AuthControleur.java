package com.foodyback.controleur;

import com.foodyback.config.JwtUtil;
import com.foodyback.modele.Utilisateur;
import com.foodyback.repository.UtilisateurRepository;
import com.foodyback.service.ServiceDetailsUtilisateur;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.Arrays;

/**
 * Contrôleur pour gérer l'inscription et la connexion des utilisateurs.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthControleur {
    private final AuthenticationManager authenticationManager;
    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final ServiceDetailsUtilisateur serviceDetailsUtilisateur;

    public AuthControleur(AuthenticationManager authenticationManager, UtilisateurRepository utilisateurRepository,
                          PasswordEncoder passwordEncoder, JwtUtil jwtUtil, ServiceDetailsUtilisateur serviceDetailsUtilisateur) {
        this.authenticationManager = authenticationManager;
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.serviceDetailsUtilisateur = serviceDetailsUtilisateur;
    }

    @PostMapping("/inscription")
    public ResponseEntity<?> inscrireUtilisateur(@Valid @RequestBody DemandeInscription demande) {
        if (utilisateurRepository.findByNomUtilisateur(demande.getNomUtilisateur()).isPresent() ||
                utilisateurRepository.findByEmail(demande.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Nom d'utilisateur ou email déjà utilisé");
        }

        // Valider le rôle
        try {
            Utilisateur.Role.valueOf(demande.getRole());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Rôle invalide. Rôles valides : " + Arrays.toString(Utilisateur.Role.values()));
        }

        Utilisateur utilisateur = new Utilisateur();
        utilisateur.setNomUtilisateur(demande.getNomUtilisateur());
        utilisateur.setMotDePasse(passwordEncoder.encode(demande.getMotDePasse()));
        utilisateur.setEmail(demande.getEmail());
        utilisateur.setTelephone(demande.getTelephone());
        utilisateur.setRole(Utilisateur.Role.valueOf(demande.getRole()));

        utilisateurRepository.save(utilisateur);
        return ResponseEntity.ok("Utilisateur inscrit avec succès");
    }

    @PostMapping("/connexion")
    public ResponseEntity<?> connecterUtilisateur(@RequestBody DemandeConnexion demande) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(demande.getNomUtilisateur(), demande.getMotDePasse()));
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = serviceDetailsUtilisateur.loadUserByUsername(demande.getNomUtilisateur());
        Utilisateur utilisateur = utilisateurRepository.findByNomUtilisateur(demande.getNomUtilisateur())
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur introuvable"));

        String jwt = jwtUtil.generateToken(userDetails.getUsername(), utilisateur.getRole().name(), utilisateur.getId());
        return ResponseEntity.ok(new ReponseJwt(jwt));
    }
}

class DemandeInscription {
    private String nomUtilisateur;
    private String motDePasse;
    private String email;
    private String telephone;
    private String role;

    public String getNomUtilisateur() { return nomUtilisateur; }
    public void setNomUtilisateur(String nomUtilisateur) { this.nomUtilisateur = nomUtilisateur; }
    public String getMotDePasse() { return motDePasse; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getTelephone() { return telephone; }
    public void setTelephone(String telephone) { this.telephone = telephone; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}

class DemandeConnexion {
    private String nomUtilisateur;
    private String motDePasse;

    public String getNomUtilisateur() { return nomUtilisateur; }
    public void setNomUtilisateur(String nomUtilisateur) { this.nomUtilisateur = nomUtilisateur; }
    public String getMotDePasse() { return motDePasse; }
    public void setMotDePasse(String motDePasse) { this.motDePasse = motDePasse; }
}

class ReponseJwt {
    private final String token;

    public ReponseJwt(String token) { this.token = token; }
    public String getToken() { return token; }
}

