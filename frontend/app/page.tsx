"use client"

import React, {useState} from 'react';
import axios from 'axios';


const ChatInterface = () => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        try {
            const response = await axios.post('http://localhost:8000/chat', {
                message: input
            });
            
            setMessages([
                ...messages,
                { role: 'user', content: input },
                { role: 'assistant', content: response.data.response }
            ]);
            
            setInput('');
        } catch (error) {
            console.error('Chat error:', error);
        }
    };

    return (
        <div className="chat-container">
            <div className="chat-history">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        {msg.content}
                    </div>
                ))}
            </div>
            
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default ChatInterface;
