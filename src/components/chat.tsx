'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'ai';
  timestamp: Date;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isAutoScrolling = useRef(false);

  const scrollToBottom = () => {
    if (scrollRef.current && !isAutoScrolling.current) {
      isAutoScrolling.current = true;
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => {
        isAutoScrolling.current = false;
      }, 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'This is a sample AI response. Replace this with actual AI integration.',
        role: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full w-full overflow-hidden bg-background">
      <div className="p-4 border-b flex-none">
        <h2 className="text-xl font-semibold">Chat with AI</h2>
      </div>
      
      <div className="flex-1 overflow-hidden relative min-h-0">
        <ScrollArea className="absolute inset-0">
          <div className="space-y-4 px-4 py-6">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground py-8">
                No messages yet. Start a conversation!
              </div>
            )}
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex w-full gap-3 items-start',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'ai' && (
                  <Avatar className="mt-1 flex-shrink-0">
                    <span className="text-xs">AI</span>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-lg p-4 shadow-sm',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-12'
                      : 'bg-muted mr-12'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                  <span className="text-xs opacity-50 block mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                {message.role === 'user' && (
                  <Avatar className="mt-1 flex-shrink-0">
                    <span className="text-xs">You</span>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground pl-12">
                <div className="animate-pulse">AI is typing...</div>
              </div>
            )}
            <div ref={scrollRef} className="h-px w-full" />
          </div>
        </ScrollArea>
      </div>

      <div className="p-4 border-t mt-auto flex-none">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            type="submit" 
            disabled={isLoading || !input.trim()}
          >
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
