import React, { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';
import { getTransactions } from '../utils/storage';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        setTransactions(getTransactions());
    }, []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.875rem', fontWeight: '700' }}>Transactions</h2>
                <button className="btn btn-secondary">
                    <Filter size={20} />
                    Filter
                </button>
            </div>

            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Type</th>
                                <th>Item</th>
                                <th>Quantity</th>
                                <th>Date</th>
                                <th>User</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.length === 0 ? (
                                <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                        No transactions recorded yet.
                                    </td>
                                </tr>
                            ) : (
                                transactions.map(tx => (
                                    <tr key={tx.id}>
                                        <td>
                                            <span className={`badge ${tx.type === 'IN' ? 'badge-success' : 'badge-warning'}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                                                {tx.type === 'IN' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />}
                                                {tx.type === 'IN' ? 'Stock In' : 'Stock Out'}
                                            </span>
                                        </td>
                                        <td>{tx.itemName}</td>
                                        <td style={{ fontWeight: '600', color: tx.type === 'IN' ? 'var(--accent-success)' : 'var(--accent-danger)' }}>
                                            {tx.type === 'IN' ? '+' : '-'}{tx.quantity}
                                        </td>
                                        <td>{new Date(tx.date).toLocaleDateString()}</td>
                                        <td>{tx.user}</td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{tx.notes}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Transactions;
