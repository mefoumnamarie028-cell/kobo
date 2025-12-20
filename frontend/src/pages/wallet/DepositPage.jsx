import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CreditCard, Building2, CheckCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
  { id: 'bank', name: 'Bank Transfer', icon: Building2 },
];

const quickAmounts = [50, 100, 250, 500];

export default function DepositPage() {
  const navigate = useNavigate();
  const { updateBalance, addTransaction } = useApp();
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleDeposit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) return;

    setIsLoading(true);
    setTimeout(() => {
      const depositAmount = parseFloat(amount);
      updateBalance(depositAmount);
      addTransaction({
        id: Date.now().toString(),
        type: 'deposit',
        amount: depositAmount,
        currency: 'USD',
        status: 'completed',
        description: selectedMethod === 'card' ? 'Card Deposit' : 'Bank Transfer',
        createdAt: new Date(),
      });
      setIsLoading(false);
      setIsSuccess(true);
    }, 1500);
  };

  if (isSuccess) {
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
          className="text-2xl font-bold text-foreground mb-2"
        >
          Deposit Successful!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground mb-8"
        >
          ${parseFloat(amount).toFixed(2)} has been added to your wallet
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Button size="lg" onClick={() => navigate('/wallet')}>
            Back to Wallet
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center h-14 px-4">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate('/wallet')}
            className="text-foreground mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Deposit</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Amount Input */}
        <div className="space-y-3">
          <Label>Amount</Label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-semibold text-foreground">
              $
            </span>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="h-16 pl-10 text-2xl font-semibold text-center"
              min="0"
              step="0.01"
            />
          </div>
          <div className="flex gap-2">
            {quickAmounts.map((amt) => (
              <Button
                key={amt}
                variant="outline"
                size="sm"
                onClick={() => setAmount(amt.toString())}
                className={cn(
                  "flex-1",
                  amount === amt.toString() && "border-primary bg-primary/10"
                )}
              >
                ${amt}
              </Button>
            ))}
          </div>
        </div>

        {/* Payment Method */}
        <div className="space-y-3">
          <Label>Payment Method</Label>
          <div className="space-y-2">
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Card
                  key={method.id}
                  className={cn(
                    "cursor-pointer transition-all",
                    selectedMethod === method.id && "border-primary ring-1 ring-primary"
                  )}
                  onClick={() => setSelectedMethod(method.id)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <span className="font-medium text-foreground">{method.name}</span>
                    <div className="ml-auto">
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                        selectedMethod === method.id ? "border-primary" : "border-muted-foreground/30"
                      )}>
                        {selectedMethod === method.id && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Submit */}
        <Button
          size="xl"
          className="w-full"
          onClick={handleDeposit}
          disabled={!amount || parseFloat(amount) <= 0 || isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            `Deposit $${amount || '0.00'}`
          )}
        </Button>
      </div>
    </div>
  );
}
