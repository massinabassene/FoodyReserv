# Étape 1 : Build avec Gradle Wrapper
FROM gradle:8.5.0-jdk17 AS builder

WORKDIR /app

# Copier les fichiers nécessaires
COPY build.gradle settings.gradle gradlew gradlew.bat ./
COPY gradle ./gradle

# Pré-charger les dépendances
RUN ./gradlew build -x test --no-daemon || true

# Copier le code source
COPY src ./src

# Build du jar exécutable
RUN ./gradlew clean bootJar -x test --no-daemon

# Étape 2 : Image d'exécution
FROM eclipse-temurin:17-jdk-jammy

WORKDIR /app

# Copier le JAR compilé (nom défini dans build.gradle)
COPY --from=builder /app/build/libs/foodyback.jar app.jar

# Exposer le port utilisé par Spring Boot
EXPOSE 8080

# Démarrer l'application
ENTRYPOINT ["java", "-Xmx512m", "-Xms256m", "-XX:MaxMetaspaceSize=128m", "-XX:+UseSerialGC", "-jar", "app.jar"]

