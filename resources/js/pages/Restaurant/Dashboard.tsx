import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Store, ShoppingCart, Package, List, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Restaurant Dashboard', href: '/restaurant/dashboard' },
];

interface DashboardProps {
    restaurant: {
        name: string;
    };
    stats: {
        total_sales: number;
        total_orders: number;
        total_products: number;
        low_stock_count: number;
    };
}

export default function Dashboard({ restaurant, stats }: DashboardProps) {
    const quickActions = [
        { title: 'Open POS', icon: ShoppingCart, href: '/restaurant/pos', color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
        { title: 'Manage Menu', icon: List, href: '/restaurant/products', color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
        { title: 'Inventory', icon: Package, href: '/restaurant/inventory', color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-500/10' },
    ];

    const cards = [
        { title: 'Total Sales', value: `₱${Number(stats?.total_sales || 0).toFixed(2)}`, icon: Store, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-500/10' },
        { title: 'Today\'s Orders', value: stats?.total_orders || 0, icon: ShoppingCart, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-500/10' },
        { title: 'Active Products', value: stats?.total_products || 0, icon: Package, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-500/10' },
        { title: 'Low Stock', value: stats?.low_stock_count || 0, icon: List, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-500/10' },
    ];

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Restaurant Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-6 mx-auto w-full max-w-[1400px]">
                <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                        Welcome to {restaurant.name}
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400">Manage your menu, track inventory, and serve your customers.</p>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-6 sm:grid-cols-3 animate-in fade-in slide-in-from-bottom-6 duration-600">
                    {quickActions.map((action, i) => (
                        <Link href={action.href} key={i}>
                            <Card className="hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all group overflow-hidden relative cursor-pointer shadow-sm hover:shadow-md">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-2xl ${action.bg} ${action.color} group-hover:scale-110 transition-transform duration-300`}>
                                            <action.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-50">{action.title}</h3>
                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage your business features</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-neutral-300 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Stats Grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    {cards.map((card, i) => (
                        <Card key={i} className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm overflow-hidden group transition-all hover:shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                    {card.title}
                                </CardTitle>
                                <div className={`p-2 rounded-xl ${card.bg} ${card.color}`}>
                                    <card.icon className="w-4 h-4" />
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                                    {card.value}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
