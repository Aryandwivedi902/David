"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GlobalBackground3D from "./GlobalBackground3D";

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {/* Fixed global background rendering rotating 3D chairs and tables */}
      {!isAdmin && <GlobalBackground3D />}
      
      {!isAdmin && <Navbar />}
      <main className={!isAdmin ? "min-h-screen pt-20 relative z-10" : "min-h-screen relative z-10"}>
        {children}
      </main>
      {!isAdmin && <Footer />}
    </>
  );
}
