{
  /*import React, { createContext, useContext, useState, useEffect } from "react";
import SendbirdChat from "@sendbird/chat";
import {
  GroupChannelModule,
  SendbirdOpenChat,
} from "@sendbird/chat/groupChannel";

const SendbirdContext = createContext();
//failed attempt
export const SendbirdProvider = ({ appId, USER_ID, children }) => {
  const [sendbird, setSendbird] = useState(null);

  useEffect(() => {
    const initializeSendbird = async () => {
      if (appId) {
        try {
          console.log(appId);
          const sb = SendbirdChat.init({
            appId,
            modules: [new GroupChannelModule()],
          });
          setSendbird(sb);
          //
          const user = await sb.connect("daniel");
          const params = {
            // OpenChannelCreateParams can be imported from @sendbird/chat/openChannel.
            invitedUserIds: ["daniel", "Bob"],
          };
          const channel = await sb.groupChannel.createChannel(params);

          await channel.enter();
        } catch (error) {
          console.error("Error initializing Sendbird", error);
        }
      }
    };

    initializeSendbird();
  }, [appId]);

  return (
    <SendbirdContext.Provider value={sendbird}>
      {children}
    </SendbirdContext.Provider>
  );
};

export const useSendbird = () => useContext(SendbirdContext);*/
}
