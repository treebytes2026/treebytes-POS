import { useState, useMemo, useEffect } from 'react';
import AppLayout from '@/layouts/app-layout';
import { useSidebar } from '@/components/ui/sidebar';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { LucideIcon, Search, ShoppingCart, Trash2, Plus, Minus,
    ChevronRight, Hash, Utensils, LayoutGrid,
    Coffee, Pizza, Beef, Clock, Receipt, Maximize, Minimize
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'POS Terminal', href: '/restaurant/pos' },
];

const categoryIcons: Record<string, LucideIcon> = {
    'Drinks': Coffee,
    'Main': Pizza,
    'Dessert': Coffee,
    'Appetizer': Beef,
    'Default': LayoutGrid
};

interface Product {
    id: number;
    name: string;
    price: number | string;
    category_id: number;
    image?: string;
    category?: {
        name: string;
    };
}

interface OrderCategory {
    id: number;
    name: string;
}

interface CartItem extends Product {
    quantity: number;
}

interface Restaurant {
    name: string;
    logo: string | null;
}

interface OrderSnapshot {
    id: number;
    items: CartItem[];
    total: number;
    subtotal: number;
    type: string;
    payment: string;
    table: string;
    cashReceived: number;
    change: number;
    date: string;
}

interface KitchenSlipItem {
    name: string;
    quantity: number;
}

interface KitchenSlipData {
    order_id: number;
    table_number: string;
    items: KitchenSlipItem[];
    date: string;
    type: string;
    is_new: boolean;
}

export default function POS(props: { 
    categories: OrderCategory[]; 
    products: Product[]; 
    restaurant: Restaurant; 
    initialTable?: string; 
}) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Restaurant POS Terminal" />
            <POSContent {...props} />
        </AppLayout>
    );
}

