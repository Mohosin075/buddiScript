import HelmetTitle from "@/components/layout/HelmetTitle";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Bell,
  Bookmark,
  Calendar,
  Camera,
  Edit3,
  EyeOff,
  FileText,
  MessageCircle,
  MoreVertical,
  Search,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
  Video,
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function HomePage() {
  return (
    <div className="bg-muted fixed top-16 left-0 right-0 bottom-0">
      <div className="min-h-screen  container mx-auto px-4">
        <HelmetTitle title="Home" />

        <div className="flex h-screen pb-16">
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
              {/* Suggested People Card */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-bold text-lg ">Suggested People</h3>
                    {/* See All */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary"
                    >
                      See All
                    </Button>
                  </div>
                  <div className="space-y-6">
                    {[
                      {
                        name: "Steve Jobs",
                        role: "CEO of Apple",
                        initials: "SJ",
                      },
                      {
                        name: "Ryan Roslansky",
                        role: "CEO of LinkedIn",
                        initials: "RR",
                      },
                      {
                        name: "Dylan Field",
                        role: "CEO of Figma",
                        initials: "DF",
                      },
                    ].map((person, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src="images/img6.png" />
                            <AvatarFallback>KS</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-semibold">{person.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {person.role}
                            </div>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Connect
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Events Card */}
              <Card className="">
                <CardContent className="p-4">
                  <div className="flex justify-between mb-4">
                    <h3 className="font-bold text-lg ">Events</h3>
                    {/* See All */}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-primary hover:text-primary"
                    >
                      See All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {[
                      {
                        title: "No more terrorism no more cry",
                        attendees: "17 People Going",
                      },
                      {
                        title: "No more terrorism no more cry",
                        attendees: "17 People Going",
                      },
                    ].map((event, index) => (
                      <div
                        key={index}
                        className="flex items-start justify-between"
                      >
                        <Card className="flex-1 py-0! px-0!">
                          <CardContent className="px-0">
                            <img
                              src="images/feed_event1.png"
                              className="mb-5"
                              alt=""
                            />
                            <div className="p-4">
                              <div className="font-semibold mb-1 flex justify-between gap-2">
                                <p className="bg-primary-green p-2 text-background text-center rounded-lg">
                                  10 July
                                </p>
                                <h3 className="text-lg">{event.title}</h3>
                              </div>
                              <div className="text-sm text-muted-foreground flex justify-between items-center mt-5">
                                {event.attendees}
                                <Button variant="outline" size="sm">
                                  Going
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content - Feed Section */}
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="max-w-5xl mx-auto p-6">
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
                          <span className="mr-2">{item.icon}</span> {item.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Post Card */}
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
                            5 minute ago · Public
                          </div>
                        </div>
                      </div>

                      {/* Three-dot dropdown menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
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
                            <DropdownMenuItem
                              key={index}
                              className="cursor-pointer"
                            >
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
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2 text-lg">
                        Healthy Tracking App
                      </h3>
                    </div>

                    {/* Action buttons - Like, Comment, Share */}
                    <div className="flex justify-between border-t border-b border-border py-2 mb-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-muted-foreground hover:text-primary"
                      >
                        <ThumbsUp className="h-4 w-4 mr-2" />
                        Like
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-muted-foreground hover:text-primary"
                      >
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Comment
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-muted-foreground hover:text-primary"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>

                    {/* Comments section */}
                    <div className="space-y-4">
                      {/* Write comment input */}
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>Y</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 bg-input rounded-full px-4 py-2 text-sm cursor-pointer hover:bg-muted/80 text-muted-foreground">
                          Write a comment...
                        </div>
                      </div>

                      {/* View previous comments */}
                      <div className="text-sm text-muted-foreground cursor-pointer hover:text-primary">
                        View 4 previous comments
                      </div>

                      {/* Existing comment */}
                      <div className="flex space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>RS</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted/50 rounded-lg p-3">
                            <div className="font-semibold text-sm">
                              Radovan SkillArena
                            </div>
                            <p className="text-sm mt-1">
                              It is a long established fact that a reader will
                              be distracted by the readable content of a page
                              when looking at its layout.
                            </p>
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span className="cursor-pointer hover:text-primary">
                              Like
                            </span>
                            <span className="cursor-pointer hover:text-primary">
                              Reply
                            </span>
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
