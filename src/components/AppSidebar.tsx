import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, LineChart, Radio, Brain, Hash, History, Settings, ScanSearch, Target } from "lucide-react";
import logo from "@/assets/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Markets", url: "/markets", icon: LineChart },
  { title: "Signals", url: "/signals", icon: Radio },
  { title: "Predictions", url: "/predictions", icon: Brain },
  { title: "Digits", url: "/digits", icon: Hash },
  { title: "Patterns", url: "/patterns", icon: ScanSearch },
  { title: "Strategies", url: "/strategies", icon: Target },
];

const secondaryItems = [
  { title: "History", url: "/history", icon: History },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const currentPath = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (path: string) =>
    path === "/" ? currentPath === "/" : currentPath.startsWith(path);

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
        <Link to="/" className="flex items-center gap-2.5 px-2 py-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-surface border border-primary/30 shadow-glow shrink-0 overflow-hidden">
            <img src={logo} alt="ANTIPOVERTY AI logo" width={36} height={36} className="h-8 w-8 object-contain" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-bold tracking-tight">ANTIPOVERTY AI</span>
              <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-wider">Analysis Tool</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider font-mono">
            Analysis
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-wider font-mono">
            Account
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {secondaryItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)} tooltip={item.title}>
                    <Link to={item.url} className="flex items-center gap-3">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        {!collapsed ? (
          <div className="px-2 py-2">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="h-2 w-2 rounded-full bg-bull pulse-dot" />
              <span className="text-muted-foreground">Live feed</span>
              <span className="ml-auto text-bull">connected</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center py-2">
            <span className="h-2 w-2 rounded-full bg-bull pulse-dot" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
