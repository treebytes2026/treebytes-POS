import { useState } from 'react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, useForm, router } from '@inertiajs/react';
import { UserPlus, Trash2, Mail, ShieldCheck, Phone, MapPin, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Staff Management', href: '/restaurant/staff' },
];

interface Profile {
    photo: string | null;
    position: string | null;
    phone: string | null;
    address: string | null;
}

interface StaffMember {
    id: number;
    name: string;
    email: string;
    staff_profile?: Profile;
}

export default function Staff({ staff = [] }: { staff: StaffMember[] }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const { data, setData, post, processing, reset, errors } = useForm({
        name: '',
        email: '',
        password: '',
        phone: '',
        address: '',
        position: 'Cashier',
        photo: null as File | null,
    });

    const submitAdd = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('restaurant.staff.store'), {
            onSuccess: () => {
                setIsAddOpen(false);
                reset();
                toast.success('Staff member added successfully!');
            },
        });
    };

    const deleteStaff = (id: number) => {
        if (confirm('Are you sure you want to remove this staff member?')) {
            router.delete(route('restaurant.staff.destroy', id), {
                onSuccess: () => toast.success('Staff removed.'),
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Staff Management" />
            <div className="p-6 flex flex-col gap-8 mx-auto w-full max-w-[1200px]">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 text-indigo-600">Staff Management</h1>
                        <p className="text-neutral-500 dark:text-neutral-400 mt-1">Manage your restaurant staff and their personal records.</p>
                    </div>
                    <Button onClick={() => setIsAddOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 h-11 px-6 rounded-xl shadow-lg shadow-indigo-500/10">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Add New Staff
                    </Button>
                </div>

                <div className="grid gap-6">
                    {staff.length === 0 ? (
                        <Card className="border-dashed border-2 border-neutral-200 dark:border-neutral-800 bg-transparent py-20">
                            <CardContent className="flex flex-col items-center justify-center text-neutral-400 gap-4">
                                <ShieldCheck className="w-16 h-16 opacity-10" />
                                <div className="text-center">
                                    <p className="font-bold text-lg">No staff found</p>
                                    <p className="text-sm">Click the button above to register your first staff member.</p>
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {staff.map((member: StaffMember) => (
                                <Card key={member.id} className="group hover:border-indigo-200 transition-all border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden bg-white dark:bg-neutral-950">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-16 w-16 rounded-2xl border-2 border-neutral-100 shadow-sm overflow-hidden">
                                                <AvatarImage src={member.staff_profile?.photo ? `/storage/${member.staff_profile.photo}` : ''} className="object-cover" />
                                                <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold text-xl">
                                                    {(member.name || '??').substring(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-bold text-lg text-neutral-900 dark:text-neutral-50 truncate">{member.name}</h3>
                                                <p className="text-sm text-indigo-600 font-medium flex items-center gap-1">
                                                    <Briefcase className="w-3.5 h-3.5" />
                                                    {member.staff_profile?.position || 'Staff'}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-6 space-y-2">
                                            <div className="text-sm text-neutral-500 flex items-center gap-2">
                                                <Mail className="w-4 h-4" />
                                                <span className="truncate">{member.email}</span>
                                            </div>
                                            {member.staff_profile?.phone && (
                                                <div className="text-sm text-neutral-500 flex items-center gap-2">
                                                    <Phone className="w-4 h-4" />
                                                    {member.staff_profile.phone}
                                                </div>
                                            )}
                                        </div>
                                        <div className="mt-6 pt-4 border-t border-neutral-50 dark:border-neutral-900 flex justify-between items-center">
                                            <Button variant="outline" size="sm" className="rounded-lg h-8 text-xs font-semibold" onClick={() => {
                                                setSelectedStaff(member);
                                                setIsProfileOpen(true);
                                            }}>
                                                Personal Data Sheet
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-rose-500 transition-colors" onClick={() => deleteStaff(member.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add Staff Modal */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">Register Staff</DialogTitle>
                        <DialogDescription>Create a personal record and system access for your staff.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitAdd} className="space-y-6 mt-6">
                        <div className="grid gap-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1 text-neutral-700 dark:text-neutral-300">Name</label>
                                    <Input value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Full Name" className="h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none px-4" />
                                    {errors.name && <p className="text-xs text-rose-500 ml-1">{errors.name}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1 text-neutral-700 dark:text-neutral-300">Email</label>
                                    <Input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="email@example.com" className="h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none px-4" />
                                    {errors.email && <p className="text-xs text-rose-500 ml-1">{errors.email}</p>}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1 text-neutral-700 dark:text-neutral-300">Password</label>
                                    <Input type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder="••••••••" className="h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none px-4" />
                                    {errors.password && <p className="text-xs text-rose-500 ml-1">{errors.password}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1 text-neutral-700 dark:text-neutral-300">Position</label>
                                    <select value={data.position} onChange={e => setData('position', e.target.value)} className="flex h-11 w-full rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none px-4 text-sm">
                                        <option value="Cashier">Cashier</option>
                                        <option value="Waiter">Waiter</option>
                                        <option value="Chef">Chef</option>
                                        <option value="Kitchen Staff">Kitchen Staff</option>
                                        <option value="Manager">Manager</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1 text-neutral-700 dark:text-neutral-300">Mobile Number</label>
                                    <Input value={data.phone} onChange={e => setData('phone', e.target.value)} placeholder="0917..." className="h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none px-4" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold ml-1 text-neutral-700 dark:text-neutral-300">Address</label>
                                    <Input value={data.address} onChange={e => setData('address', e.target.value)} placeholder="City, Brgy" className="h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none px-4" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-semibold ml-1 text-neutral-700 dark:text-neutral-300">Staff Photo</label>
                                <Input type="file" onChange={e => setData('photo', e.target.files ? e.target.files[0] : null)} className="h-11 rounded-xl bg-neutral-50 dark:bg-neutral-900 border-none px-4 pt-2" />
                            </div>
                        </div>
                        <DialogFooter className="pt-4">
                            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)} className="rounded-xl px-6">Cancel</Button>
                            <Button type="submit" disabled={processing} className="bg-indigo-600 hover:bg-indigo-700 h-11 px-8 rounded-xl shadow-lg shadow-indigo-500/20 font-bold">
                                Register Staff
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Personal Data Sheet Modal */}
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent className="sm:max-w-[600px] rounded-3xl p-0 overflow-hidden">
                    {selectedStaff && (
                        <div className="flex flex-col">
                            <div className="h-32 bg-indigo-600 relative">
                                <div className="absolute -bottom-12 left-8 p-1 bg-white dark:bg-neutral-950 rounded-3xl shadow-lg">
                                    <Avatar className="h-24 w-24 rounded-2xl overflow-hidden border-2 border-white dark:border-neutral-900">
                                        <AvatarImage src={selectedStaff.staff_profile?.photo ? `/storage/${selectedStaff.staff_profile.photo}` : ''} className="object-cover" />
                                        <AvatarFallback className="bg-indigo-50 text-indigo-600 font-bold text-xl">
                                            {(selectedStaff.name || '??').substring(0, 2).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                            <div className="p-8 pt-16">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">{selectedStaff.name}</h2>
                                        <p className="text-indigo-600 font-semibold">{selectedStaff.staff_profile?.position || 'Staff'}</p>
                                    </div>
                                    <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1.2 rounded-full border border-emerald-100 uppercase tracking-wider">Active</span>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-neutral-400">
                                                <Mail className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-neutral-400 font-medium uppercase">Email Address</p>
                                                <p className="text-sm font-medium">{selectedStaff.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-neutral-400">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-neutral-400 font-medium uppercase">Phone Number</p>
                                                <p className="text-sm font-medium">{selectedStaff.staff_profile?.phone || 'Not provided'}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-neutral-400">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-neutral-400 font-medium uppercase">Home Address</p>
                                                <p className="text-sm font-medium">{selectedStaff.staff_profile?.address || 'Not provided'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="p-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-neutral-400">
                                                <ShieldCheck className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-neutral-400 font-medium uppercase">Access Role</p>
                                                <p className="text-sm font-medium">Standard POS Access</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-8 pt-6 border-t border-neutral-100 dark:border-neutral-900 flex justify-end">
                                    <Button variant="ghost" onClick={() => setIsProfileOpen(false)} className="rounded-xl px-6">Close Data Sheet</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
