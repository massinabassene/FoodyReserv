package com.foodyback.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // Redirections vers Swagger UI
        registry.addRedirectViewController("/", "/swagger-ui/index.html");
        registry.addRedirectViewController("", "/swagger-ui/index.html");
        registry.addRedirectViewController("/docs", "/swagger-ui/index.html");
    }

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("https://foodyreserv.up.railway.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    // Suppression de la configuration des ressources statiques
    // car nous utilisons maintenant Cloudinary pour les images
    // Plus besoin de servir des fichiers locaux
}