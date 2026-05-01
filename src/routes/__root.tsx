import { Outlet, createRootRoute, HeadContent, Scripts, Link } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold gradient-primary bg-clip-text text-transparent">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Signal lost</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The route you're looking for isn't on the chart.
        </p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md gradient-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow hover:opacity-90">
            Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ANTIPOVERTY AI — Analysis Tool" },
      { name: "description", content: "ANTIPOVERTY AI Analysis Tool: multi-market trading analysis with real-time signals, predictions, and Deriv digit analytics." },
      { property: "og:title", content: "ANTIPOVERTY AI — Analysis Tool" },
      { property: "og:description", content: "ANTIPOVERTY AI Analysis Tool: multi-market trading analysis with real-time signals, predictions, and Deriv digit analytics." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "ANTIPOVERTY AI — Analysis Tool" },
      { name: "twitter:description", content: "ANTIPOVERTY AI Analysis Tool: multi-market trading analysis with real-time signals, predictions, and Deriv digit analytics." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/55df3319-1e7b-4379-a3c8-907131dc1b1d/id-preview-3eb63d3e--148ac672-d56a-49fd-b3a6-9d903b21e5da.lovable.app-1777639612134.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/55df3319-1e7b-4379-a3c8-907131dc1b1d/id-preview-3eb63d3e--148ac672-d56a-49fd-b3a6-9d903b21e5da.lovable.app-1777639612134.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Outlet />
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}
