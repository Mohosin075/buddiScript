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

const LiveStreamChat: React.FC<LiveStreamChatProps> = ({
  streamId,
  userId,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [participants, setParticipants] = useState<
    Array<{
      id: string;
      name: string;
      avatar?: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [connectionError, setConnectionError] = useState<string>("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const maxReconnectAttempts = 5;
  const reconnectAttemptRef = useRef<number>(0);
  const hasConnectedRef = useRef<boolean>(false); // Track if we've already connected

  // Get token from localStorage
  const getAuthToken = (): string | null => {
    return localStorage.getItem("token");
  };

  // Initialize WebSocket connection - only when streamId and userId are available
  useEffect(() => {
    // Don't connect if streamId or userId are not available
    if (!streamId || !userId) {
      console.log("⏳ Waiting for streamId and userId...");
      return;
    }

    // Prevent multiple connection attempts
    if (hasConnectedRef.current) {
      console.log("⚠️ Already connected or connecting...");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      console.error("No authentication token found");
      setConnectionError("Authentication required. Please login.");
      return;
    }


    console.log(`🔌 Connecting to WebSocket at ${WS_URL}...`);
    console.log(`📊 Stream ID: ${streamId}, User ID: ${userId}`);

    // Clean up previous socket if exists
    if (socket) {
      console.log("♻️ Cleaning up previous socket connection");
      socket.disconnect();
      setSocket(null);
    }

    const socketInstance = io(WS_URL, {
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      auth: {
        token: token,
      },
      query: {
        userId,
        streamId,
      },
    });

    setSocket(socketInstance);
    hasConnectedRef.current = true;

    // Connection events
    socketInstance.on("connect", () => {
      console.log("✅ Connected to WebSocket server");
      setIsConnected(true);
      setConnectionError("");
      reconnectAttemptRef.current = 0;

      // Join stream room after connection
      console.log(`🚀 Joining stream room: stream:${streamId}`);
      socketInstance.emit("join-stream-room", { room: `stream:${streamId}` });
    });

    socketInstance.on("stream-room-joined", (data: { room: string }) => {
      console.log("🎉 Joined stream room:", data.room);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Disconnected from WebSocket server. Reason:", reason);
      setIsConnected(false);

      if (reason === "io server disconnect") {
        console.log("🔄 Server initiated disconnect, reconnecting...");
        socketInstance.connect();
      }
    });

    socketInstance.on("connect_error", (error) => {
      console.error("🔌 Connection error:", error.message);
      setIsConnected(false);
      reconnectAttemptRef.current++;

      if (reconnectAttemptRef.current >= maxReconnectAttempts) {
        setConnectionError(
          `Failed to connect after ${maxReconnectAttempts} attempts. Please refresh.`
        );
      } else {
        setConnectionError(
          `Connecting... (Attempt ${reconnectAttemptRef.current}/${maxReconnectAttempts})`
        );
      }
    });

    // Listen for new messages from backend
    socketInstance.on("new-message", (payload: any) => {
      console.log("📨 New message received from backend (raw):", payload);

      // Handle potential payload wrapping
      let message: ChatMessage;
      if (payload?.data && payload.data.id) {
        message = payload.data;
      } else if (payload?.message && payload.message.id) { 
          // Sometimes backend might send { success: true, message: { ... } }
          message = payload.message;
      } else {
         message = payload;
      }

      if (!message || !message.id) {
        console.warn("⚠️ Received invalid message format from socket:", payload);
        return;
      }

      console.log("✨ Processing message:", message);

      // Add message to state (check for duplicates)
      setMessages((prev) => {
        const exists = prev.some((msg) => msg.id === message.id);
        if (!exists) {
          return [...prev, message];
        }
        console.log("🚫 Duplicate message ignored:", message.id);
        return prev;
      });

      // Refresh participants list when new message arrives
      fetchParticipants();
      
      scrollToBottom();
    });

    // Listen for message likes from backend
    socketInstance.on(
      "message-liked",
      (data: { messageId: string; userId: string }) => {
        console.log("❤️ Message liked broadcast:", data);

        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === data.messageId) {
              // Check if current user is the one who liked
              const userLiked = data.userId === userId;
              return {
                ...msg,
                likes: userLiked ? msg.likes + 1 : msg.likes,
                hasLiked: userLiked ? true : msg.hasLiked,
              };
            }
            return msg;
          })
        );
      }
    );

    // Listen for message deletions from backend
    socketInstance.on("message-deleted", (data: { messageId: string }) => {
      console.log("🗑️ Message deleted broadcast:", data);

      setMessages((prev) => prev.filter((msg) => msg.id !== data.messageId));
    });

    // Listen for errors
    socketInstance.on("error", (data: { message: string }) => {
      console.error("❌ Socket error:", data.message);
      setConnectionError(data.message);
    });

    // Load initial messages and participants
    fetchMessages();
    fetchParticipants();

    // Cleanup on unmount
    return () => {
      console.log("🧹 Cleaning up socket connection...");
      hasConnectedRef.current = false;
      if (socketInstance) {
        socketInstance.off(); // Remove all listeners
        socketInstance.disconnect();
      }
      setSocket(null);
      setIsConnected(false);
    };
  }, [streamId, userId]); // Only re-run if streamId or userId changes

  useEffect(() => {
    if (socket && streamId) {
      socket.emit('join-stream', streamId);
      
      // Clean up on unmount
      return () => {
        socket.emit('leave-stream', streamId);
      }
    }
  }, [socket, streamId]);

  // Fetch chat messages from API
  const fetchMessages = async () => {
    try {
      setIsLoading(true);
       
      const token = getAuthToken();

      if (!token) {
        console.error("No authentication token found");
        setIsLoading(false);
        return;
      }

      console.log(`📡 Fetching messages for stream ${streamId}...`);

      const response = await fetch(
        `${BASE_URL}/chatmessage/${streamId}/messages?limit=50`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          console.error("Unauthorized - invalid token");
          setConnectionError("Session expired. Please login again.");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`📦 Received ${data.data?.length || 0} messages`);

      if (data.success && Array.isArray(data.data)) {
        setMessages(data.data);
        scrollToBottom();
      } else {
        console.error("Invalid response format:", data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setConnectionError("Failed to load messages. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch chat participants
  const fetchParticipants = async () => {
    try {
       
      const token = getAuthToken();

      if (!token) {
        return;
      }

      const response = await fetch(
        `${BASE_URL}/chatmessage/${streamId}/participants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.participants) {
          setParticipants(data.participants);
        }
      }
    } catch (error) {
      console.error("Failed to fetch participants:", error);
    }
  };

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      alert("Please enter a message");
      return;
    }

    const token = getAuthToken();
    if (!token) {
      alert("You need to be logged in to send messages");
      return;
    }

    try {
      console.log(`📤 Sending message: "${newMessage.trim()}"`);

      // Save message to database via HTTP API
       
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

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Failed to save message:", errorData);
        alert(
          `Failed to send message: ${errorData.message || "Unknown error"}`
        );
        return;
      }

      const responseData = await response.json();
      console.log("✅ Message saved to database:", responseData);

      if (!responseData.success || !responseData.data) {
        throw new Error("Invalid response format");
      }

      const savedMessage = responseData.data;

      // Add message to state (check for duplicates in case socket arrived first)
      setMessages((prev) => {
        if (prev.some((msg) => msg.id === savedMessage.id)) {
          return prev;
        }
        return [...prev, savedMessage];
      });

      // Clear input
      setNewMessage("");

      console.log("✅ Message sent - backend will broadcast via WebSocket");
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  // Like a message
  const likeMessage = async (messageId: string) => {
    const token = getAuthToken();
    if (!token) {
      alert("You need to be logged in to like messages");
      return;
    }

    try {
      console.log(`❤️ Liking message: ${messageId}`);

      // Update UI optimistically
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === messageId
            ? { ...msg, likes: msg.likes + 1, hasLiked: true }
            : msg
        )
      );

      // Send like via HTTP API (backend will broadcast via WebSocket)
       
      const response = await fetch(
        `${BASE_URL}/chatmessage/messages/${messageId}/like`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Revert optimistic update on error
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === messageId
              ? { ...msg, likes: msg.likes - 1, hasLiked: false }
              : msg
          )
        );
        throw new Error("Failed to like message");
      }

      console.log("✅ Message liked - backend will broadcast via WebSocket");
    } catch (error) {
      console.error("Failed to like message:", error);
      alert("Failed to like message. Please try again.");
    }
  };

  // Delete a message
  const deleteMessage = async (messageId: string) => {
    if (!window.confirm("Are you sure you want to delete this message?")) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
      alert("You need to be logged in to delete messages");
      return;
    }

    try {
      console.log(`🗑️ Deleting message: ${messageId}`);

      // Remove message optimistically
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );

      // Delete via HTTP API (backend will broadcast via WebSocket)
       
      const response = await fetch(
        `${BASE_URL}/chatmessage/messages/${messageId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        // Revert optimistic update on error
        fetchMessages();
        throw new Error("Failed to delete message");
      }

      console.log("✅ Message deleted - backend will broadcast via WebSocket");
    } catch (error) {
      console.error("Failed to delete message:", error);
      alert("Failed to delete message. Please try again.");
      fetchMessages(); // Refresh messages on error
    }
  };

  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, []);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Format time helper
  const formatMessageTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if user is message owner
  const isMessageOwner = (messageUserId: string) => {
    return messageUserId === userId;
  };

  // Reconnect function
  const handleReconnect = () => {
    if (socket) {
      console.log("🔄 Manual reconnection requested");
      socket.connect();
    }
  };

  // Refresh messages
  const handleRefresh = () => {
    console.log("🔄 Refreshing messages...");
    fetchMessages();
  };

  return (
    <div className="flex flex-col h-[600px] bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-purple-700 via-purple-800 to-indigo-900 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div
              className={`w-3 h-3 rounded-full absolute -top-1 -right-1 ${
                isConnected ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <h3 className="text-white font-bold text-lg">Live Chat</h3>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleRefresh}
              className="text-gray-300 hover:text-white transition-colors"
              title="Refresh messages"
            >
              🔄
            </button>
            <div
              className={`flex items-center px-3 py-1 rounded-full ${
                isConnected
                  ? "bg-green-500/20 text-green-300"
                  : "bg-red-500/20 text-red-300"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full mr-2 ${
                  isConnected ? "bg-green-400" : "bg-red-400"
                }`}
              />
              <span className="text-sm font-medium">
                {isConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
            <div className="bg-black/30 px-3 py-1 rounded-full">
              <span className="text-white text-sm font-medium">
                👥 {participants.length} participants
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Error Banner */}
      {connectionError && (
        <div className="bg-yellow-900/50 border-l-4 border-yellow-500 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-yellow-300 mr-2">⚠️</span>
              <span className="text-yellow-200 text-sm">{connectionError}</span>
            </div>
            <button
              onClick={handleReconnect}
              className="text-yellow-300 hover:text-yellow-100 text-sm font-medium"
            >
              Reconnect
            </button>
          </div>
        </div>
      )}

      {/* Debug info */}
      <div className="bg-gray-800/30 px-4 py-1 text-xs text-gray-400">
        Stream: {streamId?.slice(0, 8) || "loading..."}... | User:{" "}
        {userId?.slice(0, 8) || "loading..."}... | Messages: {messages.length} |
        Participants: {participants.length}
      </div>

      {/* Chat Messages Container */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-900 to-gray-950 p-4 space-y-4"
      >
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-400">Loading messages...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">💬</span>
            </div>
            <p className="text-gray-400 text-center">
              No messages yet. Be the first to chat!
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Start the conversation...
            </p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`group bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 hover:bg-gray-800/70 transition-all duration-200 border ${
                isMessageOwner(msg.userId)
                  ? "border-blue-500/30 hover:border-blue-500/50"
                  : "border-gray-700/50 hover:border-purple-500/30"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={"https://img.freepik.com/free-vector/smiling-young-girl-vector-portrait_1308-166167.jpg?semt=ais_hybrid&w=740&q=80"}
                      alt='alt'
                      className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes("default-avatar.png")) {
                           target.src = "/default-avatar.png";
                        }
                      }}
                    />
                    {isMessageOwner(msg.userId) && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-gray-900" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-white">
                        Id : {msg.userId} 
                      </span>
                      {isMessageOwner(msg.userId) && (
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-gray-400 text-xs">
                      {formatMessageTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => likeMessage(msg.id)}
                    disabled={msg.hasLiked}
                    className={`flex items-center space-x-1 px-3 py-1 rounded-full transition-all ${
                      msg.hasLiked
                        ? "bg-pink-500/20 text-pink-300 cursor-default"
                        : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                    }`}
                  >
                    <span>{msg.hasLiked ? "❤️" : "🤍"}</span>
                    <span className="text-sm font-medium">{msg.likes}</span>
                  </button>
                  {isMessageOwner(msg.userId) && (
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="text-gray-500 hover:text-red-400 transition-colors p-1"
                      title="Delete message"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>

              <div className="mt-2">
                <p className="text-gray-200 break-words whitespace-pre-wrap">
                  {msg.message}
                </p>
              </div>

              {/* Message Reactions */}
              {msg.likes > 0 && (
                <div className="mt-3 pt-2 border-t border-gray-700/50">
                  <div className="flex items-center space-x-1">
                    <span className="text-xs text-gray-400">
                      Liked by {msg.likes}{" "}
                      {msg.likes === 1 ? "person" : "people"}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={sendMessage}
        className="border-t border-gray-800 bg-gray-900 p-4"
      >
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={
                isConnected
                  ? "Type your message here..."
                  : "Connecting to chat..."
              }
              maxLength={500}
              disabled={!isConnected}
              className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {newMessage.length > 0 && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span
                  className={`text-xs ${
                    newMessage.length > 450 ? "text-red-400" : "text-gray-500"
                  }`}
                >
                  {newMessage.length}/500
                </span>
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={!isConnected || !newMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isConnected ? (
              <div className="flex items-center space-x-2">
                <span>Send</span>
                <span className="text-sm">✈️</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Connecting...</span>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LiveStreamChat;
