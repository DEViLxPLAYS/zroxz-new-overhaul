-- ============================================================
-- ZROXZ SUPABASE SCHEMA — Run once in Supabase SQL Editor
-- Project: zroxz (keep separate from StitchDesk / Deal Desk)
-- ============================================================

-- ============================
-- BLOG POSTS
-- ============================
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null,
  quick_answer text not null,        -- 40–60 word GEO/AI-citation block
  excerpt text not null,
  content text not null,             -- markdown or HTML
  meta_description text not null,
  read_time_minutes int default 5,
  published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_blog_posts_published on blog_posts (published, published_at desc);
create index idx_blog_posts_category on blog_posts (category);

-- ============================
-- LEADS (contact form submissions)
-- ============================
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  service text,
  message text not null,
  budget text,
  source_page text,                  -- which page they submitted from
  created_at timestamptz default now()
);

-- ============================
-- CHAT LOGS
-- ============================
create table chat_logs (
  id uuid primary key default gen_random_uuid(),
  session_id text not null,
  messages jsonb not null,
  lead_captured boolean default false,
  created_at timestamptz default now()
);

create index idx_chat_logs_session on chat_logs (session_id);

-- ============================
-- ROW LEVEL SECURITY
-- ============================
alter table blog_posts enable row level security;
alter table leads enable row level security;
alter table chat_logs enable row level security;

-- Public can read only PUBLISHED blog posts
create policy "Public can read published posts"
  on blog_posts for select
  using (published = true);

-- leads and chat_logs: zero public policies = fully locked down.
-- Only the backend's service_role key (which bypasses RLS) can read/write them.

-- ============================
-- SAMPLE BLOG POST (optional — uncomment to seed)
-- ============================
-- insert into blog_posts (
--   title, slug, category, quick_answer, excerpt, content, meta_description, published, published_at
-- ) values (
--   'How We Built an AI Voice Agent for Evinn.pk',
--   'evinn-pk-ai-voice-agent-case-study',
--   'AI Voice Agents',
--   'Zroxz built an AI voice agent for Evinn.pk handling 80+ daily calls with a 70% reduction in handle time and zero after-hours missed leads. Deployed on ElevenLabs and GoHighLevel in 2 weeks.',
--   'A breakdown of how we automated 80+ customer support calls daily and unified GHL pipeline status.',
--   '## The Challenge...',
--   'How Zroxz built an AI voice agent for Evinn.pk that handles 80+ daily calls, reducing handle time by 70% and eliminating missed leads.',
--   true,
--   now()
-- );
