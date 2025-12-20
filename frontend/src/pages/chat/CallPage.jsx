import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, MessageCircle } from 'lucide-react';
import { chats } from '@/data/mockData';

export default function CallPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callStatus, setCallStatus] = useState('connecting');

  const chat = chats.find(c => c.id === chatId);

  useEffect(() => {
    // Simulate call connecting
    const connectTimer = setTimeout(() => {
      setCallStatus('connected');
    }, 2000);

    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    if (callStatus !== 'connected') return;

    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [callStatus]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    navigate(`/chat/${chatId}`);
  };

  if (!chat) {
    navigate('/chat');
    return null;
  }

  return (
    <div className="min-h-screen gradient-wallet flex flex-col items-center justify-between py-12 px-6">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-primary-foreground/10 rounded-full blur-3xl" />
      </div>

      {/* Top area */}
      <div className="text-center relative z-10">
        <p className="text-primary-foreground/80 text-sm mb-2">
          {callStatus === 'connecting' ? 'Calling...' : 'Voice Call'}
        </p>
      </div>

      {/* Center - Avatar and Info */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center relative z-10"
      >
        {/* Pulsing ring */}
        {callStatus === 'connected' && (
          <>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full border-2 border-primary-foreground/20 animate-ping" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-40 h-40 rounded-full border border-primary-foreground/10 animate-pulse" />
            </div>
          </>
        )}

        <Avatar className="w-28 h-28 border-4 border-primary-foreground/30 shadow-xl">
          <AvatarImage src={chat.participant.avatar} alt={chat.participant.name} />
          <AvatarFallback className="bg-primary-foreground/20 text-primary-foreground text-3xl">
            {chat.participant.name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <h2 className="text-2xl font-bold text-primary-foreground mt-6">
          {chat.participant.name}
        </h2>
        <p className="text-primary-foreground/80 mt-1">
          {callStatus === 'connecting' ? 'Connecting...' : formatDuration(callDuration)}
        </p>
      </motion.div>

      {/* Bottom - Controls */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-6 relative z-10"
      >
        <Button
          variant="glass"
          size="icon-lg"
          onClick={() => setIsMuted(!isMuted)}
          className={`rounded-full border-primary-foreground/20 ${
            isMuted ? 'bg-primary-foreground/30' : 'bg-primary-foreground/10'
          } text-primary-foreground hover:bg-primary-foreground/20`}
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>

        <Button
          size="icon-lg"
          onClick={handleEndCall}
          className="rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground w-16 h-16"
        >
          <PhoneOff className="h-7 w-7" />
        </Button>

        <Button
          variant="glass"
          size="icon-lg"
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          className={`rounded-full border-primary-foreground/20 ${
            isSpeakerOn ? 'bg-primary-foreground/30' : 'bg-primary-foreground/10'
          } text-primary-foreground hover:bg-primary-foreground/20`}
        >
          {isSpeakerOn ? <Volume2 className="h-6 w-6" /> : <VolumeX className="h-6 w-6" />}
        </Button>
      </motion.div>

      {/* Message button */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="relative z-10"
      >
        <Button
          variant="ghost"
          onClick={() => navigate(`/chat/${chatId}`)}
          className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 gap-2"
        >
          <MessageCircle className="h-5 w-5" />
          Send Message
        </Button>
      </motion.div>
    </div>
  );
}
