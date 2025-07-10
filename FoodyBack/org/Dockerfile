# Étape 1 : Construction avec Gradle Wrapper
FROM gradle:8.5.0-jdk17 AS builder

WORKDIR /app

# Copier les fichiers nécessaires pour le cache des dépendances
COPY build.gradle settings.gradle gradlew gradlew.bat ./
COPY gradle ./gradle

# Télécharger les dépendances (sans compiler encore le projet complet)
RUN ./gradlew build -x test --no-daemon || return 0

# Copier le code source
COPY src ./src

# Construire le projet
RUN ./gradlew clean build -x test --no-daemon

# Étape 2 : Image d'exécution
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copier le JAR compilé
COPY --from=builder /app/build/libs/*.jar app.jar

# Exposer le port utilisé par Spring Boot
EXPOSE 8080

# Commande pour démarrer l'application
ENTRYPOINT ["java", "-jar", "app.jar"]
