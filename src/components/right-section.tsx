'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Chat } from '@/components/chat';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function RightSection() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className={cn(
        'fixed right-0 top-0 h-screen bg-background border-l transition-all duration-300 flex',
        isCollapsed ? 'w-12' : 'w-[800px]'
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-x-full transform hover:bg-accent"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        {isCollapsed ? (
          <ChevronLeft className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </Button>

      <div className={cn(
        'w-full transition-all duration-300',
        isCollapsed ? 'opacity-0' : 'opacity-100'
      )}>
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">AI Assistant</h2>
        </div>
        <div className="p-4">
          <Chat />
        </div>
      </div>
    </div>
  );
}
