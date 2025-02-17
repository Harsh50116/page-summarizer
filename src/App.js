import React, { useState } from 'react';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner';
import { SummaryButton } from './components/SummaryButton/SummaryButton';
import { SummaryContent } from './components/SummaryContent/SummaryContent';
import { getPageContent } from './utils/pageContent';
import { generateSummary } from './utils/gemini';
import './App.css';

const App = () => {

    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSummarize = async () => {
        setLoading(true);
        try {
            //Get current tab
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true
            });

            //Extract content from page
            const result = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: getPageContent
            });

            // Get the results from the first frame
            const pageContent = result[0].result;

            console.log(pageContent);

            //Generate summary using Gemini
            const summaryText = await generateSummary(pageContent);
            setSummary(summaryText);

        } catch (error) {
            setSummary('Error generating summary: ' + error.message);
            console.error("Summarization error:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container">
            <h1>Page Summarizer</h1>
            {
                summary == "" ?
                    (loading ? <LoadingSpinner /> : <SummaryButton onSummarize={handleSummarize} loading={loading} />)
                    :
                    <SummaryContent summary={summary} />
            }
        </div>
    );
};

export default App;