"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { RefreshCw } from "lucide-react";

export default function GetPublishedPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/get-published");
    } else if (status === "authenticated") {
      router.push("/researcher?action=new");
    }
  }, [status, router]);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <RefreshCw className="h-8 w-8 animate-spin text-sapphire" />
      <p className="mt-4 text-sm font-semibold text-navy/70">
        Directing to your Research Notebook...
      </p>
    </div>
  );
}
