# Configuration de Nginx
FROM nginx:alpine

# Suppression des fichiers de configuration existants de Nginx
RUN rm /etc/nginx/conf.d/*

# Copie du fichier de configuration personnalisé
COPY nginx.conf /etc/nginx/conf.d/

# Copie de l'application construite dans le répertoire de serveur Nginx
COPY dist/ /usr/share/nginx/html/

# Exposition du port 80
EXPOSE 80

# Commande de démarrage du conteneur Nginx
CMD ["nginx", "-g", "daemon off;"]
