import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Camera, FileText, Send, Video, X } from "lucide-react";
import { useState, useRef } from "react";
import { useCreatePostMutation } from "@/redux/api/postApi";
import { toast } from "sonner";

const CreatePost = () => {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [createPost, { isLoading }] = useCreatePostMutation();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select only image files");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error(`Image ${file.name} is too large. Maximum size is 10MB`);
      return;
    }

    // Only one image allowed — replace any existing image
    if (imagePreview) URL.revokeObjectURL(imagePreview);

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    try {
      // Validation: require either text or image; if image present, require text
      if (!content.trim() && !selectedImage) {
        toast.error("Please write something or add an image to post");
        return;
      }

      if (selectedImage && !content.trim()) {
        toast.error("Please add a caption/text when posting an image");
        return;
      }

      const formData = new FormData();
      const postData = {
        content: content.trim(),
        privacy: "public",
        tags: [],
      };
      formData.append("data", JSON.stringify(postData));

      if (selectedImage) {
        formData.append("images", selectedImage);
      }

      // Use the Redux mutation to create the post (handles auth headers)
      await createPost(formData).unwrap();

      // Clear form and revoke preview URL
      setContent("");
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setSelectedImage(null);
      setImagePreview(null);

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
      onClick: () => fileInputRef.current?.click(),
    },
    {
      icon: <Video className="w-4 h-4" />,
      label: "Video",
      onClick: () => toast.info("Video upload coming soon"),
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
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageSelect}
        accept="image/*"
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

          {/* Image previews */}
          {imagePreview && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <img
                    src={imagePreview}
                    alt={`Preview`}
                    className="w-20 h-20 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
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
                    ? "border-r-0 bg-primary hover:bg-primary text-background hover:text-background rounded-2xl"
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
