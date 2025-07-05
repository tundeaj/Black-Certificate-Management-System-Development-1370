import React from 'react';
import { HelpHub } from '@questlabs/react-sdk';
import questConfig from '../config/questConfig';

const AppHelp = () => {
  const userId = localStorage.getItem('userId') || questConfig.USER_ID;
  
  return (
    <HelpHub
      uniqueUserId={userId}
      questId={questConfig.QUEST_HELP_QUESTID}
      accent={questConfig.PRIMARY_COLOR}
      botLogo={{
        logo: 'https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1741000949338-Vector%20%282%29.png'
      }}
      style={{
        zIndex: 9999 // Ensure it's above navbar and sidebar
      }}
    />
  );
};

export default AppHelp;