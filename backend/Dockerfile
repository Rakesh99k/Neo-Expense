# Stage 1: Build the JAR using Maven
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml first (Docker caches this layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code
COPY src ./src

# Build JAR, skip tests (tests already pass locally)
RUN mvn clean package -DskipTests

# Stage 2: Run the JAR with lightweight JRE
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy JAR from build stage
COPY --from=build /app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Expose port
EXPOSE 8080

# Start the app
ENTRYPOINT ["java", "-jar", "app.jar"]