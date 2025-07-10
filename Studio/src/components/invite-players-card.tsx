"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { Copy, QrCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge";

export function InvitePlayersCard({ gameId }: { gameId: string | null }) {
  const { toast } = useToast();
  const [joinUrl, setJoinUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined" && gameId) {
      const url = `${window.location.origin}/?gameId=${gameId}`;
      setJoinUrl(url);
    }
  }, [gameId]);

  const copyInviteLink = () => {
    if (!joinUrl) return;
    navigator.clipboard.writeText(joinUrl);
    toast({ title: "Copied!", description: "Invite link copied to clipboard." });
  };

  if (!gameId) {
    return null;
  }

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <QrCode className="text-primary" />
          Invite Players
        </CardTitle>
        <CardDescription>
          Share the Game ID or scan the QR code to join.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        {joinUrl ? (
          <div className="bg-white p-2 rounded-lg">
            <QRCodeSVG
              value={joinUrl}
              size={160}
              bgColor="#ffffff"
              fgColor="#000000"
              level="L"
              includeMargin={false}
            />
          </div>
        ) : null}

        <div className="text-center">
            <p className="text-sm text-muted-foreground mt-2">Game ID</p>
            <Badge variant="secondary" className="text-2xl font-bold tracking-widest px-4 py-1">
                {gameId}
            </Badge>
        </div>

        <Button onClick={copyInviteLink} className="w-full">
          <Copy className="mr-2 h-4 w-4" /> Copy Invite Link
        </Button>
      </CardContent>
    </Card>
  );
}
