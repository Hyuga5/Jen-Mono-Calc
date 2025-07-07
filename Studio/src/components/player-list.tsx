"use client";

import { useGame } from "@/contexts/game-context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Landmark, User, Users } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { formatCurrency } from "@/lib/utils";

export function PlayerList() {
  const { players, localPlayer } = useGame();

  const sortedPlayers = [...players].sort((a, b) => {
    if (a.isBank) return -1;
    if (b.isBank) return 1;
    if (a.id === localPlayer?.id) return -1;
    if (b.id === localPlayer?.id) return 1;
    return a.name.localeCompare(b.name);
  });
  
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-center">
            <div>
                <CardTitle className="flex items-center gap-2">
                    <Users className="text-primary" />
                    Players
                </CardTitle>
                <CardDescription>All players in the current session.</CardDescription>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[calc(100vh-20rem)] sm:h-auto sm:max-h-[60vh] pr-4">
            <div className="space-y-4">
            {sortedPlayers.map((player) => (
                <div key={player.id} className="flex items-center gap-4 p-2 rounded-lg transition-colors hover:bg-secondary/50">
                <Avatar>
                    <AvatarFallback className={player.isBank ? 'bg-primary/20' : ''}>
                        {player.isBank ? (
                        <Landmark className="h-5 w-5 text-primary" />
                        ) : (
                        <User className="h-5 w-5" />
                        )}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-grow">
                    <p className="font-semibold">
                        {player.name}
                        {player.id === localPlayer?.id && " (You)"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        ${formatCurrency(player.balance)}
                    </p>
                </div>
                </div>
            ))}
            </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
