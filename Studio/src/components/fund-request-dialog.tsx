
"use client";

import { useEffect, useState } from "react";
import { useGame } from "@/contexts/game-context";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/lib/utils";
import type { FundRequest } from "@/lib/types";

export function FundRequestDialog() {
  const { requests, acceptRequest, declineRequest } = useGame();
  const [currentRequest, setCurrentRequest] = useState<FundRequest | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (requests.length > 0 && !isOpen) {
      // Show the oldest request first
      const sortedRequests = [...requests].sort((a, b) => (a.timestamp as number) - (b.timestamp as number));
      setCurrentRequest(sortedRequests[0]);
      setIsOpen(true);
    }
  }, [requests, isOpen]);

  if (!currentRequest) {
    return null;
  }

  const handleAccept = () => {
    acceptRequest(currentRequest);
    setIsOpen(false);
    setCurrentRequest(null);
  };

  const handleDecline = () => {
    declineRequest(currentRequest.id);
    setIsOpen(false);
    setCurrentRequest(null);
  };
  
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Incoming Fund Request</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-bold">{currentRequest.fromName}</span> is requesting{" "}
            <span className="font-bold text-primary">${formatCurrency(currentRequest.amount)}</span>.
            {currentRequest.remarks && <p className="italic mt-2">"{currentRequest.remarks}"</p>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleDecline}>Decline</AlertDialogCancel>
          <AlertDialogAction onClick={handleAccept}>Accept & Pay</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
