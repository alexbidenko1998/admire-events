FROM php:8-apache
WORKDIR /var/www/html

RUN docker-php-ext-install mysqli

COPY . .

EXPOSE 80
