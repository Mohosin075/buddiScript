import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Camera, FileText, Send, Video } from "lucide-react";

const CreatePost = () => {
  return (
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
            className="flex-1 rounded-xl px-4 py-2 text-foreground resize-none   transition-colors duration-200 border-none outline-none focus:ring-0 "
          />
        </div>
        <div className="flex justify-between  w-full  text-center items-center p-2 bg-primary-tiny-2 ro rounded-lg">
          {[
            {
              icon: <Camera className="w-4 h-4" />,
              label: "Photo",
            },
            {
              icon: <Video className="w-4 h-4" />,
              label: "Video",
            },
            {
              icon: <Calendar className="w-4 h-4" />,
              label: "Event",
            },
            {
              icon: <FileText className="w-4 h-4" />,
              label: "Article",
            },
            {
              icon: <Send className="w-4 h-4" />,
              label: "Post",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`text-muted-foreground py-2   w-full  hover:text-primary transition-colors duration-200 cursor-pointer ${
                item.label === "Post"
                  ? "border-r-0 bg-primary hover:bg-primary text-background! hover:text-background rounded-2xl"
                  : ""
              }`}
            >
              <div className="flex items-center justify-center text-center">
                {" "}
                <span className="mr-2">{item.icon}</span>{" "}
                <span className={`hidden md:block`}>{item.label}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatePost;
