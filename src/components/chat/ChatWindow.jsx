import React from 'react';
import { FloatingMetaAIChat } from './FloatingMetaAIChat';

export const ChatWindow = ({ onBack }) => {
  return <FloatingMetaAIChat forceOpen={true} onBack={onBack} />;
};
