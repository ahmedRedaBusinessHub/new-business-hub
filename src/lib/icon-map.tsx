import {
  LayoutDashboard,
  Users,
  Newspaper,
  Mail,
  GraduationCap,
  FolderKanban,
  Star,
  Building2,
  Handshake,
  MessageSquare,
  Shield,
  Boxes,
  Images,
  List,
  Settings,
  Database,
  Lock,
  ShieldCheck,
  UserCog,
  Package,
  FileText,
  CreditCard,
  Tag,
  LucideIcon,
  HelpCircle,
} from "lucide-react";

// Map of icon string names to Lucide icon components
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Newspaper,
  Mail,
  GraduationCap,
  FolderKanban,
  Star,
  Building2,
  Handshake,
  MessageSquare,
  Shield,
  Boxes,
  Images,
  List,
  Settings,
  Database,
  Lock,
  ShieldCheck,
  UserCog,
  Package,
  FileText,
  CreditCard,
  Tag,
};

interface DynamicIconProps {
  name: string | null | undefined;
  className?: string;
  size?: number;
}

/**
 * Renders a Lucide icon dynamically based on its string name
 */
export function DynamicIcon({ name, className, size = 16 }: DynamicIconProps) {
  if (!name) return null;
  
  const IconComponent = iconMap[name];
  
  if (!IconComponent) {
    // Return a fallback icon if the icon name is not found
    return <HelpCircle className={className} size={size} />;
  }
  
  return <IconComponent className={className} size={size} />;
}

/**
 * Get icon component by name
 */
export function getIconByName(name: string | null | undefined): LucideIcon | null {
  if (!name) return null;
  return iconMap[name] || null;
}
