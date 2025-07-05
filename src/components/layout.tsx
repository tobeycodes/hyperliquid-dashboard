import { ReactNode } from "react";
import { Footer } from "./footer";
import { NavigationDesktop } from "./navigation-desktop";
import { NavigationMobile } from "./navigation-mobile";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => (
  <div className="flex flex-col h-dvh">
    <NavigationDesktop />

    <main className="flex-1 overflow-auto">
      <div className="container mx-auto max-w-[1196px]">{children}</div>
    </main>

    <NavigationMobile />

    <Footer />
  </div>
);
