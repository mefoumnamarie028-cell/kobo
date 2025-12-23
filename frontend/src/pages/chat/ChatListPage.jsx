import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopBar } from '@/components/layout/TopBar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { chats, storeChats, channels } from '@/data/mockData';
import { EmptyState } from '@/components/shared/EmptyState';
import { MessageCircle, Store, Radio } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ChatListPage() {
  const navigate = useNavigate();

  const formatTime = (date) => {
    const now = new Date();
    const hours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h`;
    return formatDistanceToNow(new Date(date), { addSuffix: false });
  };

  const renderChatList = (list, metaLabel) => {
    if (list.length === 0) {
      return (
        <EmptyState
          icon={MessageCircle}
          title="No messages yet"
          description="Start a conversation with your friends"
        />
      );
    }

    return (
      <div className="divide-y divide-border/50">
        {list.map((chat, index) => (
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
              <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-success border-2 border-background" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {chat.participant.name}
                  </h3>
                  {metaLabel && (
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                      {metaLabel}
                    </Badge>
                  )}
                </div>
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
              {chat.orderId && (
                <p className="text-xs text-muted-foreground mt-1">
                  Order {chat.orderId}
                </p>
              )}
            </div>
          </motion.button>
        ))}
      </div>
    );
  };

  const followingChannels = channels.filter(channel => channel.isFollowing);
  const discoverChannels = channels.filter(channel => !channel.isFollowing);

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Messages" />

      <Tabs defaultValue="messages" className="mt-2">
        <TabsList className="mx-4 grid grid-cols-3 w-[calc(100%-2rem)]">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
        </TabsList>

        <TabsContent value="messages" className="mt-3">
          {renderChatList(chats)}
        </TabsContent>

        <TabsContent value="store" className="mt-3">
          {storeChats.length === 0 ? (
            <EmptyState
              icon={Store}
              title="No store messages"
              description="Your marketplace conversations will appear here."
            />
          ) : (
            renderChatList(storeChats, 'Store')
          )}
        </TabsContent>

        <TabsContent value="channels" className="mt-3 px-4 pb-6 space-y-6">
          {channels.length === 0 ? (
            <EmptyState
              icon={Radio}
              title="No channels yet"
              description="Follow channels to get updates in one place."
            />
          ) : (
            <>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-muted-foreground">Following</h2>
                  <Button variant="ghost" size="sm" className="text-primary">
                    Manage
                  </Button>
                </div>
                <div className="space-y-3">
                  {followingChannels.map((channel) => (
                    <Card key={channel.id} className="overflow-hidden">
                      <CardContent className="p-4 flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={channel.avatar} alt={channel.name} />
                          <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-foreground truncate">
                              {channel.name}
                            </h3>
                            {channel.newPosts > 0 && (
                              <Badge className="bg-primary text-primary-foreground text-[10px]">
                                {channel.newPosts} new
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {channel.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTime(channel.lastUpdate)} · {channel.followers.toLocaleString()} followers
                          </p>
                        </div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate(`/channels/${channel.id}`)}
                        >
                          View
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-sm font-semibold text-muted-foreground mb-3">Discover</h2>
                <div className="space-y-3">
                  {discoverChannels.map((channel) => (
                    <Card key={channel.id} className="overflow-hidden">
                      <CardContent className="p-4 flex items-center gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={channel.avatar} alt={channel.name} />
                          <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground truncate">
                            {channel.name}
                          </h3>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {channel.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {channel.followers.toLocaleString()} followers
                          </p>
                        </div>
                        <Button size="sm">Follow</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
