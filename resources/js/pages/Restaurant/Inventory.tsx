import { useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Package, AlertTriangle, Plus, MoreVertical, Edit, Trash2, Zap, Camera, Image as ImageIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Inventory', href: '/restaurant/inventory' },
];

interface InventoryItem {
    quantity: number;
    reorder_level: number;
}

interface Ingredient {
    id: number;
    name: string;
    unit: string;
    photo: string | null;
    inventory?: InventoryItem;
}

export default function Inventory({ ingredients = [] }: { ingredients: Ingredient[] }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editIngredient, setEditIngredient] = useState<Ingredient | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, reset, processing } = useForm({
        name: '',
        unit: 'kg',
        quantity: 0,
        reorder_level: 5,
        photo: null as File | null,
    });

    const lowStockItems = ingredients.filter((ing: Ingredient) => (ing.inventory?.quantity || 0) <= (ing.inventory?.reorder_level || 0));

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('photo', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('restaurant.ingredients.store'), {
            onSuccess: () => {
                setIsAddOpen(false);
                reset();
                setPreviewImage(null);
                toast.success('Ingredient added to inventory');
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editIngredient) return;
        // Method spoofing for file upload in standard Inertia post
        router.post(route('restaurant.ingredients.update', editIngredient.id), {
            _method: 'put',
            ...data
        }, {
            onSuccess: () => {
                setEditIngredient(null);
                reset();
                setPreviewImage(null);
                toast.success('Ingredient updated');
            },
        });
    };

    const deleteIngredient = (id: number) => {
        if (confirm('Are you sure you want to remove this ingredient?')) {
            router.delete(route('restaurant.ingredients.destroy', id), {
                onSuccess: () => toast.success('Ingredient removed'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Kitchen Inventory" />
            <div className="p-6 flex flex-col gap-8 mx-auto w-full max-w-[1200px]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 text-amber-600">Kitchen Inventory</h1>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage food stock and track required reorders visually.</p>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)} className="bg-amber-600 hover:bg-amber-700 h-11 px-6 rounded-xl shadow-lg shadow-amber-500/10">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Ingredient
                    </Button>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className="bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden group hover:border-amber-200 transition-all">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Low Stock Triggers</p>
                                <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-50">{lowStockItems.length} Warnings</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 shadow-sm rounded-2xl overflow-hidden group hover:border-indigo-200 transition-all">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                                <Package className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Total Catalog</p>
                                <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-50">{ingredients.length} Items</h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm overflow-hidden rounded-[2.5rem]">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-[10px] font-black uppercase bg-neutral-50 dark:bg-neutral-900 text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
                                <tr>
                                    <th className="px-10 py-6">Visual Identifier & Name</th>
                                    <th className="px-10 py-6 text-center">Measurement</th>
                                    <th className="px-10 py-6 text-center">Available Stock</th>
                                    <th className="px-10 py-6 text-center">Alert Level</th>
                                    <th className="px-10 py-6 text-center">Current Status</th>
                                    <th className="px-10 py-6 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-50 dark:divide-neutral-900">
                                {ingredients.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-10 py-24 text-center">
                                            <div className="flex flex-col items-center gap-3 opacity-20">
                                                <Zap className="w-20 h-20 text-neutral-400" />
                                                <p className="font-black text-xl text-neutral-900">No stock found</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    ingredients.map((ing: Ingredient) => {
                                        const qty = ing.inventory?.quantity || 0;
                                        const reorder = ing.inventory?.reorder_level || 0;
                                        const isLow = qty <= reorder;

                                        return (
                                            <tr key={ing.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition-all group">
                                                <td className="px-10 py-5">
                                                    <div className="flex items-center gap-4">
                                                        <Avatar className="h-14 w-14 rounded-2xl border-2 border-neutral-100 dark:border-neutral-900 shadow-sm overflow-hidden group-hover:scale-105 transition-transform duration-300">
                                                            <AvatarImage src={ing.photo ? `/storage/${ing.photo}` : ''} className="object-cover" />
                                                            <AvatarFallback className="bg-neutral-50 dark:bg-neutral-900 text-neutral-400 font-bold text-lg uppercase">
                                                                {(ing.name || '??').substring(0, 2)}
                                                            </AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <span className="font-black text-neutral-900 dark:text-neutral-50 block text-base leading-none">{ing.name}</span>
                                                            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mt-1 inline-block">Ref: {ing.id.toString().padStart(4, '0')}</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-10 py-5 text-center">
                                                    <Badge variant="outline" className="rounded-lg border-neutral-100 dark:border-neutral-800 font-bold text-neutral-500 capitalize">{ing.unit}</Badge>
                                                </td>
                                                <td className="px-10 py-5 text-center font-black text-xl text-indigo-600 dark:text-indigo-400">{qty}</td>
                                                <td className="px-10 py-5 text-center text-neutral-400 font-bold tracking-tight">{reorder}</td>
                                                <td className="px-10 py-5 text-center">
                                                    {isLow ? (
                                                        <span className="bg-rose-50 text-rose-600 text-[10px] font-black px-4 py-1.5 rounded-full border border-rose-100 uppercase tracking-wider">Low Stock</span>
                                                    ) : (
                                                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-4 py-1.5 rounded-full border border-emerald-100 uppercase tracking-wider">Stable</span>
                                                    )}
                                                </td>
                                                <td className="px-10 py-5 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-10 w-10 text-neutral-400 hover:bg-neutral-100 rounded-xl">
                                                                <MoreVertical className="w-5 h-5" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end" className="rounded-2xl border-neutral-100 shadow-xl p-2 w-48">
                                                            <DropdownMenuItem className="rounded-xl h-10 font-bold text-sm" onClick={() => {
                                                                setEditIngredient(ing);
                                                                setData({
                                                                    name: ing.name,
                                                                    unit: ing.unit,
                                                                    quantity: ing.inventory?.quantity || 0,
                                                                    reorder_level: ing.inventory?.reorder_level || 0,
                                                                    photo: null,
                                                                });
                                                                setPreviewImage(ing.photo ? `/storage/${ing.photo}` : null);
                                                            }}>
                                                                <Edit className="w-4 h-4 mr-2" /> Modify Records
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem className="rounded-xl h-10 font-bold text-sm text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => deleteIngredient(ing.id)}>
                                                                <Trash2 className="w-4 h-4 mr-2" /> Delete Item
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Modals */}
            <Dialog open={isAddOpen || !!editIngredient} onOpenChange={(open) => { if(!open) { setIsAddOpen(false); setEditIngredient(null); reset(); setPreviewImage(null); } }}>
                <DialogContent className="sm:max-w-[480px] rounded-[2.5rem] p-10">
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-black tracking-tight">{editIngredient ? 'Update Record' : 'New Ingredient'}</DialogTitle>
                        <DialogDescription className="text-sm font-medium">Detailed specifications for kitchen stock management.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={editIngredient ? submitEdit : submitAdd} className="space-y-8 mt-8">
                        <div className="flex flex-col items-center gap-6">
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className="w-32 h-32 rounded-[2rem] border-4 border-dashed border-neutral-100 dark:border-neutral-800 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-all overflow-hidden relative group shadow-inner"
                            >
                                {previewImage ? (
                                    <>
                                        <img src={previewImage} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Camera className="text-white w-6 h-6" />
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-neutral-300 gap-1">
                                        <ImageIcon className="w-8 h-8 opacity-30" />
                                        <p className="text-[10px] font-black uppercase">Upload</p>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handlePhotoChange} />
                            </div>
                        </div>

                        <div className="grid gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Label Name</label>
                                <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. Ground Beef" className="h-14 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-none px-6 font-bold" />
                            </div>
                            <div className="grid grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Metric Unit</label>
                                    <select value={data.unit} onChange={e => setData('unit', e.target.value)} className="w-full h-14 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-none px-6 text-sm font-bold uppercase tracking-wider">
                                        <option value="kg">kilograms</option>
                                        <option value="g">grams</option>
                                        <option value="l">liters</option>
                                        <option value="ml">milliliters</option>
                                        <option value="pcs">pieces</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Initial Stock</label>
                                    <Input type="number" step="0.01" value={data.quantity} onChange={e => setData('quantity', Number(e.target.value))} className="h-14 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-none px-6 font-black text-indigo-600" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Critical Stock Level Warning</label>
                                <Input type="number" step="0.01" value={data.reorder_level} onChange={e => setData('reorder_level', Number(e.target.value))} className="h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 border-none px-6 font-black text-rose-500" />
                            </div>
                        </div>
                        <DialogFooter className="pt-4 flex !justify-center gap-3">
                            <Button type="button" variant="ghost" onClick={() => { setIsAddOpen(false); setEditIngredient(null); reset(); setPreviewImage(null); }} className="rounded-2xl h-14 flex-1">Back</Button>
                            <Button type="submit" disabled={processing} className="bg-amber-600 hover:bg-amber-700 h-14 rounded-2xl font-black text-white flex-[2] shadow-xl shadow-amber-500/30 tracking-wide">
                                {editIngredient ? 'Save Changes' : 'Confirm Stock'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
