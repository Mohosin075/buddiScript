import { BASE_URL, WS_URL } from "@/lib/Base_URL";
import React, { useState, useEffect, useRef, useCallback } from "react";
import io, { Socket } from "socket.io-client";

// Define TypeScript interfaces
interface UserProfile {
  name: string;
  avatar?: string;
}

interface ChatMessage {
  id: string;
  userId: string;
  userProfile: UserProfile;
  message: string;
  messageType: string;
  formattedTime: string;
  likes: number;
  hasLiked: boolean;
  createdAt: string | Date;
}

interface LiveStreamChatProps {
  streamId: string;
  userId: string;
}

// Generate a color based on the user ID for consistent avatar/name coloring
const getUserColor = (userId: string) => {
    const colors = [
        "text-pink-500",
        "text-purple-500", 
        "text-blue-500",
        "text-green-500",
        "text-yellow-500",
        "text-red-500",
        "text-indigo-500",
        "text-cyan-500"
    ];
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
        hash = userId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
};

const LiveStreamChat: React.FC<LiveStreamChatProps> = ({
  streamId,
  userId,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const maxReconnectAttempts = 5;
  const reconnectAttemptRef = useRef<number>(0);
  const hasConnectedRef = useRef<boolean>(false);

  // Get token from localStorage
  const getAuthToken = (): string | null => {
    return localStorage.getItem("token");
  };

  // Initialize WebSocket connection
  useEffect(() => {
    if (!streamId || !userId) return;
    if (hasConnectedRef.current) return;

    const token = getAuthToken();
    if (!token) return;

    if (socket) {
      socket.disconnect();
      setSocket(null);
    }

    const socketInstance = io(WS_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      auth: { token },
      query: { userId, streamId },
    });

    setSocket(socketInstance);
    hasConnectedRef.current = true;

    socketInstance.on("connect", () => {
      setIsConnected(true);
      reconnectAttemptRef.current = 0;
      socketInstance.emit("join-stream-room", { room: `stream:${streamId}` });
    });

    socketInstance.on("disconnect", () => setIsConnected(false));

    socketInstance.on("new-message", (payload: any) => {
      let message: ChatMessage;
      if (payload?.data && payload.data.id) message = payload.data;
      else if (payload?.message && payload.message.id) message = payload.message;
      else message = payload;

      if (!message || !message.id) return;

      setMessages((prev) => {
        if (prev.some((msg) => msg.id === message.id)) return prev;
        return [...prev, message];
      });
      
      scrollToBottom();
    });

    fetchMessages();

    return () => {
      hasConnectedRef.current = false;
      if (socketInstance) {
        socketInstance.off();
        socketInstance.disconnect();
      }
      setSocket(null);
      setIsConnected(false);
    };
  }, [streamId, userId]);

  useEffect(() => {
    if (socket && streamId) {
      socket.emit('join-stream', streamId);
      return () => { socket.emit('leave-stream', streamId); }
    }
  }, [socket, streamId]);

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(
        `${BASE_URL}/chatmessage/${streamId}/messages?limit=50`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setMessages(data.data);
          scrollToBottom();
        }
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const token = getAuthToken();
    if (!token) return;

    try {
      const response = await fetch(
        `${BASE_URL}/chatmessage/${streamId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            message: newMessage.trim(),
            messageType: "text",
          }),
        }
      );

      if (response.ok) {
        const responseData = await response.json();
        const savedMessage = responseData.data;
        if (savedMessage) {
           setMessages((prev) => {
             if (prev.some((msg) => msg.id === savedMessage.id)) return prev;
             return [...prev, savedMessage];
           });
           setNewMessage("");
           scrollToBottom();
        }
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  return (
    <div className="flex flex-col h-full bg-black text-white px-4 pb-4">
      
      {/* Messages List */}
      <div className="mb-2">
         <h3 className="text-white text-lg font-medium">Live chat</h3>
      </div>
      
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto space-y-2 mb-4 scrollbar-hide"
      >
        {isLoading && messages.length === 0 ? (
          <div className="flex justify-center p-4">
            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="flex items-start text-sm leading-relaxed">
              <span className={`font-bold mr-2 ${getUserColor(msg.userId)} whitespace-nowrap`}>
                {msg.userId === userId ? "You" : (msg.userProfile?.name || msg.userId.slice(0, 8))}
              </span>
              <span className="text-gray-300 break-words">
                {msg.message}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="relative">
         <input
           type="text"
           value={newMessage}
           onChange={(e) => setNewMessage(e.target.value)}
           placeholder="Join the chat..."
           className="w-full bg-white/10 text-white placeholder-gray-400 rounded-full py-3 px-5 pr-12 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-all border border-transparent focus:border-purple-500/50"
           disabled={!isConnected}
         />
         <button 
           type="submit"
           className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white w-9 h-9 flex items-center justify-center rounded-full transition-colors disabled:opacity-50"
           disabled={!newMessage.trim() || !isConnected}
         >
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 ml-0.5">
             <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
           </svg>
         </button>
      </form>
    </div>
  );
};

export default LiveStreamChat;
