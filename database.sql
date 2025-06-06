-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Criação dos tipos enumerados
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');
CREATE TYPE "FuelType" AS ENUM ('GASOLINE', 'ETHANOL', 'DIESEL', 'FLEX', 'ELECTRIC', 'HYBRID');
CREATE TYPE "VehicleStatus" AS ENUM ('AVAILABLE', 'SOLD', 'MAINTENANCE', 'RESERVED');
CREATE TYPE "MaintenanceStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
CREATE TYPE "TransactionType" AS ENUM ('PURCHASE', 'SALE', 'MAINTENANCE');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');

-- Criação da tabela User
CREATE TABLE "User" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLogin" TIMESTAMPTZ,
    "loginAttempts" INTEGER NOT NULL DEFAULT 0,
    "lastLoginAttempt" TIMESTAMPTZ,
    "passwordChangedAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ,
    "createdBy" UUID REFERENCES "User"("id"),
    "updatedBy" UUID REFERENCES "User"("id"),
    "deletedBy" UUID REFERENCES "User"("id")
);

-- Criação da tabela Vehicle
CREATE TABLE "Vehicle" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "brand" VARCHAR(100) NOT NULL,
    "model" VARCHAR(100) NOT NULL,
    "year" INTEGER NOT NULL CHECK ("year" >= 1900),
    "licensePlate" VARCHAR(20) UNIQUE NOT NULL,
    "chassis" VARCHAR(50) UNIQUE NOT NULL,
    "mileage" DECIMAL(10,2) NOT NULL CHECK ("mileage" >= 0),
    "color" VARCHAR(50) NOT NULL,
    "fuelType" "FuelType" NOT NULL,
    "status" "VehicleStatus" NOT NULL DEFAULT 'AVAILABLE',
    "purchasePrice" DECIMAL(10,2) NOT NULL CHECK ("purchasePrice" > 0),
    "salePrice" DECIMAL(10,2) CHECK ("salePrice" > 0),
    "purchaseDate" TIMESTAMPTZ NOT NULL,
    "saleDate" TIMESTAMPTZ,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ,
    "createdBy" UUID REFERENCES "User"("id"),
    "updatedBy" UUID REFERENCES "User"("id"),
    "deletedBy" UUID REFERENCES "User"("id")
);

-- Criação da tabela Client
CREATE TABLE "Client" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) UNIQUE NOT NULL,
    "phone" VARCHAR(20) NOT NULL,
    "cpf" VARCHAR(14) UNIQUE NOT NULL,
    "cnh" VARCHAR(20) UNIQUE NOT NULL,
    "address" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ,
    "createdBy" UUID REFERENCES "User"("id"),
    "updatedBy" UUID REFERENCES "User"("id"),
    "deletedBy" UUID REFERENCES "User"("id")
);

-- Criação da tabela Maintenance
CREATE TABLE "Maintenance" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "vehicleId" UUID NOT NULL REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "description" TEXT NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL CHECK ("cost" > 0),
    "startDate" TIMESTAMPTZ NOT NULL,
    "endDate" TIMESTAMPTZ,
    "status" "MaintenanceStatus" NOT NULL DEFAULT 'PENDING',
    "mechanic" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela ServiceOrder
CREATE TABLE "ServiceOrder" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "maintenanceId" UUID NOT NULL REFERENCES "Maintenance"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "description" TEXT NOT NULL,
    "cost" DECIMAL(10,2) NOT NULL CHECK ("cost" > 0),
    "parts" TEXT[] NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela Transaction
CREATE TABLE "Transaction" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "vehicleId" UUID NOT NULL REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "clientId" UUID NOT NULL REFERENCES "Client"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "type" "TransactionType" NOT NULL,
    "amount" DECIMAL(10,2) NOT NULL CHECK ("amount" > 0),
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ,
    "createdBy" UUID REFERENCES "User"("id"),
    "updatedBy" UUID REFERENCES "User"("id"),
    "deletedBy" UUID REFERENCES "User"("id")
);

-- Criação da tabela Contract
CREATE TABLE "Contract" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "transactionId" UUID UNIQUE NOT NULL REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "fileName" VARCHAR(255) NOT NULL,
    "mimeType" VARCHAR(100) NOT NULL,
    "fileSize" INTEGER NOT NULL CHECK ("fileSize" > 0),
    "fileHash" VARCHAR(64) NOT NULL,
    "fileBuffer" BYTEA NOT NULL,
    "uploadDate" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela Installment
CREATE TABLE "Installment" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "transactionId" UUID NOT NULL REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "number" INTEGER NOT NULL CHECK ("number" > 0),
    "amount" DECIMAL(10,2) NOT NULL CHECK ("amount" > 0),
    "dueDate" TIMESTAMPTZ NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paidAt" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela AuditLog
CREATE TABLE "AuditLog" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" UUID NOT NULL REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    "action" VARCHAR(50) NOT NULL,
    "entity" VARCHAR(50) NOT NULL,
    "entityId" UUID NOT NULL,
    "details" JSONB NOT NULL,
    "ipAddress" VARCHAR(45),
    "timestamp" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Criação dos índices
CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

CREATE INDEX "Vehicle_licensePlate_idx" ON "Vehicle"("licensePlate");
CREATE INDEX "Vehicle_chassis_idx" ON "Vehicle"("chassis");
CREATE INDEX "Vehicle_status_idx" ON "Vehicle"("status");
CREATE INDEX "Vehicle_isActive_idx" ON "Vehicle"("isActive");

CREATE INDEX "Client_email_idx" ON "Client"("email");
CREATE INDEX "Client_cpf_idx" ON "Client"("cpf");
CREATE INDEX "Client_cnh_idx" ON "Client"("cnh");
CREATE INDEX "Client_isActive_idx" ON "Client"("isActive");

CREATE INDEX "Transaction_vehicleId_idx" ON "Transaction"("vehicleId");
CREATE INDEX "Transaction_clientId_idx" ON "Transaction"("clientId");
CREATE INDEX "Transaction_status_idx" ON "Transaction"("status");
CREATE INDEX "Transaction_isActive_idx" ON "Transaction"("isActive");

CREATE INDEX "Contract_transactionId_idx" ON "Contract"("transactionId");

CREATE INDEX "AuditLog_userId_idx" ON "AuditLog"("userId");
CREATE INDEX "AuditLog_entity_idx" ON "AuditLog"("entity");
CREATE INDEX "AuditLog_entityId_idx" ON "AuditLog"("entityId");
CREATE INDEX "AuditLog_timestamp_idx" ON "AuditLog"("timestamp");

-- Função para atualizar o updatedAt
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar o updatedAt
CREATE TRIGGER update_user_updated_at
    BEFORE UPDATE ON "User"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vehicle_updated_at
    BEFORE UPDATE ON "Vehicle"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_client_updated_at
    BEFORE UPDATE ON "Client"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenance_updated_at
    BEFORE UPDATE ON "Maintenance"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_order_updated_at
    BEFORE UPDATE ON "ServiceOrder"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transaction_updated_at
    BEFORE UPDATE ON "Transaction"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contract_updated_at
    BEFORE UPDATE ON "Contract"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_installment_updated_at
    BEFORE UPDATE ON "Installment"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Inserir usuário administrador padrão
INSERT INTO "User" ("email", "password", "name", "role", "isActive")
VALUES (
    'admin@controleveicular.com',
    '$2b$10$YourHashedPasswordHere', -- Você precisará gerar um hash bcrypt para a senha
    'Administrador',
    'ADMIN',
    true
); 