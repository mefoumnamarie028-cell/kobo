import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Phone, Video, MoreVertical, Send, Paperclip, Image, Smile, Mic, Check, CheckCheck, Play, Square, X } from 'lucide-react';
import { chats, storeChats, messages as allMessages } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

export default function ChatThreadPage() {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(allMessages.filter(m => m.chatId === chatId));
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const messagesEndRef = useRef(null);

  const allChats = [...chats, ...storeChats];
  const chat = allChats.find(c => c.id === chatId);

  useEffect(() => {
    setMessages(allMessages.filter(m => m.chatId === chatId));
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!isRecording) return;
    const timer = setInterval(() => {
      setRecordingSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isRecording]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const newMessage = {
      id: crypto.randomUUID(),
      chatId,
      senderId: currentUser.id,
      type: 'text',
      text: message,
      createdAt: new Date(),
      status: 'sent',
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');

    // Simulate typing indicator and reply
    setTimeout(() => setIsTyping(true), 1000);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        chatId,
        senderId: chat.participant.id,
        type: 'text',
        text: 'Thanks for your message! I\'ll get back to you soon.',
        createdAt: new Date(),
        status: 'delivered',
      }]);
    }, 3000);
  };

  const handleToggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      if (recordingSeconds > 0) {
        const voiceMessage = {
          id: crypto.randomUUID(),
          chatId,
          senderId: currentUser.id,
          type: 'voice',
          duration: recordingSeconds,
          createdAt: new Date(),
          status: 'sent',
        };
        setMessages(prev => [...prev, voiceMessage]);
      }
      setRecordingSeconds(0);
      return;
    }

    setRecordingSeconds(0);
    setIsRecording(true);
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
    setRecordingSeconds(0);
  };

  if (!chat) {
    navigate('/chat');
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/50">
        <div className="flex items-center justify-between h-16 px-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate('/chat')}
              className="text-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <button
              onClick={() => navigate(`/profile/${chat.participant.id}`)}
              className="flex items-center gap-3"
            >
              <Avatar className="w-10 h-10">
                <AvatarImage src={chat.participant.avatar} alt={chat.participant.name} />
                <AvatarFallback>{chat.participant.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="text-left">
                <h1 className="font-semibold text-foreground text-sm">
                  {chat.participant.name}
                </h1>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-success">Online</p>
                  {chat.type === 'store' && (
                    <Badge variant="secondary" className="text-[10px] uppercase tracking-wide">
                      Store
                    </Badge>
                  )}
                </div>
              </div>
            </button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => navigate(`/call/${chatId}`)}
              className="text-primary"
            >
              <Phone className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-primary"
              onClick={() => navigate(`/call/${chatId}?type=video`)}
            >
              <Video className="h-5 w-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-sm" className="text-muted-foreground">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate(`/profile/${chat.participant.id}`)}>
                  View profile
                </DropdownMenuItem>
                <DropdownMenuItem>Search in chat</DropdownMenuItem>
                <DropdownMenuItem>Mute notifications</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Report</DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">Block</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isOwn = msg.senderId === currentUser.id;
          const showAvatar = !isOwn && (index === 0 || messages[index - 1].senderId !== msg.senderId);

          return (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                "flex items-end gap-2",
                isOwn && "flex-row-reverse"
              )}
            >
              {!isOwn && (
                <div className="w-8">
                  {showAvatar && (
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={chat.participant.avatar} />
                      <AvatarFallback className="text-xs">
                        {chat.participant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )}
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5",
                  isOwn
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-foreground rounded-bl-md"
                )}
              >
                {msg.type === 'voice' ? (
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-9 h-9 rounded-full flex items-center justify-center",
                      isOwn ? "bg-primary-foreground/20" : "bg-background/80"
                    )}>
                      <Play className={cn(
                        "h-4 w-4",
                        isOwn ? "text-primary-foreground" : "text-foreground"
                      )} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-1">
                        {[...Array(8)].map((_, idx) => (
                          <span
                            key={idx}
                            className={cn(
                              "w-1 rounded-full",
                              isOwn ? "bg-primary-foreground/70" : "bg-muted-foreground",
                              idx % 2 === 0 ? "h-4" : "h-2"
                            )}
                          />
                        ))}
                      </div>
                      <p className={cn(
                        "text-[10px] mt-1",
                        isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                      )}>
                        Voice message · {formatDuration(msg.duration || 0)}
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                )}
                <div className={cn(
                  "flex items-center gap-1 mt-1",
                  isOwn ? "justify-end" : "justify-start"
                )}>
                  <span className={cn(
                    "text-[10px]",
                    isOwn ? "text-primary-foreground/70" : "text-muted-foreground"
                  )}>
                    {format(new Date(msg.createdAt), 'HH:mm')}
                  </span>
                  {isOwn && (
                    msg.status === 'read' ? (
                      <CheckCheck className="h-3 w-3 text-primary-foreground/70" />
                    ) : (
                      <Check className="h-3 w-3 text-primary-foreground/70" />
                    )
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-end gap-2"
          >
            <Avatar className="w-8 h-8">
              <AvatarImage src={chat.participant.avatar} />
              <AvatarFallback className="text-xs">
                {chat.participant.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="sticky bottom-0 p-4 pb-safe glass border-t border-border/50">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Button type="button" variant="ghost" size="icon-sm" className="text-muted-foreground">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Button type="button" variant="ghost" size="icon-sm" className="text-muted-foreground">
              <Image className="h-5 w-5" />
            </Button>
          </div>
          {isRecording ? (
            <div className="flex-1 flex items-center gap-3 bg-secondary rounded-full px-4 h-11">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              <span className="text-sm text-foreground">
                Recording {formatDuration(recordingSeconds)}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="ml-auto text-muted-foreground"
                onClick={handleCancelRecording}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="h-11 pr-12 bg-secondary border-0"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                <Smile className="h-5 w-5" />
              </Button>
            </div>
          )}
          {message.trim() ? (
            <Button type="submit" size="icon" className="rounded-full">
              <Send className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="button"
              variant={isRecording ? 'destructive' : 'secondary'}
              size="icon"
              className="rounded-full"
              onClick={handleToggleRecording}
            >
              {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
