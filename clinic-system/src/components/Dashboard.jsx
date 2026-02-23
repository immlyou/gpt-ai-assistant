import React, { useEffect, useState } from 'react';
import { Package, AlertTriangle, Users, TrendingUp } from 'lucide-react';
import { getInventory, getVendors } from '../utils/storage';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{
            padding: '1rem',
            borderRadius: '12px',
            background: `rgba(${color}, 0.1)`,
            color: `rgb(${color})`
        }}>
            <Icon size={24} />
        </div>
        <div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{title}</p>
            <h3 style={{ fontSize: '1.5rem', fontWeight: '700' }}>{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    const [stats, setStats] = useState({
        totalItems: 0,
        lowStock: 0,
        totalVendors: 0,
        totalValue: 0
    });

    useEffect(() => {
        const inventory = getInventory();
        const vendors = getVendors();

        setStats({
            totalItems: inventory.length,
            lowStock: inventory.filter(i => i.quantity <= i.minStock).length,
            totalVendors: vendors.length,
            totalValue: inventory.reduce((acc, item) => acc + (item.quantity * item.price), 0)
        });
    }, []);

    return (
        <div>
            <h2 style={{ fontSize: '1.875rem', fontWeight: '700', marginBottom: '2rem' }}>Dashboard</h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatCard
                    title="Total Items"
                    value={stats.totalItems}
                    icon={Package}
                    color="56, 189, 248" // blue
                />
                <StatCard
                    title="Low Stock Alerts"
                    value={stats.lowStock}
                    icon={AlertTriangle}
                    color="248, 113, 113" // red
                />
                <StatCard
                    title="Active Vendors"
                    value={stats.totalVendors}
                    icon={Users}
                    color="168, 85, 247" // purple
                />
                <StatCard
                    title="Inventory Value"
                    value={`$${stats.totalValue.toLocaleString()}`}
                    icon={TrendingUp}
                    color="74, 222, 128" // green
                />
            </div>

            <div className="card">
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem' }}>Quick Actions</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-primary">Add New Item</button>
                    <button className="btn btn-secondary">Record Transaction</button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
