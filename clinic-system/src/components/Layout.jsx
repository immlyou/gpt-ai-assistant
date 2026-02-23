import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, Users, History, Activity } from 'lucide-react';
import '../styles/components.css';

const Layout = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/inventory', icon: Package, label: 'Inventory' },
        { path: '/vendors', icon: Users, label: 'Vendors' },
        { path: '/transactions', icon: History, label: 'Transactions' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                background: 'rgba(15, 23, 42, 0.8)',
                backdropFilter: 'blur(20px)',
                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2rem 1rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #38bdf8, #818cf8)',
                        padding: '0.5rem',
                        borderRadius: '12px',
                        display: 'flex'
                    }}>
                        <Activity size={24} color="white" />
                    </div>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: '700', background: 'linear-gradient(to right, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        ClinicOS
                    </h1>
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    padding: '0.75rem 1rem',
                                    borderRadius: '12px',
                                    color: isActive ? '#fff' : '#94a3b8',
                                    background: isActive ? 'rgba(56, 189, 248, 0.1)' : 'transparent',
                                    transition: 'all 0.2s',
                                    fontWeight: isActive ? '600' : '500'
                                }}
                            >
                                <Icon size={20} color={isActive ? '#38bdf8' : 'currentColor'} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
