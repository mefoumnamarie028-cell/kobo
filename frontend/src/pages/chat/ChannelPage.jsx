import React, { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Eye } from 'lucide-react';
import { channels, channelUpdates } from '@/data/mockData';
import { formatDistanceToNow } from 'date-fns';

export default function ChannelPage() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const channel = channels.find((item) => item.id === channelId);
  const [isFollowing, setIsFollowing] = useState(channel?.isFollowing ?? false);
  const updates = useMemo(
    () => channelUpdates.filter((update) => update.channelId === channelId),
    [channelId]
  );

  if (!channel) {
    navigate('/chat');
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center h-14 px-4">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => navigate('/chat')}
            className="text-foreground mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Channel</h1>
        </div>
      </header>

      <div className="p-4 space-y-6">
        <Card>
          <CardContent className="p-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={channel.avatar} alt={channel.name} />
                <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-lg font-semibold text-foreground">{channel.name}</h2>
                <p className="text-sm text-muted-foreground">{channel.description}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {channel.followers.toLocaleString()} followers · {channel.category}
                </p>
              </div>
            </div>
            <Button
              variant={isFollowing ? 'secondary' : 'default'}
              onClick={() => setIsFollowing((prev) => !prev)}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {updates.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-6">
              No updates yet. Check back soon.
            </p>
          ) : (
            updates.map((update, index) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden">
                  {update.mediaUrl && (
                    <div className="relative h-44">
                      <img
                        src={update.mediaUrl}
                        alt={update.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                    </div>
                  )}
                  <CardContent className="p-4 space-y-2">
                    <h3 className="font-semibold text-foreground">{update.title}</h3>
                    <p className="text-sm text-muted-foreground">{update.text}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatDistanceToNow(new Date(update.createdAt), { addSuffix: true })}</span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {update.views.toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
