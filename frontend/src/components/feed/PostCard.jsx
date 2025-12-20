import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

export function PostCard({ post, onTip }) {
  const navigate = useNavigate();
  const [liked, setLiked] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  const [likesCount, setLikesCount] = React.useState(post.likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
  };

  return (
    <article className="bg-card border border-border/50 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <button
          onClick={() => navigate(`/profile/${post.user.id}`)}
          className="flex items-center gap-3"
        >
          <Avatar className="w-10 h-10">
            <AvatarImage src={post.user.avatar} alt={post.user.name} />
            <AvatarFallback className="bg-secondary">
              {post.user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-semibold text-foreground">
              {post.user.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </button>
        <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
          <MoreHorizontal className="h-5 w-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="px-4 pb-3">
        <p className="text-sm text-foreground leading-relaxed">
          {post.text}
        </p>
      </div>

      {/* Media */}
      {post.mediaUrl && (
        <div className="relative">
          <img
            src={post.mediaUrl}
            alt="Post media"
            className="w-full aspect-video object-cover"
          />
        </div>
      )}

      {/* Tips Banner */}
      {post.tipsTotal > 0 && (
        <div className="px-4 py-2 bg-secondary/50 flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-success" />
          <span className="text-xs text-muted-foreground">
            <span className="font-semibold text-success">${post.tipsTotal.toFixed(2)}</span> in tips
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between p-4 pt-3">
        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1.5 transition-colors",
              liked ? "text-destructive" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Heart className={cn("h-5 w-5", liked && "fill-current")} />
            <span className="text-sm font-medium">{likesCount}</span>
          </button>
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <MessageCircle className="h-5 w-5" />
            <span className="text-sm font-medium">{post.comments}</span>
          </button>
          <button className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors">
            <Send className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onTip && onTip(post.user)}
            className="text-primary hover:text-primary hover:bg-primary/10 gap-1.5"
          >
            <DollarSign className="h-4 w-4" />
            Tip
          </Button>
          <button
            onClick={() => setSaved(!saved)}
            className={cn(
              "transition-colors",
              saved ? "text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Bookmark className={cn("h-5 w-5", saved && "fill-current")} />
          </button>
        </div>
      </div>
    </article>
  );
}
