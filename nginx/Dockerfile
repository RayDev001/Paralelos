FROM nginx:1.23-alpine

# Eliminamos la conf default
RUN rm /etc/nginx/conf.d/default.conf

# Copiamos nuestra propia config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
