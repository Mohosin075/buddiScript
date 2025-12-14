import React, { useState, useEffect } from "react";
import LiveStreamChat from "./Chat";

const ChatContainer: React.FC = () => {
  // State to handle loading user data
  const [userId, setUserId] = useState<string | null>(null);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Get user ID from localStorage or API
        const token = localStorage.getItem("token");
        if (token) {
          // Decode token or fetch user info
          // For now, using mock data
          setUserId("693dd5011b47fc73fcaebeaf");
          setStreamId("693dd5011b47fc73fcaebeaf");
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userId || !streamId) {
    return (
      <div className="h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-sm">
            Please login to chat
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black">
       <LiveStreamChat streamId={streamId} userId={userId} />
    </div>
  );
};

export default ChatContainer;
