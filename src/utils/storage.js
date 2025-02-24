
export const savePageData = async(url, summary, completeText, chatHistory = []) => {
    try {
        
        const data = {
            summary,
            completeText,
            timestamp: new Date().toISOString(),
            chatHistory
        };

        await chrome.storage.local.set({
            [url]: data
        });

        return true;
    } catch(error) {
        console.error("Error saving data: ", error);
        return false;
    }
}

export const getPageData = async(url) => {
    try {
        const result = await chrome.storage.local.get(url);
        return result[url] || null;
    } catch(error) {
        console.error('Error retrieving the data: ', error);
        return null;
    }
};

export const updateChatHistory = async(url, newMessage) => {
    try {
        const existingData = await getPageData(url);
        if(existingData) {
            await savePageData(url, existingData.summary, existingData.completeText, newMessage);
            return true;
        }
        return false;
    } catch(error) {
        console.error('Error updating the chat history: ', error);
        return false;
    }
};

export const clearOldEntries = async() => {
    try {
        const data = await chrome.storage.local.get(null);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        for(const [url, pageData] of Object.entries(data)) {
            if(new Date(pageData.timestamp) < sevenDaysAgo)
                    await chrome.storage.local.remove(url);
        }
    } catch(error) {
        console.error('Error clearing old entries: ', error);
    }
};