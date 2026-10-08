import React from 'react';
import type { NavigationTab } from '../../types';
import { 
  LayoutDashboard, 
  Satellite, 
  Building2, 
  Flame, 
  ShieldAlert, 
  ChevronRight,
  Database
} from 'lucide-react';

interface SidebarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  isCollapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  currentTab, 
  onTabChange,
  isCollapsed = false 
}) => {
  const navItems: { id: NavigationTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'EOC Dashboard', icon: LayoutDashboard },
    { id: 'satellite', label: 'Satellite Analysis', icon: Satellite, badge: 'MSI' },
    { id: 'damage', label: 'Damage Assessment', icon: Building2 },
    { id: 'risk', label: 'Risk Analysis', icon: Flame, badge: 'AI' },
    { id: 'response', label: 'Emergency Response', icon: ShieldAlert, badge: 'P1' },
  ];

  return (
    <aside className={`bg-command-panel border-r border-command-border flex flex-col justify-between transition-all duration-200 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono text-command-dim uppercase tracking-wider font-semibold">
          Operational Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-mono transition-all text-left ${
                isActive
                  ? 'bg-command-accent/20 border border-command-accent/50 text-command-accent-glow font-bold shadow-tactical-glow'
                  : 'text-command-muted hover:text-command-text hover:bg-command-surface/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-command-accent-glow' : 'text-command-dim'}`} />
                {!isCollapsed && <span>{item.label}</span>}
              </div>

              {!isCollapsed && (
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      isActive 
                        ? 'bg-command-accent text-white' 
                        : 'bg-command-surface text-command-dim border border-command-border'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-command-accent-glow" />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom Mission Support Links */}
      <div className="p-3 border-t border-command-border space-y-2">
        <div className="p-2.5 rounded-lg bg-command-card border border-command-border text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
            <Database className="w-3.5 h-3.5" />
            <span>GEO-CACHE READY</span>
          </div>
          <p className="text-[10px] text-command-dim leading-tight">
            Transboundary AOI: Bhote Koshi / Tatopani Corridor (EPSG:32645)
          </p>
        </div>

        <div className="text-[10px] font-mono text-command-dim text-center py-1">
          HIMALAYA-SHIELD © 2026
        </div>
      </div>
    </aside>
  );
};
