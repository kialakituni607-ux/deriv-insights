import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
}

export function AppHeader({ title, subtitle }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-3 backdrop-blur-xl sm:px-5">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <div className="flex flex-col leading-tight min-w-0">
        <h1 className="text-sm font-semibold tracking-tight truncate">{title}</h1>
        {subtitle && (
          <span className="text-[11px] text-muted-foreground font-mono truncate">{subtitle}</span>
        )}
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex items-center gap-2 rounded-md bg-surface border border-border px-2.5 py-1.5 text-xs text-muted-foreground w-56">
          <Search className="h-3.5 w-3.5" />
          <span>Search markets…</span>
          <kbd className="ml-auto font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded">⌘K</kbd>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="h-8 w-8 rounded-full gradient-primary grid place-items-center text-[11px] font-bold text-primary-foreground">
          QX
        </div>
      </div>
    </header>
  );
}
