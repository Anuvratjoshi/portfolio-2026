"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/common/components/layout/Navbar";
import { Footer } from "@/common/components/layout/Footer";
import { ChatBot } from "@/common/components/ui/ChatBot";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
      <ChatBot />
    </>
  );
}
