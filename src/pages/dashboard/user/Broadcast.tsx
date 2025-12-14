import { useState } from "react";
import ChatContainer from "./ChatContainer";
import Live from "./Live";

const Broadcast = () => {
  const [currentStreamId, setCurrentStreamId] = useState<string | null>(null);

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      {/* Top Section: Video Player */}
      <div className="w-full h-[45vh] relative shrink-0">
        <Live onStreamChange={setCurrentStreamId} />
      </div>

      {/* Middle Section: Tags */}
      <div className="py-3 px-4 flex items-center space-x-3 overflow-x-auto bg-black shrink-0 scrollbar-hide">
        <button className="flex items-center space-x-1 px-4 py-1.5 rounded-full border border-yellow-500 bg-yellow-500/10 text-yellow-500 text-sm font-medium whitespace-nowrap">
          <span>🔥</span>
          <span>Lit</span>
        </button>
        <button className="flex items-center space-x-1 px-4 py-1.5 rounded-full border border-purple-500 bg-purple-500/10 text-purple-500 text-sm font-medium whitespace-nowrap">
          <span>🎵</span>
          <span>Hip-Hop</span>
        </button>
        <button className="flex items-center space-x-1 px-4 py-1.5 rounded-full border border-pink-500 bg-pink-500/10 text-pink-500 text-sm font-medium whitespace-nowrap">
          <span>🌙</span>
          <span>Late Night</span>
        </button>
      </div>

      {/* Bottom Section: Live Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatContainer streamId={currentStreamId} />
      </div>
    </div>
  );
};

export default Broadcast;
