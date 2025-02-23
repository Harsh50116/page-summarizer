import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

import { API_INFO } from '../../utils/config';

import './styles.css';

export const GrootTalk = ({ text }) => {

    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const genAI = new GoogleGenerativeAI(API_INFO.API_KEY);

    const handleSendMessage = async() => {

        if(!inputMessage.trim()) 
            return;

        //Create a messages array including user's message as well
        const newMessages = [...messages, { role: 'user', content: inputMessage }];

        setMessages(newMessages);
        setInputMessage('');
        setIsLoading(true);

        try {
            //Prepare the model with the initial context
            const model = genAI.getGenerativeModel({
                model: "gemini-1.0-pro"
            });

            //combine the context and current conversation
            const chat = model.startChat({
                history: newMessages.map(msg => ({
                    role: msg.role == 'user' ? 'user': 'model',
                    parts: [{ text: `You are an assistant helping a user understand a page summary. 
                        The initial context is: ${text}. 
                        Use this context to provide more detailed and contextual responses.` }]
                }))
            });

            //Generate response
            const result = await chat.sendMessage(inputMessage);
            const response = await result.response.text();

            //update messages with AI response
            setMessages(prev => [...prev, { role: 'model', content: response }]);

        } catch(error) {
            console.error("Error generating content: ", error);
            setMessages(prev => [
                ...prev, { role:'model', content: 'Sorry, there was an error processing your request.' }
            ]);
        } finally{
            setIsLoading(false);
        }

    } 

    return (
        <div className="groot-talk-container">
            <div className="groot-talk-messages">
                {
                    messages.map((msg, index) => (
                        <div key={index} className={`groot-talk-message ${
                            msg.role === 'user' 
                              ? 'groot-talk-message-user' 
                              : 'groot-talk-message-model'
                          }`}
                          dangerouslySetInnerHTML={{__html: msg.role === 'model' 
                            ? msg.content
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')  // Convert ** to bold
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')             // Convert * to italic
                                .replace(/\n/g, '<br />')                         // Convert newlines to breaks
                            : msg.content}}
                          />
                        
                    ))
                }
                {
                    isLoading && (
                        <div className="groot-talk-loading">
                            Generating response...
                        </div>
                    )
                }
            </div>

            <div className="groot-talk-input-container">
                <input 
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask abot the summary"
                className="groot-talk-input"
                />
                <button onClick={handleSendMessage} disabled={isLoading} 
          className="groot-talk-send-button"
          >Send</button>
            </div>
        </div>
    )
}