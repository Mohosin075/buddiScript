import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Camera, FileText, Send, Video, X } from "lucide-react";
import { useState, useRef } from "react";
import { useCreatePostMutation } from "@/redux/api/postApi";
import { toast } from "sonner";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [createPost, { isLoading }] = useCreatePostMutation();

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select only image files");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error(`Image ${file.name} is too large. Maximum size is 20MB`);
      return;
    }

    // Clear previous media
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);

    setSelectedMedia(file);
    setMediaType("image");
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("video/")) {
      toast.error("Please select only video files");
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      toast.error(`Video ${file.name} is too large. Maximum size is 20MB`);
      return;
    }

    // Clear previous media
    if (mediaPreview) URL.revokeObjectURL(mediaPreview);

    setSelectedMedia(file);
    setMediaType("video");
    setMediaPreview(URL.createObjectURL(file));
  };

  const removeMedia = () => {
    if (mediaPreview) {
      URL.revokeObjectURL(mediaPreview);
    }
    setSelectedMedia(null);
    setMediaPreview(null);
    setMediaType(null);
  };

  const handleSubmit = async () => {
    try {
      // Validation: require either text or media; if media present, require text
      if (!content.trim() && !selectedMedia) {
        toast.error("Please write something or add media to post");
        return;
      }

      // if (selectedMedia && !content.trim()) {
      //   toast.error("Please add a caption/text when posting media");
      //   return;
      // }

      const formData = new FormData();
      const postData = {
        content: content.trim(),
        privacy: "public",
        tags: [],
      };
      formData.append("data", JSON.stringify(postData));

      if (selectedMedia) {
        if (mediaType === "image") {
          formData.append("images", selectedMedia);
        } else if (mediaType === "video") {
          formData.append("media", selectedMedia);
        }
      }

      // Use the Redux mutation to create the post
      await createPost(formData).unwrap();

      // Clear form and revoke preview URL
      setContent("");
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
      setSelectedMedia(null);
      setMediaPreview(null);
      setMediaType(null);

      toast.success("Post created successfully!");

      // Notify other parts of app if needed
      window.dispatchEvent(new Event("postCreated"));
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Failed to create post. Please try again.");
    }
  };

  const actionItems = [
    {
      icon: <Camera className="w-4 h-4" />,
      label: "Photo",
      onClick: () => imageInputRef.current?.click(),
    },
    {
      icon: <Video className="w-4 h-4" />,
      label: "Video",
      onClick: () => videoInputRef.current?.click(),
    },
    {
      icon: <Calendar className="w-4 h-4" />,
      label: "Event",
      onClick: () => toast.info("Event feature coming soon"),
    },
    {
      icon: <FileText className="w-4 h-4" />,
      label: "Article",
      onClick: () => toast.info("Article feature coming soon"),
    },
    {
      icon: <Send className="w-4 h-4" />,
      label: "Post",
      onClick: handleSubmit,
    },
  ];

  return (
    <>
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={imageInputRef}
        onChange={handleImageSelect}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={videoInputRef}
        onChange={handleVideoSelect}
        accept="video/*"
        className="hidden"
      />

      <Card className="mb-6 bg-card">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3 mb-4">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                <div className="bg-primary rounded-full w-8 h-8 flex items-center justify-center border-1 border-background z-10">
                  <img
                    src="/images/mini_pic.png"
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
              </AvatarFallback>
            </Avatar>
            <textarea
              rows={3}
              placeholder="Write something ... "
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="flex-1 rounded-xl px-4 py-2 text-foreground resize-none transition-colors duration-200 border-none outline-none focus:ring-0"
              disabled={isLoading}
            />
          </div>

          {/* Media preview */}
          {mediaPreview && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  {mediaType === "image" ? (
                    <img
                      src={mediaPreview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border"
                    />
                  ) : (
                    <div className="relative">
                      <video
                        src={mediaPreview}
                        className="w-20 h-20 object-cover rounded-lg border"
                        muted
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Video className="w-8 h-8 text-white opacity-70" />
                      </div>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={removeMedia}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 w-6 h-6 flex items-center justify-center text-xs"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between w-full text-center items-center p-2 bg-primary-tiny-2 rounded-lg">
            {actionItems.map((item) => (
              <div
                key={item.label}
                className={`text-muted-foreground py-2 w-full hover:text-primary transition-colors duration-200 cursor-pointer ${
                  item.label === "Post"
                    ? "border-r-0 bg-primary hover:bg-primary text-white hover:text-white rounded-2xl"
                    : ""
                } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                onClick={isLoading ? undefined : item.onClick}
              >
                <div className="flex items-center justify-center text-center">
                  <span className="mr-2">{item.icon}</span>
                  <span className="hidden md:block">{item.label}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default CreatePost;
