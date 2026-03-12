'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Settings, 
  LogOut, 
  Users, 
  ShieldCheck, 
  BarChart3,
  HeartPulse
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
}

const SidebarItem = ({ href, icon, label }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
        isActive 
          ? 'bg-secondary text-secondary-foreground' 
          : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
      )}
    >
      <span className="mr-3">{icon}</span>
      {label}
    </Link>
  );
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex flex-col w-64 h-screen bg-card border-r">
      <div className="flex items-center h-16 px-6 border-b">
        <HeartPulse className="w-8 h-8 text-primary mr-2" />
        <span className="text-xl font-bold">Wellness</span>
      </div>
      
      <div className="flex-1 px-4 py-6 space-y-1">
        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
          Menu
        </div>
        <SidebarItem 
          href="/dashboard" 
          icon={<LayoutDashboard size={20} />} 
          label="Dashboard" 
        />
        <SidebarItem 
          href="/sessions/create" 
          icon={<PlusCircle size={20} />} 
          label="Create Session" 
        />
        
        {isAdmin && (
          <div className="pt-6 space-y-1">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
              Admin
            </div>
            <SidebarItem 
              href="/admin/overview" 
              icon={<BarChart3 size={20} />} 
              label="Overview" 
            />
            <SidebarItem 
              href="/admin/users" 
              icon={<Users size={20} />} 
              label="Users" 
            />
            <SidebarItem 
              href="/admin/sessions" 
              icon={<ShieldCheck size={20} />} 
              label="Moderation" 
            />
          </div>
        )}
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center px-3 py-2 mb-4">
          <div className="flex-1 overflow-hidden text-sm">
            <p className="font-medium truncate">{user?.name}</p>
            <p className="text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button 
          variant="outline" 
          className="w-full justify-start text-destructive hover:text-destructive" 
          onClick={logout}
        >
          <LogOut className="mr-2" size={18} />
          Logout
        </Button>
      </div>
    </div>
  );
}
