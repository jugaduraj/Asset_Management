
'use client';

import {
  Briefcase,
  ClipboardList,
  Cog,
  LayoutDashboard,
  Layers,
  Users,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/login');
  };
  
  const navLinks = [
    { key: 'dashboard', href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'assets', href: '/assets', label: 'Assets', icon: Briefcase },
    { key: 'employees', href: '/employees', label: 'Employees', icon: Users },
    { key: 'logs', href: '/logs', label: 'Logs', icon: ClipboardList },
    { key: 'settings', href: '/settings', label: 'Settings', icon: Cog },
  ];

  return (
    <div className="flex min-h-screen w-full flex-col bg-background">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-60 flex-col border-r bg-card sm:flex">
        <div className="flex h-16 items-center px-6">
          <a className="flex items-center gap-2 font-semibold" href="/">
            <Layers className="h-6 w-6" />
            <span>AssetZen</span>
          </a>
        </div>
        <nav className="flex flex-col gap-2 px-4">
          {navLinks.map(({ key, href, label, icon: Icon }) => (
            <a
              key={key}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary ${
                pathname === href ? 'bg-secondary text-primary' : ''
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </a>
          ))}
        </nav>
        <div className="mt-auto flex flex-col gap-2 p-4">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex w-full justify-start gap-2"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span>Admin User</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => router.push('/profile')}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>
      <main className="flex flex-1 flex-col gap-4 p-4 sm:ml-60 sm:gap-8 sm:p-10">
        {children}
      </main>
    </div>
  );
}
