import { useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Plus, Edit, Trash2, Package, Image as ImageIcon, BookOpen, UtensilsCrossed, X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/restaurant/products' },
];

interface Category {
    id: number;
    name: string;
}

interface Ingredient {
    id: number;
    name: string;
    unit: string;
    pivot?: {
        quantity_required: number;
    };
}

interface Product {
    id: number;
    name: string;
    price: number | string;
    category_id: number;
    image: string | null;
    status: string;
    category?: Category;
    ingredients?: Ingredient[];
}

export default function Products({ products = [], categories = [], ingredients = [] }: { 
    products: Product[], 
    categories: Category[], 
    ingredients: Ingredient[] 
}) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editProduct, setEditProduct] = useState<Product | null>(null);
    const [recipeProduct, setRecipeProduct] = useState<Product | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, reset, processing, errors } = useForm({
        category_id: '',
        name: '',
        price: '',
        status: 'active',
        image: null as File | null,
    });

    // Recipe Form
    const recipeForm = useForm({
        ingredients: [] as { id: number, name: string, quantity: number, unit: string }[]
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('image', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('restaurant.products.store'), {
            onSuccess: () => {
                setIsAddOpen(false);
                reset();
                setPreviewImage(null);
                toast.success('Product added successfully');
            },
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editProduct) return;
        router.post(route('restaurant.products.update', editProduct.id), {
            _method: 'post',
            ...data,
        }, {
            onSuccess: () => {
                setEditProduct(null);
                reset();
                setPreviewImage(null);
                toast.success('Product updated successfully');
            },
        });
    };

    const openRecipe = (product: Product) => {
        setRecipeProduct(product);
        const existingIngredients = (product.ingredients || []).map((ing: Ingredient) => ({
            id: ing?.id,
            name: ing?.name || 'Unnamed',
            quantity: ing?.pivot?.quantity_required || 0,
            unit: ing?.unit || 'unit'
        }));
        recipeForm.setData('ingredients', existingIngredients);
    };

    const addIngredientToRecipe = (ingredientId: string) => {
        const ingredient = ingredients.find((i: Ingredient) => i.id.toString() === ingredientId);
        if (ingredient && !recipeForm.data.ingredients.find(i => i.id === ingredient.id)) {
            recipeForm.setData('ingredients', [
                ...recipeForm.data.ingredients,
                { id: ingredient.id, name: ingredient.name, quantity: 1, unit: ingredient.unit }
            ]);
        }
    };

    const removeIngredientFromRecipe = (id: number) => {
        recipeForm.setData('ingredients', recipeForm.data.ingredients.filter(i => i.id !== id));
    };

    const updateIngredientQuantity = (id: number, qty: number) => {
        recipeForm.setData('ingredients', recipeForm.data.ingredients.map(i => i.id === id ? { ...i, quantity: qty } : i));
    };

    const submitRecipe = (e: React.FormEvent) => {
        e.preventDefault();
        if (!recipeProduct) return;
        recipeForm.post(route('restaurant.products.recipe', recipeProduct.id), {
            onSuccess: () => {
                setRecipeProduct(null);
                toast.success('Recipe updated! Inventory will now be deducted correctly.');
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Manage Products & Recipes" />
            <div className="p-6 flex flex-col gap-8 mx-auto w-full max-w-[1400px]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 text-indigo-600">Product Management</h1>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage your terminal products and their ingredient recipes.</p>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 rounded-xl shadow-lg shadow-indigo-500/10">
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Product
                    </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product: Product) => (
                        <Card key={product.id} className="group overflow-hidden border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm hover:shadow-md transition-all rounded-3xl">
                            <div className="aspect-[4/3] bg-neutral-100 dark:bg-neutral-900 relative">
                                {product.image ? (
                                    <img src={`/storage/${product.image}`} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                        <Package className="w-12 h-12 opacity-20" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 flex flex-col gap-1">
                                    <Badge className={`border-none px-3 py-1 rounded-full uppercase text-[10px] font-black ${product.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                                        {product.status}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-black text-xl text-neutral-900 dark:text-neutral-50 truncate mr-2">{product.name}</h3>
                                    <span className="font-black text-indigo-600 dark:text-indigo-400 text-lg">₱{product.price}</span>
                                </div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-6">{product.category?.name || 'Uncategorized'}</p>
                                
                                <div className="space-y-3">
                                    <Button variant="outline" size="sm" onClick={() => openRecipe(product)} className={`w-full rounded-xl h-10 border-neutral-100 dark:border-neutral-800 transition-all ${(product.ingredients || []).length > 0 ? 'bg-indigo-50/50 dark:bg-indigo-500/5 text-indigo-600' : 'hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-400'}`}>
                                        <BookOpen className={`w-3.5 h-3.5 mr-2 ${(product.ingredients || []).length > 0 ? 'text-indigo-600' : 'text-neutral-400'}`} />
                                        <span className="font-bold text-xs">{(product.ingredients || []).length > 0 ? `Recipe: ${product.ingredients?.length} Items` : 'Build Recipe'}</span>
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => { 
                                            setEditProduct(product); 
                                            setData({ 
                                                category_id: (product.category_id || '').toString(), 
                                                name: product.name || '', 
                                                price: (product.price || '').toString(), 
                                                status: product.status || 'active', 
                                                image: null 
                                            }); 
                                            setPreviewImage(product.image ? `/storage/${product.image}` : null); 
                                        }} className="flex-1 rounded-xl h-10 border-neutral-100 dark:border-neutral-800 text-xs font-bold">
                                            <Edit className="w-3.5 h-3.5 mr-2" /> Edit
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => { if(confirm('Delete product?')) router.delete(route('restaurant.products.destroy', product.id)); }} className="h-10 w-10 text-rose-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl">
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Recipe Builder Modal */}
            <Dialog open={!!recipeProduct} onOpenChange={() => setRecipeProduct(null)}>
                <DialogContent className="sm:max-w-[550px] rounded-3xl p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                            <UtensilsCrossed className="w-6 h-6 text-indigo-600" />
                            Recipe Builder
                        </DialogTitle>
                        <DialogDescription>Define ingredients required for {recipeProduct?.name}. Stock will be deducted on every sale.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitRecipe} className="space-y-6 mt-6">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Add Ingredient to Recipe</label>
                                <Select onValueChange={addIngredientToRecipe}>
                                    <SelectTrigger className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none px-4">
                                        <SelectValue placeholder="Search ingredients..." />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {ingredients.map((ing: Ingredient) => (
                                            <SelectItem key={ing.id} value={ing.id.toString()}>{ing.name} ({ing.unit})</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                                {recipeForm.data.ingredients.length === 0 ? (
                                    <div className="py-12 border-2 border-dashed border-neutral-100 dark:border-neutral-800 rounded-2xl flex flex-col items-center justify-center text-neutral-400 gap-2">
                                        <Package className="w-8 h-8 opacity-20" />
                                        <p className="text-xs font-medium">No ingredients added yet</p>
                                    </div>
                                ) : (
                                    recipeForm.data.ingredients.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4 bg-white dark:bg-neutral-900 p-5 rounded-2xl group border border-neutral-100 dark:border-neutral-800 hover:border-indigo-200 transition-all shadow-sm">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-black text-neutral-900 dark:text-white leading-tight truncate">{item.name}</p>
                                                <p className="text-[10px] text-neutral-400 mt-0.5 font-bold uppercase tracking-wider">Metric: {item.unit}</p>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex flex-col items-end">
                                                    <label className="text-[9px] font-black uppercase text-neutral-400 mb-1">Quantity / Serving</label>
                                                    <div className="flex items-center gap-2">
                                                        <Input 
                                                            type="number" 
                                                            step="0.01" 
                                                            value={item.quantity} 
                                                            onChange={e => updateIngredientQuantity(item.id, Number(e.target.value))}
                                                            className="h-9 w-20 rounded-lg bg-neutral-50 dark:bg-neutral-950 border-none text-center font-black text-xs text-indigo-600"
                                                        />
                                                        <span className="text-[10px] font-black text-neutral-400 w-8">{item.unit}</span>
                                                    </div>
                                                </div>
                                                <button type="button" onClick={() => removeIngredientFromRecipe(item.id)} className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-colors">
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setRecipeProduct(null)} className="rounded-xl h-12">Cancel</Button>
                            <Button type="submit" disabled={recipeForm.processing} className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-xl font-bold shadow-lg shadow-indigo-500/20">
                                Save Recipe
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Add / Edit Product Modals (Existing code retained and styled) */}
            <Dialog open={isAddOpen || !!editProduct} onOpenChange={(open) => { if (!open) { setIsAddOpen(false); setEditProduct(null); reset(); setPreviewImage(null); } }}>
                <DialogContent className="sm:max-w-[600px] rounded-3xl p-8 overflow-y-auto max-h-[90vh]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">{editProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
                        <DialogDescription>Fill in the details for your menu item.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={editProduct ? submitEdit : submitAdd} className="space-y-6 mt-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2 sm:col-span-1 space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Product Name</label>
                                <Input placeholder="e.g. Cheese Burger" className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none px-4" value={data.name} onChange={e => setData('name', e.target.value)} />
                                {errors.name && <p className="text-xs text-rose-500 ml-1">{errors.name}</p>}
                            </div>
                            <div className="col-span-2 sm:col-span-1 space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Price (₱)</label>
                                <Input type="number" step="0.01" value={data.price} onChange={e => setData('price', e.target.value)} className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none px-4 font-black" />
                            </div>
                            <div className="col-span-2 sm:col-span-1 space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Category</label>
                                <Select onValueChange={(val) => setData('category_id', val)} defaultValue={data.category_id}>
                                    <SelectTrigger className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none px-4">
                                        <SelectValue placeholder="Select Category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {categories.map((cat: Category) => (
                                            <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="col-span-2 sm:col-span-1 space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Status</label>
                                <Select onValueChange={(val) => setData('status', val)} defaultValue={data.status}>
                                    <SelectTrigger className="h-12 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none px-4">
                                        <SelectValue placeholder="Select Status" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                            <label className="text-xs font-black uppercase tracking-widest text-neutral-400 ml-1">Product Photo</label>
                            <div onClick={() => fileInputRef.current?.click()} className="w-full aspect-video rounded-3xl border-2 border-dashed border-neutral-100 dark:border-neutral-800 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-all overflow-hidden relative group">
                                {previewImage ? (
                                    <>
                                        <img src={previewImage} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold">Change Overlay</div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center text-neutral-400 gap-2">
                                        <ImageIcon className="w-8 h-8 opacity-20" />
                                        <p className="text-[10px] font-bold uppercase tracking-widest">Select Image</p>
                                    </div>
                                )}
                                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageChange} />
                            </div>
                        </div>

                        <DialogFooter className="pt-6">
                            <Button type="button" variant="ghost" onClick={() => { setIsAddOpen(false); setEditProduct(null); reset(); }} className="rounded-xl h-12">Cancel</Button>
                            <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-xl font-bold shadow-lg shadow-indigo-500/20">
                                {editProduct ? 'Update Product' : 'Create Product'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
