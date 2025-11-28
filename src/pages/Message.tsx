import HelmetTitle from "@/components/layout/HelmetTitle";
import UserAvatar from "@/components/shared/UserAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import PageContainer from "@/components/shared/PageContainer";

export default function MessagePage() {
  const conversations = [
    { id: 1, name: "Lina H", last: "Let's catch up tomorrow!", time: "1h" },
    { id: 2, name: "Maya H", last: "Nice meeting today", time: "3h" },
    { id: 3, name: "Zakir R", last: "Sent you the file", time: "1d" },
  ];

  return (
    <div className="bg-muted fixed top-16 left-0 right-0 bottom-0">
      <PageContainer>
        <HelmetTitle title="Message" />

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Conversations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {conversations.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-accent cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <UserAvatar
                        className="h-10 w-10"
                        src={`/images/avatar-${c.id}.png`}
                        fallback={c.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      />
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {c.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {c.last}
                        </p>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {c.time}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent className="h-[60vh]">
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>
                    Select a conversation to view message history — this page is
                    static UI only.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
