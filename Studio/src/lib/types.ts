
import type { ServerValue } from "firebase/database";

export interface Player {
  id: string;
  name: string;
  balance: number;
  isBank?: boolean;
}

export interface Transaction {
  id: string;
  from: string; // Player name for display
  to: string; // Player name for display
  fromId: string; // Player ID
  toId: string; // Player ID
  amount: number;
  remarks: string;
  timestamp: number | ServerValue;
}

export interface FundRequest {
    id: string;
    fromId: string;
    fromName: string;
    toId: string;
    toName: string;
    amount: number;
    remarks: string;
    timestamp: number | ServerValue;
}

export interface GameSession {
  id: string;
  creatorId: string;
  players: Record<string, Player>;
  transactions: Record<string, Transaction>;
  requests: Record<string, FundRequest>;
  createdAt: number | ServerValue;
}
