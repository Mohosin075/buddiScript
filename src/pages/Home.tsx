import HelmetTitle from "@/components/layout/HelmetTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  Check,
  MessageCircle,
  MoreHorizontal,
  Search,
  ThumbsUp,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background fixed top-0 left-0 right-0 bottom-0">
      <HelmetTitle title="Home" />

      <div className="flex h-screen">
        {/* Left Sidebar - Explore Section */}
        <div className="hidden xl:block w-0 xl:w-80 border-r border-border overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4">Explore</h2>
            <div className="space-y-2">
              {[
                "Learning",
                "Insights",
                "Find friends",
                "Bookmarks",
                "Group",
                "Gaming",
                "Settings",
                "Save post",
              ].map((item, index) => (
                <div
                  key={item}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                >
                  <div
                    className={`w-4 h-4 border border-border rounded ${
                      [2, 4, 6].includes(index)
                        ? "bg-primary border-primary"
                        : ""
                    }`}
                  >
                    {[2, 4, 6].includes(index) && (
                      <Check className="w-3 h-3 text-primary-foreground" />
                    )}
                  </div>
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <h3 className="font-semibold mb-4">New</h3>
              <div className="space-y-3">
                {[
                  "Your Story",
                  "Byan Rodamsky",
                  "Byan Rodamsky",
                  "Byan Rodamsky",
                ].map((name, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent cursor-pointer"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Feed Section */}
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="max-w-3xl mx-auto p-6">
            {/* Create Post Card */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>Y</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 bg-muted rounded-full px-4 py-2 text-muted-foreground cursor-pointer hover:bg-muted/80">
                    Write something ... 😊
                  </div>
                </div>
                <div className="flex justify-between border-t border-border pt-4">
                  {["Photo", "Video", "Event", "Article", "Post"].map(
                    (item) => (
                      <Button
                        key={item}
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground"
                      >
                        {item}
                      </Button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Post Card */}
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png" />
                        <AvatarFallback>KS</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">Karim Saif</div>
                        <div className="text-xs text-muted-foreground">
                          5 minute ago · Public
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Healthy Tracking App</h3>
                    <p className="text-sm text-muted-foreground">
                      Just launched our new health tracking application. Stay
                      fit and healthy with our innovative features!
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Like
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border p-4 bg-muted/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Save Post</span>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-muted"
                    >
                      Save
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="mb-6">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="https://cdn1.iconfinder.com/data/icons/user-pictures/100/male3-512.png" />
                        <AvatarFallback>KS</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold">Karim Saif</div>
                        <div className="text-xs text-muted-foreground">
                          5 minute ago · Public
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Healthy Tracking App</h3>
                    <p className="text-sm text-muted-foreground">
                      Just launched our new health tracking application. Stay
                      fit and healthy with our innovative features!
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <ThumbsUp className="h-4 w-4 mr-2" />
                      Like
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Comment
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="border-t border-border p-4 bg-muted/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Save Post</span>
                    <Badge
                      variant="secondary"
                      className="cursor-pointer hover:bg-muted"
                    >
                      Save
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar - Suggestions Section */}
        <div className="hidden xl:block w-0 xl:w-80 border-l border-border overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none">
          <div className="p-6">
            {/* You Might Like */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">You Might Like</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary text-sm"
                >
                  See All
                </Button>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>RS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold">Radowan SkillArena</div>
                      <div className="text-xs text-muted-foreground">
                        Founder & CEO at Trophy
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Ignore
                    </Button>
                    <Button size="sm" className="flex-1">
                      Follow
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">You Might Like</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary text-sm"
                >
                  See All
                </Button>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>RS</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-semibold">Radowan SkillArena</div>
                      <div className="text-xs text-muted-foreground">
                        Founder & CEO at Trophy
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Ignore
                    </Button>
                    <Button size="sm" className="flex-1">
                      Follow
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Your Friends */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold">Your Friends</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary text-sm"
                >
                  See All
                </Button>
              </div>

              {/* Search Input */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Input search"
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-muted text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              {/* Friend List */}
              <div className="space-y-4">
                {[
                  {
                    name: "Steve Jobs",
                    role: "CEO of Apple",
                    time: "6 minute",
                    status: "opp",
                  },
                  { name: "Ryan Roslansky", role: "", time: "", status: "" },
                ].map((friend, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {friend.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">{friend.name}</div>
                      {friend.role && (
                        <div className="text-xs text-muted-foreground">
                          {friend.role} · {friend.time}
                        </div>
                      )}
                      {friend.status && (
                        <div className="text-xs text-primary">
                          {friend.status}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
