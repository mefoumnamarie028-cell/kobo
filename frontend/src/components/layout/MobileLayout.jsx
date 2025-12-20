import React from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, Wallet, Store, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { path: '/home', icon: Home, label: 'Home' },
  { path: '/chat', icon: MessageCircle, label: 'Chat' },
  { path: '/wallet', icon: Wallet, label: 'Wallet' },
  { path: '/store', icon: Store, label: 'Store' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export function MobileLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Hide bottom nav on certain screens
  const hideBottomNav = [
    '/story/',
    '/call/',
    '/onboarding',
    '/login',
    '/signup',
    '/otp',
  ].some(path => location.pathname.includes(path) || location.pathname === path.replace('/', ''));

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <main className={cn(
        "flex-1 overflow-auto",
        !hideBottomNav && "pb-20"
      )}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      {!hideBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50">
          <div className="max-w-lg mx-auto px-4 pb-safe">
            <div className="flex items-center justify-around h-16">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path || 
                  (item.path !== '/home' && location.pathname.startsWith(item.path));
                const Icon = item.icon;

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={cn(
                      "flex flex-col items-center justify-center w-16 h-full transition-colors duration-200 relative",
                      isActive ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute -top-0.5 w-8 h-1 bg-primary rounded-full"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon className={cn(
                      "h-5 w-5 transition-all duration-200",
                      isActive && "scale-110"
                    )} />
                    <span className={cn(
                      "text-[10px] mt-1 font-medium transition-all duration-200",
                      isActive && "font-semibold"
                    )}>
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
