create table if not exists projects(
  id bigint generated always as identity primary key,
  name text not null, image_url text, short_desc text, full_desc text,
  features text, requirements text, download_url text not null, video_url text,
  category text not null default 'bot', version text default '1.0.0',
  is_premium boolean default false, hidden boolean default false,
  downloads int default 0, created_at timestamptz default now());
create table if not exists requests(
  id bigint generated always as identity primary key,
  discord_id text, username text, display_name text, avatar text,
  bot_name text, idea text, features text[], server_type text, budget text,
  deadline text, contact text, notes text, status text default 'review',
  webhook_ok boolean default false, created_at timestamptz default now());
alter table projects enable row level security;
alter table requests enable row level security;
insert into storage.buckets(id,name,public) values('projects','projects',true) on conflict do nothing;
