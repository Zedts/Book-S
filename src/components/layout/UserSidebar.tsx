/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  Compass, 
  BookOpen, 
  Heart, 
  Settings, 
  LogOut, 
  ShoppingCart,
  ChevronRight,
  ChevronLeft,
  X
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/Button";
import { useRequireRole } from "@/src/hooks/useRequireRole";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
  collapsed?: boolean;
}

function NavItem({ href, icon: Icon, label, active, collapsed }: NavItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
        active 
          ? "bg-slate-800 text-white shadow-lg shadow-slate-200" 
          : "text-slate-500 hover:bg-white/50 hover:text-slate-800",
        collapsed && "justify-center px-0 w-12 mx-auto"
      )}
    >
      <Icon className={cn("w-5 h-5 transition-transform duration-300 group-hover:scale-110 shrink-0", active ? "text-white" : "text-slate-400 group-hover:text-slate-800")} />
      {!collapsed && <span className="font-semibold text-sm truncate">{label}</span>}
      {active && !collapsed && <ChevronRight className="w-4 h-4 ml-auto opacity-50" />}
      
      {active && collapsed && (
        <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-6 bg-slate-800 rounded-l-full" />
      )}
    </Link>
  );
}

interface SidebarBrandProps {
  isCollapsed?: boolean;
}

function SidebarBrand({ isCollapsed }: SidebarBrandProps) {
  return (
    <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center flex-col px-0" : "px-2")}>
      <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center shadow-lg shadow-slate-200 shrink-0">
        <BookOpen className="w-6 h-6 text-white" />
      </div>
      {!isCollapsed && (
        <div>
          <h2 className="text-xl font-bold text-slate-800 leading-none">Book&apos;S</h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Premium Store</span>
        </div>
      )}
    </div>
  );
}

interface NavLinksProps {
  navItems: { href: string; icon: React.ElementType; label: string }[];
  pathname: string;
  isCollapsed?: boolean;
}

function NavLinks({ navItems, pathname, isCollapsed }: NavLinksProps) {
  return (
    <nav className="flex-1 space-y-2">
      {!isCollapsed && (
        <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Menu Utama</p>
      )}
      {navItems.map((item) => (
        <NavItem 
          key={item.label} 
          href={item.href} 
          icon={item.icon} 
          label={item.label} 
          active={pathname === item.href}
          collapsed={isCollapsed}
        />
      ))}
    </nav>
  );
}

interface UserAccountProps {
  user: { id: string; role: string; fullName: string } | null;
  isCollapsed?: boolean;
  onLogout: () => void;
}

function UserAccount({ user, isCollapsed, onLogout }: UserAccountProps) {
  return (
    <div className={cn(
      "rounded-2xl transition-all duration-300",
      isCollapsed 
        ? "flex flex-col items-center gap-4 bg-transparent border-transparent backdrop-blur-none p-0" 
        : "p-4 bg-slate-800/10 border border-white/20 backdrop-blur-md"
    )}>
      <div className={cn("flex items-center", isCollapsed ? "justify-center" : "gap-3 mb-3")}>
        <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm overflow-hidden shrink-0">
           <img src="https://i.pravatar.cc/100?img=12" alt="User" className="w-full h-full object-cover" />
        </div>
        {!isCollapsed && (
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-bold text-slate-800 truncate">{user?.fullName || "Regular User"}</p>
            <p className="text-[10px] font-medium text-slate-500 truncate">Premium Member</p>
          </div>
        )}
      </div>
      
      <Button 
        onClick={onLogout}
        className={cn(
          "text-xs font-bold transition-all duration-300 border shadow-sm flex items-center justify-center bg-slate-100/80 text-slate-600 border-slate-200 hover:bg-slate-800 hover:text-white hover:border-slate-800",
          isCollapsed 
            ? "w-10 h-10 p-0 rounded-xl mx-auto shrink-0" 
            : "w-full h-10 py-2 px-4 rounded-xl gap-2"
        )}
        title={isCollapsed ? "Keluar" : undefined}
      >
        <LogOut className="w-4 h-4 shrink-0" />
        {!isCollapsed && "Keluar"}
      </Button>
    </div>
  );
}

interface UserSidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

export default function UserSidebar({ isCollapsed, onToggle, isMobile }: UserSidebarProps) {
  const pathname = usePathname();
  const { handleLogout, user } = useRequireRole();

  const navItems = [
    { href: "/user/home", icon: Home, label: "Beranda" },
    { href: "/user/explore", icon: Compass, label: "Jelajahi" },
    { href: "/user/my-books", icon: BookOpen, label: "Progress" },
    { href: "/user/favorites", icon: Heart, label: "Favorit" },
    { href: "/user/cart", icon: ShoppingCart, label: "Keranjang" },
  ];

  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        <div 
          className={cn(
            "fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-50 lg:hidden transition-opacity duration-300",
            !isCollapsed ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
          )}
          onClick={onToggle}
        />
        
        {/* Drawer */}
        <aside 
          className={cn(
            "fixed left-0 top-0 h-screen w-72 bg-white/90 backdrop-blur-xl border-r border-white/40 p-6 flex flex-col z-60 transition-transform duration-500 ease-in-out lg:hidden shadow-2xl",
            !isCollapsed ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {/* Header with Close Button */}
          <div className="flex items-center justify-between mb-10 mt-1">
            <SidebarBrand />
            <button 
              onClick={onToggle}
              className="w-8 h-8 -mr-2 rounded-lg hover:bg-slate-200/50 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all"
              aria-label="Close Menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <NavLinks navItems={navItems} pathname={pathname} />

          {/* Footer / Account */}
          <div className="mt-auto space-y-4 pt-6 border-t border-slate-200/50">
            <NavItem 
              href="/user/settings" 
              icon={Settings} 
              label="Pengaturan" 
              active={pathname === "/user/settings"} 
              collapsed={false}
            />
            <UserAccount user={user} onLogout={() => { onToggle?.(); handleLogout(); }} />
          </div>
        </aside>
      </>
    );
  }

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-white/30 backdrop-blur-xl border-r border-white/40 p-6 flex flex-col z-50 transition-all duration-500 ease-in-out",
        isCollapsed ? "w-24" : "w-72",
        isMobile && !isCollapsed ? "translate-x-0" : isMobile ? "-translate-x-full" : "translate-x-0"
      )}
    >
      {/* Brand & Toggle */}
      <div className={cn("flex items-center mb-10 px-2", isCollapsed ? "justify-center" : "justify-between")}>
        <SidebarBrand isCollapsed={isCollapsed} />
        
        {!isMobile && (
          <button 
            onClick={onToggle}
            className={cn(
              "w-8 h-8 rounded-lg bg-white/50 border border-white/80 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-all",
              isCollapsed && "mt-4"
            )}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      <NavLinks navItems={navItems} pathname={pathname} isCollapsed={isCollapsed} />

      {/* Footer / Account */}
      <div className="mt-auto space-y-4 pt-6 border-t border-white/40">
        <NavItem 
          href="/user/settings" 
          icon={Settings} 
          label="Pengaturan" 
          active={pathname === "/user/settings"} 
          collapsed={isCollapsed}
        />
        <UserAccount user={user} isCollapsed={isCollapsed} onLogout={handleLogout} />
      </div>
    </aside>
  );
}
