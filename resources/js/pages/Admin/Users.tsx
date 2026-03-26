import { useState } from 'react';
import { type BreadcrumbItem, type User } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Users as UsersIcon, Edit, Trash2, MoreHorizontal, ShieldAlert, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Super Admin', href: '/admin' },
    { title: 'Platform Users', href: '/admin/users' },
];

interface UsersProps {
    all_users: User[];
}

export default function Users({ all_users = [] }: UsersProps) {
    // --- Edit Profile Form State ---
    const [editUser, setEditUser] = useState<(User & { action: 'profile' | 'role' }) | null>(null);
    const { 
        data: editData, 
        setData: setEditData, 
        put, 
        processing: editProcessing, 
        errors: editErrors,
        reset: resetEdit
    } = useForm({
        name: '',
        email: '',
        role: 'user',
    });

    const openEdit = (user: User, action: 'profile' | 'role' = 'profile') => {
        setEditUser({ ...user, action });
        setEditData({
            name: user.name,
            email: user.email,
            role: user.role,
        });
    };

    const submitEdit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!editUser) return;
        
        put(route('admin.users.update', editUser.id), {
            onSuccess: () => {
                const actionLabel = editUser.action === 'role' ? 'Role updated' : 'Profile updated';
                setEditUser(null);
                resetEdit();
                toast.success(`${actionLabel} successfully!`);
            },
            onError: () => {
                toast.error('Failed to update user. Please check the form.');
            },
            preserveScroll: true,
        });
    };

    // --- Delete Action ---
    const [deleteUserId, setDeleteUserId] = useState<number | null>(null);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Platform Users" />
            
            <div className="flex flex-col gap-8 p-6 mx-auto w-full max-w-[1200px]">
                {/* Header Title */}
                <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">Platform Users</h1>
                    <p className="text-neutral-500 dark:text-neutral-400">
                        Monitor all registered users across your platform ecosystem, including their structural roles and joined dates.
                    </p>
                </div>

                {/* Data Table Panel */}
                <Card className="border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="p-6 border-b border-neutral-200 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-neutral-900/20">
                        <div>
                            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Registered Accounts</h2>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                Complete directory of every account.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs uppercase bg-neutral-50 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 border-b border-neutral-200 dark:border-neutral-800">
                                <tr>
                                    <th className="px-6 py-4 font-semibold tracking-wider">User Details</th>
                                    <th className="px-6 py-4 font-semibold tracking-wider">Assigned Role</th>
                                    <th className="px-6 py-4 font-semibold tracking-wider">Joined Date</th>
                                    <th className="px-6 py-4 font-semibold tracking-wider text-right">Settings</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                {all_users.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-neutral-500 dark:text-neutral-400">
                                            <UsersIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                                            <p>No users found in the system right now.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    all_users.map((user) => (
                                        <tr key={user.id} className="bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors group">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-4">
                                                    <Avatar className="h-10 w-10 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                                                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.name}&backgroundColor=blue`} alt={user.name} />
                                                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-neutral-900 dark:text-neutral-100 text-base">{user.name}</span>
                                                        <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{user.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Badge 
                                                    variant="outline" 
                                                    className={`px-2.5 py-0.5 font-medium border
                                                        ${user.role === 'super_admin' ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20' : 'bg-neutral-50 dark:bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-500/20'}
                                                    `}
                                                >
                                                    {user.role === 'super_admin' ? 'Super Admin' : 'Standard User'}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-neutral-500 dark:text-neutral-400">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-50 focus-visible:ring-0">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Open menu</span>
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48">
                                                        <DropdownMenuLabel>User Settings</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="cursor-pointer" onClick={() => openEdit(user, 'profile')}>
                                                            <Edit className="mr-2 h-4 w-4" />
                                                            <span>Edit Profile</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem className="cursor-pointer" onClick={() => openEdit(user, 'role')}>
                                                            <ShieldAlert className="mr-2 h-4 w-4" />
                                                            <span>Change Role</span>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem className="text-red-600 dark:text-red-400 cursor-pointer" onClick={() => setDeleteUserId(user.id)}>
                                                            <Trash2 className="mr-2 h-4 w-4" />
                                                            <span>Delete Account</span>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            {/* Edit User/Role Dialog */}
            <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editUser?.action === 'role' ? 'Change Account Role' : 'Edit Profile Identity'}</DialogTitle>
                        <DialogDescription>
                            {editUser?.action === 'role' ? `Modify structural permissions for ${editUser?.name}.` : `Update contact identity information for ${editUser?.name}.`}
                        </DialogDescription>
                    </DialogHeader>
                    {editUser && (
                        <form onSubmit={submitEdit} className="space-y-4 py-4">
                            {editUser.action === 'profile' ? (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_name">Full Name</Label>
                                        <Input id="edit_name" value={editData.name} onChange={e => setEditData('name', e.target.value)} required />
                                        {editErrors.name && <p className="text-sm text-red-500">{editErrors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="edit_email">Email Address</Label>
                                        <Input id="edit_email" type="email" value={editData.email} onChange={e => setEditData('email', e.target.value)} required />
                                        {editErrors.email && <p className="text-sm text-red-500">{editErrors.email}</p>}
                                    </div>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className={`p-4 rounded-lg border cursor-pointer transition-colors ${editData.role === 'user' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10' : 'border-neutral-200 dark:border-neutral-800'}`} onClick={() => setEditData('role', 'user')}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-neutral-900 dark:text-neutral-100">Standard User</span>
                                                <span className="text-xs text-neutral-500">Regular tenant application access</span>
                                            </div>
                                            {editData.role === 'user' && <Check className="h-5 w-5 text-indigo-600" />}
                                        </div>
                                    </div>
                                    <div className={`p-4 rounded-lg border cursor-pointer transition-colors ${editData.role === 'super_admin' ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-500/10' : 'border-neutral-200 dark:border-neutral-800'}`} onClick={() => setEditData('role', 'super_admin')}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-neutral-900 dark:text-neutral-100">Super Admin</span>
                                                <span className="text-xs text-neutral-500">Unrestricted system-wide authority</span>
                                            </div>
                                            {editData.role === 'super_admin' && <Check className="h-5 w-5 text-indigo-600" />}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <DialogFooter className="mt-4">
                                <Button type="submit" disabled={editProcessing} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white">
                                    Confirm Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete User Dialog */}
            <Dialog open={deleteUserId !== null} onOpenChange={(open) => !open && setDeleteUserId(null)}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Revoke Account Access</DialogTitle>
                        <DialogDescription>
                            Are you absolutely sure you want to delete this user? This cannot be undone and will immediately destroy their platform access.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-4 gap-2 sm:gap-0">
                        <Button variant="outline" onClick={() => setDeleteUserId(null)}>Cancel Action</Button>
                        <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => {
                            if (deleteUserId) {
                                router.delete(route('admin.users.destroy', deleteUserId), {
                                    onSuccess: () => {
                                        setDeleteUserId(null);
                                        toast.success('User account deleted successfully.');
                                    },
                                    onError: () => {
                                        toast.error('Failed to delete user account.');
                                    },
                                    preserveScroll: true,
                                });
                            }
                        }}>
                            Purge User
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </AppLayout>
    );
}
