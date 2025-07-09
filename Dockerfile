FROM openjdk:17-jdk-slim

WORKDIR /app

COPY FoodyBack/org/gradlew .
COPY FoodyBack/org/gradle gradle
COPY FoodyBack/org/build.gradle .
COPY FoodyBack/org/settings.gradle .
COPY FoodyBack/org/src src

RUN chmod +x ./gradlew
RUN ./gradlew bootJar --no-daemon -x test

RUN ls build/libs
RUN cp build/libs/*.jar app.jar

EXPOSE 8080
CMD ["java", "-jar", "app.jar"]
