import { WsWebData2 } from "@nktkas/hyperliquid";
import { useQueryClient } from "@tanstack/react-query";
import useWebSocket from "react-use-websocket";

interface WebSocketProviderProps {
  children: React.ReactNode;
}

interface Webdata2Event {
  channel: "webData2";
  data: WsWebData2;
}

type WebSocketEvents = Webdata2Event;

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const queryClient = useQueryClient();

  const { sendJsonMessage } = useWebSocket<WebSocketEvents>(
    "wss://api.hyperliquid.xyz/ws",
    {
      onOpen: () => {
        sendJsonMessage({
          method: "subscribe",
          subscription: {
            type: "webData2",
            user: "0x0000000000000000000000000000000000000000",
          },
        });
      },
      onMessage: (event) => {
        const message = JSON.parse(event.data) as WebSocketEvents;
        if (message.channel === "webData2") {
          queryClient.setQueryData(["webData2"], () => {
            return message.data;
          });
        }
      },
      shouldReconnect: () => true,
      reconnectAttempts: 20,
      reconnectInterval: (attempt) =>
        Math.min(Math.pow(2, attempt) * 1000, 10000),
      heartbeat: {
        message: "ping",
        returnMessage: "pong",
        timeout: 60000,
        interval: 25000,
      },
    },
  );

  return children;
};
