import React from 'react';
import type { NavigationTab } from '../../types';
import { 
  LayoutDashboard, 
  Satellite, 
  Building2, 
  Flame, 
  ShieldAlert, 
  ChevronRight
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
  const navItems: { id: NavigationTab; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'satellite', label: 'Satellite Analysis', icon: Satellite },
    { id: 'damage', label: 'Damage Assessment', icon: Building2 },
    { id: 'risk', label: 'Risk Analysis', icon: Flame },
    { id: 'response', label: 'Emergency Response', icon: ShieldAlert },
  ];

  return (
    <aside className={`bg-command-panel border-r border-command-border flex flex-col justify-between transition-all duration-200 ${
      isCollapsed ? 'w-16' : 'w-56 lg:w-60'
    } shrink-0`}>
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-mono text-command-dim uppercase tracking-wider font-semibold">
          Modules
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
                  ? 'bg-command-accent/20 border border-command-accent/60 text-command-accent-glow font-bold shadow-tactical-glow'
                  : 'text-command-muted hover:text-command-text hover:bg-command-surface/50 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-command-accent-glow' : 'text-command-dim'}`} />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </div>

              {!isCollapsed && isActive && (
                <ChevronRight className="w-3.5 h-3.5 text-command-accent-glow shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Clean Bottom EOC Status */}
      <div className="p-3 border-t border-command-border text-[10px] font-mono text-command-dim text-center">
        {!isCollapsed && <span>COMMAND TIER 1</span>}
      </div>
    </aside>
  );
};
