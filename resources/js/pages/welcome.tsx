import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

import '../../css/landing.css';
const IconMonitor = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
);
const IconShield = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
);
const IconPackage = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
);
const IconCloud = () => (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" /></svg>
);
const IconCheck = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
);
const IconArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
);
const IconStar = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
);
const IconZap = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
);
const IconTarget = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
);
const IconTrendingUp = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
);
const IconClock = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
);
const IconStore = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
);
const IconBox = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /><polyline points="3.27 6.96 12 12.01 20.73 6.96" /><line x1="12" y1="22.08" x2="12" y2="12" /></svg>
);
const IconShoppingCart = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" /></svg>
);
const IconBarChart = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>
);

/* ─── Scroll Animation Hook ─── */
function useScrollReveal() {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('revealed');
                    observer.unobserve(el);
                }
            },
            { threshold: 0.15 },
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);
    return ref;
}

function RevealSection({ children, className = '', delay = '' }: { children: React.ReactNode; className?: string; delay?: string }) {
    const ref = useScrollReveal();
    return (
        <div ref={ref} className={`scroll-reveal ${className}`} style={delay ? { transitionDelay: delay } : {}}>
            {children}
        </div>
    );
}

/* ═══════════════════════════════════════════════
   CSS-BUILT UI MOCKUP ILLUSTRATIONS
   (No images — pure HTML/CSS floating card UIs)
   ═══════════════════════════════════════════════ */

/* ── HERO MOCKUP ── */
function HeroMockup() {
    return (
        <div className="mockup-composition hero-comp">
            {/* Main dashboard card */}
            <div className="mock-card mock-main-card">
                <div className="mock-card-header">
                    <div className="mock-icon-sm mock-icon-green">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>
                    </div>
                    <div className="mock-header-lines">
                        <div className="mock-line" style={{ width: '80px', height: '8px', background: '#e0e0e0', borderRadius: '4px' }} />
                        <div className="mock-line" style={{ width: '50px', height: '6px', background: '#f0f0f0', borderRadius: '3px', marginTop: '4px' }} />
                    </div>
                </div>
                <div className="mock-bars">
                    {[65, 85, 45, 70, 90, 55, 78].map((h, i) => (
                        <div key={i} className="mock-bar" style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }} />
                    ))}
                </div>
            </div>

            {/* Floating KPI - Total Sales */}
            <div className="mock-card mock-float-card mock-float-top-right">
                <div className="mock-badge-label">TOTAL SALES</div>
                <div className="mock-kpi-value">₱45,280</div>
                <div className="mock-kpi-change positive">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /></svg>
                    +18% from last month
                </div>
            </div>

            {/* Floating phone card - Today's Orders */}
            <div className="mock-card mock-phone-card mock-float-right">
                <div className="mock-phone-label">TODAY'S ORDERS</div>
                <div className="mock-phone-value">128</div>
                <div className="mock-phone-sub">+12% from last month</div>
                <div className="mock-phone-bars">
                    <div className="mock-phone-bar-row">
                        <span className="mock-dot green" /> <div className="mock-phone-bar" style={{ width: '85%' }} />
                    </div>
                    <div className="mock-phone-bar-row">
                        <span className="mock-dot gold" /> <div className="mock-phone-bar" style={{ width: '60%' }} />
                    </div>
                </div>
            </div>

            {/* Bottom floating chips */}
            <div className="mock-card mock-chip mock-float-bottom-left">
                <div className="mock-icon-xs mock-icon-gold">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                </div>
                <div>
                    <div className="mock-chip-label">Avg. Process Time</div>
                    <div className="mock-chip-value">2.4s</div>
                </div>
            </div>

            <div className="mock-card mock-chip mock-float-bottom-right">
                <div className="mock-icon-xs mock-icon-emerald">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                </div>
                <div>
                    <div className="mock-chip-label">SECURED</div>
                    <div className="mock-chip-value">End-to-end encrypted</div>
                </div>
            </div>
        </div>
    );
}

