import React from 'react';
import './styles.css';

export const SummaryContent = ({ summary }) => {

    const formatMarkdown = (text) => {
        if (!text) return '';
        
        return text
            // Convert bold text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            // Convert bullet points
            .replace(/^\s*•\s+/gm, '• ') // Keep existing bullet points
            .replace(/^\s*\*\s+/gm, '• ') // Convert * to •
            // Convert line breaks
            .split('\n').map(line => `<div>${line}</div>`).join('');
    };

    return (
        <div className="summary-container">
            <div className="summary-content" 
            dangerouslySetInnerHTML={{ 
                __html: formatMarkdown(summary) || "Click the above button to generate the summary"
             }}
            />
        </div>
    );
}

