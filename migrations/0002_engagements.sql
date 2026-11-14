-- HackerAI Pro Max operator data — per-user engagements, messages, findings
create table if not exists engagements (
  id text primary key,
  user_id text not null,
  title text not null,
  mode text not null default 'chat',
  model_id text not null default 'gemma4-31b',
  lab_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists engagements_user_id_idx on engagements (user_id);

create table if not exists messages (
  id text primary key,
  engagement_id text not null,
  user_id text not null,
  role text not null,
  content text not null,
  kind text not null default 'text',
  created_at timestamptz not null default now()
);
create index if not exists messages_engagement_idx on messages (engagement_id, created_at);

create table if not exists findings (
  id text primary key,
  engagement_id text not null,
  user_id text not null,
  severity text not null,
  title text not null,
  evidence text not null default '',
  cwe text,
  status text not null default 'open',
  created_at timestamptz not null default now()
);
create index if not exists findings_engagement_idx on findings (engagement_id);
