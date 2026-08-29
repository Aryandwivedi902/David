"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import GlobalBackground3D from "./GlobalBackground3D";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();
  const [mounted, setMounted] = useState(false);
  const isAdmin = pathname.startsWith("/admin");
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && !user && !isAuthPage && !isAdmin) {
      router.replace("/login");
    }
  }, [mounted, user, loading, pathname, isAuthPage, isAdmin, router]);

  const showLoader = (!mounted || loading) && !isAuthPage && !isAdmin;

  // Show loading indicator while resolving auth state on restricted pages
  if (showLoader) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-deep text-white relative z-50">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-accent animate-spin mx-auto mb-4" />
          <p className="text-xs text-gray-400 tracking-widest uppercase">
            Verifying secure session...
          </p>
        </div>
      </div>
    );
  }

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

export default function ClientLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <ClientLayoutContent>{children}</ClientLayoutContent>
    </AuthProvider>
  );
}
