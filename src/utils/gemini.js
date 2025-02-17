
export const generateSummary = async (content) => {

    const API_KEY = 'AIzaSyBt2VNLUignvRZGu2MRt6MwsDNg0rPxwIs';
    const API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent';

    try {
        const prompt = `Please provide a concise summary of the following text in this format:

Summary:
[2-3 sentence overview of the main topic]

Key Points:
• [Point 1]
• [Point 2]
• [Point 3]
...

Important Details:
• [Detail 1]
• [Detail 2]
• [Detail 3]
...

Text to summarize: `;

        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${prompt} ${content}`
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new NoEmitOnErrorsPlugin('Failed to generate summary');
        }

        const data = await response.json();
        console.log(data);
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error(`Error calling gemini API: `, error);
        throw error;
    }
}