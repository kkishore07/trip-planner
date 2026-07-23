# Render Cloud Build Stage
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Runtime Stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

EXPOSE 8081

COPY --from=build /app/target/journeymate-backend-1.0.0.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]
