import React from "react";
import UserAvatar from "@/components/shared/UserAvatar";
import { Send } from "lucide-react";

interface CommentInputProps {
  value: string;
  onChange: (v: string) => void;
  onKeyPress?: (e: React.KeyboardEvent) => void;
  onSubmit: () => void;
  disabled?: boolean;
}

const CommentInput: React.FC<CommentInputProps> = ({
  value,
  onChange,
  onKeyPress,
  onSubmit,
  disabled = false,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <UserAvatar
            className="h-8 w-8 absolute left-3 top-1/2 transform -translate-y-1/2"
            src="images/mini_pic.png"
            fallback="KS"
          />
          <input
            type="text"
            placeholder="Write a comment..."
            className="w-full bg-input rounded-full px-4 py-2 pr-12 text-foreground placeholder:text-muted-foreground border-none outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors duration-200 text-lg ps-14"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyPress={onKeyPress}
            disabled={disabled}
          />
          <button
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80 transition-colors cursor-pointer p-2"
            onClick={onSubmit}
            disabled={disabled || !value.trim()}
            type="button"
          >
            <Send className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommentInput;
