import React, { useState, useEffect } from "react";
import LiveStreamChat from "./Chat";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  authId: string;
  userId: string;
  email: string;
  role: string;
}

interface ChatContainerProps {
  streamId?: string | null;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ streamId: propStreamId }) => {
  // State to handle loading user data
  const [userId, setUserId] = useState<string | null>(null);
  // Internal streamId state if not provided via props (fallback)
  // But ideally we rely on props. Let's prioritize prop, fallback to null or internal logic found earlier.
  // Actually, if prop is provided, we use it. 
  // The prompt asked for dynamic streamId.
  
  const [isLoading, setIsLoading] = useState(true);

  // const { data: usersData, isLoading: usersIsLoading } = useGetProfileQuery();

  // console.log("Users Data:", usersData, usersIsLoading);
  useEffect(() => {
    // Simulate loading user data
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Get user ID from localStorage or API
        const token = localStorage.getItem("accessToken") || localStorage.getItem("token");
        if (token) {
          // Decode token to get user info
          try {
            const decoded = jwtDecode<JwtPayload>(token);
            const currentUserId = decoded.authId || decoded.userId;
            setUserId(currentUserId);
            
            // setStreamId is removed as we get it from props
          } catch (decodeError) {
            console.error("Error decoding token:", decodeError);
          }
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  const activeStreamId = propStreamId; // Use prop directly

  if (isLoading) {
    return (
      <div className="h-full bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userId || !activeStreamId) {
    return (
      <div className="h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-sm">Please login to chat</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-black">
      <LiveStreamChat streamId={activeStreamId} userId={userId} />
    </div>
  );
};

export default ChatContainer;
