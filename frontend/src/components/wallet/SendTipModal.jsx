import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DollarSign, CheckCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const quickAmounts = [5, 10, 25, 50];

export function SendTipModal({ open, onClose, recipient }) {
  const { currentUser, updateBalance, addTransaction } = useApp();
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendTip = () => {
    const tipAmount = parseFloat(amount);
    if (!tipAmount || tipAmount <= 0 || tipAmount > currentUser.balance) return;

    setIsLoading(true);
    setTimeout(() => {
      updateBalance(-tipAmount);
      addTransaction({
        id: Date.now().toString(),
        type: 'tip_sent',
        amount: tipAmount,
        currency: 'USD',
        status: 'completed',
        description: `Tip to ${recipient?.username || '@user'}`,
        recipient,
        createdAt: new Date(),
      });
      setIsLoading(false);
      setIsSuccess(true);
    }, 1000);
  };

  const handleClose = () => {
    onClose();
    // Reset after animation
    setTimeout(() => {
      setAmount('');
      setMessage('');
      setIsSuccess(false);
    }, 200);
  };

  if (!recipient) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center py-6"
            >
              <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Tip Sent!</h3>
              <p className="text-muted-foreground text-center mb-6">
                You sent ${parseFloat(amount).toFixed(2)} to {recipient.name}
              </p>
              <Button onClick={handleClose} className="w-full">
                Done
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <DialogHeader>
                <DialogTitle>Send Tip</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 pt-4">
                {/* Recipient */}
                <div className="flex items-center gap-4 p-4 bg-secondary/50 rounded-xl">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={recipient.avatar} alt={recipient.name} />
                    <AvatarFallback>{recipient.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{recipient.name}</p>
                    <p className="text-sm text-muted-foreground">{recipient.username}</p>
                  </div>
                </div>

                {/* Amount Input */}
                <div className="space-y-3">
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
                    <Input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="h-14 pl-12 text-xl font-semibold"
                      min="0"
                      max={currentUser.balance}
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
                  <p className="text-xs text-muted-foreground text-center">
                    Balance: ${currentUser.balance.toFixed(2)}
                  </p>
                </div>

                {/* Optional Message */}
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a message (optional)"
                />

                {/* Send Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleSendTip}
                  disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > currentUser.balance || isLoading}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    `Send $${amount || '0.00'} Tip`
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
