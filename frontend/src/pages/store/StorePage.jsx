import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { products } from '@/data/mockData';
import { Star, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

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

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(p => p.category === selectedCategory);

  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Store" />

      <div className="space-y-6">
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
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="text-xs text-muted-foreground">4.8</span>
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
