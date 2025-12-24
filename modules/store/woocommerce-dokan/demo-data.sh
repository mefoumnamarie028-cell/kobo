#!/usr/bin/env bash
set -euo pipefail

WP="wp --allow-root"

$WP user get seller1 >/dev/null 2>&1 || $WP user create seller1 seller1@example.com --role=seller --user_pass="Seller123!"
$WP user get seller2 >/dev/null 2>&1 || $WP user create seller2 seller2@example.com --role=seller --user_pass="Seller123!"
$WP user get customer1 >/dev/null 2>&1 || $WP user create customer1 customer1@example.com --role=customer --user_pass="Customer123!"

v1_id=$($WP user get seller1 --field=ID)
v2_id=$($WP user get seller2 --field=ID)

$WP user meta update "$v1_id" dokan_enable_selling yes
$WP user meta update "$v2_id" dokan_enable_selling yes

$WP eval "\
\$social = array_fill_keys(array_keys(dokan_get_social_profile_fields()), '');\
\$settings = [\
  'store_name' => 'Boutique Alpha',\
  'social' => \$social,\
  'payment' => [],\
  'address' => [\
    'street_1' => 'Rue 1',\
    'street_2' => '',\
    'city' => 'Douala',\
    'zip' => 'BP 000',\
    'country' => 'CM',\
    'state' => ''\
  ],\
  'phone' => '+237 690000001',\
  'show_email' => 'no',\
  'location' => '',\
  'find_address' => '',\
  'dokan_category' => '',\
  'banner' => 0,\
  'profile_completion' => [\
    'store_name' => 10,\
    'phone' => 10,\
    'next_todo' => 'banner_val',\
    'progress' => 20,\
    'progress_vals' => [\
      'banner_val' => 15,\
      'profile_picture_val' => 15,\
      'store_name_val' => 10,\
      'address_val' => 10,\
      'phone_val' => 10,\
      'map_val' => 15,\
      'payment_method_val' => 15,\
      'social_val' => [\
        'fb' => 4,\
        'twitter' => 2,\
        'youtube' => 2,\
        'linkedin' => 2,\
      ],\
    ],\
  ],\
];\
update_user_meta($v1_id, 'dokan_profile_settings', \$settings);\
update_user_meta($v1_id, 'dokan_store_name', \$settings['store_name']);\
"

$WP eval "\
\$social = array_fill_keys(array_keys(dokan_get_social_profile_fields()), '');\
\$settings = [\
  'store_name' => 'Boutique Beta',\
  'social' => \$social,\
  'payment' => [],\
  'address' => [\
    'street_1' => 'Avenue 2',\
    'street_2' => '',\
    'city' => 'Yaounde',\
    'zip' => 'BP 001',\
    'country' => 'CM',\
    'state' => ''\
  ],\
  'phone' => '+237 690000002',\
  'show_email' => 'no',\
  'location' => '',\
  'find_address' => '',\
  'dokan_category' => '',\
  'banner' => 0,\
  'profile_completion' => [\
    'store_name' => 10,\
    'phone' => 10,\
    'next_todo' => 'banner_val',\
    'progress' => 20,\
    'progress_vals' => [\
      'banner_val' => 15,\
      'profile_picture_val' => 15,\
      'store_name_val' => 10,\
      'address_val' => 10,\
      'phone_val' => 10,\
      'map_val' => 15,\
      'payment_method_val' => 15,\
      'social_val' => [\
        'fb' => 4,\
        'twitter' => 2,\
        'youtube' => 2,\
        'linkedin' => 2,\
      ],\
    ],\
  ],\
];\
update_user_meta($v2_id, 'dokan_profile_settings', \$settings);\
update_user_meta($v2_id, 'dokan_store_name', \$settings['store_name']);\
"

cat_elec=$($WP term list product_cat --search="Electronique" --field=term_id --format=csv | head -n 1)
[ -n "$cat_elec" ] || cat_elec=$($WP term create product_cat "Electronique" --porcelain)

cat_mode=$($WP term list product_cat --search="Mode" --field=term_id --format=csv | head -n 1)
[ -n "$cat_mode" ] || cat_mode=$($WP term create product_cat "Mode" --porcelain)

cat_maison=$($WP term list product_cat --search="Maison" --field=term_id --format=csv | head -n 1)
[ -n "$cat_maison" ] || cat_maison=$($WP term create product_cat "Maison" --porcelain)

p1=$($WP wc product create --user=admin --name="Smartphone Kobo X" --regular_price="120000" --description="Smartphone 6.5\" 128GB" --short_description="Android, 128GB" --status=publish --porcelain)
$WP post update "$p1" --post_author="$v1_id" >/dev/null
$WP post term add "$p1" product_cat "$cat_elec" >/dev/null

p2=$($WP wc product create --user=admin --name="Ecouteurs Bluetooth" --regular_price="15000" --description="Autonomie 20h" --short_description="Bluetooth 5.2" --status=publish --porcelain)
$WP post update "$p2" --post_author="$v1_id" >/dev/null
$WP post term add "$p2" product_cat "$cat_elec" >/dev/null

p3=$($WP wc product create --user=admin --name="T-shirt Classique" --regular_price="7000" --description="Coton 100%" --short_description="Unisexe" --status=publish --porcelain)
$WP post update "$p3" --post_author="$v2_id" >/dev/null
$WP post term add "$p3" product_cat "$cat_mode" >/dev/null

p4=$($WP wc product create --user=admin --name="Lampe de Bureau" --regular_price="9000" --description="LED, 3 niveaux" --short_description="Lumiere blanche" --status=publish --porcelain)
$WP post update "$p4" --post_author="$v2_id" >/dev/null
$WP post term add "$p4" product_cat "$cat_maison" >/dev/null

echo "Demo data ready"
