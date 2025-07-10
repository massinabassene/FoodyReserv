# Étape 1 : Build de l'application React
FROM node:20 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

RUN npm install jwt-decode

# Copier le reste du code
COPY . ./

# Construire l'application
RUN npm run build

# Étape 2 : Servir l'application avec serve
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers buildés
COPY --from=build /app/build ./build

# Copier package.json pour éviter les erreurs ENOENT
COPY --from=build /app/package.json ./package.json

# Installer serve
RUN npm install -g serve@14.2.4

# Exposer le port
EXPOSE 3000

# Lancer serve avec l'option -s pour rediriger toutes les requêtes vers index.html
CMD ["serve", "-s", "build", "-l", "3000"]