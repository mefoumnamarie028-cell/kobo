import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Star, ShoppingCart, CheckCircle, Heart, MessageCircle } from 'lucide-react';
import { products, shops, storeChats } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { currentUser, updateBalance, addTransaction } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);

  const product = products.find(p => p.id === productId);
  const shop = shops.find(s => s.id === product?.shopId);
  const storeChat = storeChats.find(chat => chat.store?.id === product?.shopId);

  if (!product) {
    navigate('/store');
    return null;
  }

  const handlePurchase = () => {
    if (product.price > currentUser.balance) {
      navigate('/wallet/deposit');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      updateBalance(-product.price);
      addTransaction({
        id: Date.now().toString(),
        type: 'purchase',
        amount: product.price,
        currency: 'USD',
        status: 'completed',
        description: product.title,
        createdAt: new Date(),
      });
      setIsLoading(false);
      setIsPurchased(true);
    }, 1500);
  };

  if (isPurchased) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6"
        >
          <CheckCircle className="h-10 w-10 text-success" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-foreground mb-2 text-center"
        >
          Purchase Successful!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-center mb-8"
        >
          {product.title} has been added to your account.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex gap-3"
        >
          <Button variant="outline" onClick={() => navigate('/store')}>
            Continue Shopping
          </Button>
          <Button onClick={() => navigate('/profile')}>
            View Profile
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-40 pt-safe">
        <div className="flex items-center h-14 px-4">
          <Button
            variant="glass"
            size="icon"
            onClick={() => navigate('/store')}
            className="bg-background/50 text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Product Image */}
      <div className="relative h-80">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        {product.featured && (
          <Badge className="absolute top-20 right-4 bg-warning text-warning-foreground">
            Featured
          </Badge>
        )}
      </div>

      {/* Content */}
      <div className="p-4 -mt-10 relative space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="secondary" className="mb-2 capitalize">
                    {product.category}
                  </Badge>
                  <h1 className="text-xl font-bold text-foreground">
                    {product.title}
                  </h1>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= Math.round(product.rating) ? 'fill-warning text-warning' : 'text-muted-foreground'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-muted-foreground ml-1">
                    {product.rating} ({product.reviews})
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    {product.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" />
                    {product.comments}
                  </span>
                </div>
              </div>

              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {shop && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <h2 className="text-lg font-semibold text-foreground mb-3">Shop</h2>
            <Card>
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={shop.avatar}
                    alt={shop.name}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-foreground">{shop.name}</h3>
                    <p className="text-xs text-muted-foreground">{shop.category}</p>
                  </div>
                </div>
                {storeChat ? (
                  <Button variant="secondary" onClick={() => navigate(`/chat/${storeChat.id}`)}>
                    Message
                  </Button>
                ) : (
                  <Button variant="secondary">Visit</Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-3">What&apos;s Included</h2>
          <Card>
            <CardContent className="p-4 space-y-3">
              {['Instant delivery', 'Lifetime access', '24/7 support', 'Free updates'].map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle className="h-4 w-4 text-success" />
                  </div>
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Buy Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="pb-safe"
        >
          <Button
            size="xl"
            className="w-full gap-2"
            onClick={handlePurchase}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" />
                {product.price > currentUser.balance ? 'Add Funds to Purchase' : `Buy Now - $${product.price.toFixed(2)}`}
              </>
            )}
          </Button>
          {product.price > currentUser.balance && (
            <p className="text-center text-sm text-muted-foreground mt-2">
              Your balance: ${currentUser.balance.toFixed(2)}
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
