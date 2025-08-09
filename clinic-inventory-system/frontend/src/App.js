import React, { useState, useEffect } from 'react';
// import axios from 'axios'; // No longer needed for mock data
import './App.css';

// Mock Data
const mockInventoryData = [
  { id: 1, vaccine_id: 1, vaccine_name: 'COVID-19 - Pfizer', manufacturer: 'Pfizer-BioNTech', lot_number: 'PFIZER001', quantity_on_hand: 50, expiration_date: '2025-12-31' },
  { id: 2, vaccine_id: 2, vaccine_name: 'COVID-19 - Moderna', manufacturer: 'Moderna', lot_number: 'MODERNA002', quantity_on_hand: 30, expiration_date: '2025-11-30' },
  { id: 3, vaccine_id: 3, vaccine_name: 'Fluarix Quadrivalent', manufacturer: 'GSK', lot_number: 'GSKFLU003', quantity_on_hand: 100, expiration_date: '2026-08-15' },
];

const mockVaccinesData = [
    { id: 1, name: 'COVID-19 - Pfizer', manufacturer: 'Pfizer-BioNTech', type: 'Government-funded', total_doses_required: 2 },
    { id: 2, name: 'COVID-19 - Moderna', manufacturer: 'Moderna', type: 'Government-funded', total_doses_required: 2 },
    { id: 3, name: 'Fluarix Quadrivalent', manufacturer: 'GSK', type: 'Self-paid', total_doses_required: 1 },
];


function App() {
  const [inventory, setInventory] = useState(mockInventoryData);
  const [vaccines, setVaccines] = useState(mockVaccinesData);

  // --- Form State ---
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLot, setNewLot] = useState({ vaccine_id: '', lot_number: '', quantity_on_hand: '', expiration_date: '' });

  const handleAddInventory = (e) => {
    e.preventDefault();
    const selectedVaccine = vaccines.find(v => v.id === parseInt(newLot.vaccine_id));
    const newInventoryItem = {
      id: inventory.length + 1, // simple id generation
      ...newLot,
      vaccine_name: selectedVaccine.name,
      manufacturer: selectedVaccine.manufacturer,
      quantity_on_hand: parseInt(newLot.quantity_on_hand)
    };
    setInventory([...inventory, newInventoryItem]);
    setNewLot({ vaccine_id: '', lot_number: '', quantity_on_hand: '', expiration_date: '' });
    setShowAddForm(false);
  };

  const handleLogUsage = (itemId) => {
    setInventory(inventory.map(item => {
      if (item.id === itemId && item.quantity_on_hand > 0) {
        return { ...item, quantity_on_hand: item.quantity_on_hand - 1 };
      }
      return item;
    }).filter(item => item.quantity_on_hand > 0)); // Optionally remove if quantity reaches 0
  };

  return (
    <div className="App-container">
      <header>
        <h1>Clinic Vaccine Inventory (Demo Mode)</h1>
      </header>
      <main>
        {/* --- Add Inventory Section --- */}
        <div className="form-section">
            <button onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? 'Cancel' : 'Add New Inventory Lot'}
            </button>
            {showAddForm && (
                <form onSubmit={handleAddInventory} className="add-form">
                    <h3>Add New Lot</h3>
                    <select
                        value={newLot.vaccine_id}
                        onChange={(e) => setNewLot({...newLot, vaccine_id: e.target.value})}
                        required
                    >
                        <option value="">Select Vaccine</option>
                        {vaccines.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                    </select>
                    <input
                        type="text"
                        placeholder="Lot Number"
                        value={newLot.lot_number}
                        onChange={(e) => setNewLot({...newLot, lot_number: e.target.value})}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={newLot.quantity_on_hand}
                        onChange={(e) => setNewLot({...newLot, quantity_on_hand: e.target.value})}
                        required
                    />
                    <input
                        type="date"
                        placeholder="Expiration Date"
                        value={newLot.expiration_date}
                        onChange={(e) => setNewLot({...newLot, expiration_date: e.target.value})}
                        required
                    />
                    <button type="submit">Add Lot</button>
                </form>
            )}
        </div>

        {/* --- Inventory Display Section --- */}
        <div className="inventory-section">
          <h2>Current Inventory</h2>
          <table>
            <thead>
              <tr>
                <th>Vaccine Name</th>
                <th>Manufacturer</th>
                <th>Lot Number</th>
                <th>Quantity</th>
                <th>Expiration Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inventory.length > 0 ? (
                inventory.map((item) => (
                  <tr key={item.id} className={new Date(item.expiration_date) < new Date() ? 'expired' : ''}>
                    <td>{item.vaccine_name}</td>
                    <td>{item.manufacturer}</td>
                    <td>{item.lot_number}</td>
                    <td>{item.quantity_on_hand}</td>
                    <td>{new Date(item.expiration_date).toLocaleDateString()}</td>
                    <td>
                      <button onClick={() => handleLogUsage(item.id)} disabled={item.quantity_on_hand === 0}>
                        Log 1 Dose Used
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No inventory found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;
