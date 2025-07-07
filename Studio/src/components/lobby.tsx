"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Landmark, PlusCircle, LogIn, Loader2 } from "lucide-react";
import { useGame } from "@/contexts/game-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const createGameSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  budget: z.coerce.number().positive("Budget must be a positive number."),
});

const joinGameSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  gameId: z.string().length(6, "Game ID must be 6 characters."),
});

export function Lobby() {
    const { createGame, joinGame } = useGame();
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    const createForm = useForm<z.infer<typeof createGameSchema>>({
        resolver: zodResolver(createGameSchema),
        defaultValues: { name: "", budget: 15 },
    });

    const joinForm = useForm<z.infer<typeof joinGameSchema>>({
        resolver: zodResolver(joinGameSchema),
        defaultValues: { name: "", gameId: "" },
    });

    const handleCreateGame = async (values: z.infer<typeof createGameSchema>) => {
        setIsCreating(true);
        try {
            await createGame(values.name, values.budget * 1_000_000);
        } finally {
            setIsCreating(false);
        }
    };

    const handleJoinGame = async (values: z.infer<typeof joinGameSchema>) => {
        setIsJoining(true);
        try {
            await joinGame(values.gameId, values.name);
        } finally {
            setIsJoining(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto bg-primary text-primary-foreground rounded-full p-3 w-fit mb-4">
                        <Landmark className="h-8 w-8" />
                    </div>
                    <CardTitle className="font-headline text-3xl">Jenish MonoCalc</CardTitle>
                    <CardDescription>The digital banking companion</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="create" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="create">Create Game</TabsTrigger>
                            <TabsTrigger value="join">Join Game</TabsTrigger>
                        </TabsList>
                        <TabsContent value="create">
                            <Form {...createForm}>
                                <form onSubmit={createForm.handleSubmit(handleCreateGame)} className="space-y-6 pt-4">
                                <FormField
                                    control={createForm.control}
                                    name="name"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Your Name</FormLabel>
                                        <FormControl>
                                        <Input placeholder="e.g. Top Hat" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <FormField
                                    control={createForm.control}
                                    name="budget"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Starting Budget (in Millions)</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                            <Input type="number" step="any" className="pr-8" {...field} disabled />
                                            </FormControl>
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <span className="text-muted-foreground sm:text-sm">M</span>
                                            </div>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full !mt-8" size="lg" disabled={isCreating}>
                                    {isCreating ? <Loader2 className="animate-spin" /> : <PlusCircle />}
                                    {isCreating ? 'Creating...' : 'Start New Game'}
                                </Button>
                                </form>
                            </Form>
                        </TabsContent>
                        <TabsContent value="join">
                            <Form {...joinForm}>
                                <form onSubmit={joinForm.handleSubmit(handleJoinGame)} className="space-y-6 pt-4">
                                    <FormField
                                        control={joinForm.control}
                                        name="gameId"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Game ID</FormLabel>
                                            <FormControl>
                                            <Input placeholder="ABCXYZ" {...field} onChange={(e) => field.onChange(e.target.value.toUpperCase())} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={joinForm.control}
                                        name="name"
                                        render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Your Name</FormLabel>
                                            <FormControl>
                                            <Input placeholder="e.g. Scottie the Dog" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                        )}
                                    />
                                     <Button type="submit" className="w-full !mt-8" size="lg" disabled={isJoining}>
                                        {isJoining ? <Loader2 className="animate-spin" /> : <LogIn />}
                                        {isJoining ? 'Joining...' : 'Join Game'}
                                    </Button>
                                </form>
                            </Form>
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </div>
    );
}
