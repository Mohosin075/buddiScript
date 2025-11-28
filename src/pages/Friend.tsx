import HelmetTitle from "@/components/layout/HelmetTitle";
import { Button } from "@/components/ui/button";
import UserAvatar from "@/components/shared/UserAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PageContainer from "@/components/shared/PageContainer";

export default function FriendPage() {
  const fakeRequests = [
    { id: 1, name: "Maya Hasan", mutual: 5 },
    { id: 2, name: "Farhan Ahmed", mutual: 2 },
  ];

  const suggestions = [
    { id: 1, name: "Rafi Khan", mutual: 3 },
    { id: 2, name: "Lina Hossain", mutual: 1 },
    { id: 3, name: "Sakib Noor", mutual: 6 },
  ];

  return (
    <div className="bg-muted fixed top-16 left-0 right-0 bottom-0">
      <PageContainer>
        <HelmetTitle title="Friend" />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Friend Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fakeRequests.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <UserAvatar
                        className="h-12 w-12"
                        src={`/images/avatar-${r.id}.png`}
                        fallback={r.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      />
                      <div>
                        <p className="font-medium text-foreground">{r.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {r.mutual} mutual friends
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        className="bg-primary text-primary-foreground"
                      >
                        Accept
                      </Button>
                      <Button size="sm" variant="ghost">
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Separator className="my-4" />

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">All Friends</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  This is a static demo list created to showcase a friends page.
                  No back-end calls are made.
                </p>

                <div className="grid gap-3">
                  {suggestions.map((s) => (
                    <div
                      key={s.id}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer"
                    >
                      <UserAvatar
                        className="h-10 w-10"
                        src={`/images/avatar-${s.id}.png`}
                        fallback={s.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{s.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {s.mutual} mutual friends
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Message
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="hidden lg:block">
            <Card>
              <CardHeader>
                <CardTitle>People you may know</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Recommended friends based on your network. This is static text
                  for demo.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
