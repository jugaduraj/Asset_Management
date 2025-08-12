"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Log } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";

interface RecentActivityProps {
  logs: Log[];
}

export function RecentActivity({ logs }: RecentActivityProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="space-y-4">
      {logs.map((log) => (
        <div key={log.id} className="flex items-start gap-4">
          <Avatar className="h-9 w-9 border">
            <AvatarImage src={log.avatarUrl} alt={log.user} data-ai-hint="person avatar" />
            <AvatarFallback>{log.user.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium">{log.user}</span> {log.action.toLowerCase()}{" "}
              <span className="font-medium text-muted-foreground">{log.details}</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {isClient ? formatDistanceToNow(new Date(log.timestamp), { addSuffix: true, }) : new Date(log.timestamp).toLocaleDateString() }
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
