"use client";

import { useGame } from "@/contexts/game-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ArrowRight, History } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Separator } from "./ui/separator";
import Image from 'next/image';
import { formatCurrency } from "@/lib/utils";

export function TransactionLog() {
  const { transactions } = useGame();

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="text-primary" />
          Transaction Log
        </CardTitle>
        <CardDescription>
          A record of all payments in this session.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[60vh] pr-4">
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-48">
              <Image src="https://placehold.co/200x200.png" alt="No transactions" width={100} height={100} className="opacity-50 rounded-full mb-4" data-ai-hint="empty vault" />
              <p className="font-semibold">No transactions yet</p>
              <p className="text-sm">Payments will appear here once they are made.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx, index) => (
                <div key={tx.id}>
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                      <p className="font-semibold text-sm flex items-center flex-wrap">
                        <span>{tx.from}</span>
                        <ArrowRight className="h-4 w-4 mx-2 text-muted-foreground" />
                        <span>{tx.to}</span>
                      </p>
                      <p className="text-primary font-bold text-lg">
                        ${formatCurrency(tx.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground italic">
                        {tx.remarks}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground text-right shrink-0">
                      {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                   {index < transactions.length - 1 && <Separator className="my-4" />}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
