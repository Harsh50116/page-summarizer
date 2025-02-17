import React from 'react';
import './styles.css';

export const SummaryButton = ({ onSummarize, loading }) => {

    return(
        <button
        className="summarize-button"
        onClick={onSummarize}
        disabled={loading}
        >
            {loading ? "Summarizing..." : "Summarize Page"}
        </button>
    )
}

