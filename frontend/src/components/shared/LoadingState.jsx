import React from 'react';
import { cn } from '@/lib/utils';

export function LoadingState({ className }) {
  return (
    <div className={cn(
      "flex items-center justify-center py-12",
      className
    )}>
      <div className="relative">
        <div className="w-10 h-10 rounded-full border-2 border-primary/20" />
        <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    </div>
  );
}

export function SkeletonCard({ className }) {
  return (
    <div className={cn(
      "bg-card rounded-xl p-4 space-y-3 animate-pulse",
      className
    )}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-3 bg-muted rounded w-16" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-3/4" />
      </div>
    </div>
  );
}

export function SkeletonAvatar({ className, size = 'default' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    default: 'w-10 h-10',
    lg: 'w-14 h-14',
  };

  return (
    <div className={cn(
      "rounded-full bg-muted animate-pulse",
      sizeClasses[size],
      className
    )} />
  );
}
