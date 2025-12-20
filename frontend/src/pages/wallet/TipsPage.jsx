import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, DollarSign, Send, ArrowDownLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { transactions, users } from '@/data/mockData';
import { SendTipModal } from '@/components/wallet/SendTipModal';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function TipsPage() {
  const navigate = useNavigate();
  const [tipRecipient, setTipRecipient] = useState(null);

  const tipTransactions = transactions.filter(
    t => t.type === 'tip_sent' || t.type === 'tip_received'
  );

  const sentTips = tipTransactions.filter(t => t.type === 'tip_sent');
  const receivedTips = tipTransactions.filter(t => t.type === 'tip_received');

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
          <h1 className="text-lg font-semibold text-foreground">Tips</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {/* Quick Send */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">Quick Send</h2>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {users.slice(1, 6).map((user) => (
              <button
                key={user.id}
                onClick={() => setTipRecipient(user)}
                className="flex flex-col items-center gap-2 flex-shrink-0"
              >
                <Avatar className="w-14 h-14">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-xs text-foreground truncate w-16 text-center">
                  {user.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tip History */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="sent" className="flex-1">Sent</TabsTrigger>
            <TabsTrigger value="received" className="flex-1">Received</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <Card>
              <CardContent className="p-0 divide-y divide-border/50">
                {tipTransactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <DollarSign className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No tips yet</p>
                  </div>
                ) : (
                  tipTransactions.map((tip, index) => (
                    <TipItem key={tip.id} tip={tip} index={index} />
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sent" className="mt-4">
            <Card>
              <CardContent className="p-0 divide-y divide-border/50">
                {sentTips.length === 0 ? (
                  <div className="p-8 text-center">
                    <Send className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No tips sent</p>
                  </div>
                ) : (
                  sentTips.map((tip, index) => (
                    <TipItem key={tip.id} tip={tip} index={index} />
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="received" className="mt-4">
            <Card>
              <CardContent className="p-0 divide-y divide-border/50">
                {receivedTips.length === 0 ? (
                  <div className="p-8 text-center">
                    <ArrowDownLeft className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No tips received</p>
                  </div>
                ) : (
                  receivedTips.map((tip, index) => (
                    <TipItem key={tip.id} tip={tip} index={index} />
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <SendTipModal
        open={!!tipRecipient}
        onClose={() => setTipRecipient(null)}
        recipient={tipRecipient}
      />
    </div>
  );
}

function TipItem({ tip, index }) {
  const isSent = tip.type === 'tip_sent';
  const user = isSent ? tip.recipient : tip.sender;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center justify-between p-4"
    >
      <div className="flex items-center gap-3">
        {user ? (
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
        ) : (
          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-foreground">
            {tip.description}
          </p>
          <p className="text-xs text-muted-foreground">
            {format(new Date(tip.createdAt), 'MMM d, yyyy')}
          </p>
        </div>
      </div>
      <p className={cn(
        "text-sm font-semibold",
        isSent ? "text-foreground" : "text-success"
      )}>
        {isSent ? '-' : '+'}${tip.amount.toFixed(2)}
      </p>
    </motion.div>
  );
}
