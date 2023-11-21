import React, { useEffect } from "react";
import { Stack } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import SideNav from "./SideNav";
import { useDispatch, useSelector } from "react-redux";
import { FetchUserProfile, SelectConversation, showSnackbar } from "../../redux/slices/app";
import {
  UpdateDirectConversation,
  AddDirectConversation,
  AddDirectMessage,
  addNotification,
} from "../../redux/slices/conversation";

import { setNotifications } from "../../redux/slices/notification";
// import AudioCallNotification from "../../sections/dashboard/Audio/CallNotification";
// import VideoCallNotification from "../../sections/dashboard/video/CallNotification";
import {
  PushToAudioCallQueue,
  UpdateAudioCallDialog,
} from "../../redux/slices/audioCall";
// import AudioCallDialog from "../../sections/dashboard/Audio/CallDialog";
// import VideoCallDialog from "../../sections/dashboard/video/CallDialog";
import { PushToVideoCallQueue, UpdateVideoCallDialog } from "../../redux/slices/videoCall";
import { connectSocket, socket } from "../../socket";
import { formatCreatedAtMessage } from "../../utils/formatTime";

const DashboardLayout = () => {
  const isDesktop = useResponsive("up", "md");
  const dispatch = useDispatch();
  const { user_id } = useSelector((state) => state.auth);
  const { open_audio_notification_dialog, open_audio_dialog } = useSelector(
    (state) => state.audioCall
  );
  const { open_video_notification_dialog, open_video_dialog } = useSelector(
    (state) => state.videoCall
  );
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { conversations, current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );

  useEffect(() => {
    dispatch(FetchUserProfile());
  }, []);


  const handleCloseAudioDialog = () => {
    dispatch(UpdateAudioCallDialog({ state: false }));
  };
  const handleCloseVideoDialog = () => {
    dispatch(UpdateVideoCallDialog({ state: false }));
  };

  useEffect(() => {
    if (isLoggedIn) {
      window.onload = function () {
        if (!window.location.hash) {
          window.location = window.location + "#loaded";
          window.location.reload();
        }
      };
      window.onload();
      if (!socket) {
        connectSocket(user_id);
      }
      socket.on("request_sent", (data) => {
        dispatch(showSnackbar({ severity: "success", message: data.message }));
      });
      socket.on("new_friend_request", (data) => {
        dispatch(
          showSnackbar({
            severity: "success",
            message: data.message,
          })
        );
      });
      socket.on("start_chat", (data) => {
        console.log(data);
        // add / update to conversation list
        const existing_conversation = conversations.find(
          (el) => el?.id === data._id
        );
        if (existing_conversation) {
          // update direct conversation
          dispatch(UpdateDirectConversation({ conversation: data }));
        } else {
          // add direct conversation
          dispatch(AddDirectConversation({ conversation: data }));
        }
        dispatch(SelectConversation({ room_id: data._id }));
      });
      socket.on("new_message", (data) => {
        const message = data.message;
        // check if msg we got is from currently selected conversation
        if (current_conversation?.id === data.conversation_id) {
          // TODO: API remove notification
          dispatch(
            AddDirectMessage({
              date: formatCreatedAtMessage(message.created_at),
              id: message._id,
              type: "msg",
              subtype: message.type,
              message: message.text || "",
              incoming: message.to === user_id,
              outgoing: message.from === user_id,
              filename: message.file || ""
            })
          );
        } else {
          // TODO : add notification to state
          dispatch(
            addNotification({
              conversation_id: data.conversation_id,
              new_notification: 1
            })
          );
        }
        if (current_conversation?.id === data.conversation_id && message.to === user_id) {
          // TODO: remove notification 
          dispatch(setNotifications({
            date: formatCreatedAtMessage(message.created_at),
            message: message.text || "",
            name: message.receiverUser.name || "",
          }));
        }
      });
      return () => {
        socket?.off("new_friend_request");
        socket?.off("request_sent");
        socket?.off("start_chat");
        socket?.off("new_message");
      };
    }

  }, [isLoggedIn, socket])

  // useEffect(() => {
  //   if (isLoggedIn) {
  //     window.onload = function () {
  //       if (!window.location.hash) {
  //         window.location = window.location + "#loaded";
  //         window.location.reload();
  //       }
  //     };

  //     window.onload();

  //     if (!socket) {
  //       connectSocket(user_id);
  //     }

  //     socket.on("audio_call_notification", (data) => {
  //       // TODO => dispatch an action to add this in call_queue
  //       dispatch(PushToAudioCallQueue(data));
  //     });

  //     socket.on("video_call_notification", (data) => {
  //       // TODO => dispatch an action to add this in call_queue
  //       dispatch(PushToVideoCallQueue(data));
  //     });

  //     socket.on("new_message", (data) => {
  //       const message = data.message;
  //       console.log(current_conversation, data);
  //       // check if msg we got is from currently selected conversation
  //       if (current_conversation?.id === data.conversation_id) {
  //         dispatch(
  //           AddDirectMessage({
  //             id: message._id,
  //             type: "msg",
  //             subtype: message.type,
  //             message: message.text,
  //             incoming: message.to === user_id,
  //             outgoing: message.from === user_id,
  //           })
  //         );
  //       }
  //     });

  //     socket.on("start_chat", (data) => {
  //       console.log(data);
  //       // add / update to conversation list
  //       const existing_conversation = conversations.find(
  //         (el) => el?.id === data._id
  //       );
  //       if (existing_conversation) {
  //         // update direct conversation
  //         dispatch(UpdateDirectConversation({ conversation: data }));
  //       } else {
  //         // add direct conversation
  //         dispatch(AddDirectConversation({ conversation: data }));
  //       }
  //       dispatch(SelectConversation({ room_id: data._id }));
  //     });

  //     socket.on("new_friend_request", (data) => {
  //       dispatch(
  //         showSnackbar({
  //           severity: "success",
  //           message: "New friend request received",
  //         })
  //       );
  //     });

  //     socket.on("request_accepted", (data) => {
  //       dispatch(
  //         showSnackbar({
  //           severity: "success",
  //           message: "Friend Request Accepted",
  //         })
  //       );
  //     });

  //     socket.on("request_sent", (data) => {
  //       dispatch(showSnackbar({ severity: "success", message: data.message }));
  //     });
  //   }

  //   // Remove event listener on component unmount
  //   return () => {
  //     socket?.off("new_friend_request");
  //     socket?.off("request_accepted");
  //     socket?.off("request_sent");
  //     socket?.off("start_chat");
  //     socket?.off("new_message");
  //     socket?.off("audio_call_notification");
  //   };
  // }, [isLoggedIn, socket]);

  if (!isLoggedIn) {
    return <Navigate to={"/auth/login"} />;
  }

  return (
    <>
      <Stack direction="row">
        {isDesktop && (
          // SideBar
          <SideNav />
        )}

        <Outlet />
      </Stack>
      {/* {open_audio_notification_dialog && (
        <AudioCallNotification open={open_audio_notification_dialog} />
      )} */}
      {/* {open_audio_dialog && (
        <AudioCallDialog
          open={open_audio_dialog}
          handleClose={handleCloseAudioDialog}
        />
      )} */}
      {/* {open_video_notification_dialog && (
        <VideoCallNotification open={open_video_notification_dialog} />
      )} */}
      {/* {open_video_dialog && (
        <VideoCallDialog
          open={open_video_dialog}
          handleClose={handleCloseVideoDialog}
        />
      )} */}
    </>
  );
};

export default DashboardLayout;
