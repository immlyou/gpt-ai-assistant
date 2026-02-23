const STORAGE_KEYS = {
    INVENTORY: 'clinic_inventory',
    VENDORS: 'clinic_vendors',
    TRANSACTIONS: 'clinic_transactions'
};

// Seed data
const seedData = () => {
    if (!localStorage.getItem(STORAGE_KEYS.VENDORS)) {
        const vendors = [
            { id: '1', name: 'MediSupply Co.', phone: '555-0123', email: 'orders@medisupply.com', address: '123 Medical Blvd' },
            { id: '2', name: 'PharmaDirect', phone: '555-0456', email: 'support@pharmadirect.com', address: '456 Health Ave' }
        ];
        localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
    }

    if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
        const inventory = [
            { id: '1', name: 'Surgical Masks', sku: 'MSK-001', category: 'Consumables', quantity: 500, minStock: 100, price: 0.5 },
            { id: '2', name: 'Latex Gloves (M)', sku: 'GLV-002', category: 'Consumables', quantity: 50, minStock: 100, price: 0.2 },
            { id: '3', name: 'Syringes 5ml', sku: 'SYR-003', category: 'Equipment', quantity: 200, minStock: 50, price: 1.5 }
        ];
        localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    }
};

// Initialize seed data
if (typeof window !== 'undefined') {
    seedData();
}

export const getInventory = () => {
    const data = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return data ? JSON.parse(data) : [];
};

export const saveInventory = (inventory) => {
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
};

export const getVendors = () => {
    const data = localStorage.getItem(STORAGE_KEYS.VENDORS);
    return data ? JSON.parse(data) : [];
};

export const saveVendors = (vendors) => {
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
};

export const getTransactions = () => {
    const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return data ? JSON.parse(data) : [];
};

export const saveTransactions = (transactions) => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const addTransaction = (transaction) => {
    const transactions = getTransactions();
    const newTransaction = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        ...transaction
    };
    transactions.unshift(newTransaction);
    saveTransactions(transactions);
    return newTransaction;
};