function POSContent({ categories = [], products = [], restaurant, initialTable }: {
    categories: OrderCategory[];
    products: Product[];
    restaurant: Restaurant;
    initialTable?: string;
}) {
    const { props: pageProps } = usePage<{ flash: { kitchen_slip?: KitchenSlipData, success?: string, error?: string } }>();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState<number | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [showReceipt, setShowReceipt] = useState(false);
    const [showKitchenSlip, setShowKitchenSlip] = useState(false);
    const [showClearConfirm, setShowClearConfirm] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [lastOrder, setLastOrder] = useState<OrderSnapshot | null>(null);
    const [kitchenSlipData, setKitchenSlipData] = useState<KitchenSlipData | null>(null);
    const [cashReceived, setCashReceived] = useState<number | string>('');

    const { data, setData, post, processing, reset } = useForm({
        cart: [] as { id: number; quantity: number }[],
        order_type: initialTable ? 'dine_in' : 'dine_in',
        table_number: initialTable || '',
        payment_method: 'cash',
        notes: '',
    });

    // Listen for kitchen slip flash data
    useEffect(() => {
        if (pageProps.flash?.kitchen_slip) {
            setKitchenSlipData(pageProps.flash.kitchen_slip);
            setShowKitchenSlip(true);
            // Clear the basket on success
            setCart([]);
            reset();
        }
    }, [pageProps.flash, reset]);

    const filteredProducts = useMemo(() => {
        if (!Array.isArray(products)) return [];
        return products.filter((p: Product) => {
            if (!p) return false;
            const name = p.name || 'Unnamed Product';
            const matchesSearch = name.toLowerCase().includes((searchTerm || '').toLowerCase());
            const matchesCategory = activeCategory ? p.category_id === activeCategory : true;
            return matchesSearch && matchesCategory;
        });
    }, [products, searchTerm, activeCategory]);

    const cartSubtotal = useMemo(() => {
        try {
            return cart.reduce((sum, item) => sum + (Number(item?.price || 0) * (item?.quantity || 1)), 0);
        } catch (e) {
            console.error("Cart total error", e);
            return 0;
        }
    }, [cart]);

    const cartTax = cartSubtotal * 0;
    const cartTotal = cartSubtotal + cartTax;
    const changeAmount = Number(cashReceived) > 0 ? Number(cashReceived) - cartTotal : 0;

    const appendCash = (val: string) => {
        if (val === 'C') {
            setCashReceived('');
        } else if (val === '.') {
            if (!cashReceived.toString().includes('.')) {
                setCashReceived(prev => prev.toString() + '.');
            }
        } else {
            setCashReceived(prev => (prev === '0' || prev === 0 ? '' : prev.toString()) + val);
        }
    };

    const setQuickCash = (amount: number) => {
        setCashReceived((Number(cashReceived || 0) + amount).toString());
    };

    // Sync cart to form data whenever it changes
    useEffect(() => {
        if (typeof setData === 'function') {
            setData('cart', cart.map(item => ({ id: item.id, quantity: item.quantity })));
        }
    }, [cart, setData]);

    const addToCart = (product: Product) => {
        if (!product || !product.id) return;

        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            }
            return [...prev, { ...product, quantity: 1 }];
        });

        try {
            toast.success(`Added ${product.name || 'item'}`);
        } catch (e) {
            console.warn("Toast failed", e);
        }
    };

    const updateQuantity = (id: number, delta: number) => {
        setCart(prev => {
            return prev.map(item => {
                if (item.id === id) {
                    const newQty = Math.max(1, item.quantity + delta);
                    return { ...item, quantity: newQty };
                }
                return item;
            });
        });
    };

    const removeFromCart = (id: number) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const handleCheckout = (e: React.FormEvent) => {
        e.preventDefault();
        if (cart.length === 0) return;

        post(route('restaurant.process-order'), {
            onSuccess: () => {
                const orderSnapshot = {
                    id: Math.floor(Math.random() * 900000) + 100000,
                    items: [...cart],
                    total: cartTotal,
                    subtotal: cartSubtotal,
                    type: data.order_type,
                    payment: data.payment_method,
                    table: data.table_number,
                    cashReceived: Number(cashReceived),
                    change: changeAmount,
                    date: new Date().toLocaleString(),
                };
                setLastOrder(orderSnapshot);
                setCart([]);
                setCashReceived('');
                reset();
                setShowReceipt(true);
                toast.success('ORDER PLACED!', {
                    description: `Transaction completed for ₱${Number(cartTotal).toFixed(2)}`,
                    className: 'bg-emerald-50 dark:bg-emerald-950 border-emerald-200 text-emerald-900 dark:text-emerald-100 font-bold'
                });
            },
            onError: () => toast.error('Check order details!'),
        });
    };

    useSidebar();

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    return (
        <div className={`flex h-screen overflow-hidden transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-60 bg-white dark:bg-neutral-950 max-h-screen' : 'relative bg-neutral-50/50 dark:bg-neutral-950 max-h-[calc(100vh-4rem)]'}`}>
            <div className="flex-1 flex flex-col min-w-0 border-r border-neutral-200 dark:border-neutral-800">
                <div className="p-6 bg-white dark:bg-neutral-900 space-y-6 shadow-sm z-10">
                    <div className="flex items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <Input
                                placeholder="Search products..."
                                className="pl-12 h-12 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border-none ring-1 ring-neutral-200 dark:ring-neutral-800 focus-visible:ring-2 focus-visible:ring-indigo-500 font-medium"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-neutral-400 bg-neutral-50 dark:bg-neutral-950 px-4 py-2 rounded-xl border border-neutral-100 dark:border-neutral-800">
                            <Clock className="w-4 h-4" />
                            <span className="text-xs font-black uppercase tracking-tighter tabular-nums">
                                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-2 px-2 no-scrollbar">
                        <button
                            onClick={() => setActiveCategory(null)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeCategory === null ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:border-indigo-200'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            All Menu
                        </button>
                        {(categories || []).map((cat: OrderCategory) => {
                            if (!cat) return null;
                            const Icon = categoryIcons[cat.name] || categoryIcons.Default;
                            return (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all whitespace-nowrap border-2 ${activeCategory === cat.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:border-indigo-200'}`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {cat.name}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-12">
                        {filteredProducts.map((product: Product) => (
                            <Card
                                key={product.id}
                                className="group cursor-pointer hover:ring-2 hover:ring-indigo-500 transition-all shadow-sm hover:shadow-xl overflow-hidden bg-white dark:bg-neutral-900 border-none rounded-[2rem] flex flex-col active:scale-95"
                                onClick={() => addToCart(product)}
                            >
                                <div className="aspect-square bg-neutral-100 dark:bg-neutral-950 relative overflow-hidden">
                                    {product.image ? (
                                        <img src={`/storage/${product.image}`} alt={product.name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-neutral-200">
                                            <Utensils className="w-12 h-12 opacity-10" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent flex items-end p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-full h-10 bg-white/90 dark:bg-neutral-800/90 backdrop-blur rounded-xl flex items-center justify-center gap-2 text-indigo-600 font-black text-xs uppercase">
                                            <Plus className="w-3 h-3" /> Quick Add
                                        </div>
                                    </div>
                                </div>
                                <CardContent className="p-5 flex-1 flex flex-col">
                                    <h3 className="font-black text-neutral-900 dark:text-neutral-50 text-sm leading-tight line-clamp-2 min-h-[2.5rem] mb-1">{product.name}</h3>
                                    <div className="mt-auto flex items-center justify-between">
                                        <span className="text-[10px] text-neutral-400 font-black uppercase tracking-widest">{product.category?.name || 'Main'}</span>
                                        <span className="font-black text-indigo-600 dark:text-indigo-400 text-lg">₱{product.price}</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-[480px] flex flex-col bg-white dark:bg-neutral-900 shadow-2xl z-20">
                <form onSubmit={handleCheckout} className="flex flex-col h-full">
                    <div className="px-8 py-5 space-y-3 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                                    <Receipt className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-black text-neutral-900 dark:text-white leading-none">Checkout</h2>
                                    <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mt-1">TXN-#{Math.floor(Date.now() / 100000)}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-neutral-300 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-xl transition-colors" onClick={toggleFullscreen}>
                                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                                </Button>
                                <Button type="button" variant="ghost" size="icon" className="h-10 w-10 text-neutral-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors" onClick={() => setShowClearConfirm(true)}>
                                    <Trash2 className="w-5 h-5" />
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex bg-white dark:bg-neutral-900 p-1 rounded-xl border border-neutral-100 dark:border-neutral-800">
                                <button
                                    type="button"
                                    onClick={() => setData('order_type', 'dine_in')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${data.order_type === 'dine_in' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'text-neutral-400'}`}
                                >
                                    <Utensils className="w-3 h-3" /> Dine
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setData('order_type', 'take_out')}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-[10px] font-black uppercase rounded-lg transition-all ${data.order_type === 'take_out' ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600' : 'text-neutral-400'}`}
                                >
                                    <ShoppingCart className="w-3 h-3" /> Take
                                </button>
                            </div>
                            <div className="relative">
                                <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-neutral-300" />
                                <Input
                                    placeholder="Table"
                                    className="h-10 pl-8 rounded-xl bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800 text-[10px] font-black placeholder:text-neutral-300"
                                    value={data.table_number}
                                    onChange={e => setData('table_number', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col min-h-0">
                        <div className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin scrollbar-thumb-neutral-100 dark:scrollbar-thumb-neutral-800">
                            {cart.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-neutral-200 gap-4 py-20 animate-pulse">
                                    <ShoppingCart className="w-16 h-16 stroke-1" />
                                    <p className="font-black text-sm text-neutral-300 uppercase tracking-widest text-center italic leading-relaxed">Basket is Empty<br /><span className="text-[10px] opacity-50">Select items to begin checkout</span></p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between px-1 mb-2">
                                        <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2 italic">
                                            Order List ({cart.length})
                                        </h3>
                                        <div className="h-[1px] flex-1 ml-4 bg-neutral-100 dark:bg-neutral-800" />
                                    </div>
                                    {cart.map((item: CartItem) => (
                                        <div key={item.id} className="relative group bg-white dark:bg-neutral-950 p-3 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm transition-all flex items-center gap-3 hover:border-indigo-100 dark:hover:border-indigo-900/50 hover:shadow-md">
                                            <div className="w-10 h-10 rounded-xl bg-neutral-50 dark:bg-neutral-900 flex items-center justify-center overflow-hidden flex-shrink-0 border border-neutral-100 dark:border-neutral-800">
                                                {item.image ? (
                                                    <img src={`/storage/${item.image}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <Utensils className="w-4 h-4 text-neutral-200" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-black text-[12px] text-neutral-900 dark:text-white truncate uppercase tracking-tight">{item.name}</h4>
                                                <p className="text-[9px] text-neutral-400 font-bold">PT {Number(item.price || 0).toFixed(0)}</p>
                                            </div>
                                            <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-neutral-900 p-1 rounded-xl border border-neutral-100 dark:border-neutral-800">
                                                <button type="button" onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-rose-500 rounded-lg transition-colors"><Minus className="w-2.5 h-2.5" /></button>
                                                <span className="w-4 text-center font-black text-xs tabular-nums">{item.quantity}</span>
                                                <button type="button" onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 flex items-center justify-center text-neutral-400 hover:text-indigo-600 rounded-lg transition-colors"><Plus className="w-2.5 h-2.5" /></button>
                                            </div>
                                            <div className="text-right ml-1">
                                                <span className="font-black text-xs text-indigo-600 dark:text-indigo-400 block min-w-[50px]">₱{(Number(item.price || 0) * item.quantity).toLocaleString()}</span>
                                            </div>
                                            <button type="button" onClick={() => removeFromCart(item.id)} className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg scale-75 group-hover:scale-100">
                                                <Trash2 className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-6 bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800 space-y-4 shadow-[0_-10px_20px_-15px_rgba(0,0,0,0.1)]">
                            <div className="flex items-center justify-between px-1">
                                <label className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Payment</label>
                                <div className="flex gap-2">
                                    {['cash', 'gcash', 'card'].map((method) => (
                                        <button
                                            key={method}
                                            type="button"
                                            onClick={() => setData('payment_method', method)}
                                            className={`px-3 py-1.5 text-[9px] font-black uppercase rounded-lg border-2 transition-all ${data.payment_method === method ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'border-neutral-100 dark:border-neutral-800 text-neutral-400 hover:bg-neutral-50'}`}
                                        >
                                            {method}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="p-5 bg-neutral-50 dark:bg-neutral-900 rounded-[2.5rem] border border-neutral-100 dark:border-neutral-800 space-y-4 shadow-inner">
                                <div className="flex items-center justify-between border-b border-neutral-200/50 dark:border-neutral-800/50 pb-3">
                                    <div className="flex flex-col">
                                        <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest leading-none">Total Bill</span>
                                        <span className="text-2xl font-black text-neutral-900 dark:text-white mt-1">₱{cartTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">Change Due</span>
                                        <span className="text-2xl font-black text-emerald-500 mt-1">₱{changeAmount.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-1">
                                    {[50, 100, 200, 500, 1000].map(amt => (
                                        <Button key={amt} type="button" variant="outline" onClick={() => setQuickCash(amt)} className="h-8 px-4 rounded-xl border-indigo-100 text-indigo-600 font-black text-[9px] flex-shrink-0 active:scale-95 transition-all outline-none">+₱{amt}</Button>
                                    ))}
                                </div>

                                <div className="grid grid-cols-4 gap-1.5">
                                    {[1, 2, 3, 'C', 4, 5, 6, '0', 7, 8, 9, '.'].map(key => (
                                        <Button
                                            key={key}
                                            type="button"
                                            variant={key === 'C' ? 'destructive' : 'secondary'}
                                            onClick={() => appendCash(key.toString())}
                                            className={`h-11 rounded-2xl font-black text-xs shadow-sm transition-all active:scale-95 ${key === 'C' ? 'bg-rose-500 hover:bg-rose-600 text-white' : 'bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700'}`}
                                        >
                                            {key}
                                        </Button>
                                    ))}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={cart.length === 0 || processing}
                                className="w-full h-16 rounded-[2rem] bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-2xl shadow-indigo-500/40 flex items-center justify-between px-8 group active:scale-[0.98] transition-all"
                            >
                                <div className="flex flex-col items-start gap-0.5">
                                    <span className="text-[9px] font-black uppercase opacity-60 tracking-widest leading-none">Confirmation</span>
                                    <span className="leading-none tracking-tight">Place Order</span>
                                </div>
                                <ChevronRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
            <ReceiptModal open={showReceipt} onOpenChange={setShowReceipt} order={lastOrder} restaurant={restaurant} />
            <KitchenSlipModal open={showKitchenSlip} onOpenChange={setShowKitchenSlip} data={kitchenSlipData} />
            <ClearConfirmModal 
                open={showClearConfirm} 
                onOpenChange={setShowClearConfirm} 
                onConfirm={() => {
                    setCart([]);
                    reset();
                    setShowClearConfirm(false);
                }} 
            />
        </div>
    );
}

function ClearConfirmModal({ open, onOpenChange, onConfirm }: { open: boolean, onOpenChange: (v: boolean) => void, onConfirm: () => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[360px] p-0 overflow-hidden border border-neutral-200 dark:border-neutral-800 rounded-[2rem] bg-white dark:bg-neutral-950 shadow-2xl [&>button]:hidden">
                <div className="p-8 space-y-6 text-center">
                    <div className="w-20 h-20 bg-rose-50 dark:bg-rose-500/10 rounded-full flex items-center justify-center mx-auto ring-8 ring-rose-50 dark:ring-rose-500/5">
                        <Trash2 className="w-8 h-8 text-rose-500" />
                    </div>
                    
                    <div className="space-y-2">
                        <h2 className="text-2xl font-black text-neutral-900 dark:text-white tracking-tight uppercase">Clear Basket?</h2>
                        <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 leading-relaxed px-4">
                            This will remove all items currently in your basket. This action cannot be undone.
                        </p>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <Button 
                            variant="outline" 
                            className="flex-1 h-12 rounded-xl font-black text-[11px] uppercase tracking-widest text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 transition-all active:scale-95"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        <Button 
                            className="flex-1 h-12 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-rose-500/20 transition-all active:scale-95"
                            onClick={onConfirm}
                        >
                            Clear All
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function ReceiptModal({ open, onOpenChange, order, restaurant }: { open: boolean, onOpenChange: (v: boolean) => void, order: OrderSnapshot | null, restaurant: Restaurant }) {
    if (!order) return null;

    const handlePrint = () => {
        const printContent = document.getElementById('printable-receipt');
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const logoUrl = restaurant?.logo ? (restaurant.logo.startsWith('http') || restaurant.logo.startsWith('/storage') ? restaurant.logo : `/storage/${restaurant.logo}`) : '';

        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Receipt</title>
                    <style>
                        body { 
                            font-family: monospace; 
                            width: 80mm; 
                            margin: 0; 
                            padding: 10mm;
                            color: black;
                        }
                        .text-center { text-align: center; }
                        .flex { display: flex; }
                        .justify-between { justify-content: space-between; }
                        .font-black { font-weight: 900; }
                        .uppercase { text-transform: uppercase; }
                        .mb-1 { margin-bottom: 0.25rem; }
                        .mb-2 { margin-bottom: 0.5rem; }
                        .mb-3 { margin-bottom: 0.75rem; }
                        .mb-4 { margin-bottom: 1rem; }
                        .mb-6 { margin-bottom: 1.5rem; }
                        .my-4 { margin: 1rem 0; }
                        .border-t { border-top: 1px dashed #ccc; }
                        .text-xl { font-size: 1.25rem; }
                        .text-base { font-size: 1rem; }
                        .text-[10px] { font-size: 10px; }
                        .text-[11px] { font-size: 11px; }
                        .opacity-70 { opacity: 0.7; }
                        .opacity-50 { opacity: 0.5; }
                        .leading-tight { line-height: 1.25; }
                        .space-y-2 > * + * { margin-top: 0.5rem; }
                        .space-y-3 > * + * { margin-top: 0.75rem; }
                        img { width: 64px; height: 64px; object-fit: contain; margin-bottom: 0.75rem; }
                    </style>
                </head>
                <body>
                    <div class="text-center" style="display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 2rem;">
                        ${logoUrl ? `<img src="${logoUrl}" alt="Logo" style="margin-bottom: 1rem;" />` : ''}
                        <h3 class="font-black text-xl uppercase" style="margin: 0; padding: 0;">${restaurant?.name || 'TreeBytes Restaurant'}</h3>
                        <p class="text-[10px] opacity-70" style="margin: 0.25rem 0;">POS-TERMINAL-1</p>
                        <p class="text-[10px] opacity-70" style="margin: 0;">${order.date}</p>
                    </div>

                    <div class="border-t my-4"></div>

                    <div class="flex justify-between text-[11px] mb-2">
                        <span class="font-black">ORDER ID:</span>
                        <span>#${order.id}</span>
                    </div>
                    <div class="flex justify-between text-[11px] mb-4">
                        <span class="font-black">SERVICE:</span>
                        <span class="uppercase">${order.type} ${order.table ? `(T-${order.table})` : ''}</span>
                    </div>

                    <div class="border-t my-4"></div>

                    <div class="space-y-3 mb-6">
                        ${order.items.map((item: CartItem) => `
                            <div class="flex justify-between text-[11px] leading-tight">
                                <span style="flex: 1; margin-right: 1rem;">${item.quantity}x ${item.name}</span>
                                <span class="font-black">₱${(Number(item.price) * item.quantity).toFixed(2)}</span>
                            </div>
                        `).join('')}
                    </div>

                    <div class="border-t my-4"></div>

                    <div class="space-y-2">
                        <div class="flex justify-between text-[11px]">
                            <span>SUBTOTAL:</span>
                            <span>₱${Number(order.subtotal).toFixed(2)}</span>
                        </div>
                        <div class="flex justify-between text-base font-black" style="border-top: 1px solid #eee; padding-top: 0.5rem; margin-top: 0.5rem;">
                            <span>TOTAL:</span>
                            <span>₱${Number(order.total).toFixed(2)}</span>
                        </div>
                        ${order.cashReceived ? `
                            <div class="flex justify-between text-[11px]" style="margin-top: 1rem;">
                                <span>CASH TENDERED:</span>
                                <span>₱${Number(order.cashReceived).toFixed(2)}</span>
                            </div>
                            <div class="flex justify-between text-[11px] font-black">
                                <span>CHANGE:</span>
                                <span>₱${Number(order.change).toFixed(2)}</span>
                            </div>
                        ` : ''}
                    </div>

                    <div class="mt-8 text-center" style="margin-top: 2rem;">
                        <p class="text-[10px] font-black uppercase mb-1">Thank You!</p>
                        <p class="text-[8px] opacity-50 uppercase">Visit treebytes.com for more</p>
                    </div>
                    <script>
                        setTimeout(() => {
                            window.print();
                            window.close();
                        }, 500);
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[350px] bg-white dark:bg-neutral-900 p-0 overflow-hidden border-none shadow-2xl rounded-[2rem]">
                <div id="printable-receipt" className="p-8 font-mono text-neutral-800 dark:text-neutral-200">
                    <div className="flex flex-col items-center text-center mb-6">
                        {restaurant?.logo && (
                            <img
                                src={restaurant.logo.startsWith('http') || restaurant.logo.startsWith('/storage') ? restaurant.logo : `/storage/${restaurant.logo}`}
                                alt="Logo"
                                className="w-16 h-16 object-contain rounded-xl mb-3"
                            />
                        )}
                        <h3 className="font-black text-xl tracking-tighter uppercase mb-1">{restaurant?.name || 'TreeBytes Restaurant'}</h3>
                        <p className="text-[10px] opacity-70">POS-TERMINAL-1</p>
                        <p className="text-[10px] opacity-70">{order.date}</p>
                    </div>

                    <div className="border-t border-dashed border-neutral-300 dark:border-neutral-700 my-4" />

                    <div className="flex justify-between text-[11px] mb-2">
                        <span className="font-bold">ORDER ID:</span>
                        <span>#{order.id}</span>
                    </div>
                    <div className="flex justify-between text-[11px] mb-4">
                        <span className="font-bold">SERVICE:</span>
                        <span className="uppercase">{order.type} {order.table ? `(T-${order.table})` : ''}</span>
                    </div>

                    <div className="border-t border-dashed border-neutral-300 dark:border-neutral-700 my-4" />

                    <div className="space-y-3 mb-6">
                        {order.items.map((item: CartItem, idx: number) => (
                            <div key={idx} className="flex justify-between text-[11px] leading-tight">
                                <span className="flex-1 mr-4">{item.quantity}x {item.name}</span>
                                <span className="font-bold">₱{(Number(item.price) * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-dashed border-neutral-300 dark:border-neutral-700 my-4" />

                    <div className="space-y-2">
                        <div className="flex justify-between text-[11px]">
                            <span>SUBTOTAL:</span>
                            <span>₱{Number(order.subtotal).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base font-black border-t border-neutral-100 dark:border-neutral-800 pt-2">
                            <span>TOTAL:</span>
                            <span>₱{Number(order.total).toFixed(2)}</span>
                        </div>
                        {order.cashReceived > 0 && (
                            <>
                                <div className="flex justify-between text-[11px] mt-4 opacity-70">
                                    <span>CASH TENDERED:</span>
                                    <span>₱{Number(order.cashReceived).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-black">
                                    <span>CHANGE:</span>
                                    <span>₱{Number(order.change).toFixed(2)}</span>
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Thank You!</p>
                        <p className="text-[8px] opacity-50 uppercase tracking-tighter">Visit treebytes.com for more</p>
                    </div>
                </div>

                <div className="p-6 bg-neutral-50 dark:bg-neutral-950 flex flex-col gap-2 no-print">
                    <Button onClick={handlePrint} className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase text-xs tracking-widest gap-2">
                        <Receipt className="w-4 h-4" /> Print Receipt
                    </Button>
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full h-12 rounded-xl border-neutral-200 font-bold text-xs uppercase text-neutral-500">
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

function KitchenSlipModal({ open, onOpenChange, data }: { open: boolean, onOpenChange: (v: boolean) => void, data: KitchenSlipData | null }) {
    if (!data) return null;

    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Kitchen Slip</title>
                    <style>
                        body { font-family: monospace; width: 80mm; margin: 0; padding: 10mm; color: black; }
                        .text-center { text-align: center; }
                        .font-black { font-weight: 900; }
                        .uppercase { text-transform: uppercase; }
                        .mb-4 { margin-bottom: 1rem; }
                        .my-4 { margin: 1rem 0; }
                        .border-t { border-top: 1px dashed #000; }
                        .text-xl { font-size: 1.5rem; }
                        .text-2xl { font-size: 2rem; }
                    </style>
                </head>
                <body>
                    <div class="text-center mb-4">
                        <h1 class="font-black text-xl uppercase">KITCHEN SLIP</h1>
                        <p class="font-black text-2xl">TABLE: ${data.table_number || 'N/A'}</p>
                        <p style="font-size: 10px;">Order #${data.order_id} | ${data.date}</p>
                    </div>
                    <div class="border-t my-4"></div>
                    <div style="font-size: 14px; font-weight: bold;">
                        ${data.items.map((item: KitchenSlipItem) => `
                            <div style="display: flex; justify-between: space-between; margin-bottom: 8px;">
                                <span style="font-size: 20px;">${item.quantity}x ${item.name}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="border-t my-4"></div>
                    <div class="text-center">
                        <p class="uppercase font-black">${data.is_new ? 'NEW ORDER' : 'ADDITIONAL ITEMS'}</p>
                    </div>
                    <script>
                        setTimeout(() => {
                            window.print();
                            window.close();
                        }, 500);
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[400px] border-none shadow-2xl rounded-[2rem] p-0 overflow-hidden bg-white dark:bg-neutral-900">
                <div className="p-8 text-center space-y-6">
                    <div className="w-20 h-20 bg-orange-50 dark:bg-orange-500/10 rounded-full flex items-center justify-center mx-auto">
                        <Utensils className="w-10 h-10 text-orange-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-neutral-900 dark:text-white uppercase tracking-tight">Kitchen Slip Ready</h2>
                        <p className="text-sm font-bold text-neutral-500 dark:text-neutral-400 mt-2">Only newly added items will be printed for the chef.</p>
                    </div>
                    <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-left">
                        <p className="text-[10px] font-black uppercase text-neutral-400 mb-2">Items to Print:</p>
                        {data.items.map((item: KitchenSlipItem, i: number) => (
                            <div key={i} className="flex justify-between font-bold text-sm">
                                <span>{item.quantity}x {item.name}</span>
                            </div>
                        ))}
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button variant="outline" className="flex-1 h-12 rounded-xl font-black text-[11px] uppercase" onClick={() => onOpenChange(false)}>Dismiss</Button>
                        <Button className="flex-1 h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black text-[11px] uppercase shadow-lg shadow-orange-500/20" onClick={handlePrint}>Print to Kitchen</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

