import AppLogoIcon from '@/components/app-logo-icon';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { Monitor, ShieldCheck, Box, ChevronLeft } from 'lucide-react';

interface AuthLayoutProps {
    children: React.ReactNode;
}

export default function AuthSplitCardLayout({ children }: AuthLayoutProps) {
    const { name } = usePage<SharedData>().props;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6" style={{ backgroundColor: '#F3F4F6' }}>
            <div className="w-full max-w-[900px] bg-white dark:bg-neutral-900 rounded-[1.2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-neutral-100 dark:border-neutral-800">
                {/* Left Panel: Brand & Features (Reference Green) - Balanced 50% */}
                <div className="w-full md:w-1/2 p-8 md:p-10 text-white flex flex-col relative overflow-hidden" style={{ backgroundColor: '#064E3B' }}>
                    {/* Subtle Glow like in reference */}
                    <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-yellow-500/10 blur-[100px]" />
                    <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-[100px]" />

                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg bg-white/10 border border-white/20">
                                <AppLogoIcon className="w-7 h-7 fill-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter uppercase italic text-white">
                                TreeBytes<span style={{ color: '#D4AF37' }}>POS</span>
                            </span>
                        </div>

                        <div className="mb-auto">
                            <h1 className="text-3xl md:text-[2.2rem] font-serif font-black leading-[1.15] mb-4 tracking-tight">
                                Smart POS System for <br />
                                <span className="text-white/90">Growing Businesses</span>
                            </h1>
                            
                            <p className="text-white/60 text-sm mb-8 font-medium leading-relaxed max-w-[280px]">
                                Secure, transparent, and efficient digital management platform for modern retail.
                            </p>

                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6 border-b border-white/5 pb-3">
                                Central TreeBytes Solution
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {[
                                    { icon: ShieldCheck, title: 'Enterprise-grade security' },
                                    { icon: Monitor, title: 'Real-time sales tracking' },
                                    { icon: Box, title: 'Verified industrial operations' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <item.icon className="w-3.5 h-3.5 text-emerald-400" />
                                        <p className="font-bold text-xs text-white/70">{item.title}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-6 h-6 rounded-full border border-[#1F7A63] bg-neutral-200" />
                                    ))}
                                </div>
                                <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
                                    Trusted by <span className="text-white">2,500+</span> businesses
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Login Form - Balanced 50% */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-neutral-900 border-l border-neutral-100 dark:border-neutral-800">
                    <div className="max-w-[360px] mx-auto w-full">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-serif font-black text-[#1E293B] dark:text-white mb-2 tracking-tight">Welcome Back</h2>
                            <p className="text-[#64748B] font-medium text-sm tracking-tight">Sign in to access your dashboard</p>
                        </div>

                        {children}

                        <div className="mt-8 text-center border-t border-neutral-50 pt-6">
                            <Link 
                                href={route('home')} 
                                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-400 hover:text-[#064E3B] transition-colors"
                            >
                                <ChevronLeft className="w-3.5 h-3.5" />
                                Back to home
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            
            <p className="mt-8 text-neutral-400 text-[11px] font-bold uppercase tracking-[0.1em] text-center">
                &copy; {new Date().getFullYear()} {name} POS. All rights reserved.
            </p>
        </div>
    );
}
