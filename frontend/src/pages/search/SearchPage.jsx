import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Search, User, Image, ShoppingBag, TrendingUp } from 'lucide-react';
import { users, stories, products } from '@/data/mockData';
import { cn } from '@/lib/utils';

const trendingSearches = ['NFT', 'Crypto', 'Design', 'Art', 'Music'];

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.username.toLowerCase().includes(query.toLowerCase())
  );

  const filteredProducts = products.filter(p =>
    p.title.toLowerCase().includes(query.toLowerCase()) ||
    p.category.toLowerCase().includes(query.toLowerCase())
  );

  const hasResults = filteredUsers.length > 0 || filteredProducts.length > 0 || stories.length > 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center gap-3 h-14 px-4">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate(-1)}
            className="text-foreground flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users, products, stories..."
              className="pl-9 bg-secondary border-0"
              autoFocus
            />
          </div>
        </div>
      </header>

      <div className="p-4">
        {!query ? (
          // Trending Searches
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-foreground">Trending</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((term) => (
                <Button
                  key={term}
                  variant="secondary"
                  size="sm"
                  onClick={() => setQuery(term)}
                >
                  {term}
                </Button>
              ))}
            </div>

            <h2 className="font-semibold text-foreground mt-8 mb-4">Suggested Users</h2>
            <div className="space-y-2">
              {users.slice(1, 4).map((user, index) => (
                <motion.button
                  key={user.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => navigate(`/profile/${user.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                >
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.username}</p>
                  </div>
                  <Button variant="secondary" size="sm">
                    Follow
                  </Button>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          // Search Results
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full">
              <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
              <TabsTrigger value="users" className="flex-1 gap-1">
                <User className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="products" className="flex-1 gap-1">
                <ShoppingBag className="h-4 w-4" />
                Products
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-4 space-y-6">
              {!hasResults ? (
                <div className="text-center py-12">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No results found for "{query}"</p>
                </div>
              ) : (
                <>
                  {filteredUsers.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Users</h3>
                      <UserResults users={filteredUsers.slice(0, 3)} navigate={navigate} />
                    </div>
                  )}
                  {filteredProducts.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Products</h3>
                      <ProductResults products={filteredProducts.slice(0, 3)} navigate={navigate} />
                    </div>
                  )}
                </>
              )}
            </TabsContent>

            <TabsContent value="users" className="mt-4">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No users found</p>
                </div>
              ) : (
                <UserResults users={filteredUsers} navigate={navigate} />
              )}
            </TabsContent>

            <TabsContent value="products" className="mt-4">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No products found</p>
                </div>
              ) : (
                <ProductResults products={filteredProducts} navigate={navigate} />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}

function UserResults({ users, navigate }) {
  return (
    <Card>
      <CardContent className="p-0 divide-y divide-border/50">
        {users.map((user, index) => (
          <motion.button
            key={user.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/profile/${user.id}`)}
            className="w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors"
          >
            <Avatar className="w-12 h-12">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.username}</p>
            </div>
          </motion.button>
        ))}
      </CardContent>
    </Card>
  );
}

function ProductResults({ products, navigate }) {
  return (
    <Card>
      <CardContent className="p-0 divide-y divide-border/50">
        {products.map((product, index) => (
          <motion.button
            key={product.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/store/${product.id}`)}
            className="w-full flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors"
          >
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-12 h-12 rounded-lg object-cover"
            />
            <div className="flex-1 text-left">
              <p className="font-medium text-foreground">{product.title}</p>
              <p className="text-sm text-primary font-semibold">${product.price.toFixed(2)}</p>
            </div>
          </motion.button>
        ))}
      </CardContent>
    </Card>
  );
}
