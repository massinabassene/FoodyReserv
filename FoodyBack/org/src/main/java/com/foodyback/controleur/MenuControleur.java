package com.foodyback.controleur;

import com.foodyback.modele.Menu;
import com.foodyback.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * Contrôleur pour gérer les opérations liées aux articles du menu.
 */
@RestController
@RequestMapping("/api/menu")
public class MenuControleur {
    private final MenuService menuService;

    public MenuControleur(MenuService menuService) {
        this.menuService = menuService;
    }

    @GetMapping
    public List<Menu> obtenirMenusActifs() {
        return menuService.obtenirMenusActifs();
    }

    @GetMapping("/categorie/{categorie}")
    public List<Menu> obtenirMenusParCategorie(@PathVariable String categorie) {
        return menuService.obtenirMenusParCategorie(categorie);
    }

    @PostMapping
    @PreAuthorize("hasRole('MANAGER')")
    public Menu creerMenu(@Valid @RequestBody Menu menu) {
        return menuService.enregistrerMenu(menu);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Menu> mettreAJourMenu(@PathVariable Long id, @Valid @RequestBody Menu menu) {
        Optional<Menu> menuExistant = menuService.obtenirMenuParId(id);
        if (menuExistant.isPresent()) {
            menu.setId(id);
            return ResponseEntity.ok(menuService.enregistrerMenu(menu));
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> supprimerMenu(@PathVariable Long id) {
        if (menuService.obtenirMenuParId(id).isPresent()) {
            menuService.supprimerMenu(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}