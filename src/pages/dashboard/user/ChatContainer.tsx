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
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!userId || !streamId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔒</span>
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-400">
            Please login to access the chat feature
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Live Stream Chat
          </h1>
          <p className="text-gray-400">
            Real-time chat with your favorite streamers and community
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Chat Section */}
          <div className="lg:col-span-2">
            <LiveStreamChat streamId={streamId} userId={userId} />

            {/* Chat Guidelines */}
            <div className="mt-6 bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-4">
              <h3 className="text-white font-semibold mb-3 flex items-center">
                <span className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-2">
                  !
                </span>
                Community Guidelines
              </h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  Be respectful to everyone in the chat
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  No spamming or excessive emoji use
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  Keep conversations appropriate
                </li>
                <li className="flex items-start">
                  <span className="text-purple-400 mr-2">•</span>
                  Report any abusive behavior
                </li>
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stream Info */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center mr-2 animate-pulse">
                  ▶
                </span>
                Currently Streaming
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">House Party</span>
                    <span className="text-xs bg-gradient-to-r from-purple-500 to-pink-500 text-white px-2 py-1 rounded-full">
                      LIVE
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">
                    TONIGHT • Hip-Hop • 4.7⭐
                  </p>
                </div>
              </div>
            </div>

            {/* Active Users */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-2">
                  👥
                </span>
                Active in Chat
              </h3>
              <div className="space-y-3">
                {["brianna", "jayhou", "kevo713", "djflow", "musiclover42"].map(
                  (user, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 p-2 hover:bg-gray-800/30 rounded-lg transition-colors"
                    >
                      <div className="relative">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                          {user.charAt(0).toUpperCase()}
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{user}</p>
                        <p className="text-gray-400 text-xs">Active now</p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-xl p-5">
              <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button className="bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg transition-colors text-sm">
                  Share Stream
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors text-sm">
                  Report Issue
                </button>
                <button className="bg-gray-800 hover:bg-gray-700 text-white py-2 rounded-lg transition-colors text-sm">
                  Mute Chat
                </button>
                <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 rounded-lg transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
