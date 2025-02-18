import React, { useState } from 'react';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';

export const PageTabs = () => {
    const [tabValue, setTabValue] = useState('summary');

    const onTabClicked = (newValue) => {
        setTabValue(newValue);
    }

    return(
        <Box sx={{ width: '100%' }}>
            <Tabs 
            value={tabValue}
            onChange={onTabClicked}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="secondary tabs example"
            >
                <Tab value="summary" label="Summarized"></Tab>
                <Tab value="talk" label="Groot talk" disabled></Tab>
            </Tabs>
        </Box>
    )
}