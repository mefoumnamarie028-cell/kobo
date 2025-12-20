import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { stories } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

export function StoryRing({ user, hasStory = false, viewed = false, onClick, size = 'default' }) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    default: 'w-16 h-16',
    lg: 'w-20 h-20',
  };

  const ringClasses = {
    sm: 'p-0.5',
    default: 'p-[2.5px]',
    lg: 'p-[3px]',
  };

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 flex-shrink-0"
    >
      <div
        className={cn(
          "rounded-full",
          ringClasses[size],
          hasStory && !viewed && "gradient-story",
          hasStory && viewed && "bg-muted-foreground/30",
          !hasStory && "bg-transparent"
        )}
      >
        <Avatar className={cn(sizeClasses[size], "border-2 border-background")}>
          <AvatarImage src={user.avatar} alt={user.name} />
          <AvatarFallback className="bg-secondary text-secondary-foreground font-medium">
            {user.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
      </div>
      <span className="text-[11px] text-foreground truncate w-16 text-center">
        {user.name.split(' ')[0]}
      </span>
    </button>
  );
}

export function AddStoryButton({ onClick }) {
  const { currentUser } = useApp();

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-1 flex-shrink-0"
    >
      <div className="relative">
        <Avatar className="w-16 h-16 border-2 border-muted">
          <AvatarImage src={currentUser.avatar} alt="Your story" />
          <AvatarFallback className="bg-secondary">
            {currentUser.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full bg-primary flex items-center justify-center border-2 border-background">
          <Plus className="h-3.5 w-3.5 text-primary-foreground" />
        </div>
      </div>
      <span className="text-[11px] text-foreground w-16 text-center">
        Add Story
      </span>
    </button>
  );
}

export function StoriesRow({ onStoryClick, onAddStory }) {
  const navigate = useNavigate();

  const handleStoryClick = (story, index) => {
    if (onStoryClick) {
      onStoryClick(story, index);
    } else {
      navigate(`/story/${story.id}`);
    }
  };

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-hide px-4 py-3">
      <AddStoryButton onClick={onAddStory} />
      {stories.map((story, index) => (
        <StoryRing
          key={story.id}
          user={story.user}
          hasStory={true}
          viewed={story.viewed}
          onClick={() => handleStoryClick(story, index)}
        />
      ))}
    </div>
  );
}
