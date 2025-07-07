
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
import { Landmark, ArrowRightLeft } from "lucide-react";
import { useGame } from "@/contexts/game-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const paySchema = z.object({
  recipientId: z.string().min(1, { message: "You must select a recipient." }),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be a positive number." }),
  remarks: z.string().optional(),
});

const receiveSchema = z.object({
  senderId: z.string().min(1, { message: "You must select a sender." }),
  amount: z.coerce
    .number()
    .positive({ message: "Amount must be a positive number." }),
  remarks: z.string().optional(),
});

function PayForm() {
  const { transferFunds, localPlayer, players } = useGame();
  const otherPlayers = players.filter((p) => p.id !== localPlayer?.id && !p.isBank);

  const form = useForm<z.infer<typeof paySchema>>({
    resolver: zodResolver(paySchema),
    defaultValues: {
      amount: 15,
      remarks: "",
      recipientId: "",
    },
  });

  const [baseAmount, setBaseAmount] = useState<string | number>(form.getValues("amount"));

  function onSubmit(values: z.infer<typeof paySchema>) {
    if (!localPlayer) return;
    transferFunds(
      localPlayer.id,
      values.recipientId,
      values.amount,
      values.remarks || "Player Transfer"
    );
    form.reset({ amount: 0, remarks: "", recipientId: "" });
    setBaseAmount(0);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="recipientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a player or the bank..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="bank">Bank</SelectItem>
                  {otherPlayers.map((player) => (
                    <SelectItem key={player.id} value={player.id}>
                      {player.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount ($)</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                  <Input 
                    type="number" 
                    step="any" 
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      setBaseAmount(e.target.value);
                    }}
                  />
                </FormControl>
                <Button type="button" variant="outline" size="sm" onClick={() => {
                    const numBase = Number(baseAmount) || 0;
                    form.setValue("amount", numBase * 1000, { shouldValidate: true });
                }}>
                    K
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => {
                    const numBase = Number(baseAmount) || 0;
                    form.setValue("amount", numBase * 1000000, { shouldValidate: true });
                }}>
                    M
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="remarks"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Remarks (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Rent for Boardwalk" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full !mt-6">
          <ArrowRightLeft className="mr-2 h-4 w-4" /> Send Payment
        </Button>
      </form>
    </Form>
  );
}


function ReceiveForm() {
    const { transferFunds, localPlayer, players } = useGame();
    const senders = players.filter((p) => p.id !== localPlayer?.id);

    const form = useForm<z.infer<typeof receiveSchema>>({
        resolver: zodResolver(receiveSchema),
        defaultValues: {
            amount: 2,
            remarks: "Passed Go",
            senderId: "bank"
        },
    });

    const [baseAmount, setBaseAmount] = useState<string | number>(form.getValues("amount"));
    
    function onSubmit(values: z.infer<typeof receiveSchema>) {
        if (!localPlayer) return;
        transferFunds(values.senderId, localPlayer.id, values.amount, values.remarks || "Received funds");
        form.reset({ amount: 0, remarks: "", senderId: "" });
        setBaseAmount(0);
    }

    return (
         <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="senderId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sender..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {senders.map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount ($)</FormLabel>
                  <div className="flex items-center gap-2">
                    <FormControl>
                       <Input
                        type="number"
                        step="any"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          setBaseAmount(e.target.value);
                        }}
                      />
                    </FormControl>
                    <Button type="button" variant="outline" size="sm" onClick={() => {
                        const numBase = Number(baseAmount) || 0;
                        form.setValue("amount", numBase * 1000, { shouldValidate: true });
                    }}>
                        K
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => {
                        const numBase = Number(baseAmount) || 0;
                        form.setValue("amount", numBase * 1000000, { shouldValidate: true });
                    }}>
                        M
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="remarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Remarks (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Bank Error in Your Favor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" variant="secondary" className="w-full !mt-6">
                Receive Funds
            </Button>
          </form>
        </Form>
    )
}

export function BankActionsCard() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Landmark className="text-primary" />
            Transactions
        </CardTitle>
        <CardDescription>
          Pay players or the bank, and receive money from players or the bank.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="pay" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="pay">Pay</TabsTrigger>
                <TabsTrigger value="receive">Receive</TabsTrigger>
            </TabsList>
            <TabsContent value="pay" className="pt-4">
                <PayForm />
            </TabsContent>
            <TabsContent value="receive" className="pt-4">
                <ReceiveForm />
            </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
