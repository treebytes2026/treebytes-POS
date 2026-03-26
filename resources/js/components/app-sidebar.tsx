import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { type NavItem, type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ChevronRight, LayoutGrid, Settings, Store, Users, ShoppingCart, List, Package } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutGrid,
    },
];

const restaurantNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        url: '/restaurant/dashboard',
        icon: LayoutGrid,
    },
    {
        title: 'POS Interface',
        url: '/restaurant/pos',
        icon: ShoppingCart,
    },
];

const restaurantManageItems: NavItem[] = [
    {
        title: 'Orders',
        url: '/restaurant/orders',
        icon: ShoppingCart,
    },
    {
        title: 'Menu Items',
        url: '/restaurant/products',
        icon: List,
    },
    {
        title: 'Categories',
        url: '/restaurant/categories',
        icon: LayoutGrid,
    },
    {
        title: 'Inventory',
        url: '/restaurant/inventory',
        icon: Package,
    },
    {
        title: 'Staff Management',
        url: '/restaurant/staff',
        icon: Users,
    },
    {
        title: 'Restaurant Settings',
        url: '/restaurant/settings',
        icon: Settings,
    },
];

const footerNavItems: NavItem[] = [];

const adminPlatformItems: NavItem[] = [
    {
        title: 'Restaurants',
        url: '/admin',
        icon: Store,
    },
];

const settingsItems: NavItem[] = [
    {
        title: 'Platform Users',
        url: '/admin/users',
        icon: Users,
    },
];

export function AppSidebar() {
    const { auth } = usePage<SharedData>().props;
    const page = usePage();
    const isSuperAdmin = auth.user.role === 'super_admin';

    const platformItems = isSuperAdmin
        ? [...mainNavItems, ...adminPlatformItems]
        : []; // For restaurant users, we use the logo link and the Management section instead, or just keep restaurantNavItems if we want.
    
    // Let's actually keep restaurantNavItems in platformItems for better visibility of "Dashboard" and "POS"
    const finalPlatformItems = isSuperAdmin ? platformItems : restaurantNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={isSuperAdmin ? '/dashboard' : '/restaurant/dashboard'} prefetch>
                                <AppLogo restaurant={auth.user.restaurant} />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={finalPlatformItems} />

                {isSuperAdmin && (
                    <SidebarGroup className="px-2 py-0">
                        <SidebarGroupLabel>Admin</SidebarGroupLabel>
                        <SidebarMenu>
                            <Collapsible className="group/collapsible">
                                <SidebarMenuItem>
                                    <CollapsibleTrigger asChild>
                                        <SidebarMenuButton tooltip="Settings">
                                            <Settings />
                                            <span>Settings</span>
                                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                        </SidebarMenuButton>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent>
                                        <SidebarMenuSub>
                                            {settingsItems.map((item) => (
                                                <SidebarMenuSubItem key={item.title}>
                                                    <SidebarMenuSubButton asChild isActive={item.url === page.url}>
                                                        <Link href={item.url} prefetch>
                                                            {item.icon && <item.icon className="h-4 w-4" />}
                                                            <span>{item.title}</span>
                                                        </Link>
                                                    </SidebarMenuSubButton>
                                                </SidebarMenuSubItem>
                                            ))}
                                        </SidebarMenuSub>
                                    </CollapsibleContent>
                                </SidebarMenuItem>
                            </Collapsible>
                        </SidebarMenu>
                    </SidebarGroup>
                )}

                {!isSuperAdmin && (
                    <SidebarGroup className="px-2 py-0">
                        <SidebarGroupLabel>Management</SidebarGroupLabel>
                        <SidebarMenu>
                            {restaurantManageItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton tooltip={item.title} asChild isActive={item.url === page.url}>
                                        <Link href={item.url} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
