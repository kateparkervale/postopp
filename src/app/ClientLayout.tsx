"use client";

import { useEffect } from "react";
import NavBar from "@/components/NavBar";
import { registerServiceWorker } from "@/lib/sw-register";
import { initializeSettings } from "@/db/database";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    registerServiceWorker();
    initializeSettings();
  }, []);

  return (
    <>
      <main className="pb-16">{children}</main>
      <NavBar />
    </>
  );
}
