"use client";
import {
  SidebarProvider,
  Sidebar,
  SidebarInset,
} from "@/components/ui/sidebar";
import SidebarNavigation from "@/components/sidebar-navigation";
import { Button } from "./ui/button";
import { PanelLeft } from "lucide-react";
import { useSidebar } from "./ui/sidebar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

function Header() {
  const { toggleSidebar, isMobile } = useSidebar();
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      {isMobile && (
        <Button size="icon" variant="outline" onClick={toggleSidebar}>
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      )}
      <div className="flex-1">
        {/* Placeholder for future header content like search or breadcrumbs */}
      </div>
    </header>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (!isLoggedIn && pathname !== '/login') {
            router.replace('/login');
        } else {
            setIsChecking(false);
        }
    }, [pathname, router]);

    if (isChecking) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
            </div>
        );
    }
    
    return <>{children}</>;
}


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/login") {
    return <>{children}</>;
  }
  
  return (
    <AuthGuard>
        <SidebarProvider>
        <div className="flex min-h-screen w-full">
            <Sidebar>
            <SidebarNavigation />
            </Sidebar>
            <div className="flex w-full flex-col">
            <Header />
            <SidebarInset>
                <main className="flex-1 p-4 md:p-6">{children}</main>
            </SidebarInset>
            </div>
        </div>
        </SidebarProvider>
    </AuthGuard>
  );
}
