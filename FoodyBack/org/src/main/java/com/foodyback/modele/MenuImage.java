package com.foodyback.modele;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Entity
@Data
@EqualsAndHashCode(exclude = "menu") // Exclure menu du equals/hashCode
@ToString(exclude = "menu") // Exclure menu du toString
public class MenuImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "menu_id")
    @JsonBackReference
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