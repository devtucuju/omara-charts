import React from 'react';
import {
  LucideProps,
  BarChart3,
  Droplets,
  Waves,
  Settings,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  Search,
  Menu,
  X,
  Home,
  Activity,
  TrendingUp,
  TrendingDown,
  Eye,
  EyeOff,
  Play,
  Pause,
  Square,
} from 'lucide-react';

// Mapeamento de ícones para facilitar uso
const iconMap = {
  // Módulos
  intrusion: Droplets,
  solid: Waves,
  inundation: BarChart3,

  // Ações
  settings: Settings,
  calendar: Calendar,
  filter: Filter,
  download: Download,
  refresh: RefreshCw,
  search: Search,
  menu: Menu,
  close: X,
  plus: Plus,
  minus: Minus,

  // Status
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,

  // Navegação
  'chevron-down': ChevronDown,
  'chevron-up': ChevronUp,
  'chevron-left': ChevronLeft,
  'chevron-right': ChevronRight,

  // Interface
  home: Home,
  activity: Activity,
  'trending-up': TrendingUp,
  'trending-down': TrendingDown,
  eye: Eye,
  'eye-off': EyeOff,
  play: Play,
  pause: Pause,
  stop: Square,
} as const;

type IconName = keyof typeof iconMap;

interface IconProps extends Omit<LucideProps, 'name'> {
  name: IconName;
  size?: number;
  className?: string;
}

const Icon: React.FC<IconProps> = ({
  name,
  size = 24,
  className = '',
  ...props
}) => {
  const IconComponent = iconMap[name];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in iconMap`);
    return null;
  }

  return <IconComponent size={size} className={className} {...props} />;
};

export default Icon;
export type { IconName };
