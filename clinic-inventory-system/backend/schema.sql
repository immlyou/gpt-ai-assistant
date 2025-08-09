-- Main table for vaccine master data
CREATE TABLE vaccines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255),
    type VARCHAR(50), -- e.g., 'Government-funded', 'Self-paid'
    total_doses_required INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table to track each batch/lot of vaccines
CREATE TABLE inventory_lots (
    id SERIAL PRIMARY KEY,
    vaccine_id INTEGER NOT NULL REFERENCES vaccines(id),
    lot_number VARCHAR(100) NOT NULL,
    quantity_on_hand INTEGER NOT NULL,
    expiration_date DATE NOT NULL,
    received_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(vaccine_id, lot_number)
);

-- Table to log each dose administered or used
CREATE TABLE usage_logs (
    id SERIAL PRIMARY KEY,
    inventory_lot_id INTEGER NOT NULL REFERENCES inventory_lots(id),
    patient_identifier VARCHAR(255), -- Anonymized or internal patient ID
    usage_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    notes TEXT
);

-- Optional: Add some initial data for testing
INSERT INTO vaccines (name, manufacturer, type, total_doses_required) VALUES
('COVID-19 - Pfizer', 'Pfizer-BioNTech', 'Government-funded', 2),
('COVID-19 - Moderna', 'Moderna', 'Government-funded', 2),
('Fluarix Quadrivalent', 'GSK', 'Self-paid', 1);
