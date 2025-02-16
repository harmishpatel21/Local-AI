"use client"

import React, {useState, useRef, useEffect} from 'react';
import 'highlight.js/styles/atom-one-dark.css';

import { ChatMessage } from './components/chat/ChatMessage';
import { LoadingIndicator } from './components/chat/LoadingIndicator';
import { ChatInput } from './components/chat/ChatInput';
import './styles/globals.css';
import './styles/theme/cyberpunk.css';
import './styles/components/animations.css';
import './styles/components/scrollbars.css';


const ChatInterface = () => {
    const [input, setInput] = useState('')
    const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom when messages change
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = input
        setInput('')
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setIsLoading(true)

        try {
            setMessages(prev => [...prev, {role: 'assistant', content: ''}]);

            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.map(m => ({
                        role: m.role,
                        content: m.content.replace(/▌$/, '')
                    }))
                    // history: messages.filter(m => m.role === 'user').map(m => m.content)
                })
            });

            if (!response.body) throw new Error('No response body');
            
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let assistantMessage = '';

            while (true) {
                const { done, value} = await reader.read();
                if (done) break;

                // Append new chunk to message
                assistantMessage += decoder.decode(value, {stream: true});
                
                // Update only the last message
                setMessages(prev => {
                    const newMessages = [...prev];
                    const lastIndex = newMessages.length - 1;
                    newMessages[lastIndex] = {
                        role: 'assistant',
                        content: assistantMessage + (done ? '': '▌')
                    };
                    return newMessages;
                });
            }

            // Remove typing indicator after completion
            setMessages(prev => {
                const newMessages = [...prev];
                const lastIndex = newMessages.length - 1;
                newMessages[lastIndex] = {
                    role: 'assistant',
                    content: assistantMessage 
                };
                return newMessages;
            });

        } catch (error) {
            console.error('Chat error:', error)
            setMessages(prev => [
                ...prev,
                { 
                    role: 'assistant', 
                    content: '**Error:** ' + (error instanceof Error ? error.message : 'Failed to get response')
                }
            ]);
        } finally {
            setIsLoading(false)
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 bg-void-black">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 cyber-scroll">
        {messages.map((msg, index) => (
            <ChatMessage key={index} role={msg.role} content={msg.content} />
        ))}
        {isLoading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
        </div>

        <ChatInput
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        />
        </div>
   )
}

export default ChatInterface


