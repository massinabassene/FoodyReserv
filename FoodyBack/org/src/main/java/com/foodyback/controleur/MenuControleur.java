package com.foodyback.controleur;

import com.foodyback.modele.Menu;
import com.foodyback.modele.MenuImage;
import com.foodyback.service.MenuService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.util.UUID;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.Path;
import java.io.IOException;

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
    public ResponseEntity<Menu> creerMenu(
            @RequestPart("menu") @Valid Menu menu,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        
        try {
            // Initialiser la liste des images si elle n'existe pas
            if (menu.getImages() == null) {
                menu.setImages(new ArrayList<>());
            }
            
            // Traiter les images si elles sont fournies
            if (images != null && !images.isEmpty()) {
                String folder = "uploads/menus/";
                Files.createDirectories(Paths.get(folder));
                
                for (MultipartFile file : images) {
                    // Valider le fichier
                    if (file.isEmpty()) {
                        continue; // Ignorer les fichiers vides
                    }
                    
                    // Valider le type de fichier
                    String contentType = file.getContentType();
                    if (contentType == null || !contentType.startsWith("image/")) {
                        return ResponseEntity.badRequest().build();
                    }
                    
                    // Générer un nom de fichier unique
                    String filename = System.currentTimeMillis() + "_" + 
                                   UUID.randomUUID().toString() + "_" + 
                                   file.getOriginalFilename();
                    Path filePath = Paths.get(folder + filename);
                    
                    // Sauvegarder le fichier
                    file.transferTo(filePath);
                    
                    // Créer l'entité MenuImage
                    MenuImage menuImage = new MenuImage();
                    menuImage.setImageUrl("/" + folder + filename);
                    menuImage.setMenu(menu);
                    menu.getImages().add(menuImage);
                }
            }
            
            // Sauvegarder le menu avec ses images
            Menu savedMenu = menuService.enregistrerMenu(menu);
            return ResponseEntity.ok(savedMenu);
            
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
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

    @PostMapping("/{id}/images")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Menu> uploadImages(@PathVariable Long id, @RequestParam("files") List<MultipartFile> files) {
        Optional<Menu> menuOpt = menuService.obtenirMenuParId(id);
        if (menuOpt.isEmpty()) return ResponseEntity.notFound().build();

        Menu menu = menuOpt.get();
        String folder = "uploads/menus/";
        try {
            Files.createDirectories(Paths.get(folder));
            for (MultipartFile file : files) {
                String filename = id + "_" + System.currentTimeMillis() + "_" + file.getOriginalFilename();
                Path filePath = Paths.get(folder + filename);
                file.transferTo(filePath);

                MenuImage menuImage = new MenuImage();
                menuImage.setImageUrl("/" + folder + filename);
                menuImage.setMenu(menu);
                menu.getImages().add(menuImage);
            }
            menuService.enregistrerMenu(menu);
            return ResponseEntity.ok(menu);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}