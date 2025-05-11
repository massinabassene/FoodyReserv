package com.foodyback.service;

import com.foodyback.modele.Menu;
import com.foodyback.repository.MenuRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service pour gérer les opérations liées aux articles du menu.
 */
@Service
public class MenuService {
    private final MenuRepository menuRepository;

    public MenuService(MenuRepository menuRepository) {
        this.menuRepository = menuRepository;
    }

    public List<Menu> obtenirMenusActifs() {
        return menuRepository.findByEstActifTrue();
    }

    public List<Menu> obtenirMenusParCategorie(String categorie) {
        return menuRepository.findByCategorie(categorie);
    }

    public Menu enregistrerMenu(Menu menu) {
        return menuRepository.save(menu);
    }

    public Optional<Menu> obtenirMenuParId(Long id) {
        return menuRepository.findById(id);
    }

    public void supprimerMenu(Long id) {
        menuRepository.deleteById(id);
    }
}