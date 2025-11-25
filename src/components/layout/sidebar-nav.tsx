'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HeartPulse } from 'lucide-react';
import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { NAV_LINKS, SETTINGS_LINK } from '@/lib/constants';

export function SidebarNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  }

  return (
    <>
      <SidebarHeader className="border-b">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <HeartPulse className="h-7 w-7 text-primary" />
          <span className="text-xl font-headline font-semibold tracking-tight">Blood Bridge</span>
        </Link>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {NAV_LINKS.map((link) => (
            <SidebarMenuItem key={link.href}>
              <SidebarMenuButton
                asChild
                isActive={isActive(link.href)}
                tooltip={{ children: link.tooltip, side: 'right', align: 'center' }}
              >
                <Link href={link.href}>
                  <link.icon />
                  <span>{link.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              isActive={isActive(SETTINGS_LINK.href)}
              tooltip={{ children: SETTINGS_LINK.tooltip, side: 'right', align: 'center' }}
            >
              <Link href={SETTINGS_LINK.href}>
                <SETTINGS_LINK.icon />
                <span>{SETTINGS_LINK.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
