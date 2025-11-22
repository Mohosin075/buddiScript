/* eslint-disable react-refresh/only-export-components */
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Activity,
  DollarSign,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import type React from "react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ReactNode;
  description?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "neutral",
  icon,
  description,
}: StatCardProps) {
  const changeColor = {
    positive: "text-green-600 bg-green-50",
    negative: "text-red-600 bg-red-50",
    neutral: "text-muted-foreground bg-muted",
  };

  const TrendIcon =
    changeType === "positive"
      ? TrendingUp
      : changeType === "negative"
      ? TrendingDown
      : Activity;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {change && (
          <div className="flex items-center gap-1 mt-1">
            <Badge
              variant="secondary"
              className={`${changeColor[changeType]} text-xs`}
            >
              <TrendIcon className="h-3 w-3 mr-1" />
              {change}
            </Badge>
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

// Pre-built stat configurations for different roles
export const userStats = [
  {
    title: "Wallet Balance",
    value: "$2,450.00",
    change: "+12.5%",
    changeType: "positive" as const,
    icon: <DollarSign className="h-4 w-4" />,
    description: "Available balance",
  },
  {
    title: "This Month",
    value: "$1,230.00",
    change: "+8.2%",
    changeType: "positive" as const,
    icon: <TrendingUp className="h-4 w-4" />,
    description: "Total transactions",
  },
  {
    title: "Pending",
    value: "$125.00",
    change: "-2.1%",
    changeType: "negative" as const,
    icon: <Activity className="h-4 w-4" />,
    description: "Pending transactions",
  },
];


export const adminStats = [
  {
    title: "Total Users",
    value: "12,450",
    change: "+5.2%",
    changeType: "positive" as const,
    icon: <Users className="h-4 w-4" />,
    description: "Active users",
  },
];
