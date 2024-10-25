import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import AvatarWithStatus from './AvatarWithStatus';
import ChatBubble from './ChatBubble';
import MessageInput from './MessageInput';
import MessagesPaneHeader from './MessagesPaneHeader';
import { ChatProps, MessageProps } from '../types';

type MessagesPaneProps = {
  chat: ChatProps;
};

export default function MessagesPane({
    messages,
    sender,
    onSendButtonClick,
    onLeaveClick,
                                         onJoinClick,
                                     }: MessagesPaneProps['chat'] & {
    onSendButtonClick: (message: string) => void;
    onJoinClick: () => void;
    onLeaveClick: () => void;
}) {
  const [chatMessages, setChatMessages] = React.useState(messages);
  const [textAreaValue, setTextAreaValue] = React.useState('');

  React.useEffect(() => {
    setChatMessages(messages);
  }, [messages]);

  return (
    <Sheet
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
      }}
    >
      <MessagesPaneHeader sender={sender} onJoinClick={onJoinClick} onLeaveClick={onLeaveClick}/>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: 'scroll',
          flexDirection: 'column-reverse',
        }}
      >
        <Stack spacing={2} sx={{ justifyContent: 'flex-end' }}>
          {chatMessages.map((message: MessageProps, index: number) => {
            const isYou = message.sender === 'You';
            return (
              <Stack
                key={index}
                direction="row"
                spacing={2}
                sx={{ flexDirection: isYou ? 'row-reverse' : 'row' }}
              >
                {/*{message.sender !== 'You' && (*/}
                {/*  <AvatarWithStatus*/}
                {/*    online={message.sender.online}*/}
                {/*    src={message.sender.avatar}*/}
                {/*  />*/}
                {/*)}*/}
                <ChatBubble variant={isYou ? 'sent' : 'received'} {...message} />
              </Stack>
            );
          })}
        </Stack>
      </Box>
      <MessageInput
        textAreaValue={textAreaValue}
        setTextAreaValue={setTextAreaValue}
        onSubmit={() => {
            onSendButtonClick(textAreaValue);
          // const newId = chatMessages.length + 1;
          // const newIdString = newId.toString();
          // setChatMessages([
          //   ...chatMessages,
          //   {
          //     id: newIdString,
          //     sender: 'You',
          //     content: textAreaValue,
          //     timestamp: 'Just now',
          //   },
          // ]);
        }}
      />
    </Sheet>
  );
}
