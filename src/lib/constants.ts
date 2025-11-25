import {
  LayoutDashboard,
  Send,
  BellRing,
  History,
  Map,
  BarChart2,
  Users,
  Settings,
  FlaskConical,
  type LucideIcon,
} from 'lucide-react';

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  tooltip: string;
};

export const NAV_LINKS: NavItem[] = [
  {
    href: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    tooltip: 'Dashboard',
  },
  {
    href: '/predictions',
    label: 'Predictions',
    icon: FlaskConical,
    tooltip: 'AI Predictions',
  },
  {
    href: '/send-request',
    label: 'Send Request',
    icon: Send,
    tooltip: 'Send Urgent Request',
  },
  {
    href: '/view-alerts',
    label: 'Active Requests',
    icon: BellRing,
    tooltip: 'View Active Requests',
  },
  {
    href: '/request-history',
    label: 'Request History',
    icon: History,
    tooltip: 'Request History',
  },
  {
    href: '/camps',
    label: 'Donation Camps',
    icon: Map,
    tooltip: 'Donation Camps',
  },
  {
    href: '/analytics',
    label: 'Analytics',
    icon: BarChart2,
    tooltip: 'Analytics',
  },
  {
    href: '/donors',
    label: 'Donors',
    icon: Users,
    tooltip: 'Donors',
  },
];

export const SETTINGS_LINK: NavItem = {
  href: '/settings',
  label: 'Settings',
  icon: Settings,
  tooltip: 'Settings',
};
