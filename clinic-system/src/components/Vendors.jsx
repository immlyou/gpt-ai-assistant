import React, { useState, useEffect } from 'react';
import { Plus, Search, Phone, Mail, MapPin } from 'lucide-react';
import { getVendors, saveVendors } from '../utils/storage';

const Vendors = () => {
    const [vendors, setVendors] = useState([]);

    useEffect(() => {
        setVendors(getVendors());
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Vendors</h2>
                <button className="btn btn-primary">
                    <Plus size={20} />
                    Add Vendor
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {vendors.length === 0 ? (
                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                        <p style={{ color: 'var(--text-secondary)' }}>No vendors found. Add your first vendor.</p>
                    </div>
                ) : (
                    vendors.map(vendor => (
                        <div key={vendor.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{vendor.name}</h3>
                                <span className="badge badge-success">Active</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Phone size={16} />
                                    {vendor.phone}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Mail size={16} />
                                    {vendor.email}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <MapPin size={16} />
                                    {vendor.address}
                                </div>
                            </div>

                            <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '0.5rem' }}>
                                <button className="btn btn-secondary" style={{ flex: 1 }}>Edit</button>
                                <button className="btn btn-secondary" style={{ flex: 1 }}>History</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Vendors;