/* ── FEATURE A: Sales Dashboard ── */
function SalesMockup() {
    return (
        <div className="mockup-composition feature-comp">
            <div className="mock-card mock-feature-main">
                <div className="mock-card-header">
                    <div className="mock-icon-sm mock-icon-green">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>
                    </div>
                    <div>
                        <div className="mock-card-title">Sales Overview</div>
                        <div className="mock-card-subtitle">Live Dashboard</div>
                    </div>
                </div>
                {/* Mini line chart */}
                <div className="mock-line-chart">
                    <svg viewBox="0 0 200 60" fill="none" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2ECC71" stopOpacity="0.3" />
                                <stop offset="100%" stopColor="#2ECC71" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path d="M0 50 Q20 45, 40 38 T80 30 T120 20 T160 25 T200 10" stroke="#2ECC71" strokeWidth="2.5" fill="none" />
                        <path d="M0 50 Q20 45, 40 38 T80 30 T120 20 T160 25 T200 10 L200 60 L0 60 Z" fill="url(#salesGrad)" />
                    </svg>
                </div>
                {/* Mini kpi row */}
                <div className="mock-kpi-row">
                    <div className="mock-kpi-mini">
                        <span className="mock-kpi-mini-label">Revenue</span>
                        <span className="mock-kpi-mini-val">₱125.4K</span>
                    </div>
                    <div className="mock-kpi-mini">
                        <span className="mock-kpi-mini-label">Orders</span>
                        <span className="mock-kpi-mini-val">1,847</span>
                    </div>
                    <div className="mock-kpi-mini">
                        <span className="mock-kpi-mini-label">Avg Order</span>
                        <span className="mock-kpi-mini-val">₱67.90</span>
                    </div>
                </div>
            </div>
            {/* Floating badge */}
            <div className="mock-card mock-badge-float mock-float-top-right">
                <span className="mock-live-dot" />
                Real-Time
            </div>
            {/* Transaction mini list */}
            <div className="mock-card mock-mini-list mock-float-bottom-right">
                <div className="mock-card-title" style={{ fontSize: '10px', marginBottom: '8px' }}>Recent Transactions</div>
                {['Coffee Beans × 2', 'Milk Tea × 1', 'Pastry Box × 3'].map((item, i) => (
                    <div key={i} className="mock-list-row">
                        <span>{item}</span>
                        <span className="mock-list-amount">₱{(120 + i * 45).toFixed(0)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ── FEATURE B: Inventory ── */
function InventoryMockup() {
    return (
        <div className="mockup-composition feature-comp">
            <div className="mock-card mock-feature-main">
                <div className="mock-card-header">
                    <div className="mock-icon-sm mock-icon-green">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>
                    </div>
                    <div>
                        <div className="mock-card-title">Inventory Status</div>
                        <div className="mock-card-subtitle">Stock Levels</div>
                    </div>
                </div>
                {/* Stock bars */}
                <div className="mock-stock-list">
                    {[
                        { name: 'Coffee Beans', pct: 85, color: '#2ECC71' },
                        { name: 'Paper Cups', pct: 42, color: '#D4AF37' },
                        { name: 'Sugar Packs', pct: 18, color: '#e74c3c' },
                        { name: 'Milk Cartons', pct: 67, color: '#2ECC71' },
                    ].map((item, i) => (
                        <div key={i} className="mock-stock-row">
                            <div className="mock-stock-info">
                                <span className="mock-stock-name">{item.name}</span>
                                <span className="mock-stock-pct">{item.pct}%</span>
                            </div>
                            <div className="mock-stock-bar-bg">
                                <div className="mock-stock-bar-fill" style={{ width: `${item.pct}%`, background: item.color }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Alert badge */}
            <div className="mock-card mock-badge-float mock-float-bottom-left" style={{ borderLeft: '3px solid #e74c3c' }}>
                <div className="mock-icon-xs mock-icon-red">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                </div>
                <div>
                    <div className="mock-badge-num" style={{ color: '#e74c3c', fontSize: '12px' }}>LOW STOCK ALERT</div>
                    <div className="mock-badge-sub">3 items need ordering</div>
                </div>
            </div>
            {/* KPI metric */}
            <div className="mock-card mock-chip mock-float-top-right">
                <div style={{ textAlign: 'center' }}>
                    <div className="mock-chip-value" style={{ fontSize: '20px', color: '#1a1a1a' }}>248</div>
                    <div className="mock-chip-label" style={{ fontSize: '9px' }}>TOTAL PRODUCTS</div>
                </div>
            </div>
        </div>
    );
}

/* ── FEATURE C: Transactions ── */
function TransactionMockup() {
    return (
        <div className="mockup-composition feature-comp">
            <div className="mock-card mock-feature-main" style={{ padding: '0', overflow: 'hidden' }}>
                <div className="mock-card-header" style={{ background: '#f8f9fa', padding: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <div className="mock-icon-sm mock-icon-green">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    </div>
                    <div>
                        <div className="mock-card-title">Quick Checkout</div>
                        <div className="mock-card-subtitle">Order #1847</div>
                    </div>
                </div>
                {/* Receipt items pure CSS */}
                <div className="mock-receipt-body">
                    <div className="mock-receipt-row">
                        <span>Americano (L) ×2</span>
                        <span>₱180</span>
                    </div>
                    <div className="mock-receipt-row">
                        <span>Croissant ×1</span>
                        <span>₱95</span>
                    </div>
                    <div className="mock-receipt-row">
                        <span>Cheesecake ×1</span>
                        <span>₱150</span>
                    </div>
                    <div className="mock-receipt-divider" />
                    <div className="mock-receipt-row mock-receipt-total">
                        <span>Total</span>
                        <span>₱425.00</span>
                    </div>
                </div>
                {/* Payment buttons */}
                <div className="mock-payment-methods">
                    <div className="mock-pay-btn mock-pay-active">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" /><line x1="1" y1="10" x2="23" y2="10" /></svg>
                        Card
                    </div>
                    <div className="mock-pay-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                        Cash
                    </div>
                    <div className="mock-pay-btn">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                        E-Wallet
                    </div>
                </div>
            </div>
            {/* Success badge */}
            <div className="mock-card mock-chip mock-float-top-right">
                <div className="mock-icon-xs mock-icon-emerald">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <div>
                    <div className="mock-chip-label" style={{ color: '#2ECC71' }}>Verified & Secure</div>
                    <div className="mock-chip-value">End-to-end encrypted</div>
                </div>
            </div>
        </div>
    );
}

/* ── FEATURE D: Analytics ── */
function AnalyticsMockup() {
    return (
        <div className="mockup-composition feature-comp">
            <div className="mock-card mock-feature-main">
                <div className="mock-card-header">
                    <div className="mock-icon-sm mock-icon-green">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
                    </div>
                    <div>
                        <div className="mock-card-title">Performance Analytics</div>
                        <div className="mock-card-subtitle">Monthly Report</div>
                    </div>
                </div>
                {/* Donut + bars side by side */}
                <div className="mock-analytics-grid">
                    <div className="mock-donut-wrap">
                        <svg viewBox="0 0 80 80" className="mock-donut">
                            <circle cx="40" cy="40" r="30" fill="none" stroke="#e8e8ef" strokeWidth="8" />
                            <circle cx="40" cy="40" r="30" fill="none" stroke="#1F7A63" strokeWidth="8" strokeDasharray="113 188" strokeLinecap="round" transform="rotate(-90 40 40)" />
                            <circle cx="40" cy="40" r="30" fill="none" stroke="#2ECC71" strokeWidth="8" strokeDasharray="45 188" strokeDashoffset="-113" strokeLinecap="round" transform="rotate(-90 40 40)" />
                            <circle cx="40" cy="40" r="30" fill="none" stroke="#D4AF37" strokeWidth="8" strokeDasharray="30 188" strokeDashoffset="-158" strokeLinecap="round" transform="rotate(-90 40 40)" />
                        </svg>
                        <div className="mock-donut-labels">
                            <span><i style={{ background: '#1F7A63' }} /> Food</span>
                            <span><i style={{ background: '#2ECC71' }} /> Drinks</span>
                            <span><i style={{ background: '#D4AF37' }} /> Others</span>
                        </div>
                    </div>
                    <div className="mock-rank-list">
                        <div className="mock-card-title" style={{ fontSize: '10px', marginBottom: '6px' }}>Top Products</div>
                        {[
                            { n: 'Iced Latte', v: '₱28.5K', r: 1 },
                            { n: 'Croissant', v: '₱21.2K', r: 2 },
                            { n: 'Cheesecake', v: '₱16.9K', r: 3 },
                        ].map((p, i) => (
                            <div key={i} className="mock-rank-row">
                                <span className="mock-rank-num">{p.r}</span>
                                <span className="mock-rank-name">{p.n}</span>
                                <span className="mock-rank-val">{p.v}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* Growth badge */}
            <div className="mock-card mock-badge-float mock-float-top-right" style={{ background: '#0f1f1a', border: 'none' }}>
                <div className="mock-badge-num" style={{ color: '#2ECC71' }}>+24%</div>
                <div className="mock-badge-sub" style={{ color: 'rgba(255,255,255,0.6)' }}>Monthly Growth</div>
            </div>
            {/* Revenue chip */}
            <div className="mock-card mock-chip mock-float-bottom-left">
                <div className="mock-icon-xs mock-icon-gold">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>
                </div>
                <div>
                    <div className="mock-chip-label">Total Revenue</div>
                    <div className="mock-chip-value" style={{ color: '#1F7A63', fontWeight: 700 }}>₱245,780</div>
                </div>
            </div>
        </div>
    );
}


/* ─── Landing Page ─── */
export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Smart POS System">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=inter:300,400,500,600,700,800,900|poppins:400,500,600,700,800" rel="stylesheet" />
            </Head>

            <div className="landing-page">
                {/* ───────── NAVBAR ───────── */}
                <nav className="landing-nav">
                    <div className="landing-container nav-inner">
                        <a href="/" className="nav-logo">
                            <div className="logo-icon">
                                <IconZap />
                            </div>
                            <span>TreeBytes<span className="logo-accent">POS</span></span>
                        </a>
                        <div className="nav-links">
                            <a href="#features">Features</a>
                            <a href="#benefits">Benefits</a>
                            <a href="#how-it-works">How It Works</a>
                            <a href="#pricing">Pricing</a>
                        </div>
                        <div className="nav-actions">
                            {auth.user ? (
                                <Link href={route('dashboard')} className="btn btn-primary btn-sm">Dashboard</Link>
                            ) : (
                                <>
                                    <Link href={route('login')} className="btn btn-ghost btn-sm">Log In</Link>
                                    <Link href={route('register')} className="btn btn-gold btn-sm">Get Started</Link>
                                </>
                            )}
                        </div>
                        <button className="mobile-menu-btn" onClick={() => document.querySelector('.nav-links')?.classList.toggle('show')} aria-label="Toggle menu">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
                        </button>
                    </div>
                </nav>

                {/* ───────── HERO SECTION ───────── */}
                <section className="hero-section">
                    <div className="hero-gradient-orb hero-orb-1" />
                    <div className="hero-gradient-orb hero-orb-2" />
                    <div className="landing-container hero-inner">
                        <RevealSection className="hero-content">
                            <span className="hero-badge">
                                <IconStar />
                                #1 Rated POS Solution
                            </span>
                            <h1 className="hero-title">
                                Smart POS System for <span className="hero-highlight">Growing Businesses</span>
                            </h1>
                            <p className="hero-subtitle">
                                Manage sales, inventory, and transactions in real-time with ease and confidence.
                                Empower your business with intelligent tools built for modern retail.
                            </p>
                            <div className="hero-actions">
                                <Link href={route('register')} className="btn btn-gold btn-lg">
                                    Get Started <IconArrowRight />
                                </Link>
                                <a href="#features" className="btn btn-outline btn-lg">
                                    Request Demo
                                </a>
                            </div>
                            <div className="hero-social-proof">
                                <div className="avatar-stack">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className="avatar-circle" style={{ background: ['#1F7A63', '#2ECC71', '#D4AF37', '#17614e'][i - 1] }}>
                                            {['J', 'M', 'A', 'K'][i - 1]}
                                        </div>
                                    ))}
                                </div>
                                <div className="hero-proof-text">
                                    <div className="hero-stars">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <span key={i} className="star-icon"><IconStar /></span>
                                        ))}
                                    </div>
                                    <span>Trusted by <strong>2,500+</strong> businesses</span>
                                </div>
                            </div>
                        </RevealSection>
                        <RevealSection className="hero-image" delay="0.15s">
                            <HeroMockup />
                        </RevealSection>
                    </div>
                </section>

                {/* ───────── TRUST VALUE STRIP ───────── */}
                <section className="trust-strip">
                    <div className="landing-container">
                        <p className="trust-label">Built for modern retail and business operations</p>
                        <div className="trust-grid">
                            {[
                                { icon: <IconMonitor />, title: 'Real-time Sales Monitoring', desc: 'Track every transaction as it happens' },
                                { icon: <IconShield />, title: 'Secure Transactions', desc: 'Enterprise-grade data protection' },
                                { icon: <IconPackage />, title: 'Easy Inventory Control', desc: 'Auto stock updates & alerts' },
                                { icon: <IconCloud />, title: 'Cloud-Based Access', desc: 'Access anywhere, anytime' },
                            ].map((item, i) => (
                                <RevealSection key={i} className="trust-card" delay={`${i * 0.07}s`}>
                                    <div className="trust-card-icon">{item.icon}</div>
                                    <h4>{item.title}</h4>
                                    <p>{item.desc}</p>
                                </RevealSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ───────── FEATURE SECTIONS ───────── */}
                <section id="features" className="features-section">
                    <div className="landing-container">
                        <RevealSection className="section-header">
                            <span className="section-badge">Features</span>
                            <h2>Everything You Need to Run Your Business</h2>
                            <p>Powerful tools designed to simplify your daily operations</p>
                        </RevealSection>

                        {/* Feature A */}
                        <div className="feature-row">
                            <RevealSection className="feature-text">
                                <span className="feature-tag">Sales Management</span>
                                <h3>Manage Sales Anytime, Anywhere</h3>
                                <p>
                                    Real-time tracking and a centralized dashboard give you complete visibility over your business.
                                    Monitor transactions, review daily summaries, and make informed decisions from any device.
                                </p>
                                <ul className="feature-list">
                                    <li><IconCheck /> Live transaction monitoring</li>
                                    <li><IconCheck /> Daily & weekly sales summaries</li>
                                    <li><IconCheck /> Multi-location support</li>
                                </ul>
                            </RevealSection>
                            <RevealSection className="feature-image-area" delay="0.1s">
                                <SalesMockup />
                            </RevealSection>
                        </div>

                        {/* Feature B */}
                        <div className="feature-row feature-row-reverse">
                            <RevealSection className="feature-text">
                                <span className="feature-tag">Inventory</span>
                                <h3>Smart Inventory Management</h3>
                                <p>
                                    Automatic stock updates, low-stock alerts, and detailed reports keep your shelves stocked
                                    and your customers happy. Never miss a sale due to stockouts again.
                                </p>
                                <ul className="feature-list">
                                    <li><IconCheck /> Automatic stock level updates</li>
                                    <li><IconCheck /> Low-stock alerts & notifications</li>
                                    <li><IconCheck /> Supplier management tools</li>
                                </ul>
                            </RevealSection>
                            <RevealSection className="feature-image-area" delay="0.1s">
                                <InventoryMockup />
                            </RevealSection>
                        </div>

                        {/* Feature C */}
                        <div className="feature-row">
                            <RevealSection className="feature-text">
                                <span className="feature-tag">Transactions</span>
                                <h3>Fast & Secure Transactions</h3>
                                <p>
                                    Process payments quickly and reliably with our streamlined checkout system.
                                    Generate digital receipts, handle refunds, and support multiple payment methods seamlessly.
                                </p>
                                <ul className="feature-list">
                                    <li><IconCheck /> Multiple payment methods</li>
                                    <li><IconCheck /> Digital receipt generation</li>
                                    <li><IconCheck /> Refund & return management</li>
                                </ul>
                            </RevealSection>
                            <RevealSection className="feature-image-area" delay="0.1s">
                                <TransactionMockup />
                            </RevealSection>
                        </div>

                        {/* Feature D */}
                        <div className="feature-row feature-row-reverse">
                            <RevealSection className="feature-text">
                                <span className="feature-tag">Analytics</span>
                                <h3>Analytics That Drive Growth</h3>
                                <p>
                                    Gain actionable insights from comprehensive sales reports, performance tracking,
                                    and trend analysis. Make data-driven decisions that fuel your business growth.
                                </p>
                                <ul className="feature-list">
                                    <li><IconCheck /> Revenue & profit tracking</li>
                                    <li><IconCheck /> Product performance reports</li>
                                    <li><IconCheck /> Exportable data & charts</li>
                                </ul>
                            </RevealSection>
                            <RevealSection className="feature-image-area" delay="0.1s">
                                <AnalyticsMockup />
                            </RevealSection>
                        </div>
                    </div>
                </section>

                {/* ───────── BENEFITS SECTION ───────── */}
                <section id="benefits" className="benefits-section">
                    <div className="landing-container">
                        <RevealSection className="section-header">
                            <span className="section-badge">Benefits</span>
                            <h2>Why Choose Our POS System?</h2>
                            <p>Designed to make running your business simpler, faster, and more profitable</p>
                        </RevealSection>
                        <div className="benefits-grid">
                            {[
                                { icon: <IconZap />, title: 'Easy to Use', desc: 'Intuitive interface that requires zero technical expertise. Get started in minutes, not days.' },
                                { icon: <IconTarget />, title: 'Accurate Reporting', desc: 'Precision data you can trust for making critical business decisions with confidence.' },
                                { icon: <IconTrendingUp />, title: 'Scalable for Any Business', desc: 'From a single store to a nationwide chain — our system grows with you.' },
                                { icon: <IconClock />, title: 'Saves Time & Costs', desc: 'Automate repetitive tasks and reduce operational costs by up to 40%.' },
                            ].map((item, i) => (
                                <RevealSection key={i} className="benefit-card" delay={`${i * 0.08}s`}>
                                    <div className="benefit-icon">{item.icon}</div>
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </RevealSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ───────── HOW IT WORKS ───────── */}
                <section id="how-it-works" className="how-it-works-section">
                    <div className="landing-container">
                        <RevealSection className="section-header">
                            <span className="section-badge">How It Works</span>
                            <h2>Get Started in 4 Simple Steps</h2>
                            <p>From setup to sales in minutes — no complicated configurations</p>
                        </RevealSection>
                        <div className="steps-grid">
                            {[
                                { icon: <IconStore />, step: '01', title: 'Set Up Your Store', desc: 'Create your account and configure your store settings in just a few clicks.' },
                                { icon: <IconBox />, step: '02', title: 'Add Products & Inventory', desc: 'Import or manually add your product catalog with prices and stock quantities.' },
                                { icon: <IconShoppingCart />, step: '03', title: 'Start Selling', desc: 'Begin processing transactions immediately with our intuitive checkout flow.' },
                                { icon: <IconBarChart />, step: '04', title: 'Track & Grow', desc: 'Monitor your sales performance and use insights to grow your business.' },
                            ].map((item, i) => (
                                <RevealSection key={i} className="step-card" delay={`${i * 0.1}s`}>
                                    <div className="step-number">{item.step}</div>
                                    <div className="step-icon">{item.icon}</div>
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </RevealSection>
                            ))}
                        </div>
                    </div>
                </section>

                {/* ───────── REPEAT CTA ───────── */}
                <section className="cta-section">
                    <div className="cta-gradient-orb cta-orb-1" />
                    <div className="cta-gradient-orb cta-orb-2" />
                    <div className="landing-container cta-inner">
                        <RevealSection>
                            <h2>Start Managing Your Business Smarter Today</h2>
                            <p>No complicated setup. No hidden costs. Just the tools you need to grow.</p>
                            <div className="cta-actions">
                                <Link href={route('register')} className="btn btn-gold btn-lg">
                                    Get Started Now <IconArrowRight />
                                </Link>
                            </div>
                        </RevealSection>
                    </div>
                </section>

                {/* ───────── PRICING PREVIEW ───────── */}
                <section id="pricing" className="pricing-section">
                    <div className="landing-container">
                        <RevealSection className="section-header">
                            <span className="section-badge">Pricing</span>
                            <h2>Affordable Plans for Every Business Size</h2>
                            <p>Start free, upgrade when you're ready. No surprises.</p>
                        </RevealSection>
                        <div className="pricing-grid">
                            <RevealSection className="pricing-card" delay="0s">
                                <div className="pricing-card-header">
                                    <h3>Starter</h3>
                                    <p className="pricing-desc">Perfect for small stores just getting started</p>
                                </div>
                                <div className="pricing-price">
                                    <span className="price-currency">₱</span>
                                    <span className="price-amount">0</span>
                                    <span className="price-period">/month</span>
                                </div>
                                <ul className="pricing-features">
                                    <li><IconCheck /> Up to 100 products</li>
                                    <li><IconCheck /> 1 user account</li>
                                    <li><IconCheck /> Basic sales reports</li>
                                    <li><IconCheck /> Email support</li>
                                </ul>
                                <a href="#" className="btn btn-outline btn-full">Get Started Free</a>
                            </RevealSection>

                            <RevealSection className="pricing-card pricing-card-featured" delay="0.08s">
                                <div className="pricing-popular-badge">Most Popular</div>
                                <div className="pricing-card-header">
                                    <h3>Professional</h3>
                                    <p className="pricing-desc">For growing businesses that need more power</p>
                                </div>
                                <div className="pricing-price">
                                    <span className="price-currency">₱</span>
                                    <span className="price-amount">1,499</span>
                                    <span className="price-period">/month</span>
                                </div>
                                <ul className="pricing-features">
                                    <li><IconCheck /> Unlimited products</li>
                                    <li><IconCheck /> Up to 5 users</li>
                                    <li><IconCheck /> Advanced analytics</li>
                                    <li><IconCheck /> Inventory management</li>
                                    <li><IconCheck /> Priority support</li>
                                </ul>
                                <Link href={route('register')} className="btn btn-gold btn-full">Start Free Trial</Link>
                            </RevealSection>

                            <RevealSection className="pricing-card" delay="0.16s">
                                <div className="pricing-card-header">
                                    <h3>Enterprise</h3>
                                    <p className="pricing-desc">Custom solutions for large-scale operations</p>
                                </div>
                                <div className="pricing-price">
                                    <span className="price-currency">₱</span>
                                    <span className="price-amount">4,999</span>
                                    <span className="price-period">/month</span>
                                </div>
                                <ul className="pricing-features">
                                    <li><IconCheck /> Everything in Pro</li>
                                    <li><IconCheck /> Unlimited users</li>
                                    <li><IconCheck /> Multi-location support</li>
                                    <li><IconCheck /> API access</li>
                                    <li><IconCheck /> Dedicated account manager</li>
                                </ul>
                                <a href="#" className="btn btn-outline btn-full">Contact Sales</a>
                            </RevealSection>
                        </div>
                    </div>
                </section>

                {/* ───────── FOOTER ───────── */}
                <footer className="landing-footer">
                    <div className="landing-container footer-inner">
                        <div className="footer-brand">
                            <a href="/" className="nav-logo">
                                <div className="logo-icon">
                                    <IconZap />
                                </div>
                                <span>TreeBytes<span className="logo-accent">POS</span></span>
                            </a>
                            <p>
                                Empowering businesses with smart, reliable, and intuitive point-of-sale solutions.
                                Built for speed. Designed for growth.
                            </p>
                            <div className="footer-socials">
                                <a href="#" aria-label="Facebook">
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                                </a>
                                <a href="#" aria-label="Twitter">
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                </a>
                                <a href="#" aria-label="Instagram">
                                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                                </a>
                            </div>
                        </div>
                        <div className="footer-links-group">
                            <div className="footer-col">
                                <h4>Product</h4>
                                <a href="#features">Features</a>
                                <a href="#pricing">Pricing</a>
                                <a href="#how-it-works">How It Works</a>
                                <a href="#">Integrations</a>
                            </div>
                            <div className="footer-col">
                                <h4>Company</h4>
                                <a href="#">About Us</a>
                                <a href="#">Careers</a>
                                <a href="#">Blog</a>
                                <a href="#">Contact</a>
                            </div>
                            <div className="footer-col">
                                <h4>Support</h4>
                                <a href="#">Help Center</a>
                                <a href="#">Documentation</a>
                                <a href="#">Privacy Policy</a>
                                <a href="#">Terms of Service</a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <div className="landing-container">
                            <p>&copy; {new Date().getFullYear()} TreeBytesPOS. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
