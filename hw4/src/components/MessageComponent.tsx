import { Message } from '@/lib/types/db';
import React from 'react';

type MessageComponentProps = {
  message: Message;
  userId: string;
};

const MessageComponent: React.FC<MessageComponentProps> = ({ message, userId }) => {
    const isUserMessage = message.userId === userId;
    const messageClass = isUserMessage ? 'align-right' : 'align-left';
  
    return (
      <div className={`message ${messageClass}`}>
        <p>{userId}</p>
        <p>{message.content}</p>
      </div>
    );
  };

export default MessageComponent;
