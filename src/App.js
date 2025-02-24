import React, { useState, useEffect } from 'react';
import { LoadingSpinner } from './components/LoadingSpinner/LoadingSpinner';
import { SummaryButton } from './components/SummaryButton/SummaryButton';
import { SummaryContent } from './components/SummaryContent/SummaryContent';
import { GrootTalk } from './components/GrootTalk/GrootTalk';

import { getPageContent } from './utils/pageContent';
import { generateSummary } from './utils/gemini';
import { savePageData, getPageData, clearOldEntries } from './utils/storage';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';

import './App.css';

const App = () => {

    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [completeText, setCompleteText] = useState(false);
    const [currentUrl, setCurrentUrl] = useState('')

    const [tabValue, setTabValue] = useState('summary');

    useEffect(() => {
        const init = async() => {
            const [tab] = await chrome.tabs.query({
                active: true,
                currentWindow: true
            });

            setCurrentUrl(tab.url);

            //Check for existing data
            const existingData = await getPageData(tab.Url);
            if(existingData) {
                setSummary(existingData.summary);
                setCompleteText(existingData.completeText);
            }

            await clearOldEntries();
        };
        init();
    }, []);

    const handleSummarize = async () => {
        setLoading(true);
        try {

            //Check existing data first
            const existingData = await getPageData(currentUrl);
            if(existingData) {
                setSummary(existingData.summary);
                setCompleteText(existingData.completeText);
                setLoading(false);
                return;
            }

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

            // console.log(pageContent);
            setCompleteText(pageContent);

            //Generate summary using Gemini
            const summaryText = await generateSummary(pageContent);
            setSummary(summaryText);

            await savePageData(currentUrl, summaryText, pageContent);

        } catch (error) {
            setSummary('Error generating summary: ' + error.message);
            console.error("Summarization error:", error);
        } finally {
            setLoading(false);
        }
    }

    const onTabClicked = (newValue) => {
        setTabValue(newValue);
    }

    return (
        <div className="container">
            <h1>Page Summarizer</h1>
            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={tabValue}
                    onChange={onTabClicked}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                >
                    <Tab value="summary" label="Summarized" onClick={() => onTabClicked('summary')} />
                    <Tab value="talk" label="Groot talk" onClick={() => onTabClicked('talk')} />
                </Tabs>
            </Box>
            {tabValue == "summary" &&
                (summary == "" ?
                    (loading ? <LoadingSpinner /> : <SummaryButton onSummarize={handleSummarize} loading={loading} />)
                    :
                    <SummaryContent summary={summary} />)
            }

            {tabValue == "talk" && 
            <>
            <GrootTalk text={completeText} currentUrl={currentUrl} />
            </>
            }

        </div>
    );
};

export default App;