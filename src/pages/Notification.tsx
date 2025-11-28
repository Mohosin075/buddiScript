import HelmetTitle from "@/components/layout/HelmetTitle";
import UserAvatar from "@/components/shared/UserAvatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import PageContainer from "@/components/shared/PageContainer";

export default function NotificationPage() {
  const notifications = [
    {
      id: 1,
      title: "New comment",
      message: "Alice commented on your post.",
      time: "2h",
    },
    {
      id: 2,
      title: "New friend request",
      message: "Rafi sent you a friend request.",
      time: "5h",
    },
    { id: 3, title: "New like", message: "John liked your photo.", time: "1d" },
  ];

  return (
    <div className="bg-muted fixed top-16 left-0 right-0 bottom-0">
      <PageContainer>
        <HelmetTitle title="Notification" />

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Notifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-accent cursor-pointer"
              >
                <UserAvatar
                  className="h-10 w-10"
                  src={`/images/avatar-${n.id}.png`}
                  fallback={n.title.split(" ")[0].slice(0, 1)}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-foreground">{n.title}</p>
                    <p className="text-xs text-muted-foreground">{n.time}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{n.message}</p>
                </div>
              </div>
            ))}

            <Separator />
            <p className="text-sm text-muted-foreground">
              All notifications here are static for demo purposes. No API calls
              are made.
            </p>
          </CardContent>
        </Card>
      </PageContainer>
    </div>
  );
}
