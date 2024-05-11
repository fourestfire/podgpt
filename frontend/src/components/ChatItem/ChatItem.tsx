import { useEffect } from 'react';
import {
  Avatar,
  Box,
  BoxProps,
  Code,
  Flex,
  Paper,
  Skeleton,
  Loader,
  Text,
  TypographyStylesProvider,
  Image,
} from '@mantine/core';
import classes from './ChatItem.module.css';
import React from 'react';
import Marked from 'marked-react';

export type ChatItemProps = {
  id: string;
  fullName: string;
  avatar: string;
  sent_time: string;
  message: string;
  sender: boolean;
  loading?: boolean;
  images?: string[] | null;
} & BoxProps;

const ChatItem = (props: ChatItemProps) => {
  const {
    id,
    avatar,
    message,
    fullName,
    sender,
    sent_time,
    loading,
    images,
    ...others
  } = props;
  const isMe = fullName.toLowerCase() === 'you';

  return loading ? (
    <Flex gap="sm">
      <Skeleton height={48} circle mb="xl" />
      <Skeleton height={60} />
    </Flex>
  ) : (
    <Box component="div" {...others}>
      <Flex gap="xs">
        <Avatar src={avatar} radius="50%" />
        <Box>
          <Paper
            p="sm"
            className={isMe ? classes.isMeChatItem : classes.chatItem}
          >
            <Text
              size="sm"
              fw={600}
              tt="capitalize"
              mb={4}
              c={isMe ? 'white' : 'initial'}
            >
              {fullName}
            </Text>
            {/* <Text size="sm" c={isMe ? 'white' : 'initial'}> */}
            <TypographyStylesProvider>
              <div style={{ fontSize: '0.875rem', color: isMe ? 'white' : 'initial' }}>
                {message === "loading..." ? ( // using message contents to determine if loading. not best practice (mixing concerns, should be using prop instead) but fine
                  <Loader color="blue.3" type="dots" size="sm"/> // display loader if loading
                ) : (
                  <Marked>{message}</Marked> // otherwise display main content
                )}
              </div>
            </TypographyStylesProvider>
            {/* </Text> */}
            <Flex direction="row" wrap="wrap">
              {images && images.map((image, index) => (
                <Image
                  key={index}
                  radius="md"
                  h={200}
                  w="auto"
                  fit="contain"
                  src={image}
                  style={{ margin: '5px'}}
                />
              ))}
            </Flex>
          </Paper>
          <Text ta="end" size="sm" mt={4}>
            {sent_time}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};


export default ChatItem;
