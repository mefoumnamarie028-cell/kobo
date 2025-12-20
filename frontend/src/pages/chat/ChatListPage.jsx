import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopBar } from '@/components/layout/TopBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { chats } from '@/data/mockData';
import { EmptyState } from '@/components/shared/EmptyState';
import { MessageCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ChatListPage() {
  const navigate = useNavigate();

  const formatTime = (date) => {
    const hours = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h`;
    return formatDistanceToNow(new Date(date), { addSuffix: false });
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Messages" />

      {chats.length === 0 ? (
        <EmptyState
          icon={MessageCircle}
          title="No messages yet"
          description="Start a conversation with your friends"
        />
      ) : (
        <div className="divide-y divide-border/50">
          {chats.map((chat, index) => (
            <motion.button
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="w-full flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors text-left"
            >
              <div className="relative">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={chat.participant.avatar} alt={chat.participant.name} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    {chat.participant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {/* Online indicator */}
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-success border-2 border-background" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-foreground truncate">
                    {chat.participant.name}
                  </h3>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {formatTime(chat.lastMessageTime)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate pr-4">
                    {chat.lastMessage}
                  </p>
                  {chat.unreadCount > 0 && (
                    <Badge className="bg-primary text-primary-foreground rounded-full h-5 min-w-[20px] flex items-center justify-center text-xs">
                      {chat.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      )}
    </div>
  );
}
