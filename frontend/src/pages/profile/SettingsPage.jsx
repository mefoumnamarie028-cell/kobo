import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, ChevronRight, Moon, Sun, Globe, Lock, Bell, HelpCircle, FileText, Trash2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useApp();
  const isDarkMode = theme === 'dark';
  const [notifications, setNotifications] = React.useState(true);

  const settingsSections = [
    {
      title: 'Preferences',
      items: [
        {
          icon: isDarkMode ? Moon : Sun,
          label: 'Dark Mode',
          type: 'toggle',
          value: isDarkMode,
          onChange: toggleTheme,
        },
        {
          icon: Bell,
          label: 'Push Notifications',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications,
        },
        {
          icon: Globe,
          label: 'Language',
          type: 'link',
          value: 'English',
        },
      ],
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: Lock,
          label: 'Privacy Settings',
          type: 'link',
        },
        {
          icon: Lock,
          label: 'Change Password',
          type: 'link',
        },
        {
          icon: Lock,
          label: 'Two-Factor Authentication',
          type: 'link',
          value: 'Enabled',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help Center',
          type: 'link',
        },
        {
          icon: FileText,
          label: 'Terms of Service',
          type: 'link',
        },
        {
          icon: FileText,
          label: 'Privacy Policy',
          type: 'link',
        },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          icon: Trash2,
          label: 'Delete Account',
          type: 'link',
          danger: true,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center h-14 px-4">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate('/profile')}
            className="text-foreground mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        {settingsSections.map((section, sectionIndex) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: sectionIndex * 0.1 }}
          >
            <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
              {section.title}
            </h2>
            <Card>
              <CardContent className="p-0 divide-y divide-border/50">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.danger ? 'bg-destructive/10' : 'bg-secondary'
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            item.danger ? 'text-destructive' : 'text-foreground'
                          }`} />
                        </div>
                        <span className={`font-medium ${
                          item.danger ? 'text-destructive' : 'text-foreground'
                        }`}>
                          {item.label}
                        </span>
                      </div>
                      {item.type === 'toggle' ? (
                        <Switch
                          checked={item.value}
                          onCheckedChange={item.onChange}
                        />
                      ) : (
                        <div className="flex items-center gap-2">
                          {item.value && (
                            <span className="text-sm text-muted-foreground">
                              {item.value}
                            </span>
                          )}
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </motion.div>
        ))}

        <p className="text-center text-xs text-muted-foreground">
          Kobo v1.0.0
        </p>
      </div>
    </div>
  );
}
