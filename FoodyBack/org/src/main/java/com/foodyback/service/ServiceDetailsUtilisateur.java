package com.foodyback.service;

import com.foodyback.repository.UtilisateurRepository;
import com.foodyback.modele.Utilisateur;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

/**
 * Service pour charger les détails des utilisateurs pour l'authentification.
 */
@Service
public class ServiceDetailsUtilisateur implements UserDetailsService {
    private final UtilisateurRepository utilisateurRepository;

    public ServiceDetailsUtilisateur(UtilisateurRepository utilisateurRepository) {
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String nomUtilisateur) throws UsernameNotFoundException {
        Utilisateur utilisateur = utilisateurRepository.findByNomUtilisateur(nomUtilisateur)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur introuvable : " + nomUtilisateur));
        return new org.springframework.security.core.userdetails.User(
                utilisateur.getNomUtilisateur(),
                utilisateur.getMotDePasse(),
                Collections.singletonList(() -> utilisateur.getRole().name())
        );
    }
}