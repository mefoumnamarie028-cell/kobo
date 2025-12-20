import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Heart, Send, MoreHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { stories } from '@/data/mockData';
import { cn } from '@/lib/utils';

export default function StoryViewer() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [message, setMessage] = useState('');

  const storyIndex = stories.findIndex(s => s.id === storyId);
  const currentStoryIndex = storyIndex >= 0 ? storyIndex : 0;
  const story = stories[currentStoryIndex + currentIndex] || stories[0];

  useEffect(() => {
    if (isPaused) return;

    const duration = (story?.duration || 5) * 1000;
    const interval = 50;
    const increment = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, story]);

  const handleNext = () => {
    if (currentStoryIndex + currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      navigate(-1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (message.trim()) {
      // Mock send
      setMessage('');
    }
  };

  const formatTime = (date) => {
    const hours = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return '1d ago';
  };

  if (!story) {
    navigate('/home');
    return null;
  }

  return (
    <div className="fixed inset-0 bg-foreground z-50">
      <AnimatePresence mode="wait">
        <motion.div
          key={story.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="relative h-full"
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${story.mediaUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-foreground/50 via-transparent to-foreground/80" />
          </div>

          {/* Progress Bars */}
          <div className="absolute top-0 left-0 right-0 flex gap-1 p-3 pt-safe">
            {stories.slice(currentStoryIndex, currentStoryIndex + 5).map((s, index) => (
              <div
                key={s.id}
                className="flex-1 h-0.5 bg-background/30 rounded-full overflow-hidden"
              >
                <div
                  className={cn(
                    "h-full bg-background transition-all duration-100",
                    index < currentIndex && "w-full",
                    index > currentIndex && "w-0"
                  )}
                  style={{
                    width: index === currentIndex ? `${progress}%` : undefined,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className="absolute top-10 left-0 right-0 flex items-center justify-between px-4 pt-safe">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border-2 border-background">
                <AvatarImage src={story.user.avatar} alt={story.user.name} />
                <AvatarFallback>{story.user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-background text-sm font-medium">
                  {story.user.name}
                </p>
                <p className="text-background/70 text-xs">
                  {formatTime(story.createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-background hover:bg-background/20"
              >
                <MoreHorizontal className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={handleClose}
                className="text-background hover:bg-background/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Navigation Zones */}
          <div className="absolute inset-0 flex">
            <button
              onClick={handlePrev}
              onMouseDown={() => setIsPaused(true)}
              onMouseUp={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              className="flex-1 flex items-center justify-start pl-4"
            >
              {currentIndex > 0 && (
                <ChevronLeft className="h-8 w-8 text-background/50" />
              )}
            </button>
            <button
              onClick={handleNext}
              onMouseDown={() => setIsPaused(true)}
              onMouseUp={() => setIsPaused(false)}
              onTouchStart={() => setIsPaused(true)}
              onTouchEnd={() => setIsPaused(false)}
              className="flex-1 flex items-center justify-end pr-4"
            >
              <ChevronRight className="h-8 w-8 text-background/50" />
            </button>
          </div>

          {/* Footer - Reply */}
          <div className="absolute bottom-0 left-0 right-0 p-4 pb-safe">
            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Reply to story..."
                className="flex-1 h-11 bg-background/20 border-0 text-background placeholder:text-background/50 focus-visible:ring-background/50"
              />
              <Button
                variant="ghost"
                size="icon"
                className="text-background hover:bg-background/20"
              >
                <Heart className="h-6 w-6" />
              </Button>
              <Button
                type="submit"
                variant="ghost"
                size="icon"
                className="text-background hover:bg-background/20"
                disabled={!message.trim()}
              >
                <Send className="h-6 w-6" />
              </Button>
            </form>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
