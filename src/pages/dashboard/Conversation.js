import { Stack, Box, Divider, CircularProgress } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useTheme } from "@mui/material/styles";
import { SimpleBarStyle } from "../../components/Scrollbar";

import { ChatHeader, ChatFooter } from "../../components/Chat";
import useResponsive from "../../hooks/useResponsive";
import { Chat_History } from "../../data";

import { useDispatch, useSelector } from "react-redux";
import {
  FetchCurrentMessages,
  SetCurrentConversation,
} from "../../redux/slices/conversation";
import { socket } from "../../socket";
import { MediaMsg, Timeline, DocMsg, LinkMsg, ReplyMsg, TextMsg } from "../../sections/Dashboard/Conversation";
import moment from 'moment';
import { useState } from "react";
import { formatCreatedAtMessage } from "../../utils/formatTime";
const user_id = window.localStorage.getItem("user_id");
const Conversation = ({ isMobile, menu }) => {
  const dispatch = useDispatch();
  const { conversations, current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const [isLoading, setIsLoading] = useState(false);

  console.log("current_messages", current_messages);
  const { room_id } = useSelector((state) => state.app);


  // const handleMessages = (messages) => {
  //   const groupedMessages = {};
  //   messages.forEach((message, index) => {
  //     // Lấy ngày và giờ từ trường "created_at" bằng Moment.js
  //     const createdAt = moment(message.created_at);
  //     const date = createdAt.format('ddd MMM DD YYYY');
  //     const time = createdAt.format('HH:mm');
  //     // Tạo khóa cho nhóm bằng cách kết hợp ngày và giờ
  //     const key = `${date} ${time}`;
  //     // Kiểm tra xem nhóm đã tồn tại chưa, nếu chưa thì tạo mới
  //     if (!groupedMessages.hasOwnProperty(key)) {
  //       groupedMessages[key] = {
  //         createdAt: message.created_at,
  //         messages: []
  //       };
  //     }
  //     // Thêm tin nhắn vào nhóm tương ứng
  //     groupedMessages[key].messages.push({
  //       id: message._id,
  //       type: "msg",
  //       subtype: message.type,
  //       message: message.text || "",
  //       incoming: message.to === user_id,
  //       outgoing: message.from === user_id,
  //       filename: message.file || ""
  //     });
  //   });

  //   // Kết quả sẽ là một mảng chứa các nhóm tin nhắn theo ngày và giờ
  //   return Object.values(groupedMessages);
  // }

  useEffect(() => {
    setIsLoading(true);
    const current = conversations.find((el) => el?.id === room_id);
    console.log("current", current);
    socket.emit("get_messages", { conversation_id: current?.id }, (data) => {
      // data => list of messages
      console.log("get_messages", data);
      // const messages = handleMessages(data);
      // console.log("get_messages", messages);
      dispatch(FetchCurrentMessages({ messages: data }));
      setIsLoading(false);

    });

    dispatch(SetCurrentConversation(current));
  }, [room_id]);
  if (isLoading) return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
      <CircularProgress />
    </Box>
  )
  return (
    <Box p={isMobile ? 1 : 3}>
      <Stack spacing={3}>
        {current_messages.length > 0 &&
          current_messages.map((el, idx) => {
            switch (el.type) {
              case "divider":
                return (
                  // Timeline
                  <Timeline el={el} />
                );
              case "msg":
                switch (el.subtype) {
                  case "Image":
                    return (
                      // Media Message
                      <MediaMsg el={el} menu={menu} />
                    );
                  case "Document":
                    return (
                      // Doc Message
                      <DocMsg el={el} menu={menu} />
                    );
                  case "Link":
                    return (
                      // Link Message
                      <LinkMsg el={el} menu={menu} />
                    );
                  case "reply":
                    return (
                      // ReplyMessage
                      <ReplyMsg el={el} menu={menu} />
                    );
                  default:
                    return (
                      // Text Message
                      <TextMsg
                        el={el}
                        createdAt={el.createdAt}
                        menu={menu}
                      />
                    );
                }
              default:
                return null;
            }
          })}
      </Stack>
    </Box>
  );
};

const ChatComponent = () => {
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const theme = useTheme();

  const messageListRef = useRef(null);

  const { current_messages } = useSelector(
    (state) => state.conversation.direct_chat
  );

  useEffect(() => {
    // Scroll to the bottom of the message list when new messages are added
    messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
  }, [current_messages]);

  return (
    <Stack
      height={"100%"}
      maxHeight={"100vh"}
      width={isMobile ? "100vw" : "auto"}
    >
      {/*  */}
      <ChatHeader />
      <Box
        ref={messageListRef}
        width={"100%"}
        sx={{
          position: "relative",
          flexGrow: 1,
          overflow: "scroll",

          backgroundColor:
            theme.palette.mode === "light"
              ? "#F0F4FA"
              : theme.palette.background,

          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <SimpleBarStyle timeout={500} clickOnTrack={false}>
          <Conversation menu={true} isMobile={isMobile} />
        </SimpleBarStyle>
      </Box>

      {/*  */}
      <ChatFooter />
    </Stack>
  );
};

export default ChatComponent;

export { Conversation };
