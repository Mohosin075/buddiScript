import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search } from "lucide-react";
const RightSide = () => {
  return (
    <div className="mt-6 space-y-5">
      {/* You Might Like */}
      <Card>
        <CardContent className="px-4">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-lg">You Might Like</h3>
            <Button variant="ghost" size="sm" className="text-primary text-sm">
              See All
            </Button>
          </div>
          <div className="flex items-center space-x-3 mb-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="images/img11.png" />
              <AvatarFallback>KS</AvatarFallback>
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
                className="w-full pl-10 pr-4 py-2 border border-border rounded-2xl bg-muted hover:bg-background focus:bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {/* Friend List */}
            <div className="space-y-4">
              {[
                {
                  name: "Steve Jobs",
                  role: "CEO of Apple",
                  time: "6 minute",
                  active: true,
                },
                {
                  name: "Steve Jobs",
                  role: "CEO of Apple",
                  time: "6 minute",
                  active: true,
                },
                {
                  name: "Steve Jobs",
                  role: "CEO of Apple",
                  time: "6 minute",
                },
                {
                  name: "Steve Jobs",
                  role: "CEO of Apple",
                  time: "6 minute",
                  active: true,
                },
                {
                  name: "Steve Jobs",
                  role: "CEO of Apple",
                  time: "6 minute",
                  active: true,
                },
              ].map((friend, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer"
                >
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="images/img12.png" />
                    <AvatarFallback>KS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{friend.name}</div>
                    {friend.role && (
                      <div className="text-xs text-muted-foreground">
                        {friend.role}
                      </div>
                    )}
                  </div>
                  {friend && (
                    <div className="flex items-center space-x-1">
                      {friend.active === true && (
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      )}
                      <div
                        className={`text-xs ${
                          friend.active === true
                            ? "text-green-500"
                            : "text-muted-foreground"
                        }`}
                      >
                        <span>{friend.active ? "" : friend.time}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RightSide;
