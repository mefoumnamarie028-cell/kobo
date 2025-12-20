import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopBar } from '@/components/layout/TopBar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { ArrowDownLeft, ArrowUpRight, DollarSign, Send, Eye, EyeOff, TrendingUp, ArrowRight } from 'lucide-react';
import { transactions } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function WalletPage() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [showBalance, setShowBalance] = useState(true);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-5 w-5 text-success" />;
      case 'withdraw':
        return <ArrowUpRight className="h-5 w-5 text-destructive" />;
      case 'tip_sent':
        return <Send className="h-5 w-5 text-primary" />;
      case 'tip_received':
        return <DollarSign className="h-5 w-5 text-success" />;
      case 'purchase':
        return <ArrowUpRight className="h-5 w-5 text-warning" />;
      default:
        return <DollarSign className="h-5 w-5" />;
    }
  };

  const getAmountPrefix = (type) => {
    return ['deposit', 'tip_received'].includes(type) ? '+' : '-';
  };

  const getAmountColor = (type) => {
    return ['deposit', 'tip_received'].includes(type) ? 'text-success' : 'text-foreground';
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Wallet" />

      <div className="p-4 space-y-6">
        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="gradient-wallet text-primary-foreground overflow-hidden relative">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary-foreground/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between mb-1">
                <span className="text-primary-foreground/80 text-sm">Total Balance</span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10"
                >
                  {showBalance ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                </Button>
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-3xl font-bold">
                  {showBalance ? `$${currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
                </span>
                <span className="text-primary-foreground/70 text-sm">USD</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary-foreground/20">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>+12.5%</span>
                </div>
                <span className="text-primary-foreground/70">this month</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          <Button
            variant="secondary"
            className="flex-col h-auto py-4 gap-2"
            onClick={() => navigate('/wallet/deposit')}
          >
            <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
              <ArrowDownLeft className="h-5 w-5 text-success" />
            </div>
            <span className="text-sm font-medium">Deposit</span>
          </Button>
          <Button
            variant="secondary"
            className="flex-col h-auto py-4 gap-2"
            onClick={() => navigate('/wallet/withdraw')}
          >
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <ArrowUpRight className="h-5 w-5 text-destructive" />
            </div>
            <span className="text-sm font-medium">Withdraw</span>
          </Button>
          <Button
            variant="secondary"
            className="flex-col h-auto py-4 gap-2"
            onClick={() => navigate('/wallet/tips')}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <span className="text-sm font-medium">Tips</span>
          </Button>
        </motion.div>

        {/* Recent Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Recent Transactions</h2>
            <Button variant="ghost" size="sm" className="text-primary gap-1">
              View All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <Card>
            <CardContent className="p-0 divide-y divide-border/50">
              {transactions.slice(0, 5).map((transaction, index) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                  className="flex items-center justify-between p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(transaction.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={cn(
                      "text-sm font-semibold",
                      getAmountColor(transaction.type)
                    )}>
                      {getAmountPrefix(transaction.type)}${transaction.amount.toFixed(2)}
                    </p>
                    <p className={cn(
                      "text-xs",
                      transaction.status === 'completed' ? 'text-muted-foreground' : 'text-warning'
                    )}>
                      {transaction.status}
                    </p>
                  </div>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
