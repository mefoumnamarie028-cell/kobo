import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, Image, X } from 'lucide-react';

export function CreateStoryModal({ open, onClose }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageSelect = () => {
    // Mock image selection
    setSelectedImage('https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=700&fit=crop');
  };

  const handlePost = () => {
    // Mock post
    onClose();
    setSelectedImage(null);
  };

  const handleCancel = () => {
    onClose();
    setSelectedImage(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Story</DialogTitle>
        </DialogHeader>

        {selectedImage ? (
          <div className="space-y-4">
            <div className="relative aspect-[9/16] max-h-[400px] rounded-xl overflow-hidden bg-muted">
              <img
                src={selectedImage}
                alt="Story preview"
                className="w-full h-full object-cover"
              />
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-foreground/50 text-background hover:bg-foreground/70"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={handleCancel}>
                Cancel
              </Button>
              <Button className="flex-1" onClick={handlePost}>
                Share Story
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleImageSelect}
              className="aspect-square rounded-2xl bg-secondary flex flex-col items-center justify-center gap-3 hover:bg-secondary/80 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="h-7 w-7 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Camera</span>
            </button>
            <button
              onClick={handleImageSelect}
              className="aspect-square rounded-2xl bg-secondary flex flex-col items-center justify-center gap-3 hover:bg-secondary/80 transition-colors"
            >
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Image className="h-7 w-7 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">Gallery</span>
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
