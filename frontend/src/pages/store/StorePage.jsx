import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { products, shops } from '@/data/mockData';
import { Star, Sparkles, Heart, MessageCircle } from 'lucide-react';

const categories = [
  { id: 'all', name: 'All' },
  { id: 'avatars', name: 'Avatars' },
  { id: 'badges', name: 'Badges' },
  { id: 'themes', name: 'Themes' },
  { id: 'tools', name: 'Tools' },
  { id: 'stickers', name: 'Stickers' },
];

export default function StorePage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const shopMap = useMemo(() => new Map(shops.map((shop) => [shop.id, shop])), []);

  const formatCount = (value) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return `${value}`;
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Store" />

      <div className="space-y-6">
        {/* Shops */}
        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-foreground">Shops</h2>
            <Button variant="ghost" size="sm" className="text-primary">
              View all
            </Button>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {shops.map((shop, index) => (
              <motion.div
                key={shop.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-[220px]"
              >
                <Card className="h-full">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={shop.avatar}
                        alt={shop.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{shop.name}</h3>
                        <p className="text-xs text-muted-foreground">{shop.category}</p>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {shop.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{shop.items} items</span>
                      <span>{formatCount(shop.followers)} followers</span>
                    </div>
                    <Button size="sm" variant="secondary" className="w-full">
                      Visit Shop
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Featured Section */}
        <div className="px-4 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-warning" />
            <h2 className="text-lg font-semibold text-foreground">Featured</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex-shrink-0 w-[280px]"
              >
                <Card
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/store/${product.id}`)}
                >
                  <div className="relative h-36">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                    <Badge className="absolute top-3 right-3 bg-warning text-warning-foreground">
                      Featured
                    </Badge>
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-primary-foreground font-semibold truncate">
                        {product.title}
                      </h3>
                      <p className="text-primary-foreground/80 text-sm">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="px-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex-shrink-0"
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="px-4 pb-6">
          <div className="grid grid-cols-2 gap-4">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col"
                  onClick={() => navigate(`/store/${product.id}`)}
                >
                  <div className="relative aspect-square">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-3 flex-1 flex flex-col">
                    <h3 className="font-medium text-foreground text-sm mb-1 line-clamp-2">
                      {product.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2">
                      {shopMap.get(product.shopId)?.name}
                    </p>
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="text-xs text-muted-foreground">
                        {product.rating} ({product.reviews})
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3" />
                        <span>{formatCount(product.likes)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        <span>{formatCount(product.comments)}</span>
                      </div>
                    </div>
                    <p className="text-primary font-semibold mt-auto">
                      ${product.price.toFixed(2)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
