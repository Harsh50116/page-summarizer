import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

import './styles.css';

export const LoadingSpinner = () => {

    return(
        <div className='spinner-continaer'>
            
            <div className='loading-icon'>
                <CircularProgress />

            </div>

            <div className='loading-spinner'>
                Generating summary... 
            </div>
        </div>
    )
};