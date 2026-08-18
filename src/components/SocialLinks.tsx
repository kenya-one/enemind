/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Youtube, Instagram, Facebook, Video, Share2 } from 'lucide-react';

export interface SocialChannel {
  name: string;
  handle: string;
  url: string;
  iconName: 'youtube' | 'instagram' | 'facebook' | 'tiktok';
  color: string;
}

export const OFFICIAL_SOCIAL_CHANNELS: SocialChannel[] = [
  {
    name: 'YouTube',
    handle: '@Enemindcompany',
    url: 'https://www.youtube.com/@Enemindcompany',
    iconName: 'youtube',
    color: 'hover:text-red-500 hover:border-red-500/30',
  },
  {
    name: 'Instagram',
    handle: '@enermindcom',
    url: 'https://www.instagram.com/enermindcom/',
    iconName: 'instagram',
    color: 'hover:text-pink-500 hover:border-pink-500/30',
  },
  {
    name: 'Facebook',
    handle: 'Enemind Comp',
    url: 'https://www.facebook.com/search/top?q=Enemind%20Comp',
    iconName: 'facebook',
    color: 'hover:text-blue-500 hover:border-blue-500/30',
  },
  {
    name: 'TikTok',
    handle: 'Enemind',
    url: 'https://www.tiktok.com/@enemind',
    iconName: 'tiktok',
    color: 'hover:text-cyan-400 hover:border-cyan-400/30',
  },
];

export function SocialLinks({ compact = false }: { compact?: boolean }) {
  const renderIcon = (name: string) => {
    switch (name) {
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-500" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-500" />;
      case 'tiktok':
        return <Video className="w-4 h-4 text-cyan-400" />;
      default:
        return <Share2 className="w-4 h-4" />;
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {OFFICIAL_SOCIAL_CHANNELS.map((ch) => (
          <a
            key={ch.name}
            href={ch.url}
            target="_blank"
            rel="noopener noreferrer"
            title={`${ch.name} (${ch.handle})`}
            className={`p-2 rounded-lg bg-slate-800/60 border border-slate-700/60 text-slate-300 transition-all ${ch.color}`}
          >
            {renderIcon(ch.iconName)}
          </a>
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Official Channels</h4>
        <span className="text-[10px] bg-blue-950 text-blue-400 border border-blue-800 px-1.5 py-0.5 rounded font-mono">
          Global Community
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {OFFICIAL_SOCIAL_CHANNELS.map((ch) => (
          <a
            key={ch.name}
            href={ch.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-200 transition-colors group ${ch.color}`}
          >
            {renderIcon(ch.iconName)}
            <div className="overflow-hidden">
              <p className="font-medium truncate leading-none">{ch.name}</p>
              <p className="text-[10px] text-slate-400 truncate mt-0.5">{ch.handle}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
