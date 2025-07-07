'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitBranch, ExternalLink, RefreshCw } from "lucide-react";

export function FirebaseSetup() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 p-4 sm:p-8">
      <Card className="w-full max-w-2xl shadow-2xl border-primary/20">
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-full w-fit">
                <GitBranch className="h-8 w-8" />
            </div>
            <div>
                <CardTitle className="text-2xl font-headline">Firebase Configuration Required</CardTitle>
                <CardDescription>Follow these steps to connect your app to a Firebase Realtime Database.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 text-sm sm:text-base">
          <div className="space-y-4">
            <div className="space-y-2 p-4 border-l-4 border-primary/50 bg-primary/5 rounded-r-lg">
                <h3 className="font-semibold flex items-center gap-2"><span className="font-mono bg-primary/20 text-primary rounded-md text-xs px-2 py-1">1</span> Go to Firebase Console</h3>
                <p>
                    Visit the <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary font-semibold underline hover:text-primary/80">Firebase Console <ExternalLink className="inline-block h-4 w-4" /></a>, create a new project, and add a **Web App** to it. This is free.
                </p>
            </div>

            <div className="space-y-2 p-4 border-l-4 border-primary/50 bg-primary/5 rounded-r-lg">
                <h3 className="font-semibold flex items-center gap-2"><span className="font-mono bg-primary/20 text-primary rounded-md text-xs px-2 py-1">2</span> Create `.env.local` File</h3>
                <p>
                    In the root directory of your project (the top-level folder), create a new file named <code className="font-mono bg-secondary text-secondary-foreground rounded p-1">.env.local</code>.
                </p>
            </div>
            
            <div className="space-y-2 p-4 border-l-4 border-primary/50 bg-primary/5 rounded-r-lg">
                <h3 className="font-semibold flex items-center gap-2"><span className="font-mono bg-primary/20 text-primary rounded-md text-xs px-2 py-1">3</span> Add Configuration Keys</h3>
                 <p>
                    Copy the text below into your new <code className="font-mono bg-secondary text-secondary-foreground rounded p-1">.env.local</code> file. You will find the required values in your Firebase project settings.
                </p>
                <pre className="p-4 mt-2 bg-secondary/50 rounded-md text-secondary-foreground overflow-x-auto">
                    <code className="font-mono text-xs sm:text-sm">
{`NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_DATABASE_URL=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...`}
                    </code>
                </pre>
                 <p className="text-xs text-muted-foreground pt-2">
                    Navigate to Project Settings &gt; General &gt; Your apps &gt; SDK setup and configuration to find these values.
                </p>
            </div>

            <div className="space-y-2 p-4 border-l-4 border-primary/50 bg-primary/5 rounded-r-lg">
                <h3 className="font-semibold flex items-center gap-2"><span className="font-mono bg-primary/20 text-primary rounded-md text-xs px-2 py-1">4</span> Restart the Server</h3>
                <p className="flex items-center gap-2">
                    <RefreshCw className="h-4 w-4" />
                    After saving the file, you must **restart your development server** for the changes to take effect. The app will reload automatically once it's configured.
                </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
