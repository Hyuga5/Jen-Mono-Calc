"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { ref, set, onValue, get, child, serverTimestamp, remove, update } from "firebase/database";
import type { Player, Transaction, GameSession } from "@/lib/types";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useOnlineStatus } from "@/hooks/use-online-status";

interface GameContextType {
  gameId: string | null;
  localPlayerId: string | null;
  localPlayer: Player | null;
  players: Player[];
  transactions: Transaction[];
  isLoading: boolean;
  isCreator: boolean;
  createGame: (playerName: string, startingBudget: number) => Promise<string | undefined>;
  joinGame: (gameId: string, playerName: string) => Promise<void>;
  transferFunds: (
    fromId: string,
    toId: string,
    amount: number,
    remarks: string
  ) => void;
  bankTransaction: (
    playerId: string,
    type: "pay" | "receive",
    amount: number,
    remarks: string
  ) => void;
  endGame: () => void;
  leaveGame: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const BANK_ID = "bank";
const LOCAL_GAME_ID_KEY = "boardlink_game_id";
const LOCAL_PLAYER_ID_KEY = "boardlink_local_player_id";

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameId, setGameId] = useState<string | null>(null);
  const [localPlayerId, setLocalPlayerId] = useState<string | null>(null);
  const [gameSession, setGameSession] = useState<GameSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isOnline = useOnlineStatus();

  useEffect(() => {
    const savedGameId = localStorage.getItem(LOCAL_GAME_ID_KEY);
    const savedPlayerId = localStorage.getItem(LOCAL_PLAYER_ID_KEY);
    if (savedGameId && savedPlayerId && db) {
      setGameId(savedGameId);
      setLocalPlayerId(savedPlayerId);
    } else {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!gameId || !db) {
        setGameSession(null);
        return;
    };
    if (!isOnline) {
        toast({variant: "destructive", title: "Offline", description: "You are offline. Some features may not be available."});
    }

    const gameRef = ref(db, `games/${gameId}`);
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setGameSession(data);
      } else {
        endGame(false); 
        toast({variant: 'destructive', title: 'Game Not Found', description: `Game with ID ${gameId} may have been deleted.`});
      }
      setIsLoading(false);
    }, (error) => {
        console.error("Firebase read error:", error);
        toast({variant: "destructive", title: "Connection Error", description: "Could not sync with the database."});
        setIsLoading(false);
    });

    return () => unsubscribe();
  }, [gameId, isOnline, toast]);


  const createGame = useCallback(async (playerName: string, startingBudget: number): Promise<string | undefined> => {
    if (!db) {
        toast({variant: "destructive", title: "Database Error", description: "Firebase is not configured."});
        return;
    };
    setIsLoading(true);

    try {
        const newGameId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const gameRef = ref(db, `games/${newGameId}`);
        
        const newPlayerId = `player_${Date.now()}`;
        const newPlayer: Player = { id: newPlayerId, name: playerName, balance: startingBudget };
        const bank: Player = { id: BANK_ID, name: "Bank", balance: 1_000_000_000, isBank: true };
    
        const newGame: GameSession = {
          id: newGameId,
          creatorId: newPlayerId,
          players: { [bank.id]: bank, [newPlayer.id]: newPlayer },
          transactions: {},
          createdAt: serverTimestamp(),
        };

        await set(gameRef, newGame);

        setGameId(newGameId);
        setLocalPlayerId(newPlayerId);
        localStorage.setItem(LOCAL_GAME_ID_KEY, newGameId);
        localStorage.setItem(LOCAL_PLAYER_ID_KEY, newPlayerId);
        return newGameId;
    } catch (error) {
        console.error("Failed to create game:", error);
        toast({variant: "destructive", title: "Creation Failed", description: "Could not create the game session."});
        setIsLoading(false);
    }
  }, [toast]);
  
  const joinGame = useCallback(async (gameIdToJoin: string, playerName: string) => {
    if (!db) {
        toast({variant: "destructive", title: "Database Error", description: "Firebase is not configured."});
        return;
    };
    setIsLoading(true);
    const normalizedGameId = gameIdToJoin.toUpperCase();

    try {
        const gameRef = ref(db, `games/${normalizedGameId}`);
        const snapshot = await get(gameRef);

        if (!snapshot.exists()) {
            toast({variant: "destructive", title: "Game Not Found", description: "The specified Game ID does not exist."});
            setIsLoading(false);
            return;
        }

        const gameData: GameSession = snapshot.val();
        const playerNames = Object.values(gameData.players).map(p => p.name.toLowerCase());
        if (playerNames.includes(playerName.toLowerCase())) {
             toast({ variant: "destructive", title: "Player exists", description: `A player named ${playerName} is already in the game.` });
             setIsLoading(false);
             return;
        }
        
        const startingBudget = Object.values(gameData.players).find(p => !p.isBank)?.balance ?? 1500;
        const newPlayerId = `player_${Date.now()}`;
        const newPlayer: Player = { id: newPlayerId, name: playerName, balance: startingBudget };
        
        await set(child(gameRef, `players/${newPlayerId}`), newPlayer);

        setGameId(normalizedGameId);
        setLocalPlayerId(newPlayerId);
        localStorage.setItem(LOCAL_GAME_ID_KEY, normalizedGameId);
        localStorage.setItem(LOCAL_PLAYER_ID_KEY, newPlayerId);

    } catch(error) {
        console.error("Failed to join game:", error);
        toast({variant: "destructive", title: "Join Failed", description: "Could not join the game session."});
        setIsLoading(false);
    }
  }, [toast]);
  
  const transferFunds = useCallback(( fromId: string, toId: string, amount: number, remarks: string ) => {
      if (!gameId || !db || !gameSession) return;
      
      const fromPlayer = gameSession.players[fromId];
      const toPlayer = gameSession.players[toId];

      if (!fromPlayer || !toPlayer || amount <= 0) {
        toast({ variant: 'destructive', title: 'Invalid Transaction' });
        return;
      }
      if (fromPlayer.balance < amount && !fromPlayer.isBank) {
        toast({ variant: 'destructive', title: 'Insufficient Funds', description: `${fromPlayer.name} does not have enough funds.` });
        return;
      }
      
      const txId = `tx_${Date.now()}`;
      const newTransaction: Transaction = {
          id: txId,
          from: fromPlayer.name,
          to: toPlayer.name,
          fromId, toId,
          amount,
          remarks,
          timestamp: serverTimestamp(),
      };
      
      const updates: Record<string, any> = {};
      updates[`/games/${gameId}/players/${fromId}/balance`] = fromPlayer.balance - amount;
      updates[`/games/${gameId}/players/${toId}/balance`] = toPlayer.balance + amount;
      updates[`/games/${gameId}/transactions/${txId}`] = newTransaction;

      update(ref(db), updates).catch(error => {
          console.error("Transaction failed:", error);
          toast({variant: "destructive", title: "Transaction Failed", description: "Could not process the payment."});
      });

  }, [gameId, gameSession, toast]);


  const bankTransaction = useCallback(( playerId: string, type: 'pay' | 'receive', amount: number, remarks: string) => {
    if (type === 'pay') {
        transferFunds(playerId, BANK_ID, amount, remarks);
    } else {
        transferFunds(BANK_ID, playerId, amount, remarks);
    }
  }, [transferFunds]);

  const endGame = useCallback((showToast = true) => {
    if (gameId && db) {
        const gameRef = ref(db, `games/${gameId}`);
        remove(gameRef);
    }
    setGameSession(null);
    setGameId(null);
    setLocalPlayerId(null);
    localStorage.removeItem(LOCAL_GAME_ID_KEY);
    localStorage.removeItem(LOCAL_PLAYER_ID_KEY);
    if(showToast) {
        toast({title: "Game Over", description: "The session has been cleared."});
    }
  }, [gameId, toast, db]);

  const leaveGame = useCallback(() => {
    if (gameId && localPlayerId && db) {
        const playerRef = ref(db, `games/${gameId}/players/${localPlayerId}`);
        remove(playerRef);
    }
    setGameSession(null);
    setGameId(null);
    setLocalPlayerId(null);
    localStorage.removeItem(LOCAL_GAME_ID_KEY);
    localStorage.removeItem(LOCAL_PLAYER_ID_KEY);
    toast({title: "You have left the game."});
  }, [gameId, localPlayerId, toast, db]);

  const players = gameSession?.players ? Object.values(gameSession.players) : [];
  const transactions = gameSession?.transactions ? Object.values(gameSession.transactions).sort((a,b) => (b.timestamp as number) - (a.timestamp as number)) : [];
  const localPlayer = gameSession && localPlayerId ? gameSession.players[localPlayerId] : null;
  const isCreator = !!(gameSession?.creatorId && localPlayerId && gameSession.creatorId === localPlayerId);

  return (
    <GameContext.Provider
      value={{
        gameId,
        localPlayerId,
        localPlayer,
        players,
        transactions,
        isLoading,
        isCreator,
        createGame,
        joinGame,
        transferFunds,
        bankTransaction,
        endGame,
        leaveGame,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
