import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Bookmark,
  Edit3,
  EyeOff,
  MessageCircle,
  MoreVertical,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import type { Post } from "@/types/postApi.interface";
import { MEDIA_URL } from "@/lib/Base_URL";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  // Get first media item for the main image
  const firstMedia = post.media_source?.[0];

  return (
    <Card className="mb-6">
      <CardContent className="p-0">
        <div className="p-4">
          {/* Header with user info and menu */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png" />
                <AvatarFallback>KS</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">Karim Saif</div>
                <div className="text-xs text-muted-foreground">
                  {formattedDate} · {post.privacy}
                </div>
              </div>
            </div>

            {/* Three-dot dropdown menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-62" align="end">
                {[
                  { icon: Bookmark, label: "Save Post" },
                  { icon: Bell, label: "Turn On Notification" },
                  { icon: EyeOff, label: "Hide" },
                  { icon: Edit3, label: "Edit Post" },
                ].map((item, index) => (
                  <DropdownMenuItem key={index} className="cursor-pointer">
                    <div className="h-10 w-10 bg-primary-tiny flex items-center justify-center mr-2 rounded-full">
                      <item.icon className="text-primary" />
                    </div>
                    {item.label}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive">
                  <div className="h-10 w-10 bg-primary-tiny flex items-center justify-center mr-2 rounded-full">
                    <Trash2 className="" />
                  </div>
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Post content */}
          <div className="mb-7">
            <p className="font-semibold mb-2 text-lg">{post.content}</p>

            {/* Show first media item if exists */}
            {firstMedia && firstMedia.type === "image" && (
              <div className="flex justify-center">
                <img
                  src={`${MEDIA_URL}${firstMedia.url}`}
                  alt="Post content"
                  className="max-w-full max-h-96 object-contain rounded-lg border"
                />
              </div>
            )}

            {/* Show video if first media is video */}
            {firstMedia && firstMedia.type === "video" && (
              <div className="flex justify-center">
                <video
                  controls
                  autoPlay={true}
                  muted
                  className="max-w-full max-h-96 object-contain rounded-lg border"
                  poster={
                    firstMedia.thumbnail
                      ? `${MEDIA_URL}${firstMedia.thumbnail}`
                      : undefined
                  }
                >
                  <source
                    src={`${MEDIA_URL}${firstMedia.url}`}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}

            {/* Show placeholder if no media */}
            {/* {!firstMedia && (
              <div className="flex justify-center">
                <img
                  src={`${MEDIA_URL}/images/timeline_img.png`}
                  alt="Default post"
                  className="max-w-full max-h-96 object-contain rounded-lg"
                />
              </div>
            )} */}

            {/* Show multiple media indicator if more than 1 media */}
            {post.media_source && post.media_source.length > 1 && (
              <div className="text-center mt-2 text-sm text-muted-foreground">
                +{post.media_source.length - 1} more
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]">
              <Avatar>
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src="https://github.com/maxleiter.png"
                  alt="@maxleiter"
                />
                <AvatarFallback>LR</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  src="https://github.com/evilrabbit.png"
                  alt="@evilrabbit"
                />
                <AvatarFallback>ER</AvatarFallback>
              </Avatar>
              <Avatar className="">
                <div className="flex justify-center items-center bg-primary text-background">
                  <p>10+</p>
                </div>
              </Avatar>
            </div>
            <div className="flex items-center gap-5 text-muted-foreground ">
              <div>{post.metadata.commentCount} comments</div>
              <div>{post.metadata.shareCount} shares</div>
            </div>
          </div>

          {/* Action buttons - Like, Comment, Share */}
          <div className="flex justify-between py-2 mb-4 bg-background">
            <Button
              variant="ghost"
              size="lg"
              className="flex-1 text-muted-foreground hover:text-primary rounded-none"
            >
              <ThumbsUp className="h-4 w-4 mr-2" />
              Like
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="flex-1 text-muted-foreground hover:text-primary rounded-none"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Comment
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="flex-1 text-muted-foreground hover:text-primary rounded-none"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Comments section */}
          <div className="space-y-4">
            {/* Write comment input */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="flex-1 relative">
                  <Avatar className="h-8 w-8 absolute left-3 top-1/2 transform -translate-y-1/2">
                    <AvatarImage src="images/mini_pic.png" />
                    <AvatarFallback>KS</AvatarFallback>
                  </Avatar>
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="w-full bg-input rounded-full px-4 py-2 pr-12  text-foreground placeholder:text-muted-foreground border-none outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-colors duration-200 text-lg ps-14"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80 transition-colors cursor-pointer p-2">
                    <Send className="h-6 w-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* View previous comments */}
            <div className="text-sm text-muted-foreground cursor-pointer hover:text-primary">
              View {post.metadata.commentCount || 4} previous comments
            </div>

            {/* Existing comment */}
            <div className="flex space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="images/img11.png" />
                <AvatarFallback>KS</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="font-semibold text-sm">
                    Radovan SkillArena
                  </div>
                  <p className="text-sm mt-1 text-muted-foreground ">
                    It is a long established fact that a reader will be
                    distracted by the readable content of a page when looking at
                    its layout.
                  </p>
                </div>
                <div className="flex items-center space-x-2 mt-2 text-xs">
                  <span className="cursor-pointer hover:text-primary">
                    Like
                  </span>
                  <span>.</span>
                  <span className="cursor-pointer hover:text-primary">
                    Reply
                  </span>
                  <span>.</span>
                  <span className="cursor-pointer hover:text-primary">
                    Share
                  </span>
                  <span>· 21m</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;
