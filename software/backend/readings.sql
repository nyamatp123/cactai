-- Sensor readings sent by the ESP32 (POST /readings).
-- Run once: psql -U postgres -d cactai -f readings.sql
CREATE TABLE IF NOT EXISTS readings (
    id          BIGSERIAL PRIMARY KEY,
    device_id   TEXT NOT NULL,                       -- ESP32 WiFi MAC, e.g. AA:BB:CC:DD:EE:FF
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),  -- set by the server; the ESP32 has no clock
    moisture    REAL,                                -- %
    soil_raw    INTEGER,
    lux         REAL,
    weight_g    REAL,
    weight_raw  INTEGER,
    health      REAL                                 -- 0-100
);

CREATE INDEX IF NOT EXISTS readings_device_time_idx ON readings (device_id, recorded_at DESC);
