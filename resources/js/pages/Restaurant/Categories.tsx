import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Edit, Trash2, Folder, Layers, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Categories', href: '/restaurant/categories' },
];

interface Category {
    id: number;
    name: string;
    products_count?: number;
}

export default function Categories({ categories = [] }: { categories: Category[] }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);

    const { data, setData, post, put, delete: destroy, processing, reset, errors } = useForm({
        name: '',
    });

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('restaurant.categories.store'), {
            onSuccess: () => {
                setIsAddOpen(false);
                reset();
                toast.success('Category added successfully');
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editCategory) return;
        put(route('restaurant.categories.update', editCategory.id), {
            onSuccess: () => {
                setEditCategory(null);
                reset();
                toast.success('Category updated successfully');
            },
        });
    };

    const deleteCategory = (id: number) => {
        if (confirm('Are you sure? All products in this category will be affected.')) {
            destroy(route('restaurant.categories.destroy', id), {
                onSuccess: () => toast.success('Category deleted'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Categories" />
            <div className="p-6 flex flex-col gap-8 mx-auto w-full max-w-[1200px]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 text-emerald-600">Categories</h1>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-1">Organize your menu items into logical groups for better management.</p>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 h-11 px-6 rounded-xl shadow-lg shadow-emerald-500/10">
                        <Plus className="w-4 h-4 mr-2" />
                        New Category
                    </Button>
                </div>

                {categories.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 bg-neutral-50 dark:bg-neutral-950/50 rounded-[2rem] border-2 border-dashed border-neutral-200 dark:border-neutral-800 gap-6">
                        <div className="w-24 h-24 bg-white dark:bg-neutral-900 rounded-3xl shadow-sm flex items-center justify-center">
                            <Layers className="w-12 h-12 text-emerald-500 opacity-30" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Start Organizing</h2>
                            <p className="text-neutral-500 max-w-[300px] mt-2">Create categories like "Appetizers", "Main Course", or "Drinks" to group your products.</p>
                        </div>
                        <Button onClick={() => setIsAddOpen(true)} className="bg-emerald-600">
                             Create First Category
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {categories.map((cat: Category) => (
                            <Card key={cat.id} className="group hover:border-emerald-300 transition-all border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden bg-white dark:bg-neutral-950 rounded-[1.5rem]">
                                <CardContent className="p-6 flex flex-col">
                                    <div className="flex items-start justify-between">
                                        <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform duration-300">
                                            <Folder className="w-7 h-7" />
                                        </div>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="rounded-xl">
                                                <DropdownMenuItem onClick={() => { setEditCategory(cat); setData('name', cat.name); }}>
                                                    <Edit className="w-4 h-4 mr-2" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-rose-600" onClick={() => deleteCategory(cat.id)}>
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                    <h3 className="text-2xl font-black text-neutral-900 dark:text-neutral-50 tracking-tight leading-tight">{cat.name}</h3>
                                    <div className="mt-6 pt-4 border-t border-neutral-50 dark:border-neutral-900 flex items-center gap-2">
                                        <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-full text-[10px] font-black uppercase text-emerald-600 tracking-wider">
                                            {cat.products_count || 0} Products
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Add Modal */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">New Category</DialogTitle>
                        <DialogDescription>Define a name for your item grouping.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitAdd} className="space-y-6 mt-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Category Name</label>
                            <Input 
                                placeholder="e.g. Desserts" 
                                className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none px-4 font-medium"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-xs text-rose-500 ml-1">{errors.name}</p>}
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl px-6">Cancel</Button>
                            <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 rounded-xl font-bold shadow-lg shadow-emerald-500/20">
                                Create Category
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Edit Modal */}
            <Dialog open={!!editCategory} onOpenChange={() => setEditCategory(null)}>
                <DialogContent className="sm:max-w-[425px] rounded-3xl p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Rename Category</DialogTitle>
                        <DialogDescription>Change how this group is identified in the menu.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitEdit} className="space-y-6 mt-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">New Name</label>
                            <Input 
                                className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none px-4 font-medium"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                            />
                            {errors.name && <p className="text-xs text-rose-500 ml-1">{errors.name}</p>}
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setEditCategory(null)} className="rounded-xl px-6">Cancel</Button>
                            <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8 rounded-xl font-bold shadow-lg shadow-emerald-500/20">
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
