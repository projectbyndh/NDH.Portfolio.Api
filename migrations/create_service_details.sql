-- ============================================================
-- Migration: create service_details table
-- Run this ONCE against your PostgreSQL database before
-- starting the server with the new ServiceDetail model.
-- ============================================================

-- 1. Create the service_details table
CREATE TABLE IF NOT EXISTS service_details (
    id              SERIAL PRIMARY KEY,
    "serviceId"     INTEGER NOT NULL,
    details         TEXT    NOT NULL,
    expertise       TEXT[]  NOT NULL DEFAULT '{}',
    features        TEXT[]  NOT NULL DEFAULT '{}',
    tools           TEXT[]  NOT NULL DEFAULT '{}',
    "portfolioLink" VARCHAR(2048),
    "createdAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt"     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Foreign key: cascade delete when the parent Service is removed
    CONSTRAINT fk_service_details_service
        FOREIGN KEY ("serviceId")
        REFERENCES services(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    -- Enforce one-to-one: each service can have at most ONE detail record
    CONSTRAINT uq_service_details_service_id UNIQUE ("serviceId")
);

-- 2. Index on serviceId for fast JOIN / lookup in getServiceDetails
CREATE INDEX IF NOT EXISTS idx_service_details_service_id
    ON service_details ("serviceId");

-- ============================================================
-- Done. Verify with:
--   \d service_details
-- ============================================================
