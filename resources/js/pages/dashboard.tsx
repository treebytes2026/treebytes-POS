import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem, type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Users, Store, CreditCard, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface Stat {
    title: string;
    value: string | number;
    icon: string;
    bg: string;
    color: string;
}

interface DashboardProps {
    stats: Stat[];
}

export default function Dashboard({ stats = [] }: DashboardProps) {
    const { auth } = usePage<SharedData>().props;
    
    const statIcons: Record<string, typeof Users> = {
        CreditCard, Users, Store, AlertCircle
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-8 rounded-xl p-6 mx-auto w-full max-w-[1400px]">
                <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Welcome back, {auth.user.name.split(' ')[0]}</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">Here's what's happening across your platform today.</p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    {stats.map((stat, i) => {
                        const IconComponent = statIcons[stat.icon] || Store;
                        return (
                            <Card key={i} className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm overflow-hidden relative group transition-all hover:shadow-md">
                                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                                    <CardTitle className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                                        {stat.title}
                                    </CardTitle>
                                    <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                                        <IconComponent className="w-4 h-4" />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                                        {stat.value}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
