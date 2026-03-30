-- ============================================================
-- SCALAR — Supabase Schema
-- HK Med-Aesthetics AI Receptionist
-- Run this in: Supabase Dashboard → SQL Editor → New Query
-- ============================================================

-- ── CONTACTS ─────────────────────────────────────────────────
-- One row per unique contact across all channels
CREATE TABLE IF NOT EXISTS contacts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone         TEXT UNIQUE,
  email         TEXT,
  name          TEXT,
  first_name    TEXT,
  last_name     TEXT,
  source        TEXT,                        -- 'WhatsApp', 'Instagram', 'Web Form'
  ig_sender_id  TEXT UNIQUE,                 -- Instagram sender ID (separate unique key)
  tags          TEXT[] DEFAULT '{}',
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS contacts_phone_idx       ON contacts (phone);
CREATE INDEX IF NOT EXISTS contacts_ig_sender_idx   ON contacts (ig_sender_id);
CREATE INDEX IF NOT EXISTS contacts_email_idx       ON contacts (email);

-- ── CONVERSATIONS ─────────────────────────────────────────────
-- One row per contact per channel — stores full chat history as JSONB
CREATE TABLE IF NOT EXISTS conversations (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id       UUID REFERENCES contacts(id) ON DELETE CASCADE,
  channel          TEXT NOT NULL,            -- 'whatsapp', 'instagram', 'webform'
  history          JSONB DEFAULT '[]',       -- [{role, content, timestamp}]
  last_message_at  TIMESTAMPTZ DEFAULT NOW(),
  message_count    INT DEFAULT 0,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (contact_id, channel)               -- one conversation record per contact per channel
);

CREATE INDEX IF NOT EXISTS conversations_contact_idx ON conversations (contact_id);
CREATE INDEX IF NOT EXISTS conversations_channel_idx ON conversations (channel);

-- ── LEADS ────────────────────────────────────────────────────
-- One row per lead / booking intent captured
CREATE TABLE IF NOT EXISTS leads (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id       UUID REFERENCES contacts(id) ON DELETE SET NULL,
  status           TEXT DEFAULT 'new',       -- 'new', 'consultation_requested', 'booked', 'attended', 'converted', 'lost'
  channel          TEXT,                     -- originating channel
  service_interest TEXT,
  preferred_time   TEXT,
  booking_data     JSONB DEFAULT '{}',       -- full booking intent object from AI
  notes            TEXT,
  assigned_to      TEXT,                     -- team member name or email
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS leads_contact_idx  ON leads (contact_id);
CREATE INDEX IF NOT EXISTS leads_status_idx   ON leads (status);
CREATE INDEX IF NOT EXISTS leads_channel_idx  ON leads (channel);

-- ── MESSAGES ─────────────────────────────────────────────────
-- Full audit log — every inbound and outbound message
CREATE TABLE IF NOT EXISTS messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contact_id   UUID REFERENCES contacts(id) ON DELETE SET NULL,
  channel      TEXT NOT NULL,
  direction    TEXT NOT NULL CHECK (direction IN ('inbound', 'outbound')),
  content      TEXT,
  metadata     JSONB DEFAULT '{}',           -- raw payload, message IDs, etc.
  ai_handled   BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS messages_contact_idx   ON messages (contact_id);
CREATE INDEX IF NOT EXISTS messages_channel_idx   ON messages (channel);
CREATE INDEX IF NOT EXISTS messages_created_idx   ON messages (created_at DESC);

-- ── CRM PAYLOADS ─────────────────────────────────────────────
-- Log of every payload pushed to a client's external CRM
-- Useful for debugging and re-delivery
CREATE TABLE IF NOT EXISTS crm_payloads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id       UUID REFERENCES leads(id) ON DELETE SET NULL,
  contact_id    UUID REFERENCES contacts(id) ON DELETE SET NULL,
  client_name   TEXT,                        -- which client's CRM this went to
  payload       JSONB NOT NULL,              -- the formatted payload that was sent
  endpoint      TEXT,                        -- the URL it was sent to
  response_code INT,
  success       BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS crm_payloads_lead_idx ON crm_payloads (lead_id);

-- ── AUTO-UPDATE updated_at ────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER contacts_updated_at
  BEFORE UPDATE ON contacts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── ROW LEVEL SECURITY ────────────────────────────────────────
-- Lock down all tables — only service_role key (used by n8n) can read/write
ALTER TABLE contacts       ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations  ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads          ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_payloads   ENABLE ROW LEVEL SECURITY;

-- service_role bypasses RLS by default in Supabase — no extra policy needed
-- anon key gets no access (safe default for n8n integration)

-- ── USEFUL VIEWS ─────────────────────────────────────────────
-- Active leads with contact details joined
CREATE OR REPLACE VIEW leads_with_contacts AS
SELECT
  l.id               AS lead_id,
  l.status,
  l.channel,
  l.service_interest,
  l.preferred_time,
  l.booking_data,
  l.assigned_to,
  l.created_at       AS lead_created,
  c.id               AS contact_id,
  c.name,
  c.phone,
  c.email,
  c.source,
  c.tags
FROM leads l
LEFT JOIN contacts c ON l.contact_id = c.id
ORDER BY l.created_at DESC;

-- Recent conversations summary
CREATE OR REPLACE VIEW conversations_summary AS
SELECT
  cv.id,
  cv.channel,
  cv.last_message_at,
  cv.message_count,
  c.name,
  c.phone,
  jsonb_array_length(cv.history) AS history_length
FROM conversations cv
LEFT JOIN contacts c ON cv.contact_id = c.id
ORDER BY cv.last_message_at DESC;

-- ============================================================
-- DONE — run the above, then copy your:
--   Project URL:    Settings → API → Project URL
--   Service Key:    Settings → API → service_role (secret)
-- Both go into n8n as the Supabase credential.
-- ============================================================
