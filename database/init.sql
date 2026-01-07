-- DomusAI Database Initialization Script
-- PostgreSQL Schema for Condominium Management

-- Drop existing tables if they exist (careful in production!)
DROP TABLE IF EXISTS unit_millesimals CASCADE;
DROP TABLE IF EXISTS units CASCADE;
DROP TABLE IF EXISTS people CASCADE;
DROP TABLE IF EXISTS millesimal_tables CASCADE;
DROP TABLE IF EXISTS condominiums CASCADE;

-- Create condominiums table
CREATE TABLE condominiums (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  street_number VARCHAR(50) NOT NULL,
  cap VARCHAR(10) NOT NULL,
  city VARCHAR(255) NOT NULL,
  province VARCHAR(10) NOT NULL,
  fiscal_code VARCHAR(16) NOT NULL,
  cadastral_data TEXT,
  construction_year INTEGER,
  number_of_floors INTEGER,
  number_of_staircases INTEGER,
  number_of_units INTEGER NOT NULL DEFAULT 0,
  monthly_fee DECIMAL(10, 2),
  image_url TEXT,
  has_elevator BOOLEAN DEFAULT FALSE,
  has_central_heating BOOLEAN DEFAULT FALSE,
  has_garden BOOLEAN DEFAULT FALSE,
  has_parking BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create millesimal_tables table
CREATE TABLE millesimal_tables (
  id VARCHAR(255) PRIMARY KEY,
  condominium_id VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (condominium_id) REFERENCES condominiums(id) ON DELETE CASCADE
);

-- Create people table
CREATE TABLE people (
  id VARCHAR(255) PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  pec VARCHAR(255),
  phone VARCHAR(50),
  fiscal_code VARCHAR(16) NOT NULL UNIQUE,
  residence_address TEXT,
  role VARCHAR(50) NOT NULL CHECK (role IN ('Proprietario', 'Inquilino', 'Comproprietario')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create units table
CREATE TABLE units (
  id VARCHAR(255) PRIMARY KEY,
  condominium_id VARCHAR(255) NOT NULL,
  internal VARCHAR(50) NOT NULL,
  staircase VARCHAR(10),
  floor VARCHAR(10) NOT NULL,
  subalterno VARCHAR(255),
  type VARCHAR(50) NOT NULL CHECK (type IN ('Appartamento', 'Box', 'Cantina', 'Negozio')),
  surface DECIMAL(10, 2),
  monthly_fee DECIMAL(10, 2),
  owner_id VARCHAR(255) NOT NULL,
  tenant_id VARCHAR(255),
  is_rented BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (condominium_id) REFERENCES condominiums(id) ON DELETE CASCADE,
  FOREIGN KEY (owner_id) REFERENCES people(id),
  FOREIGN KEY (tenant_id) REFERENCES people(id)
);

-- Create unit_millesimals table (for storing millesimal values)
CREATE TABLE unit_millesimals (
  id SERIAL PRIMARY KEY,
  unit_id VARCHAR(255) NOT NULL,
  table_code VARCHAR(10) NOT NULL,
  value DECIMAL(10, 3) NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (unit_id) REFERENCES units(id) ON DELETE CASCADE,
  UNIQUE(unit_id, table_code)
);

-- Create indexes for better performance
CREATE INDEX idx_units_condominium ON units(condominium_id);
CREATE INDEX idx_units_owner ON units(owner_id);
CREATE INDEX idx_units_tenant ON units(tenant_id);
CREATE INDEX idx_millesimal_tables_condo ON millesimal_tables(condominium_id);
CREATE INDEX idx_unit_millesimals_unit ON unit_millesimals(unit_id);
CREATE INDEX idx_people_fiscal_code ON people(fiscal_code);

-- Insert sample data (optional, for testing)
INSERT INTO condominiums (id, name, street, street_number, cap, city, province, fiscal_code, number_of_units, cadastral_data) VALUES
('1', 'Villa dei Fiori', 'Via Roma', '12', '20121', 'Milano', 'MI', '90012345678', 24, 'Fg. 4, Part. 120'),
('2', 'Residenza Parco', 'Viale Monza', '45', '20125', 'Milano', 'MI', '91122334455', 12, 'Fg. 12, Part. 55');

INSERT INTO millesimal_tables (id, condominium_id, name, description) VALUES
('tab_a_1', '1', 'Tabella A - Generali', 'Spese generali del condominio'),
('tab_b_1', '1', 'Tabella B - Scale', 'Spese per la manutenzione delle scale'),
('tab_c_1', '1', 'Tabella C - Ascensore', 'Spese per la manutenzione dell''ascensore'),
('tab_a_2', '2', 'Tabella A - Generali', 'Spese generali del condominio'),
('tab_b_2', '2', 'Tabella B - Riscaldamento', 'Spese per il riscaldamento centralizzato');

INSERT INTO people (id, first_name, last_name, email, phone, fiscal_code, role) VALUES
('p1', 'Mario', 'Rossi', 'mario.rossi@email.com', '333 1234567', 'RSSMRA80A01F205Z', 'Proprietario'),
('p2', 'Laura', 'Bianchi', 'laura.bianchi@email.com', '333 7654321', 'BNCLRA85M50F205Y', 'Proprietario'),
('p3', 'Giuseppe', 'Verdi', 'giuseppe.verdi@email.com', '333 1111111', 'VRDGPP75C15F205X', 'Inquilino');

INSERT INTO units (id, condominium_id, internal, staircase, floor, type, owner_id, subalterno) VALUES
('u1', '1', '1', 'A', '1', 'Appartamento', 'p1', 'Sub. 12'),
('u2', '1', '2', 'A', '2', 'Appartamento', 'p2', 'Sub. 13');

INSERT INTO unit_millesimals (unit_id, table_code, value) VALUES
('u1', 'A', 45.500),
('u1', 'B', 50.000),
('u1', 'C', 48.250),
('u2', 'A', 52.300),
('u2', 'B', 55.100),
('u2', 'C', 51.750);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_condominiums_updated_at BEFORE UPDATE ON condominiums
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_people_updated_at BEFORE UPDATE ON people
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_units_updated_at BEFORE UPDATE ON units
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions (adjust based on your user)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_user;

COMMIT;
