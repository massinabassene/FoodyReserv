package com.foodyback.controleur;

import com.foodyback.modele.Menu;
import com.foodyback.modele.MenuImage;
import com.foodyback.service.MenuService;
import com.foodyback.service.CloudinaryService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Optional;
import java.util.ArrayList;
import java.io.IOException;
import java.io.InputStream;

/**
 * Contrôleur pour gérer les opérations liées aux articles du menu.
 */
@RestController
@RequestMapping("/api/menu")
public class MenuControleur {
    private final MenuService menuService;
    private final CloudinaryService cloudinaryService;
    private final ObjectMapper objectMapper;

    public MenuControleur(MenuService menuService, CloudinaryService cloudinaryService, ObjectMapper objectMapper) {
        this.menuService = menuService;
        this.cloudinaryService = cloudinaryService;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public List<Menu> obtenirMenusActifs() {
        return menuService.obtenirMenusActifs();
    }

    @GetMapping("/categorie/{categorie}")
    public List<Menu> obtenirMenusParCategorie(@PathVariable String categorie) {
        return menuService.obtenirMenusParCategorie(categorie);
    }

    // Méthode pour gérer multipart/form-data (format original)
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Menu> creerMenuMultipart(
            @RequestPart("menu") @Valid Menu menu,
            @RequestPart(value = "images", required = false) List<MultipartFile> images) {
        
        return processerCreationMenu(menu, images);
    }

    // Méthode pour gérer application/octet-stream
    @PostMapping(consumes = MediaType.APPLICATION_OCTET_STREAM_VALUE)
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Menu> creerMenuOctetStream(
            HttpServletRequest request,
            @RequestParam(value = "menu", required = false) String menuJson) {
        
        try {
            Menu menu;
            
            if (menuJson != null && !menuJson.isEmpty()) {
                // Si les données du menu sont passées en paramètre
                menu = objectMapper.readValue(menuJson, Menu.class);
            } else {
                // Sinon, lire depuis le corps de la requête
                try (InputStream inputStream = request.getInputStream()) {
                    menu = objectMapper.readValue(inputStream, Menu.class);
                }
            }
            
            // Pour le format octet-stream, pas d'images directement
            // Les images doivent être uploadées séparément via l'endpoint dédié
            return processerCreationMenu(menu, null);
            
        } catch (IOException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Méthode pour gérer application/json (plus standard)
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Menu> creerMenuJson(@Valid @RequestBody Menu menu) {
        return processerCreationMenu(menu, null);
    }

    // Méthode générique pour traiter la création du menu
    private ResponseEntity<Menu> processerCreationMenu(Menu menu, List<MultipartFile> images) {
        try {
            // Initialiser la liste des images si elle n'existe pas
            if (menu.getImages() == null) {
                menu.setImages(new ArrayList<>());
            }
            
            // Traiter les images si elles sont fournies
            if (images != null && !images.isEmpty()) {
                for (MultipartFile file : images) {
                    // Valider le fichier
                    if (file.isEmpty()) {
                        continue; // Ignorer les fichiers vides
                    }
                    
                    try {
                        // Uploader l'image vers Cloudinary
                        String imageUrl = cloudinaryService.uploadImage(file, "foodyback/menus");
                        
                        // Créer l'entité MenuImage
                        MenuImage menuImage = new MenuImage();
                        menuImage.setImageUrl(imageUrl);
                        menuImage.setMenu(menu);
                        menu.getImages().add(menuImage);
                        
                    } catch (IOException e) {
                        // Log l'erreur et continuer avec les autres images
                        System.err.println("Erreur lors de l'upload de l'image: " + e.getMessage());
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                    } catch (IllegalArgumentException e) {
                        // Fichier invalide
                        return ResponseEntity.badRequest().build();
                    }
                }
            }
            
            // Sauvegarder le menu avec ses images
            Menu savedMenu = menuService.enregistrerMenu(menu);
            return ResponseEntity.ok(savedMenu);
            
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
        Optional<Menu> menuOpt = menuService.obtenirMenuParId(id);
        if (menuOpt.isPresent()) {
            Menu menu = menuOpt.get();
            
            // Supprimer les images de Cloudinary avant de supprimer le menu
            if (menu.getImages() != null) {
                for (MenuImage menuImage : menu.getImages()) {
                    String publicId = cloudinaryService.extractPublicId(menuImage.getImageUrl());
                    if (publicId != null) {
                        try {
                            cloudinaryService.deleteImage(publicId);
                        } catch (IOException e) {
                            // Log l'erreur mais continuer la suppression
                            System.err.println("Erreur lors de la suppression de l'image Cloudinary: " + e.getMessage());
                        }
                    }
                }
            }
            
            menuService.supprimerMenu(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/{id}/images")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Menu> uploadImages(@PathVariable Long id, @RequestParam("files") List<MultipartFile> files) {
        try {
            Optional<Menu> menuOpt = menuService.obtenirMenuParId(id);
            if (menuOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Menu menu = menuOpt.get();
            
            // Vérifier que des fichiers ont été envoyés
            if (files == null || files.isEmpty()) {
                return ResponseEntity.badRequest().build();
            }
            
            // Initialiser la liste des images si elle n'existe pas
            if (menu.getImages() == null) {
                menu.setImages(new ArrayList<>());
            }
            
            for (MultipartFile file : files) {
                // Ignorer les fichiers vides
                if (file.isEmpty()) {
                    continue;
                }
                
                try {
                    // Uploader l'image vers Cloudinary
                    String imageUrl = cloudinaryService.uploadImage(file, "foodyback/menus");

                    // Créer l'entité MenuImage
                    MenuImage menuImage = new MenuImage();
                    menuImage.setImageUrl(imageUrl);
                    menuImage.setMenu(menu);
                    menu.getImages().add(menuImage);
                    
                } catch (IOException e) {
                    System.err.println("Erreur lors de l'upload de l'image: " + e.getMessage());
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().build();
                }
            }
            
            // Sauvegarder le menu avec les nouvelles images
            Menu savedMenu = menuService.enregistrerMenu(menu);
            
            // S'assurer que le menu sauvegardé n'est pas null
            if (savedMenu == null) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
            
            return ResponseEntity.ok(savedMenu);
            
        } catch (Exception e) {
            e.printStackTrace(); // Pour debug
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{menuId}/images/{imageId}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<Void> supprimerImage(@PathVariable Long menuId, @PathVariable Long imageId) {
        try {
            Optional<Menu> menuOpt = menuService.obtenirMenuParId(menuId);
            if (menuOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Menu menu = menuOpt.get();
            
            // Trouver l'image à supprimer
            MenuImage imageToDelete = null;
            if (menu.getImages() != null) {
                for (MenuImage image : menu.getImages()) {
                    if (image.getId().equals(imageId)) {
                        imageToDelete = image;
                        break;
                    }
                }
            }
            
            if (imageToDelete == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Supprimer l'image de Cloudinary
            String publicId = cloudinaryService.extractPublicId(imageToDelete.getImageUrl());
            if (publicId != null) {
                try {
                    cloudinaryService.deleteImage(publicId);
                } catch (IOException e) {
                    System.err.println("Erreur lors de la suppression de l'image Cloudinary: " + e.getMessage());
                }
            }
            
            // Supprimer l'image de la base de données
            menu.getImages().remove(imageToDelete);
            menuService.enregistrerMenu(menu);
            
            return ResponseEntity.noContent().build();
            
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}