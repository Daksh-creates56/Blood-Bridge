'use client';
import { usePathname } from 'next/navigation';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { NAV_LINKS, SETTINGS_LINK } from '@/lib/constants';

export function AppHeader() {
  const pathname = usePathname();
  const allLinks = [...NAV_LINKS, SETTINGS_LINK];
  const currentPage = allLinks.find(link => pathname.startsWith(link.href));
  
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:h-16 sm:px-6">
      <SidebarTrigger className="flex md:hidden" />
      <div className="flex-1">
        {currentPage && (
          <h1 className="text-lg font-semibold sm:text-xl">{currentPage.label}</h1>
        )}
      </div>
    </header>
  );
}