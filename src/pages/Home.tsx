import HelmetTitle from "@/components/layout/HelmetTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Bookmark,
  MessageCircle,
  MoreHorizontal,
  Search,
  ThumbsUp,
} from "lucide-react";

import {
  BookOpen,
  BarChart3,
  Users,
  Users2,
  Gamepad2,
  Settings,
  Download,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="bg-muted fixed top-16 left-0 right-0 bottom-0 ">
      <div className="min-h-screen  container mx-auto px-4 ">
        <HelmetTitle title="Home" />

        <div className="flex h-screen">
          {/* Left Sidebar - Explore Section */}
          <div className="hidden xl:block w-0 xl:w-80 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="mt-6 space-y-5">
              <Card>
                <CardContent>
                  <h2 className="text-lg font-semibold mb-4">Explore</h2>
                  <div className="space-y-2">
                    {[
                      { name: "Learning", icon: BookOpen, badge: "New" },
                      { name: "Insights", icon: BarChart3, badge: null },
                      { name: "Find friends", icon: Users, badge: null },
                      { name: "Bookmarks", icon: Bookmark, badge: null },
                      { name: "Group", icon: Users2, badge: null },
                      { name: "Gaming", icon: Gamepad2, badge: "New" },
                      { name: "Settings", icon: Settings, badge: null },
                      { name: "Save post", icon: Download, badge: null },
                    ].map((item) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-accent cursor-pointer transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center bg-secondary text-muted-foreground
                            }`}
                          >
                            <item.icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm">{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="bg-primary-green text-primary-foreground text-xs px-2 py-1 rounded-md">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content - Feed Section */}
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="max-w-3xl mx-auto p-6">
              {/* Your Story Header */}
              {/* Story Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                {/* Stories Container */}
                <div className="flex space-x-6 overflow-x-auto pb-2 hide-scrollbar">
                  {/* Your Story */}
                  <div className="flex flex-col items-center space-y-2 cursor-pointer">
                    <div className="w-34 h-38 rounded-xl">
                      <div
                        className="w-full h-full rounded-xl bg-cover bg-center relative"
                        style={{
                          backgroundImage: `url('/images/card_ppl1.png')`,
                        }}
                      >
                        {/* Dark overlay over entire image */}
                        <div className="absolute inset-0 bg-black opacity-60 rounded-xl"></div>

                        {/* Plus icon overlay */}
                        <div>
                          <div className="absolute bottom-14 left-1/2 transform -translate-x-1/2 translate-y-1/2 bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center border-2 border-accent-foreground z-10">
                            <span className="text-white font-bold text-lg">
                              +
                            </span>
                          </div>
                          <div className="text-xs font-medium text-white absolute bottom-6 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10">
                            Your Story
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* other story */}
                  <div className="flex flex-col items-center space-y-2 cursor-pointer">
                    <div className="w-34 h-38 rounded-xl">
                      <div
                        className="w-full h-full rounded-xl bg-cover bg-center relative"
                        style={{
                          backgroundImage: `url('images/card_ppl2.png')`,
                        }}
                      >
                        {/* Dark overlay over entire image */}
                        <div className="absolute inset-0 bg-black opacity-60 rounded-xl"></div>

                        {/* Plus icon overlay */}
                        <div>
                          <div className="absolute top-2 right-2 bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center border-2 border-background z-10">
                            <img src="/images/mini_pic.png" alt="" />
                          </div>
                          <div className="text-xs font-medium text-white absolute bottom-6 left-1/2 transform -translate-x-1/2 translate-y-1/2 z-10">
                            mohosin
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Next */}
                </div>
              </div>

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
                      <h3 className="font-semibold mb-2">
                        Healthy Tracking App
                      </h3>
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
                      <h3 className="font-semibold mb-2">
                        Healthy Tracking App
                      </h3>
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
          <div className="hidden xl:block w-0 xl:w-80 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none">
            <div className="mt-6 space-y-5">
              {/* You Might Like */}
              <Card>
                <CardContent className="px-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">You Might Like</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary text-sm"
                    >
                      See All
                    </Button>
                  </div>
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

              {/* Your Friends */}
              <Card>
                <CardContent>
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
                        {
                          name: "Ryan Roslansky",
                          role: "",
                          time: "",
                          status: "",
                        },
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
                </CardContent>
              </Card>
              <Card>
                <CardContent>
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
                        {
                          name: "Ryan Roslansky",
                          role: "",
                          time: "",
                          status: "",
                        },
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
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
