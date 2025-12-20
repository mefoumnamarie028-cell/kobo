import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Building2, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

const quickAmounts = [50, 100, 250, 500];

export default function WithdrawPage() {
  const navigate = useNavigate();
  const { currentUser, updateBalance, addTransaction } = useApp();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleWithdraw = (e) => {
    e.preventDefault();
    setError('');
    
    const withdrawAmount = parseFloat(amount);
    if (!amount || withdrawAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }
    if (withdrawAmount > currentUser.balance) {
      setError('Insufficient balance');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      updateBalance(-withdrawAmount);
      addTransaction({
        id: Date.now().toString(),
        type: 'withdraw',
        amount: withdrawAmount,
        currency: 'USD',
        status: 'pending',
        description: 'Withdrawal to Bank',
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
          Withdrawal Initiated!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-muted-foreground text-center mb-8"
        >
          ${parseFloat(amount).toFixed(2)} will be transferred to your bank account within 1-3 business days.
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
          <h1 className="text-lg font-semibold text-foreground">Withdraw</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Available Balance */}
        <Card className="bg-secondary/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
            <p className="text-2xl font-bold text-foreground">
              ${currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </CardContent>
        </Card>

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
              onChange={(e) => {
                setAmount(e.target.value);
                setError('');
              }}
              placeholder="0.00"
              className={cn(
                "h-16 pl-10 text-2xl font-semibold text-center",
                error && "border-destructive"
              )}
              min="0"
              max={currentUser.balance}
              step="0.01"
            />
          </div>
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
          <div className="flex gap-2">
            {quickAmounts.map((amt) => (
              <Button
                key={amt}
                variant="outline"
                size="sm"
                onClick={() => setAmount(Math.min(amt, currentUser.balance).toString())}
                className={cn(
                  "flex-1",
                  amount === amt.toString() && "border-primary bg-primary/10"
                )}
                disabled={amt > currentUser.balance}
              >
                ${amt}
              </Button>
            ))}
          </div>
        </div>

        {/* Withdraw To */}
        <div className="space-y-3">
          <Label>Withdraw To</Label>
          <Card className="border-primary ring-1 ring-primary">
            <CardContent className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Building2 className="h-5 w-5 text-foreground" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">Bank Account</p>
                <p className="text-sm text-muted-foreground">****4582</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit */}
        <Button
          size="xl"
          className="w-full"
          onClick={handleWithdraw}
          disabled={!amount || parseFloat(amount) <= 0 || isLoading}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            `Withdraw $${amount || '0.00'}`
          )}
        </Button>
      </div>
    </div>
  );
}
