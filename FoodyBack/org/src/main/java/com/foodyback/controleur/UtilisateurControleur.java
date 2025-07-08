package com.foodyback.controleur;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.foodyback.repository.UtilisateurRepository;
import com.foodyback.modele.Utilisateur;
import java.util.List;

@RestController
@RequestMapping("/api")
public class UtilisateurControleur {

    private final UtilisateurRepository utilisateurRepository;

    // Constructor injection for UtilisateurRepository
    public UtilisateurControleur(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @GetMapping("/role")
    public String afficherRoleUtilisateur(Authentication authentication) {
        StringBuilder roles = new StringBuilder();
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            roles.append(authority.getAuthority()).append(" ");
        }
        return "Rôles de l'utilisateur : " + roles.toString();
    }

    @GetMapping("/livreurs")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<List<Utilisateur>> obtenirLivreurs() {
        List<Utilisateur> livreurs = utilisateurRepository.findByRole(Utilisateur.Role.LIVREUR);
        return ResponseEntity.ok(livreurs);
    }

    @GetMapping("/utilisateurs/{id}")
    @PreAuthorize("hasAnyRole('CLIENT', 'MANAGER', 'LIVREUR')")
    public ResponseEntity<Utilisateur> getUser(@PathVariable Long id) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        return ResponseEntity.ok(utilisateur);
    }

    @PutMapping("/utilisateurs/{id}")
    @PreAuthorize("hasAnyRole('CLIENT', 'MANAGER', 'LIVREUR')")
    public ResponseEntity<Utilisateur> updateUser(@PathVariable Long id, @RequestBody Utilisateur updatedUser) {
        Utilisateur utilisateur = utilisateurRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé"));
        utilisateur.setNomUtilisateur(updatedUser.getNomUtilisateur());
        utilisateur.setEmail(updatedUser.getEmail());
        utilisateur.setTelephone(updatedUser.getTelephone());
        utilisateurRepository.save(utilisateur);
        return ResponseEntity.ok(utilisateur);
    }
}