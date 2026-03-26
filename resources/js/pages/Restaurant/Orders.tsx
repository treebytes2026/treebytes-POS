import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ClipboardList, ShoppingBag, Clock, CheckCircle2, CheckCircle, Plus, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Orders', href: '/restaurant/orders' },
];

interface OrderItem {
    id: number;
    quantity: number;
    product?: {
        name: string;
    };
}

interface Order {
    id: number;
    status: string;
    created_at: string;
    order_type: string;
    table_number: string | null;
    total_amount: number;
    items?: OrderItem[];
    user?: {
        name: string;
    };
}

export default function Orders({ orders = [] }: { orders: Order[] }) {
    const handleStatusUpdate = (id: number, status: string) => {
        router.patch(route('restaurant.orders.status', id), { status }, {
            onSuccess: () => toast.success(`Order #${id} marked as ${status}`),
        });
    };

    const pendingOrders = orders.filter((o: Order) => o.status === 'pending');
    const historyOrders = orders.filter((o: Order) => o.status === 'completed' || o.status === 'cancelled');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Order Management" />
            <div className="p-6 flex flex-col gap-8 mx-auto w-full max-w-[1600px]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter text-neutral-900 dark:text-neutral-50 flex items-center gap-3">
                            <ShoppingBag className="w-10 h-10 text-indigo-600" />
                            Live Order Board
                        </h1>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-1 font-medium italic">Real-time terminal transactions & kitchen workflow.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Active Orders Section */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                                Active Kitchen Queue ({pendingOrders.length})
                            </h2>
                        </div>

                        {pendingOrders.length === 0 ? (
                            <div className="bg-neutral-50 dark:bg-neutral-900/50 border-dashed border-2 border-neutral-200 dark:border-neutral-800 rounded-[2rem] py-20 flex flex-col items-center justify-center text-center opacity-30">
                                <ClipboardList className="w-12 h-12 mb-4" />
                                <p className="text-sm font-black uppercase tracking-widest leading-none">Queue Empty</p>
                                <p className="text-[10px] mt-2 font-medium italic">All orders have been served.</p>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-neutral-950 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-900 overflow-hidden shadow-sm">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-900">
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Order</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Time</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Service</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400">Items</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-right">Total</th>
                                                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-neutral-400 text-center">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
                                            {pendingOrders.map((order: Order) => (
                                                <tr key={order.id} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/20 transition-colors group">
                                                    <td className="px-6 py-5">
                                                        <span className="text-xs font-black text-indigo-600 block">#{order.id}</span>
                                                        <span className="text-[9px] font-bold text-neutral-300 uppercase italic">Active</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex items-center gap-2 text-neutral-500">
                                                            <Clock className="w-3 h-3" />
                                                            <span className="text-[11px] font-bold">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <Badge className="bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-none text-[9px] font-black uppercase px-2 py-0.5 rounded-lg shadow-sm">
                                                            {order.order_type === 'dine_in' ? 'Dine In' : 'Take Out'} {order.table_number ? `• T${order.table_number}` : ''}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-wrap gap-2">
                                                            {order.items?.map((item: OrderItem, idx: number) => (
                                                                <div key={idx} className="flex items-center gap-1.5 px-2 py-1 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100/50 dark:border-indigo-900/30">
                                                                    <span className="text-[10px] font-black text-indigo-600">{item.quantity}x</span>
                                                                    <span className="text-[10px] font-black text-neutral-600 dark:text-neutral-300 uppercase tracking-tight">{item.product?.name}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-5 text-right">
                                                        <span className="text-sm font-black text-neutral-900 dark:text-white">₱{Number(order.total_amount).toFixed(0)}</span>
                                                    </td>
                                                     <td className="px-6 py-5">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <Button 
                                                                size="sm"
                                                                onClick={() => handleStatusUpdate(order.id, 'completed')}
                                                                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-8 px-4 font-black text-[9px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all"
                                                            >
                                                                <CheckCircle className="w-3 h-3 mr-1.5" />
                                                                Serve
                                                            </Button>
                                                            <Button 
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={() => router.get(route('restaurant.pos'), { table: order.table_number })}
                                                                className="border-indigo-100 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-xl h-8 px-3 font-black text-[9px] uppercase tracking-widest hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-all"
                                                                title="Add Items"
                                                            >
                                                                <Plus className="w-3 h-3" />
                                                            </Button>
                                                            <Button 
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                                                className="text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 rounded-xl h-8 px-a transition-all"
                                                                title="Cancel Order"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order History Sidebar Section */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2 pt-1">
                            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">Order History</h2>
                            <span className="text-[10px] font-bold text-neutral-300 uppercase italic">Recent 20</span>
                        </div>
                        
                        <div className="space-y-4">
                            {historyOrders.length === 0 ? (
                                <p className="text-xs text-neutral-400 font-medium italic text-center py-8">No order history yet.</p>
                            ) : (
                                historyOrders.slice(0, 20).map((order: Order) => (
                                    <div key={order.id} className={`p-5 bg-white dark:bg-neutral-950 border ${order.status === 'cancelled' ? 'border-rose-100 dark:border-rose-900/30 bg-rose-50/20' : 'border-neutral-100 dark:border-neutral-900'} rounded-[2rem] flex items-center justify-between group hover:border-indigo-100 transition-colors`}>
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-xl ${order.status === 'cancelled' ? 'bg-rose-50 dark:bg-rose-500/5 text-rose-500' : 'bg-emerald-50 dark:bg-emerald-500/5 text-emerald-500'} flex items-center justify-center`}>
                                                {order.status === 'cancelled' ? <Trash2 className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-black text-neutral-900 dark:text-white uppercase tracking-tighter">
                                                    #{order.id} - {order.user?.name || 'Walk-in'} {order.table_number ? `(T-${order.table_number})` : ''}
                                                </span>
                                                <span className="text-[10px] font-bold text-neutral-400">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • ₱{Number(order.total_amount).toFixed(0)}</span>
                                            </div>
                                        </div>
                                        <Badge className={`${order.status === 'cancelled' ? 'bg-rose-100 dark:bg-rose-900 text-rose-500' : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-400'} border-none text-[8px] font-black uppercase px-2 rounded-full`}>
                                            {order.status === 'cancelled' ? 'CANCELLED' : 'SERVED'}
                                        </Badge>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

