import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopBar } from '@/components/layout/TopBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/context/AppContext';
import { Settings, Edit, BadgeCheck, Users, UserPlus, Grid, Wallet, LogOut, ChevronRight, Shield, Bell } from 'lucide-react';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { currentUser, logout } = useApp();

  const handleLogout = () => {
    logout();
    navigate('/onboarding');
  };

  const stats = [
    { label: 'Posts', value: '24' },
    { label: 'Followers', value: currentUser.followers.toLocaleString() },
    { label: 'Following', value: currentUser.following.toLocaleString() },
  ];

  const menuItems = [
    { icon: Wallet, label: 'Wallet', path: '/wallet' },
    { icon: Shield, label: 'KYC Verification', path: '/profile/kyc', badge: currentUser.kycStatus },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: Settings, label: 'Settings', path: '/profile/settings' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Profile" showSearch={false} />

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="relative">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback className="text-2xl">{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {currentUser.kycStatus === 'verified' && (
                    <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary flex items-center justify-center border-2 border-background">
                      <BadgeCheck className="h-4 w-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-bold text-foreground">
                      {currentUser.name}
                    </h1>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {currentUser.username}
                  </p>
                  <p className="text-foreground text-sm mt-2">
                    {currentUser.bio}
                  </p>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center justify-around mt-6 pt-6 border-t border-border/50">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  variant="secondary"
                  className="flex-1 gap-2"
                  onClick={() => navigate('/profile/edit')}
                >
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
                <Button variant="outline" className="flex-1 gap-2">
                  <Users className="h-4 w-4" />
                  Share Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card
            className="gradient-wallet text-primary-foreground cursor-pointer overflow-hidden relative"
            onClick={() => navigate('/wallet')}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-foreground/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm mb-1">Wallet Balance</p>
                  <p className="text-2xl font-bold">
                    ${currentUser.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </p>
                </div>
                <ChevronRight className="h-6 w-6 text-primary-foreground/70" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardContent className="p-0 divide-y divide-border/50">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    onClick={() => navigate(item.path)}
                    className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <Icon className="h-5 w-5 text-foreground" />
                      </div>
                      <span className="font-medium text-foreground">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <Badge
                          className={item.badge === 'verified'
                            ? 'bg-success/10 text-success capitalize'
                            : 'bg-warning/10 text-warning capitalize'
                          }
                        >
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="outline"
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            Log Out
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
