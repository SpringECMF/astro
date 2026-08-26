-- ══════════════════════════════════════════════════
-- ECMF — Schema v2
-- Ejecutar COMPLETO en Supabase → SQL Editor
-- ══════════════════════════════════════════════════

-- ── Tabla: cookie_consents ───────────────────────────
-- Solo la escribe la Edge Function save-consent (service_role,
-- que ignora RLS) — por eso no lleva políticas para "anon".
create table if not exists cookie_consents (
    id                  uuid primary key default gen_random_uuid(),
    session_id          text not null,
    technical           boolean not null default true,
    analytics           boolean not null default false,
    marketing           boolean not null default false,
    consent_version     text not null default '1.0',
    action              text not null,
    user_agent          text,
    page_url            text,
    created_at          timestamptz default now(),
    expires_at          timestamptz,
    ip_anonymized       text,
    previous_consent_id uuid references cookie_consents (id)
);

alter table cookie_consents enable row level security;

-- ── Tabla: leads ────────────────────────────────────
create table if not exists leads (
    id              uuid primary key default gen_random_uuid(),
    nombre          text not null,
    email           text not null,
    empresa         text,
    servicio_interes text,
    mensaje         text,
    fuente          text,
    created_at      timestamptz default now(),
    estado          text default 'nuevo'
);

-- ── Tabla: newsletter_subscribers ───────────────────
create table if not exists newsletter_subscribers (
    id         uuid primary key default gen_random_uuid(),
    email      text not null unique,
    fuente     text,
    created_at timestamptz default now(),
    activo     boolean default true
);

-- ── Limpiar artefactos de versiones anteriores ──────
-- (El RULE del schema v1 bloquea inserts en Supabase REST)
DROP RULE IF EXISTS newsletter_upsert ON newsletter_subscribers;

-- ── RLS ─────────────────────────────────────────────
alter table leads enable row level security;
alter table newsletter_subscribers enable row level security;

-- Eliminar políticas anteriores si existen
drop policy if exists "anon_insert_leads" on leads;
drop policy if exists "anon_insert_subscribers" on newsletter_subscribers;

-- Crear políticas de inserción para usuarios anónimos
create policy "anon_insert_leads" on leads
    for insert to anon
    with check (true);

create policy "anon_insert_subscribers" on newsletter_subscribers
    for insert to anon
    with check (true);

-- ── Permisos explícitos ──────────────────────────────
-- Necesario para que el anon key pueda insertar
grant usage on schema public to anon;
grant insert on leads to anon;
grant insert on newsletter_subscribers to anon;
