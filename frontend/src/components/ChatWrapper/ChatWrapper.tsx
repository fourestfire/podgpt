'use client';

import {
  ActionIcon,
  Anchor,
  Box,
  Button,
  Container,
  CloseButton,
  Divider,
  Flex,
  Grid,
  Image,
  Paper,
  PaperProps,
  rem,
  ScrollArea,
  Skeleton,
  Stack,
  TextInput,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { Link, RichTextEditor } from '@mantine/tiptap';
import { BubbleMenu, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { format } from 'date-fns';
// import { PATH_DASHBOARD } from '@/routes';
import {
  ChatItem,
  ChatsList,
  ErrorAlert,
  PageHeader,
  Surface,
  UserButton,
} from '@/components';
import { IconDotsVertical, IconPaperclip, IconSearch, IconSend } from '@tabler/icons-react';
import { useColorScheme, useMediaQuery } from '@mantine/hooks';
import { Carousel } from '@mantine/carousel';
import ChatsListData from '../../../dist/mocks/ChatsList.json';
import ChatItemsData from '../../../dist/mocks/ChatItems.json';
import UserProfileData from '../../../dist/mocks/UserProfile.json';
// import ChatsListData from '@/public/mocks/ChatsList.json';
// import ChatItemsData from '@/public/mocks/ChatItems.json';
// import UserProfileData from '@/public/mocks/UserProfile.json';
import useFetchData from '@/hooks/useFetchData';
import axios from 'axios';
import classes from './ChatWrapper.module.css';
import { useState, useEffect, useRef } from 'react';
import { ChatItemProps } from '../ChatItem/ChatItem';
import { v4 as uuidv4 } from 'uuid';
import { readAndCompressImage } from 'browser-image-resizer';
import { useLocation } from 'react-router-dom';

function createChatItem(data: ChatItemProps) {
  return (
    <ChatItem
      key={data.id}
      id={data.id}
      fullName={data.fullName}
      avatar={data.avatar}
      sent_time={data.sent_time}
      message={data.message}
      sender={data.sender}
      loading={data.loading}
    />
  );
}

const ICON_SIZE = 16;

const PAPER_PROPS: PaperProps = {
  shadow: 'md',
  radius: 'md',
};

interface ChatWrapperProps {
  modelType?: string;
}

const ChatWrapper: React.FC<ChatWrapperProps> = ({ modelType }) => {
  const theme = useMantineTheme();
  const colorScheme = useColorScheme();
  const tablet_match = useMediaQuery('(max-width: 768px)');
  const [value, setValue] = useState('');
  const [chatItems, setChatItems] = useState<ChatItemProps[]>([]);
  const [userInput, setUserInput] = useState('');
  const [responseMessage, setResponseMessage] = useState('');
  const [messageHistory, setMessageHistory] = useState<{ role: string, content: string, image?: string }[]>([]);
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [imageName, setImageName] = useState<string | null>(null);
  const [requestLoading, setRequestLoading] = useState(false);
  

  const handleUserInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(event.target.value);
  };

  const lastChatItemRef = useRef(null);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link,
      Placeholder.configure({ placeholder: 'Type your message' }),
    ],
    content: '<p>Select some text to see a bubble menu</p>',
  });
  // const {
  //   data: chatsListData,
  //   loading: chatsListLoading,
  //   error: chatsListError,
  // } = useFetchData('/static/mocks/ChatsList.json'); // calls from the root dir
  // const {
  //   data: chatItemsData,
  //   loading: chatsItemsLoading,
  //   error: chatsItemsError,
  // } = useFetchData('/static/mocks/ChatItems.json');

  const [chatsListData, setChatsListData] = useState<any>([]);
  const [chatsListError, setChatsListError] = useState<any>(null);
  const [chatsListLoading, setChatsListLoading] = useState(false);
  
  const [chatItemsData, setChatItemsData] = useState<any>([]);
  const [chatsItemsError, setChatsItemsError] = useState<any>(null);
  const [chatsItemsLoading, setChatsItemsLoading] = useState(false);

  const location = useLocation();
  useEffect(() => {
    // Clear messageHistory whenever the route changes
    setMessageHistory([]);
  }, [location]);

  // Update chatItemsData
  useEffect(() => {
    if (chatItemsData) {
      setChatItems(chatItemsData);
    }
  }, [chatItemsData, modelType]); // whenever chatItemsData or modelType changes, we setChatItems again

  // handles scroll to bottom functionality
  const viewport = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    viewport.current!.scrollTo({ top: viewport.current!.scrollHeight, behavior: 'smooth' });

  const handleSendMessage = async () => {

    const base64Images = attachedImages ? attachedImages.map(image => image.split(',')[1]) : [];
    // console.log('Image in handleSendMessage:', base64Image?.substring(0, 50));

    const newChatItem: ChatItemProps = {
      id: uuidv4(),
      fullName: "New User",
      avatar: `https://api.dicebear.com/8.x/thumbs/svg?seed=Baby&backgroundType=gradientLinear&backgroundColor=00041e,002849&shapeColor=f1f4dc&translateY=20&translateX=11&scale=120`, //https://api.dicebear.com/8.x/thumbs/svg?backgroundColor=80deea,c5e1a5&backgroundType=gradientLinear&rotate=5`,
      sent_time: format(new Date(), 'h:mm a'),
      message: value, // Use the value from the text input
      sender: true,
      loading: false,
      images: attachedImages || [],
    };

    // update UI state
    setChatItems(prevChatItems => [...prevChatItems, newChatItem]);

    // clear input field
    setValue('');

    // make call to backend
    try {
      setRequestLoading(true); // Request has started

      const csrftoken = getCSRFToken(); // Retrieve the CSRF token

      // Log whether the CSRF token was retrieved successfully using getCSRFToken()
      // console.log('CSRF token retrieved:', csrftoken);
      // console.log("userInput:", value)

      // console.log('base64Image:', base64Image ? base64Image.substring(0, 50) : 'No image'); // Log the first 50 characters of base64Image

      const requestConfig = {
        url: '/api/call-gpt/',
        method: 'POST',
        data: {
          user_input: value,
          model_type: modelType,
          images: base64Images,
          message_history: JSON.stringify(messageHistory)
        },
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrftoken
        },
        withCredentials: true
      };

      // Create a "skeleton" responseChatItem
      const skeletonChatItem: ChatItemProps = {
        id: uuidv4(),
        fullName: "PodGPT",
        avatar: `https://api.dicebear.com/8.x/icons/svg?icon=magic&backgroundColor=E6228B,E67D22&backgroundType=gradientLinear`,
        sent_time: format(new Date(), 'h:mm a'),
        message: "loading...",
        sender: false,
        loading: true
      };

      // Add the "skeleton" responseChatItem to chatItems
      setChatItems(prevChatItems => [...prevChatItems, skeletonChatItem]);

      // The request!
      const response = await axios(requestConfig);

      // Log the status code of the response
      console.log('Response from ChatGPT:', response.data.response);

      setResponseMessage(response.data.response); // Update the response message

      // Create a new ChatItem from the response to update the UI with
      const responseChatItem: ChatItemProps = {
        id: uuidv4(),
        fullName: "PodGPT",
        avatar: `https://api.dicebear.com/8.x/icons/svg?icon=magic&backgroundColor=E6228B,E67D22&backgroundType=gradientLinear`, // https://www.dicebear.com/styles/icons/
        sent_time: format(new Date(), 'h:mm a'),
        message: response.data.response, // Use the response from GPT
        sender: false,
        loading: false
      };

      // Replace the "skeleton" responseChatItem with the actual responseChatItem
      setChatItems(prevChatItems => prevChatItems.map(item => item.id === skeletonChatItem.id ? responseChatItem : item));
    
      // Add the user message to the message history
      setMessageHistory(prevMessageHistory => [...prevMessageHistory, { role: 'user', content: value, images: base64Images || undefined }]);

      // Add the response to the message history
      setMessageHistory(prevMessageHistory => [...prevMessageHistory, { role: 'system', content: response.data.response }]);

      // After message is sent, reset attachedImage state to null
      setAttachedImages([]);

    } catch (error) {
      console.error('Error:', error);
      // Handle error
    } finally {
      setRequestLoading(false); // End loading
    }
  };

  useEffect(() => {
    // console.log('Message history:', messageHistory);
  }, [messageHistory]);

  const getCSRFToken = () => {
    let csrfToken = null;
    // console.log('document.cookie:', document.cookie); 
    if (document.cookie && document.cookie !== '') {
      let cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, "csrftoken".length + 1) === ("csrftoken" + '=')) {
          csrfToken = decodeURIComponent(cookie.substring("csrftoken".length + 1));
          break;
        }
      }
    }
    // Log whether the CSRF token was found in the cookies
    // console.log('CSRF token found in cookies:', Boolean(csrfToken));

    return csrfToken;
  };

  const handleAction = () => { // used to handle the onClick event for the send message button
    if (value.trim() !== '') {
      handleSendMessage();
      scrollToBottom();
    }
  };

  const handleImageAttach = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = async (event) => {
      const startTime = performance.now(); // Start the timer

      const files = (event.target as HTMLInputElement).files;
      if (files) {
        const file = files[0];
        setImageName(file.name); // update state

        const config = {
          quality: 0.9, // Adjust this value to change the compression quality
          maxWidth: 750, // Set the maximum width of the output image
          maxHeight: 750, // Set the maximum height of the output image
          autoRotate: true,
          debug: true,
        };

        try {
          const compressedImage = await readAndCompressImage(file, config);
          const reader = new FileReader();

          reader.onloadend = () => {
            const base64String = reader.result as string;
            setAttachedImages((prevImages: string[]) => [...prevImages, base64String]); // update state

            // Now you can send this base64String to your server

            const endTime = performance.now(); // End the timer
            console.log(`handleImageAttach took ${endTime - startTime} milliseconds.`);
          };

          reader.readAsDataURL(compressedImage);
        } catch (error) {
          console.error('Error while compressing image', error);
        }
      }
    };

    input.click();
  };

  return (
    <>
      <>
        <title>Chat</title>
        <meta
          name="description"
          content="PodGPT"
        />
      </>
      <Container fluid>
        <Stack>
          {/* <PageHeader title="Chat" breadcrumbItems={items} /> */}
          <Surface
            component={Paper}
            {...PAPER_PROPS}
            style={{ height: tablet_match ? 'auto' : rem(565) }}
          >
            <Grid gutter={0}>

              <Grid.Col span={{ base: 12, sm: 12, md: 12, lg: 12 }}>
                <Box className={classes.chatItems}>
                  <Box bg="blue.9" className={classes.chatHeader}>
                    <Skeleton visible={chatsListLoading || chatsItemsLoading}>
                      <Flex align="center" justify="space-between">
                        <Flex>
                          <Text fw={900}>Chat with PodGPT&nbsp;</Text>
                          <Text
                            size="m"
                            fw={900}
                            variant="gradient"
                            gradient={{ from: 'orange', to: 'yellow', deg: 90 }}
                          >
                            /{modelType}/
                          </Text>
                        </Flex>
                        {/* <UserButton
                          email={UserProfileData.email}
                          image={UserProfileData.avatar}
                          name={UserProfileData.name}
                          asAction={false}
                          className={classes.user}
                        /> */}
                        <Flex gap="sm">
                          {/* <ActionIcon variant="subtle">
                            <IconSearch size={16} />
                          </ActionIcon> */}
                          <ActionIcon variant="subtle">
                            <IconDotsVertical size={16} />
                          </ActionIcon>
                        </Flex>
                      </Flex>
                    </Skeleton>
                  </Box>
                  <ScrollArea h={515} viewportRef={viewport}>
                    <Stack px="lg" py="xl">
                      {chatsItemsError ? (
                        <ErrorAlert
                          title="Error loading chat"
                          message={chatsItemsError.toString()}
                        />
                      ) : (
                        chatItems.length > 0 &&

                        chatItems.map((c: any, index) => (
                          <ChatItem
                            // ref={index === chatItems.length - 1 ? lastChatItemRef : null}
                            key={c.id}
                            avatar={c.avatar}
                            id={c.id}
                            message={c.message}
                            fullName={
                              c.sender
                                ? 'you'
                                : `${c?.fullName}`
                            }
                            sender={c.sender}
                            sent_time={c.sent_time}
                            ml={c.sender ? 'auto' : 0}
                            style={{ maxWidth: tablet_match ? '100%' : '100%' }}
                            loading={chatsItemsLoading}
                            images={c.images}
                          />
                        ))
                      )}
                    </Stack>
                  </ScrollArea>
                  <Divider />
                  <Box bg="#2e2e2e" style={{ borderTop: 'none' }} className={classes.replyBox}>
                    <Flex gap="sm" align="center">
                      <Skeleton visible={chatsListLoading || chatsItemsLoading}>
                        <TextInput
                          // label="Input label"
                          // description="Input description"
                          placeholder="Type your message..."
                          value={value}
                          onChange={(event) => setValue(event.currentTarget.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              handleAction();
                            }
                          }}
                        />
                      </Skeleton>
                      {modelType === "Vision" && (
                        <Tooltip label="Attach image">
                          <ActionIcon
                            component="button"
                            title="attach image"
                            onClick={handleImageAttach}
                            variant="filled"
                            size="xl"
                            radius="xl"
                            // gradient={{ from: 'purple', to: 'lime', deg: 224 }}
                            loading={chatsListLoading || chatsItemsLoading}
                            color="blue.4"
                          >
                            <IconPaperclip size={24} /> {/* You need to import this icon */}
                          </ActionIcon>
                        </Tooltip>
                      )}
                      <Tooltip label="Send message">
                        <ActionIcon
                          component="button"
                          onClick={() => {
                            if (value.trim() !== '') { // If value is empty, the onClick event will do nothing.
                              handleSendMessage();
                              scrollToBottom();
                            }
                          }}
                          title="send message"
                          variant="filled"
                          size="xl"
                          radius="xl"
                          color="blue.4"
                          // gradient={{ from: 'purple', to: 'lime', deg: 224 }}
                          //   disabled={!Boolean(editor?.getText())}
                          loading={chatsListLoading || chatsItemsLoading}
                        >
                          <IconSend size={24} />
                        </ActionIcon>
                      </Tooltip>
                    </Flex>
                    <Flex pt="xs">
                      {attachedImages && attachedImages.map((image, index) => (
                        <div key={index} style={{ position: 'relative', display: 'inline-block', width: '75px', height: '75px', overflow: 'hidden' }}>
                          <Image
                            src={image}
                            alt={`Preview ${index}`}
                            radius="sm"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                          <CloseButton
                            onClick={() => {
                              setAttachedImages(prevImages => prevImages.filter((_, imgIndex) => imgIndex !== index));
                            }}
                            style={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              cursor: 'pointer',
                            }}
                          />
                        </div>
                      ))}
                    </Flex>
                  </Box>
                </Box>
              </Grid.Col>
            </Grid>
          </Surface>
        </Stack>
      </Container>
    </>
  );
}

export default ChatWrapper;
