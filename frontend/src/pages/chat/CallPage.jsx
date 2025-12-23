import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { PhoneOff, Mic, MicOff, Volume2, VolumeX, MessageCircle, Camera, CameraOff, RotateCcw } from 'lucide-react';
import { chats, storeChats } from '@/data/mockData';

export default function CallPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const callType = searchParams.get('type') === 'video' ? 'video' : 'voice';
  const isVideoCall = callType === 'video';
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [callStatus, setCallStatus] = useState('connecting');

  const allChats = [...chats, ...storeChats];
  const chat = allChats.find(c => c.id === chatId);

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
    <div className={`min-h-screen ${isVideoCall ? 'bg-black' : 'gradient-wallet'} flex flex-col items-center justify-between py-12 px-6`}>
      {/* Decorative elements */}
      {!isVideoCall && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-60 h-60 bg-primary-foreground/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-60 h-60 bg-primary-foreground/10 rounded-full blur-3xl" />
        </div>
      )}

      {/* Top area */}
      <div className="text-center relative z-10">
        <p className={`${isVideoCall ? 'text-white/80' : 'text-primary-foreground/80'} text-sm mb-2`}>
          {callStatus === 'connecting' ? 'Calling...' : isVideoCall ? 'Video Call' : 'Voice Call'}
        </p>
      </div>

      {/* Center */}
      {isVideoCall ? (
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex-1 w-full max-w-md flex items-center justify-center relative z-10"
        >
          <div className="relative w-full h-[65vh] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={chat.participant.avatar}
              alt={chat.participant.name}
              className={`w-full h-full object-cover ${isCameraOn ? '' : 'opacity-50 blur-md'}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <h2 className="text-lg font-semibold">{chat.participant.name}</h2>
              <p className="text-xs text-white/70">
                {callStatus === 'connecting' ? 'Connecting...' : formatDuration(callDuration)}
              </p>
            </div>
            <div className="absolute top-4 right-4 w-24 h-32 rounded-2xl overflow-hidden border border-white/20 bg-white/10 backdrop-blur">
              <div className="w-full h-full flex items-center justify-center text-xs text-white/80">
                {isFrontCamera ? 'You' : 'Back cam'}
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center relative z-10"
        >
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
      )}

      {/* Bottom - Controls */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-4 relative z-10"
      >
        <Button
          variant="glass"
          size="icon-lg"
          onClick={() => setIsMuted(!isMuted)}
          className={`rounded-full ${isVideoCall ? 'border-white/20 text-white' : 'border-primary-foreground/20 text-primary-foreground'} ${
            isMuted ? (isVideoCall ? 'bg-white/20' : 'bg-primary-foreground/30') : (isVideoCall ? 'bg-white/10' : 'bg-primary-foreground/10')
          } hover:bg-white/20`}
        >
          {isMuted ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
        </Button>

        {isVideoCall && (
          <Button
            variant="glass"
            size="icon-lg"
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={`rounded-full border-white/20 text-white ${
              isCameraOn ? 'bg-white/10' : 'bg-white/25'
            } hover:bg-white/20`}
          >
            {isCameraOn ? <Camera className="h-6 w-6" /> : <CameraOff className="h-6 w-6" />}
          </Button>
        )}

        <Button
          size="icon-lg"
          onClick={handleEndCall}
          className="rounded-full bg-destructive hover:bg-destructive/90 text-destructive-foreground w-16 h-16"
        >
          <PhoneOff className="h-7 w-7" />
        </Button>

        {isVideoCall && (
          <Button
            variant="glass"
            size="icon-lg"
            onClick={() => setIsFrontCamera(!isFrontCamera)}
            className="rounded-full border-white/20 text-white bg-white/10 hover:bg-white/20"
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
        )}

        <Button
          variant="glass"
          size="icon-lg"
          onClick={() => setIsSpeakerOn(!isSpeakerOn)}
          className={`rounded-full ${isVideoCall ? 'border-white/20 text-white' : 'border-primary-foreground/20 text-primary-foreground'} ${
            isSpeakerOn ? (isVideoCall ? 'bg-white/20' : 'bg-primary-foreground/30') : (isVideoCall ? 'bg-white/10' : 'bg-primary-foreground/10')
          } hover:bg-white/20`}
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
          className={`${isVideoCall ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10'} gap-2`}
        >
          <MessageCircle className="h-5 w-5" />
          Send Message
        </Button>
      </motion.div>
    </div>
  );
}
