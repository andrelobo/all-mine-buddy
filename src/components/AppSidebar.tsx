import React from 'react';
import { Building2, Users, Receipt } from 'lucide-react';
import skaleLogo from '@/assets/skale-logo.png';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';

type ActiveTab = 'prestador' | 'tomador' | 'emissao';

interface AppSidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
}

const menuItems = [
  { key: 'prestador' as ActiveTab, label: 'O Prestador', icon: Building2 },
  { key: 'tomador' as ActiveTab, label: 'Tomadores', icon: Users },
  { key: 'emissao' as ActiveTab, label: 'DANFSE', icon: Receipt },
];

const AppSidebar: React.FC<AppSidebarProps> = ({ activeTab, onTabChange }) => {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        <div className="flex items-center">
          <span className="text-sm font-bold text-sidebar-foreground leading-tight">
            Skalë Software
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[10px] tracking-widest">
            Módulos
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeTab === item.key}
                    onClick={() => onTabChange(item.key)}
                    tooltip={item.label}
                    className={
                      activeTab === item.key
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground'
                        : ''
                    }
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!isCollapsed && (
          <p className="text-[9px] text-sidebar-foreground/40 text-center">
            Portal Nacional NFS-e
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
