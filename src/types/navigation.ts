import {
  LucideIcon,
  LayoutDashboard,
  Compass,
  Scan,
  AlertOctagon,
  Map,
  BarChart3,
  FileText,
  Settings,
  Sparkles,
  Database,
  Cpu,
  Bell,
} from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  badgeVariant?: 'default' | 'cyan' | 'amber' | 'red' | 'purple';
  isFuture?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  active?: boolean;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  severity: 'low' | 'medium' | 'high' | 'anomaly' | 'ai';
  read: boolean;
  tag?: string;
}

export const MAIN_NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '#dashboard', icon: LayoutDashboard },
  { id: 'missions', label: 'Missions', href: '#missions', icon: Compass },
  { id: 'sonar-analysis', label: 'Sonar Analysis', href: '#sonar', icon: Scan },
  { id: 'detections', label: 'Detections', href: '#detections', icon: AlertOctagon, badge: '27', badgeVariant: 'red' },
  { id: 'marine-map', label: 'Marine Map', href: '#map', icon: Map },
  { id: 'analytics', label: 'Analytics', href: '#analytics', icon: BarChart3 },
  { id: 'reports', label: 'Reports', href: '#reports', icon: FileText },
  { id: 'datasets', label: 'Datasets', href: '#datasets', icon: Database, badge: '8.4 GB', badgeVariant: 'cyan' },
  { id: 'models', label: 'Models', href: '#models', icon: Cpu, badge: 'v4.2', badgeVariant: 'cyan' },
  { id: 'alerts', label: 'Alerts', href: '#alerts', icon: Bell, badge: '5', badgeVariant: 'red' },
  { id: 'settings', label: 'Settings', href: '#settings', icon: Settings },
  { id: 'preview', label: 'Design System', href: '#preview', icon: Sparkles, badge: 'UI KIT', badgeVariant: 'cyan' },
];
