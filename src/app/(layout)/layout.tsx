"use client";

import Image from "next/image";
import Link from "next/link";
import Logo from "../assets/recaply.png";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();

  return (
    <SessionProvider>
      <div className="min-h-screen bg-[#0A0B0F] text-white">
        {/* Sidebar */}
        <div className="fixed left-0 top-0 h-full w-[240px] bg-[#12141A] p-4">
          <div className="mb-8">
            <Link
              href={"/"}
              className="flex w-full items-center !justify-center lg:justify-start mb-8"
            >
              <Image src={Logo} alt="logo" width={100} height={100} />
            </Link>
          </div>
          <nav className="space-y-2">
            <Link
              href="/home"
              className={cn(
                "flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-400",
                path === "/home" && "bg-[#4844E1] text-white"
              )}
            >
              <span>Dashboard</span>
            </Link>
            <Link
              href="/workspace"
              className={cn(
                "flex items-center space-x-2 rounded-lg px-4 py-2 text-gray-400",
                path.includes("/workspace") && "bg-[#4844E1] text-white"
              )}
            >
              <span>Workspaces</span>
            </Link>
          </nav>
        </div>

        {children}
      </div>
    </SessionProvider>
  );
}
