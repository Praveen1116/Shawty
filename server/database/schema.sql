CREATE TABLE urls (
    short_code VARCHAR(6) PRIMARY KEY,
    original_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT valid_short_code
        CHECK (short_code ~ '^[A-Za-z0-9]{6}$')
);