"use client";

import Image from "next/image";
import { useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase/browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function signIn() {
    setLoading(true);
    const supabase = createBrowserSupabase();
    const redirectTo = `${window.location.origin}/dashboard`;
    await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
    setSent(true);
    setLoading(false);
  }

  return (
    <main className="studio-grid flex min-h-screen items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Image
            src="/brand/cmedia-logo-white.png"
            alt="CMedia Productions"
            width={258}
            height={80}
            priority
            className="h-14 w-auto"
          />
          <h1 className="mt-4 text-4xl font-bold text-broadcast-white">Format & Script Database</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">Log in om formats, scripts, draaiboeken en pitchdecks centraal te beheren.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="email@cmedia.nl" type="email" />
          <Button className="w-full" disabled={!email || loading} onClick={signIn}>
            {sent ? "Magic link verstuurd" : "Inloggen"}
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
