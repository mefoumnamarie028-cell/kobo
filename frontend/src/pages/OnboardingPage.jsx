import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useApp } from '@/context/AppContext';
import { Wallet, Users, Gift, ChevronRight } from 'lucide-react';

const slides = [
  {
    icon: Wallet,
    title: 'Your Kobo',
    description: 'Send, receive, and manage your money seamlessly with friends and creators.',
    gradient: 'from-primary to-primary-light',
  },
  {
    icon: Users,
    title: 'Connect & Share',
    description: 'Share stories, chat with friends, and build your social community.',
    gradient: 'from-accent to-primary',
  },
  {
    icon: Gift,
    title: 'Tips & Rewards',
    description: 'Support your favorite creators and earn rewards in the digital store.',
    gradient: 'from-primary to-chart-5',
  },
];

export default function OnboardingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();
  const { completeOnboarding } = useApp();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding();
      navigate('/signup');
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    navigate('/signup');
  };

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Skip button */}
      <div className="flex justify-end p-4 pt-safe">
        <Button variant="ghost" onClick={handleSkip} className="text-muted-foreground">
          Skip
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center text-center"
          >
            {/* Icon */}
            <div className={`w-28 h-28 rounded-3xl bg-gradient-to-br ${slide.gradient} flex items-center justify-center mb-8 shadow-xl`}>
              <Icon className="h-14 w-14 text-primary-foreground" />
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">
              {slide.title}
            </h1>

            {/* Description */}
            <p className="text-muted-foreground text-base max-w-xs leading-relaxed">
              {slide.description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <div className="p-6 pb-safe space-y-4">
        {/* Dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted-foreground/30'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <Button
          size="xl"
          className="w-full gap-2"
          onClick={handleNext}
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
