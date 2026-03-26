import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { Store, Save, Upload, MapPin, Mail, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Restaurant Settings', href: '/restaurant/settings' },
];

interface Restaurant {
    name: string;
    owner_name: string | null;
    email: string | null;
    address: string | null;
    logo: string | null;
}

export default function Settings({ restaurant }: { restaurant: Restaurant }) {
    const { data, setData, post, processing, errors } = useForm({
        name: restaurant?.name || '',
        owner_name: restaurant?.owner_name || '',
        email: restaurant?.email || '',
        address: restaurant?.address || '',
        logo: null as File | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('restaurant.settings.update'), {
            onSuccess: () => toast.success('Restaurant information updated!'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Restaurant Settings" />
            <div className="p-6 max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-black text-neutral-900 dark:text-white flex items-center gap-3">
                        <Store className="w-8 h-8 text-indigo-600" />
                        Restaurant Branding
                    </h1>
                    <p className="text-neutral-500 dark:text-neutral-400 mt-2 font-medium">Update your restaurant identity, logo, and contact details for receipts and invoices.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border-none shadow-sm bg-white dark:bg-neutral-950 rounded-[2rem] overflow-hidden">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-xl font-black">Identity & Contact</CardTitle>
                            <CardDescription>How your restaurant appears to customers on the platform.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 pt-4 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Restaurant Name</Label>
                                    <div className="relative group">
                                        <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-indigo-500 transition-colors" />
                                        <Input 
                                            id="name"
                                            value={data.name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('name', e.target.value)}
                                            placeholder="Seaside Bistro"
                                            className="h-12 pl-12 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-none font-bold"
                                        />
                                    </div>
                                    {errors.name && <p className="text-xs text-rose-500 font-bold ml-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="owner" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Owner Name</Label>
                                    <div className="relative group">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-indigo-500 transition-colors" />
                                        <Input 
                                            id="owner"
                                            value={data.owner_name}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('owner_name', e.target.value)}
                                            placeholder="John Doe"
                                            className="h-12 pl-12 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-none font-bold"
                                        />
                                    </div>
                                    {errors.owner_name && <p className="text-xs text-rose-500 font-bold ml-1">{errors.owner_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Business Email</Label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-300 group-focus-within:text-indigo-500 transition-colors" />
                                        <Input 
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('email', e.target.value)}
                                            placeholder="contact@restaurant.com"
                                            className="h-12 pl-12 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-none font-bold"
                                        />
                                    </div>
                                    {errors.email && <p className="text-xs text-rose-500 font-bold ml-1">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Restaurant Address</Label>
                                <div className="relative group">
                                    <MapPin className="absolute left-4 top-4 w-4 h-4 text-neutral-300 group-focus-within:text-indigo-500 transition-colors" />
                                    <Textarea 
                                        id="address"
                                        value={data.address}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setData('address', e.target.value)}
                                        placeholder="123 Coastal Road, Beachfront..."
                                        className="min-h-[100px] pl-12 pt-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border-none font-bold resize-none"
                                    />
                                </div>
                                {errors.address && <p className="text-xs text-rose-500 font-bold ml-1">{errors.address}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm bg-white dark:bg-neutral-950 rounded-[2rem] overflow-hidden">
                        <CardContent className="p-8 flex items-center justify-between gap-8">
                            <div className="flex-1">
                                <h3 className="text-lg font-black">Restaurant Logo</h3>
                                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">This logo will appear in your POS terminal, the customer receipt, and the sidebar.</p>
                                <div className="mt-6">
                                    <Label htmlFor="logo" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 rounded-xl cursor-pointer hover:bg-indigo-100 transition-colors font-black text-xs uppercase tracking-widest">
                                        <Upload className="w-4 h-4" />
                                        {data.logo ? data.logo.name : 'Select New Logo'}
                                    </Label>
                                    <input 
                                        type="file" 
                                        id="logo" 
                                        className="hidden" 
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setData('logo', e.target.files ? e.target.files[0] : null)} 
                                    />
                                </div>
                            </div>
                            <div className="w-32 h-32 rounded-[2rem] bg-neutral-100 dark:bg-neutral-900 border-2 border-dashed border-neutral-200 dark:border-neutral-800 flex items-center justify-center overflow-hidden shrink-0">
                                {data.logo ? (
                                    <img src={URL.createObjectURL(data.logo)} className="w-full h-full object-contain p-2" />
                                ) : restaurant?.logo ? (
                                    <img src={restaurant.logo.startsWith('http') || restaurant.logo.startsWith('/storage') ? restaurant.logo : `/storage/${restaurant.logo}`} className="w-full h-full object-contain p-2" />
                                ) : (
                                    <Store className="w-8 h-8 text-neutral-300" />
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end pt-4">
                        <Button 
                            disabled={processing}
                            type="submit" 
                            className="bg-indigo-600 hover:bg-indigo-700 text-white h-14 px-10 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-500/20 active:scale-95 transition-all"
                        >
                            <Save className="w-5 h-5" />
                            Save All Changes
                        </Button>
                    </div>
                </form>
            </div>
        </AppLayout>
    );
}
