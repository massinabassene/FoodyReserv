package com.foodyback.controleur;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class UtilisateurControleur {

    @GetMapping("/role")
    public String afficherRoleUtilisateur(Authentication authentication) {
        // Récupérer les rôles de l'utilisateur authentifié
        StringBuilder roles = new StringBuilder();
        
        for (GrantedAuthority authority : authentication.getAuthorities()) {
            roles.append(authority.getAuthority()).append(" ");
        }
        
        // Afficher les rôles dans la réponse
        return "Rôles de l'utilisateur : " + roles.toString();
    }
}
