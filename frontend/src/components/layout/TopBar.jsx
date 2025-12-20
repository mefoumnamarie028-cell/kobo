import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';

export function TopBar({ title, showSearch = true, showNotifications = true, className }) {
  const navigate = useNavigate();
  const { unreadNotificationsCount } = useApp();

  return (
    <header className={cn(
      "sticky top-0 z-40 glass border-b border-border/50",
      className
    )}>
      <div className="flex items-center justify-between h-14 px-4">
        <h1 className="text-lg font-semibold text-foreground">
          {title}
        </h1>
        
        <div className="flex items-center gap-2">
          {showSearch && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate('/search')}
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="h-5 w-5" />
            </Button>
          )}
          
          {showNotifications && (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate('/notifications')}
              className="text-muted-foreground hover:text-foreground relative"
            >
              <Bell className="h-5 w-5" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] font-medium flex items-center justify-center">
                  {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                </span>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
