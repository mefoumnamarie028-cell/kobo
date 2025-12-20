import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TopBar } from '@/components/layout/TopBar';
import { StoriesRow } from '@/components/stories/StoryRing';
import { CreateStoryModal } from '@/components/stories/CreateStoryModal';
import { PostCard } from '@/components/feed/PostCard';
import { SendTipModal } from '@/components/wallet/SendTipModal';
import { posts } from '@/data/mockData';

export default function HomePage() {
  const navigate = useNavigate();
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [tipRecipient, setTipRecipient] = useState(null);

  const handleStoryClick = (story) => {
    navigate(`/story/${story.id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar title="Social Wallet" />

      {/* Stories */}
      <section className="border-b border-border/50">
        <StoriesRow
          onStoryClick={handleStoryClick}
          onAddStory={() => setShowCreateStory(true)}
        />
      </section>

      {/* Feed */}
      <section className="p-4 space-y-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <PostCard
              post={post}
              onTip={(user) => setTipRecipient(user)}
            />
          </motion.div>
        ))}
      </section>

      {/* Modals */}
      <CreateStoryModal
        open={showCreateStory}
        onClose={() => setShowCreateStory(false)}
      />

      <SendTipModal
        open={!!tipRecipient}
        onClose={() => setTipRecipient(null)}
        recipient={tipRecipient}
      />
    </div>
  );
}
