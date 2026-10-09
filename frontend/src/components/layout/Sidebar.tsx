import React from 'react';
import type { NavigationTab } from '../../types';
import { 
  Home, 
  Satellite, 
  Building2, 
  ShieldAlert, 
  AlertTriangle,
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
  const navItems: { 
    id: NavigationTab; 
    label: string; 
    explanation: string; 
    icon: React.ElementType 
  }[] = [
    { 
      id: 'dashboard', 
      label: 'Home', 
      explanation: 'See the current situation', 
      icon: Home 
    },
    { 
      id: 'satellite', 
      label: 'Satellite Images', 
      explanation: 'Compare images before and after an event', 
      icon: Satellite 
    },
    { 
      id: 'damage', 
      label: 'Damage Check', 
      explanation: 'See places that may need inspection', 
      icon: Building2 
    },
    { 
      id: 'risk', 
      label: 'Risk Map', 
      explanation: 'Understand where hazards may be a concern', 
      icon: AlertTriangle 
    },
    { 
      id: 'response', 
      label: 'Emergency Help', 
      explanation: 'Find safety guidance and response priorities', 
      icon: ShieldAlert 
    },
  ];

  return (
    <aside className={`bg-white dark:bg-command-panel border-r border-slate-200 dark:border-command-border flex flex-col justify-between transition-all duration-200 ${
      isCollapsed ? 'w-16' : 'w-60 lg:w-64'
    } shrink-0 font-sans shadow-sm`}>
      {/* Navigation Links */}
      <div className="p-3 space-y-1.5">
        {!isCollapsed && (
          <div className="px-3 py-1.5 text-xs font-semibold text-slate-400 dark:text-command-dim uppercase tracking-wider">
            Navigation
          </div>
        )}

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 font-semibold shadow-sm'
                  : 'text-slate-600 dark:text-command-muted hover:text-slate-900 dark:hover:text-command-text hover:bg-slate-50 dark:hover:bg-command-surface/50 border border-transparent'
              }`}
              title={`${item.label} — ${item.explanation}`}
            >
              <div className="flex items-center gap-3 truncate">
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 dark:text-command-dim'}`} />
                {!isCollapsed && (
                  <div className="truncate">
                    <span className="block text-sm font-semibold leading-tight">{item.label}</span>
                    <span className="block text-[11px] text-slate-400 dark:text-command-dim font-normal truncate mt-0.5">
                      {item.explanation}
                    </span>
                  </div>
                )}
              </div>

              {!isCollapsed && isActive && (
                <ChevronRight className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Clean Bottom Public Information Status */}
      <div className="p-3 border-t border-slate-200 dark:border-command-border text-xs text-slate-400 dark:text-command-dim text-center">
        {!isCollapsed && <span>Public Safety & Hazard Portal</span>}
      </div>
    </aside>
  );
};
