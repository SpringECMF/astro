-- ══════════════════════════════════════════════════
-- ECMF — Schema inicial
-- Ejecutar en Supabase → SQL Editor
-- ══════════════════════════════════════════════════

-- ── Tabla: leads (solicitudes de demo) ──────────────
create table if not exists leads (
    id              uuid primary key default gen_random_uuid(),
    nombre          text not null,
    email           text not null,
    empresa         text,
    servicio_interes text,
    mensaje         text,
    fuente          text,          -- qué formulario lo originó (hero, cta, etc.)
    created_at      timestamptz default now(),
    estado          text default 'nuevo'
);

alter table leads enable row level security;

-- Usuarios anónimos solo pueden insertar
create policy "anon_insert_leads" on leads
    for insert to anon
    with check (true);

-- ── Tabla: newsletter_subscribers ───────────────────
create table if not exists newsletter_subscribers (
    id         uuid primary key default gen_random_uuid(),
    email      text not null unique,
    fuente     text,              -- 'mid' o 'footer'
    created_at timestamptz default now(),
    activo     boolean default true
);

alter table newsletter_subscribers enable row level security;

-- Usuarios anónimos solo pueden insertar
create policy "anon_insert_subscribers" on newsletter_subscribers
    for insert to anon
    with check (true);

-- Si el email ya existe, reactivar la suscripción en lugar de dar error
create or replace rule newsletter_upsert as
    on insert to newsletter_subscribers
    where (exists (
        select 1 from newsletter_subscribers
        where email = new.email
    ))
    do instead
        update newsletter_subscribers
        set activo = true
        where email = new.email;
