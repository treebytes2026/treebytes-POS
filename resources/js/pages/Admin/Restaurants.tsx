import { useState, useRef } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { Store, Edit, Trash2, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Super Admin', href: '/admin' },
];

interface Restaurant {
    id: number;
    name: string;
    owner: string;
    email: string;
    address: string;
    status: 'active' | 'trial' | 'expired';
    logo: string | null;
    plan: string;
    expires: string;
}

interface RestaurantsProps {
    restaurants: Restaurant[];
}

export default function Restaurants({ restaurants = [] }: RestaurantsProps) {
    // --- Create Form State ---
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [editLogoPreview, setEditLogoPreview] = useState<string | null>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        owner_name: '',
        email: '',
        password: '',
        address: '',
        status: 'active',
        plan_type: 'trial',
        logo: null as File | null,
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    const submitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.restaurants.store'), {
            onSuccess: () => {
                setIsCreateOpen(false);
                reset();
                setLogoPreview(null);
                toast.success('Restaurant created successfully!');
            },
            onError: () => {
                toast.error('Failed to create restaurant. Please check the form.');
            },
            preserveScroll: true,
        });
    };

    // --- Edit Form State ---
    const [editRestaurant, setEditRestaurant] = useState<Restaurant | null>(null);
    const [showEditPassword, setShowEditPassword] = useState(false);
    const { 
        data: editData, 
        setData: setEditData, 
        post: updatePost, 
        processing: editProcessing, 
        errors: editErrors,
        reset: resetEdit
    } = useForm({
        name: '',
        owner_name: '',
        email: '',
        password: '',
        address: '',
        status: 'active',
        logo: null as File | null,
    });

    const openEdit = (restaurant: Restaurant) => {
        setEditRestaurant(restaurant);
        setEditData({
            name: restaurant.name,
            owner_name: restaurant.owner,
            email: restaurant.email,
            password: '',
            address: restaurant.address,
            status: restaurant.status,
            logo: null,
        });
        setEditLogoPreview(restaurant.logo || null);
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        // Use POST with method spoofing for file uploads in Inertia/Laravel
        if (!editRestaurant) return;
        
        updatePost(route('admin.restaurants.update', editRestaurant.id), {
            onSuccess: () => {
                setEditRestaurant(null);
                resetEdit();
                setEditLogoPreview(null);
                toast.success('Restaurant updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update restaurant. Please check the form.');
            },
            preserveScroll: true,
        });
    };

    // --- Delete Action ---
    const [deleteRestaurantId, setDeleteRestaurantId] = useState<number | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Super Admin Dashboard" />
            
            <div className="flex flex-col gap-8 p-6 mx-auto w-full max-w-[1400px]">
                {/* Header Title */}
                <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Tenants & Restaurants</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">Manage your enrolled restaurants, subscriptions, and billing states.</p>
                </div>

                {/* Unified Data Table Panel */}
                <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Restaurants & Subscriptions</h2>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                A comprehensive list of all enrolled restaurants and their billing states.
                            </p>
                        </div>
                        
                        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-colors">
                                    <Store className="w-4 h-4 mr-2" />
                                    Add Restaurant
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[680px]">
                                <DialogHeader>
                                    <DialogTitle>Enroll New Restaurant</DialogTitle>
                                    <DialogDescription>
                                        Register a new tenant and configure their subscription plan.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={submitCreate} className="space-y-4 py-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Business Name</Label>
                                            <Input id="name" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="e.g. The Rustic Bean" required />
                                            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="owner_name">Owner Name</Label>
                                            <Input id="owner_name" value={data.owner_name} onChange={e => setData('owner_name', e.target.value)} placeholder="e.g. Sarah Jenkins" required />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email Address</Label>
                                            <Input id="email" type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="admin@restaurant.com" required />
                                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Account Password</Label>
                                            <div className="relative">
                                                <Input 
                                                    id="password" 
                                                    type={showPassword ? "text" : "password"} 
                                                    value={data.password} 
                                                    onChange={e => setData('password', e.target.value)} 
                                                    placeholder="••••••••" 
                                                    required 
                                                    className="pr-10"
                                                />
                                                <button 
                                                    type="button" 
                                                    onClick={() => setShowPassword(!showPassword)} 
                                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 focus:outline-none"
                                                >
                                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                            </div>
                                            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="address">Address Component</Label>
                                        <Input id="address" value={data.address} onChange={e => setData('address', e.target.value)} placeholder="123 Example Street" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="plan_type">Subscription Plan</Label>
                                            <select id="plan_type" value={data.plan_type} onChange={e => setData('plan_type', e.target.value)} className="flex h-9 w-full items-center justify-between rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white focus:outline-none focus:ring-1 focus:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300">
                                                <option value="trial">14-Day Trial</option>
                                                <option value="monthly">Monthly (₱49)</option>
                                                <option value="yearly">Yearly (₱490)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                             <Label>Restaurant Logo</Label>
                                             <div
                                                 className="relative flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors overflow-hidden"
                                                 onClick={() => fileInputRef.current?.click()}
                                             >
                                                 {logoPreview ? (
                                                     <>
                                                         <img src={logoPreview} alt="Logo preview" className="absolute inset-0 w-full h-full object-cover" />
                                                         <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                             <ImageIcon className="w-6 h-6 text-white mb-1" />
                                                             <span className="text-xs text-white font-medium">Change Photo</span>
                                                         </div>
                                                     </>
                                                 ) : (
                                                     <div className="flex flex-col items-center gap-1 text-neutral-400 dark:text-neutral-500">
                                                         <ImageIcon className="w-8 h-8" />
                                                         <span className="text-xs font-medium">Click to upload logo</span>
                                                         <span className="text-xs">PNG, JPG up to 1MB</span>
                                                     </div>
                                                 )}
                                             </div>
                                             <input
                                                 ref={fileInputRef}
                                                 type="file"
                                                 accept="image/*"
                                                 className="hidden"
                                                 onChange={e => {
                                                     const file = e.target.files?.[0] || null;
                                                     setData('logo', file);
                                                     if (file) setLogoPreview(URL.createObjectURL(file));
                                                     else setLogoPreview(null);
                                                 }}
                                             />
                                         </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit" disabled={processing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                            Create Account
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                    
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                                <tr>
                                    <th className="px-6 py-4 font-semibold tracking-wider">Restaurant Details</th>
                                    <th className="px-6 py-4 font-semibold tracking-wider">Plan Type</th>
                                    <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                                    <th className="px-6 py-4 font-semibold tracking-wider">Expiration</th>
                                    <th className="px-6 py-4 font-semibold tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {restaurants.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-neutral-500 dark:text-neutral-400">
                                            <Store className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <p>No restaurants enrolled yet.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    restaurants.map((restaurant) => (
                                        <tr key={restaurant.id} className="bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <div className="h-12 w-12 rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-sm bg-neutral-100 dark:bg-neutral-900 shrink-0">
                                                        <img 
                                                            src={restaurant.logo || `https://api.dicebear.com/7.x/initials/svg?seed=${restaurant.name}&backgroundColor=6366f1`} 
                                                            alt={restaurant.name} 
                                                            className="h-full w-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-base">{restaurant.name}</span>
                                                        <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{restaurant.owner} • {restaurant.address?.split(',')[0]}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-neutral-700 dark:text-neutral-300 font-medium">
                                                {restaurant.plan}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge 
                                                    variant="outline" 
                                                    className={`px-2.5 py-0.5 font-medium border
                                                        ${restaurant.status === 'active' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' : ''}
                                                        ${restaurant.status === 'trial' ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20' : ''}
                                                        ${restaurant.status === 'expired' ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20' : ''}
                                                    `}
                                                >
                                                    {restaurant.status.charAt(0).toUpperCase() + restaurant.status.slice(1)}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                                                {restaurant.expires}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex items-center justify-end gap-2 whitespace-nowrap">
                                                    <Button variant="ghost" size="icon" onClick={() => openEdit(restaurant)} className="h-8 w-8 text-neutral-500 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-500/10 dark:hover:text-blue-400 rounded-full transition-colors">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => setDeleteRestaurantId(restaurant.id)} className="h-8 w-8 text-neutral-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-500/10 dark:hover:text-red-400 rounded-full transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>

            </div>

            {/* Edit Restaurant Dialog */}
            <Dialog open={!!editRestaurant} onOpenChange={(open) => !open && setEditRestaurant(null)}>
                <DialogContent className="sm:max-w-[680px]" onOpenAutoFocus={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Edit Restaurant</DialogTitle>
                        <DialogDescription>Update details for {editRestaurant?.name}.</DialogDescription>
                    </DialogHeader>
                    {editRestaurant && (
                        <form onSubmit={submitEdit} className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit_name">Business Name</Label>
                                    <Input id="edit_name" value={editData.name} onChange={e => setEditData('name', e.target.value)} required />
                                    {editErrors.name && <p className="text-sm text-red-500">{editErrors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit_owner_name">Owner Name</Label>
                                    <Input id="edit_owner_name" value={editData.owner_name} onChange={e => setEditData('owner_name', e.target.value)} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit_email">Email Address</Label>
                                    <Input id="edit_email" type="email" value={editData.email} onChange={e => setEditData('email', e.target.value)} required />
                                    {editErrors.email && <p className="text-sm text-red-500">{editErrors.email}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="edit_password">Update Password</Label>
                                    <div className="relative">
                                        <Input 
                                            id="edit_password" 
                                            type={showEditPassword ? "text" : "password"} 
                                            value={editData.password} 
                                            onChange={e => setEditData('password', e.target.value)} 
                                            placeholder="Leave blank to keep current" 
                                            className="pr-10"
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowEditPassword(!showEditPassword)} 
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 focus:outline-none"
                                        >
                                            {showEditPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="edit_address">Address Component</Label>
                                <Input id="edit_address" value={editData.address} onChange={e => setEditData('address', e.target.value)} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="edit_status">Account Status</Label>
                                    <select id="edit_status" value={editData.status} onChange={e => setEditData('status', e.target.value)} className="flex h-9 w-full items-center justify-between rounded-md border border-neutral-200 bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-white focus:outline-none focus:ring-1 focus:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800 dark:ring-offset-neutral-950 dark:focus:ring-neutral-300">
                                        <option value="active">Active</option>
                                        <option value="trial">Trial</option>
                                        <option value="expired">Expired</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                     <Label>Update Logo</Label>
                                     <div
                                         className="relative flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors overflow-hidden"
                                         onClick={() => editFileInputRef.current?.click()}
                                     >
                                         {editLogoPreview ? (
                                             <>
                                                 <img src={editLogoPreview} alt="Logo preview" className="absolute inset-0 w-full h-full object-cover" />
                                                 <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                                     <ImageIcon className="w-6 h-6 text-white mb-1" />
                                                     <span className="text-xs text-white font-medium">Change Photo</span>
                                                 </div>
                                             </>
                                         ) : (
                                             <div className="flex flex-col items-center gap-1 text-neutral-400 dark:text-neutral-500">
                                                 <ImageIcon className="w-8 h-8" />
                                                 <span className="text-xs font-medium">Click to upload logo</span>
                                                 <span className="text-xs">PNG, JPG up to 1MB</span>
                                             </div>
                                         )}
                                     </div>
                                     <input
                                         ref={editFileInputRef}
                                         type="file"
                                         accept="image/*"
                                         className="hidden"
                                         onChange={e => {
                                             const file = e.target.files?.[0] || null;
                                             setEditData('logo', file);
                                             if (file) setEditLogoPreview(URL.createObjectURL(file));
                                             else setEditLogoPreview(null);
                                         }}
                                     />
                                 </div>
                            </div>
                            <DialogFooter>
                                <Button type="submit" disabled={editProcessing} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Restaurant Dialog */}
            <Dialog open={deleteRestaurantId !== null} onOpenChange={(open) => !open && setDeleteRestaurantId(null)}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Confirm Deletion</DialogTitle>
                        <DialogDescription>
                            Are you absolutely sure you want to delete this restaurant? All data, subscriptions, and associated files will be permanently lost. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setDeleteRestaurantId(null)}>Cancel</Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => {
                            if (deleteRestaurantId) {
                                router.delete(route('admin.restaurants.destroy', deleteRestaurantId), {
                                    onSuccess: () => {
                                        setDeleteRestaurantId(null);
                                        toast.success('Restaurant deleted successfully.');
                                    },
                                    onError: () => {
                                        toast.error('Failed to delete the restaurant.');
                                    },
                                    preserveScroll: true,
                                });
                            }
                        }}>
                            Delete Restaurant
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
