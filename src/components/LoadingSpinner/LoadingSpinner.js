import React from 'react';
import './styles.css';

export const LoadingSpinner = () => {

    return(
        <div className='spinner-continaer'>
            <div className='loading-spinner'>
                Generating summary...
            </div>
        </div>
    )
};