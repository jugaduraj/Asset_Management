
'use client';
import {
  Briefcase,
  ClipboardList,
  Cog,
  LayoutDashboard,
  Layers,
  LogOut,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/context/user-context';
import { useAuth } from '@/context/auth-context';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const { isAuthenticated, logout } = useAuth();
  
  const navLinks = [
    { key: 'dashboard', href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'assets', href: '/assets', label: 'Assets', icon: Briefcase },
    { key: 'employees', href: '/employees', label: 'Employees', icon: Users },
    { key: 'logs', href: '/logs', label: 'Logs', icon: ClipboardList },
    { key: 'settings', href: '/settings', label: 'Settings', icon: Cog },
  ];

  if (!isAuthenticated) {
     if (pathname !== '/login') {
      return null; // Render nothing while redirecting
    }
    return <>{children}</>;
  }


  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-background sm:flex">
        <div className="flex h-16 shrink-0 items-center border-b px-6">
          <a className="flex items-center gap-2 font-semibold" href="/">
            <Layers className="h-6 w-6" />
            <span>AssetZen</span>
          </a>
        </div>
        <nav className="flex-1 overflow-auto py-2">
           <div className="flex flex-col gap-1 px-4">
            {navLinks.map(({ key, href, label, icon: Icon }) => (
              <a
                key={key}
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                  pathname === href ? 'bg-muted text-primary' : ''
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </div>
        </nav>
        <div className="mt-auto border-t p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full justify-start gap-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar} data-ai-hint="user avatar" />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                 <DropdownMenuItem onClick={() => router.push('/settings')}>
                    <Cog className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                 <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-64">
        <main className="flex flex-1 flex-col gap-4 p-4 sm:gap-8 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
