# Dockerfile pour FoodyReserv API (depuis la racine)
FROM openjdk:17-jdk-slim

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers Gradle depuis le sous-répertoire
COPY FoodyBack/org/gradlew .
COPY FoodyBack/org/gradle gradle
COPY FoodyBack/org/build.gradle .
COPY FoodyBack/org/settings.gradle .

# Copier le code source
COPY FoodyBack/org/src src

# Rendre gradlew exécutable
RUN chmod +x ./gradlew

# Construire l'application (sans les tests)
RUN ./gradlew bootJar --no-daemon -x test

# Exposer le port
EXPOSE 8080

# Démarrer l'application
CMD ["java", "-jar", "build/libs/*.jar"]