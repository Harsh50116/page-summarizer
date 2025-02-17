export const getPageContent = () => {

    // Helper function to clean content
    const cleanContent = (text) => {
        return text
            .replace(/\s+/g, ' ')        // Replace multiple spaces with single space
            .replace(/[^\w\s.,!?-]/g, '') // Remove special characters
            .trim();                      // Remove leading/trailing spaces
    };

    const contentSelectors = [
        'article',
        '[role="main"]',
        '.main-content',
        '#main-content',
        'main',
        '.post-content',
        '.article-content'
    ];

    for (let selector of contentSelectors) {
        const element = document.querySelector(selector);
        if (element) {
            return cleanContent(element.textContent);
        }
    }

    const elementsToRemove = [
        'header',
        'footer',
        'nav',
        'aside',
        '.ads',
        '#ads',
        '.sidebar',
        '#sidebar'
    ];

    const bodyClone = document.body.cloneNode(true);
    for (let element of elementsToRemove) {
        const e = bodyClone.querySelectorAll(element);
        e.forEach(el => el.remove());
    }

    return cleanContent(bodyClone.textContent);
};




