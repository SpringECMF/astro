-- ══════════════════════════════════════════════════
-- ECMF — Schema v2
-- Ejecutar COMPLETO en Supabase → SQL Editor
-- ══════════════════════════════════════════════════

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
