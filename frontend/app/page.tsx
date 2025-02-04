"use client"

import React, {useState, useRef, useEffect} from 'react';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/atom-one-dark.css'


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
            const response = await axios.post('http://localhost:8000/chat', {
                message: userMessage
            })

            // Simulate streaming response
            const responseText = response.data.response
            const words = responseText.split(' ')
            let currentMessage = ''

            for (const word of words) {
                currentMessage += word + ' '
                setMessages(prev => {
                    const lastMessage = prev[prev.length - 1]
                    if (lastMessage?.role === 'assistant') {
                        return [
                            ...prev.slice(0, -1),
                            { role: 'assistant', content: currentMessage }
                        ]
                    }
                    return [...prev, { role: 'assistant', content: currentMessage }]
                })
                await new Promise(resolve => setTimeout(resolve, 50))
            }
        } catch (error) {
            console.error('Chat error:', error)
            setMessages(prev => [
                ...prev,
                { role: 'assistant', content: '**Error:** Unable to get response' }
            ])
        } finally {
            setIsLoading(false)
        }
    }

    return (
        
        <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 bg-gray-50">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((msg, index) => (
            <div
            key={index}
            className={`p-4 rounded-lg ${
                msg.role === 'user' 
                    ? 'bg-blue-100 ml-8 text-gray-900'  // Added text color
                    : 'bg-green-100 mr-8 text-gray-900' // Added text color
            }`}
            >
            <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            className="prose text-gray-900" // Added text color
            >
            {msg.content}
            </ReactMarkdown>
            </div>
        ))}
        {isLoading && (
            <div className="p-4 rounded-lg bg-green-100 mr-8 text-gray-900"> {/* Added text color */}
            <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-700"></div>
            <span>Thinking...</span>
            </div>
            </div>
        )}
        <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
        <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white" // Added text color
        disabled={isLoading}
        />
        {/* ... rest of the form ... */}
        </form>
        </div>
   )
}

export default ChatInterface


