import { createSlice } from "@reduxjs/toolkit";
import { faker } from "@faker-js/faker";
import { AWS_S3_REGION, S3_BUCKET_NAME } from "../../config";
import { showSnackbar } from "./app";
import axios from "../../utils/axios";

const user_id = window.localStorage.getItem("user_id");

const initialState = {
  direct_chat: {
    conversations: [],
    current_conversation: null,
    current_messages: [],
  },
  group_chat: {},
};

const slice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    fetchDirectConversations(state, action) {
      const list = action.payload.conversations.map((el) => {
        const user = el.participants.find(
          (elm) => elm._id.toString() !== user_id
        );
        return {
          id: el._id,
          user_id: user?._id,
          name: `${user?.firstName} ${user?.lastName}`,
          online: user?.status === "Online",
          img: user?.avatar?.url || faker.image.avatar(),
          msg: faker.music.songName(),
          time: "11:11",
          unread: 0,
          pinned: false,
          about: user?.about,
          notifications: el?.notifications.filter(n => n.receiver === user_id).length
        };
      });

      state.direct_chat.conversations = list;
    },
    updateDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      state.direct_chat.conversations = state.direct_chat.conversations.map(
        (el) => {
          if (el?.id !== this_conversation._id) {
            return el;
          } else {
            const user = this_conversation.participants.find(
              (elm) => elm._id.toString() !== user_id
            );
            return {
              id: this_conversation._id._id,
              user_id: user?._id,
              name: `${user?.firstName} ${user?.lastName}`,
              online: user?.status === "Online",
              img: faker.image.avatar(),
              msg: faker.music.songName(),
              time: "11:11",
              unread: 0,
              pinned: false,
            };
          }
        }
      );
    },
    addDirectConversation(state, action) {
      const this_conversation = action.payload.conversation;
      const user = this_conversation.participants.find(
        (elm) => elm._id.toString() !== user_id
      );
      state.direct_chat.conversations = state.direct_chat.conversations.filter(
        (el) => el?.id !== this_conversation._id
      );
      state.direct_chat.conversations.push({
        id: this_conversation._id,
        user_id: user?._id,
        name: `${user?.firstName} ${user?.lastName}`,
        online: user?.status === "Online",
        img: faker.image.avatar(),
        msg: faker.music.songName(),
        time: "11:11",
        unread: 0,
        pinned: false,
      });
    },
    setCurrentConversation(state, action) {
      state.direct_chat.current_conversation = action.payload;
    },
    fetchCurrentMessages(state, action) {
      const messages = action.payload.messages;
      console.log("messages", messages);
      const formatted_messages = messages.map((el) => ({
        id: el._id,
        type: "msg",
        subtype: el.type,
        message: el.text || "",
        incoming: el.to === user_id, // gửi đến 
        outgoing: el.from === user_id, // gửi đi 
        filename: el.file || "",
        createdAt: el.created_at
      }));
      state.direct_chat.current_messages = formatted_messages;
    },
    addDirectMessage(state, action) {
      // const { message } = action.payload;
      // const { date, ...rest } = message;
      // const existCurrentMessage = state.direct_chat.current_messages.find(x => x.createdAt.includes(date));
      // if (existCurrentMessage) {
      //   existCurrentMessage.messages.push({ ...rest });
      // } else {
      //   state.direct_chat.current_messages.push({
      //     createdAt: date,
      //     messages: [{ ...rest }]
      //   })
      // }
      state.direct_chat.current_messages.push(action.payload.message);
    },
    addOrUpdateNotification(state, action) {
      const { conversation_id, new_notification, type } = action.payload;
      console.log("state.direct_chat.conversations", state.direct_chat.conversations);
      const conversations = JSON.parse(JSON.stringify(state.direct_chat.conversations)).map(conversation => {
        if (conversation.id === conversation_id) {
          if (type === 0) {
            return {
              ...conversation,
              notifications: conversation.notifications + new_notification
            };
          } else {
            return {
              ...conversation,
              notifications: 0
            };
          }
        }
        return conversation;
      });
      state.direct_chat.conversations = conversations;
    }
  },
});

// Reducer
export default slice.reducer;

// ----------------------------------------------------------------------

export const FetchDirectConversations = ({ conversations }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchDirectConversations({ conversations }));
  };
};
export const AddDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectConversation({ conversation }));
  };
};
export const UpdateDirectConversation = ({ conversation }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.updateDirectConversation({ conversation }));
  };
};

export const SetCurrentConversation = (current_conversation) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.setCurrentConversation(current_conversation));
  };
};


export const FetchCurrentMessages = ({ messages }) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.fetchCurrentMessages({ messages }));
  }
}

export const AddDirectMessage = (message) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addDirectMessage({ message }));
  }
}

export const addOrUpdateNotification = (notification) => {
  return async (dispatch, getState) => {
    dispatch(slice.actions.addOrUpdateNotification(notification));
    if (notification.type === 1) {
      await axios
        .put(`/oneToOne/notification/${notification.conversation_id}`, {}, {
          headers: {
            Authorization: `Bearer ${getState().auth.token}`,
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
          dispatch(showSnackbar({ severity: 'error', message: error.message }));
        });
    }
  }
}

