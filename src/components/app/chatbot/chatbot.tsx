'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { answerQuestion } from '@/app/actions/chat';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type Message = {
  role: 'user' | 'model';
  content: string;
};

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
        // Greet user on first open
        if (messages.length === 0) {
            setMessages([{ role: 'model', content: 'Hi! How can I help you today?' }]);
        }
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages;
      const response = await answerQuestion({ history, question: input });
      const modelMessage: Message = { role: 'model', content: response };
      setMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      const errorMessage: Message = { role: 'model', content: 'Sorry, I am having trouble connecting. Please try again later.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
        setTimeout(() => {
            const innerDiv = scrollAreaRef.current?.querySelector('div');
            if (innerDiv) {
                scrollAreaRef.current.scrollTop = innerDiv.scrollHeight;
            }
        }, 100);
    }
  }, [messages]);

  return (
    <>
      <div className={cn("fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-in-out", 
        isOpen ? 'translate-y-full scale-0' : 'translate-y-0 scale-100'
      )}>
        <Button onClick={handleToggle} size="lg" className="rounded-full shadow-lg w-16 h-16">
          <Bot className="h-7 w-7" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </div>

      <div className={cn("fixed bottom-6 right-6 z-50 transition-transform duration-300 ease-in-out",
        !isOpen ? 'translate-y-full scale-0' : 'translate-y-0 scale-100'
      )}>
        <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b p-4">
            <div className="flex items-center gap-3">
              <Bot className="h-6 w-6 text-primary" />
              <CardTitle className="text-lg font-semibold">Blood Bridge Assistant</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={handleToggle} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <ScrollArea className="h-[340px] p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div key={index} className={cn("flex items-start gap-3", message.role === 'user' && 'justify-end')}>
                    {message.role === 'model' && (
                        <Avatar className="h-8 w-8 border-2 border-primary">
                            <AvatarFallback><Bot size={16} /></AvatarFallback>
                        </Avatar>
                    )}
                    <div className={cn("rounded-lg px-3 py-2 max-w-[80%]", 
                      message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    )}>
                      <p className="text-sm">{message.content}</p>
                    </div>
                     {message.role === 'user' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-muted text-muted-foreground"><User size={16}/></AvatarFallback>
                        </Avatar>
                    )}
                  </div>
                ))}
                 {isLoading && (
                    <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 border-2 border-primary">
                            <AvatarFallback><Bot size={16} /></AvatarFallback>
                        </Avatar>
                        <div className="rounded-lg px-3 py-2 bg-muted flex items-center space-x-2">
                           <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                           <span className="text-sm text-muted-foreground">Thinking...</span>
                        </div>
                    </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
              <Input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
