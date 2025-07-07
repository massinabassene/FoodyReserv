package com.foodyback.modele;

import jakarta.persistence.*;

@Entity
public class MenuImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "menu_id")
    private Menu menu;

    // getters et setters
    public Long getId() {
        return id;
    }
    public String getImageUrl() {
        return imageUrl;
    }
    public Menu getMenu() {
        return menu;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public void setMenu(Menu menu) {
        this.menu = menu;
    }
}