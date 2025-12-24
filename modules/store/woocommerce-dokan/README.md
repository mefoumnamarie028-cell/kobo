# Kobo Store - WooCommerce + Dokan (demo)

Module store multivendeur pour Kobo, base sur WooCommerce + Dokan (free). Ce module est une reference technique a integrer plus tard au backend Kobo.

## Prerequis

- Docker + Docker Compose

## Demarrage rapide

```bash
cd /home/paul/Bureau/Projects/kobo/modules/store/woocommerce-dokan

docker compose up -d

# Premiere installation seulement
# 1) creer le wp-config

docker compose run --rm wpcli --allow-root config create \
  --dbname=wordpress --dbuser=wordpress --dbpass=wordpress --dbhost=db \
  --skip-check --force

# 2) installer WordPress

docker compose run --rm wpcli --allow-root core install \
  --url="http://localhost:8085" --title="WooCommerce Dokan" \
  --admin_user="admin" --admin_password="admin123" --admin_email="admin@example.com" \
  --skip-email

# 3) installer les plugins

docker compose run --rm wpcli --allow-root plugin install woocommerce --activate

docker compose run --rm wpcli --allow-root plugin install dokan-lite --activate

# 4) activer la creation de comptes

docker compose run --rm wpcli --allow-root option update users_can_register 1

docker compose run --rm wpcli --allow-root option update default_role customer

# 5) charger les donnees de demo

docker compose run --rm --entrypoint bash -v $(pwd)/demo-data.sh:/demo-data.sh wpcli -lc '/demo-data.sh'
```

## Acces

- Site: http://localhost:8085
- Admin: http://localhost:8085/wp-admin
- Login admin: admin / admin123

Comptes demo:
- Vendeur 1: seller1 / Seller123! (Boutique Alpha)
- Vendeur 2: seller2 / Seller123! (Boutique Beta)
- Client: customer1 / Customer123!

Pages utiles:
- Liste des boutiques: http://localhost:8085/store/
- Dashboard vendeur: http://localhost:8085/dashboard/

## Depannage permissions (themes / plugins)

Si tu vois "Could not create directory" pour l'installation de themes/plugins:

```bash
docker exec wc_dokan_wordpress sh -lc "chown -R www-data:www-data /var/www/html/wp-content"
```

## API pour l'app mobile

- WooCommerce REST API: http://localhost:8085/wp-json/wc/v3
- Dokan API (vendeurs): http://localhost:8085/wp-json/dokan/v1

Pour utiliser l'API, creer une cle dans:
WooCommerce > Settings > Advanced > REST API

Recommandation: passer par le backend Kobo pour securiser la cle API.
