import React from 'react';
import {
  Droplets,
  Zap,
  ShieldCheck,
  ArrowUpCircle,
  Car,
  Waves,
  Dumbbell,
  Wifi,
  Sun,
  Tv,
  Users,
  Trees,
  CheckCircle2,
  Sparkles,
  Home,
  FileCheck
} from 'lucide-react';

interface AmenityIconProps {
  name: string;
  className?: string;
}

export const AmenityIcon: React.FC<AmenityIconProps> = ({ name, className = 'w-4 h-4' }) => {
  switch (name) {
    case 'Droplets':
      return <Droplets className={className} />;
    case 'Zap':
      return <Zap className={className} />;
    case 'ShieldCheck':
      return <ShieldCheck className={className} />;
    case 'ArrowUpCircle':
      return <ArrowUpCircle className={className} />;
    case 'Car':
      return <Car className={className} />;
    case 'Waves':
      return <Waves className={className} />;
    case 'Dumbbell':
      return <Dumbbell className={className} />;
    case 'Wifi':
      return <Wifi className={className} />;
    case 'Sun':
      return <Sun className={className} />;
    case 'Tv':
      return <Tv className={className} />;
    case 'Users':
      return <Users className={className} />;
    case 'Trees':
      return <Trees className={className} />;
    case 'FileCheck':
      return <FileCheck className={className} />;
    case 'Sparkles':
      return <Sparkles className={className} />;
    default:
      return <CheckCircle2 className={className} />;
  }
};
