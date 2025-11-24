import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  BookOpen,
  Bookmark,
  BarChart3,
  Users,
  Users2,
  Gamepad2,
  Settings,
  Download,
} from "lucide-react";

const LeftSide = () => {
  return (
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
              <div key={index} className="flex items-center justify-between">
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
              <div key={index} className="flex items-start justify-between">
                <Card className="flex-1 py-0! px-0!">
                  <CardContent className="px-0">
                    <img src="images/feed_event1.png" className="mb-5" alt="" />
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
  );
};

export default LeftSide;
