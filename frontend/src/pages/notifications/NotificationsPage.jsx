import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Check, DollarSign, Heart, UserPlus, MessageCircle, ShoppingBag, Bell } from 'lucide-react';
import { notifications } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const navigate = useNavigate();
  const { markNotificationRead, markAllNotificationsRead, notifications: appNotifications } = useApp();

  const getIcon = (type) => {
    switch (type) {
      case 'tip':
        return <DollarSign className="h-5 w-5 text-success" />;
      case 'follow':
        return <UserPlus className="h-5 w-5 text-primary" />;
      case 'like':
        return <Heart className="h-5 w-5 text-destructive" />;
      case 'comment':
        return <MessageCircle className="h-5 w-5 text-info" />;
      case 'transaction':
        return <DollarSign className="h-5 w-5 text-success" />;
      default:
        return <Bell className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const unreadCount = appNotifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate(-1)}
              className="text-foreground mr-3"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold text-foreground">Notifications</h1>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllNotificationsRead}
              className="text-primary"
            >
              Mark all read
            </Button>
          )}
        </div>
      </header>

      <div className="p-4">
        {appNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-1">No notifications</h3>
            <p className="text-sm text-muted-foreground">You&apos;re all caught up!</p>
          </div>
        ) : (
          <Card>
            <CardContent className="p-0 divide-y divide-border/50">
              {appNotifications.map((notification, index) => (
                <motion.button
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => markNotificationRead(notification.id)}
                  className={cn(
                    "w-full flex items-start gap-4 p-4 text-left transition-colors",
                    !notification.read && "bg-primary/5"
                  )}
                >
                  {notification.avatar ? (
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={notification.avatar} />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {!notification.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-2" />
                  )}
                </motion.button>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
