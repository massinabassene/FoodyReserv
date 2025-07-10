package com.foodyback.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    /**
     * Upload une image vers Cloudinary
     * @param file Le fichier à uploader
     * @param folder Le dossier dans Cloudinary (optionnel)
     * @return L'URL de l'image uploadée
     * @throws IOException En cas d'erreur d'upload
     */
    public String uploadImage(MultipartFile file, String folder) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Le fichier ne peut pas être vide");
        }

        // Valider le type de fichier
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Le fichier doit être une image");
        }

        // Générer un nom unique pour l'image
        String publicId = UUID.randomUUID().toString();
        
        // Préparer les options d'upload
        Map<String, Object> uploadOptions = ObjectUtils.asMap(
            "public_id", publicId,
            "folder", folder != null ? folder : "foodyback/menus",
            "resource_type", "image",
            "quality", "auto:good",
            "format", "auto"
        );

        // Effectuer l'upload
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);
        
        // Retourner l'URL sécurisée
        return (String) uploadResult.get("secure_url");
    }

    /**
     * Supprime une image de Cloudinary
     * @param publicId L'ID public de l'image à supprimer
     * @throws IOException En cas d'erreur de suppression
     */
    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    /**
     * Extrait l'ID public d'une URL Cloudinary
     * @param imageUrl L'URL de l'image
     * @return L'ID public ou null si l'URL n'est pas valide
     */
    public String extractPublicId(String imageUrl) {
        if (imageUrl == null || !imageUrl.contains("cloudinary.com")) {
            return null;
        }
        
        try {
            // Extraire la partie après le dernier '/' et avant l'extension
            String[] parts = imageUrl.split("/");
            String lastPart = parts[parts.length - 1];
            
            // Enlever l'extension
            int dotIndex = lastPart.lastIndexOf('.');
            if (dotIndex > 0) {
                return lastPart.substring(0, dotIndex);
            }
            return lastPart;
        } catch (Exception e) {
            return null;
        }
    }
}