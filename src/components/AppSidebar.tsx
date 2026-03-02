import React from 'react';
import { Building2, Users, Receipt, Landmark, Settings, ClipboardList, LayoutDashboard, FileText } from 'lucide-react';
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

type ActiveTab = 'dashboard' | 'prestador' | 'tomador' | 'emissao' | 'notas';
type PrestadorSubTab = 'cadastro' | 'regime' | 'parametros';

interface AppSidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  prestadorSubTab?: PrestadorSubTab;
  onPrestadorSubTabChange?: (sub: PrestadorSubTab) => void;
}

const prestadorSubItems = [
  { key: 'cadastro' as PrestadorSubTab, label: 'Dados Cadastrais', icon: ClipboardList },
  { key: 'regime' as PrestadorSubTab, label: 'Regime Tributário', icon: Landmark },
  { key: 'parametros' as PrestadorSubTab, label: 'Parâmetros Fiscais', icon: Settings },
];

const AppSidebar: React.FC<AppSidebarProps> = ({ activeTab, onTabChange, prestadorSubTab, onPrestadorSubTabChange }) => {
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
              {/* Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === 'dashboard'}
                  onClick={() => onTabChange('dashboard')}
                  tooltip="Dashboard"
                  className={
                    activeTab === 'dashboard'
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground'
                      : ''
                  }
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* O Prestador - com sub-itens */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === 'prestador'}
                  onClick={() => onTabChange('prestador')}
                  tooltip="O Prestador"
                  className={
                    activeTab === 'prestador'
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground'
                      : ''
                  }
                >
                  <Building2 className="w-4 h-4" />
                  <span>O Prestador</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Sub-itens do Prestador */}
              {activeTab === 'prestador' && !isCollapsed && (
                <div className="ml-4 border-l border-sidebar-border pl-2 space-y-0.5">
                  {prestadorSubItems.map((sub) => (
                    <SidebarMenuItem key={sub.key}>
                      <SidebarMenuButton
                        isActive={prestadorSubTab === sub.key}
                        onClick={() => onPrestadorSubTabChange?.(sub.key)}
                        tooltip={sub.label}
                        className={`text-xs ${
                          prestadorSubTab === sub.key
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                            : 'text-sidebar-foreground/70'
                        }`}
                      >
                        <sub.icon className="w-3.5 h-3.5" />
                        <span>{sub.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              )}

              {/* Tomadores */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === 'tomador'}
                  onClick={() => onTabChange('tomador')}
                  tooltip="Tomadores"
                  className={
                    activeTab === 'tomador'
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground'
                      : ''
                  }
                >
                  <Users className="w-4 h-4" />
                  <span>Tomadores</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* DANFSE */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === 'emissao'}
                  onClick={() => onTabChange('emissao')}
                  tooltip="DANFSE"
                  className={
                    activeTab === 'emissao'
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground'
                      : ''
                  }
                >
                  <Receipt className="w-4 h-4" />
                  <span>DANFSE</span>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Notas Fiscais */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeTab === 'notas'}
                  onClick={() => onTabChange('notas')}
                  tooltip="FinGest"
                  className={
                    activeTab === 'notas'
                      ? 'bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary hover:text-sidebar-primary-foreground'
                      : ''
                  }
                >
                  <FileText className="w-4 h-4" />
                  <span>FinGest</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
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
