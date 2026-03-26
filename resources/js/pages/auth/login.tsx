import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthSplitCardLayout from '@/layouts/auth/auth-split-card-layout';

interface LoginForm {
    email: string;
    password: string;
    remember: boolean;
    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <AuthSplitCardLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-6 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-xl text-center text-sm font-bold text-emerald-600">
                    {status}
                </div>
            )}

            <form className="space-y-5" onSubmit={submit}>
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-bold text-slate-700 ml-1">Email Address</Label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#064E3B] transition-colors" />
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Enter Email Address"
                                className="h-11 pl-11 rounded-xl bg-white dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 transition-all focus:ring-0 focus:border-[#064E3B] text-sm placeholder:text-slate-300 shadow-sm"
                            />
                        </div>
                        <InputError message={errors.email} />
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-xs font-bold text-slate-700 ml-1">Password</Label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 group-focus-within:text-[#064E3B] transition-colors" />
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'}
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter Password"
                                className="h-11 pl-11 pr-11 rounded-xl bg-white dark:bg-neutral-950 border-slate-200 dark:border-neutral-800 transition-all focus:ring-0 focus:border-[#064E3B] text-sm placeholder:text-slate-300 shadow-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
                            >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <InputError message={errors.password} />
                    </div>

                    <div className="flex items-center justify-between ml-1 pt-0.5">
                        <div className="flex items-center space-x-2">
                            <Checkbox 
                                id="remember" 
                                name="remember" 
                                tabIndex={3} 
                                checked={data.remember}
                                onCheckedChange={(checked) => setData('remember', checked as boolean)}
                                className="w-4 h-4 rounded border-slate-300 data-[state=checked]:bg-[#064E3B] data-[state=checked]:border-[#064E3B]" 
                            />
                            <Label htmlFor="remember" className="text-[11px] font-medium text-slate-500 select-none cursor-pointer">Keep me logged in</Label>
                        </div>
                        {canResetPassword && (
                            <TextLink href={route('password.request')} className="text-[11px] font-bold text-[#064E3B] hover:underline" tabIndex={5}>
                                Forgot password?
                            </TextLink>
                        )}
                    </div>

                    <Button type="submit" className="h-11 w-full rounded-xl bg-[#064E3B] hover:bg-[#053d2e] text-white font-bold text-sm shadow-md transition-all active:scale-[0.98] group" tabIndex={4} disabled={processing}>
                        {processing ? (
                            <LoaderCircle className="h-4 w-4 animate-spin mx-auto" />
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <LogIn className="w-4 h-4" /> Sign In
                            </span>
                        )}
                    </Button>
                </div>

                <div className="pt-3 text-center">
                    <p className="text-xs font-medium text-slate-500">
                        Don't have an account?{' '}
                        <TextLink href={route('register')} className="text-[#064E3B] font-bold hover:underline" tabIndex={5}>
                            Sign up
                        </TextLink>
                    </p>
                </div>
            </form>
        </AuthSplitCardLayout>
    );
}
