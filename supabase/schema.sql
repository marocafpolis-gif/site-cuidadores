-- Banco de dados do site Movimento e Longevidade (Supabase / PostgreSQL).
-- Rode este arquivo uma vez no SQL Editor do Supabase. Depois rode seed.sql.
--
-- Quem pode fazer o quê:
--   * Qualquer visitante: ler conteúdos, exercícios, fases e treinos, e assistir aos vídeos.
--   * Aluna logada: registrar e ver só os próprios treinos concluídos.
--   * Personal (perfil com papel = 'personal'): editar tudo, enviar vídeos e ver a evolução das alunas.

-- ---------- Perfis ----------
create table if not exists public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text,
  papel text not null default 'aluna' check (papel in ('aluna', 'personal')),
  criado_em timestamptz not null default now()
);

-- Cria o perfil automaticamente quando alguém se cadastra.
create or replace function public.criar_perfil() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.perfis (id, nome) values (new.id, split_part(new.email, '@', 1))
  on conflict (id) do nothing;
  return new;
end $$;

drop trigger if exists ao_criar_usuario on auth.users;
create trigger ao_criar_usuario after insert on auth.users
  for each row execute function public.criar_perfil();

create or replace function public.eh_personal() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.perfis where id = auth.uid() and papel = 'personal');
$$;

-- ---------- Conteúdos (artigos) ----------
create table if not exists public.conteudos (
  id text primary key,
  titulo text not null,
  categoria text not null,
  aba text not null check (aba in ('Hoje', 'Treinos', 'Evolução', 'Mais')),
  resumo text,
  corpo jsonb not null default '[]',   -- lista de parágrafos
  fontes jsonb not null default '[]',  -- lista de { label, url }
  ordem int not null default 0,
  publicado boolean not null default true,
  atualizado_em timestamptz not null default now()
);

-- ---------- Exercícios ----------
create table if not exists public.exercicios (
  id text primary key,
  nome text not null,
  grupo text,
  descricao text,
  dicas jsonb not null default '[]',
  cuidado text,
  animacao text,        -- demonstração animada usada enquanto não há vídeo
  video_url text,       -- vídeo do exercício (enviado pelo painel da personal)
  video_poster text,    -- imagem de capa opcional do vídeo
  ordem int not null default 0,
  atualizado_em timestamptz not null default now()
);

-- ---------- Fases e treinos ----------
create table if not exists public.fases (
  id text primary key,
  nome text not null,
  descricao text,
  ordem int not null default 0,
  sessoes_para_liberar int not null default 0  -- treinos concluídos necessários para liberar a fase
);

create table if not exists public.treinos (
  id text primary key,
  fase_id text not null references public.fases (id) on delete cascade,
  nome text not null,
  foco text,
  duracao_min int,
  ordem int not null default 0
);

create table if not exists public.treino_exercicios (
  id bigint generated always as identity primary key,
  treino_id text not null references public.treinos (id) on delete cascade,
  exercicio_id text not null references public.exercicios (id) on delete restrict,
  ordem int not null default 0,
  series text,
  repeticoes text,
  descanso text,
  observacao text
);
create index if not exists treino_exercicios_treino on public.treino_exercicios (treino_id, ordem);

-- ---------- Histórico das alunas ----------
create table if not exists public.sessoes (
  id uuid primary key default gen_random_uuid(),
  aluna_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  treino_id text not null references public.treinos (id) on delete cascade,
  concluida_em timestamptz not null default now(),
  percepcao int check (percepcao between 1 and 5),  -- esforço percebido
  nota text check (char_length(nota) <= 500)
);
create index if not exists sessoes_aluna on public.sessoes (aluna_id, concluida_em desc);

-- ---------- Regras de acesso (RLS) ----------
alter table public.perfis enable row level security;
alter table public.conteudos enable row level security;
alter table public.exercicios enable row level security;
alter table public.fases enable row level security;
alter table public.treinos enable row level security;
alter table public.treino_exercicios enable row level security;
alter table public.sessoes enable row level security;

drop policy if exists "perfil próprio ou personal" on public.perfis;
create policy "perfil próprio ou personal" on public.perfis for select using (id = auth.uid() or public.eh_personal());
drop policy if exists "aluna edita o próprio nome" on public.perfis;
create policy "aluna edita o próprio nome" on public.perfis for update using (id = auth.uid())
  with check (id = auth.uid() and papel = (select papel from public.perfis where id = auth.uid()));

do $$
declare t text;
begin
  foreach t in array array['exercicios', 'fases', 'treinos', 'treino_exercicios'] loop
    execute format('drop policy if exists "leitura pública" on public.%I', t);
    execute format('create policy "leitura pública" on public.%I for select using (true)', t);
    execute format('drop policy if exists "personal edita" on public.%I', t);
    execute format('create policy "personal edita" on public.%I for all using (public.eh_personal()) with check (public.eh_personal())', t);
  end loop;
end $$;

drop policy if exists "leitura pública" on public.conteudos;
create policy "leitura pública" on public.conteudos for select using (publicado or public.eh_personal());
drop policy if exists "personal edita" on public.conteudos;
create policy "personal edita" on public.conteudos for all using (public.eh_personal()) with check (public.eh_personal());

drop policy if exists "aluna vê os seus treinos" on public.sessoes;
create policy "aluna vê os seus treinos" on public.sessoes for select using (aluna_id = auth.uid() or public.eh_personal());
drop policy if exists "aluna registra os seus treinos" on public.sessoes;
create policy "aluna registra os seus treinos" on public.sessoes for insert with check (aluna_id = auth.uid());
drop policy if exists "aluna apaga os seus treinos" on public.sessoes;
create policy "aluna apaga os seus treinos" on public.sessoes for delete using (aluna_id = auth.uid());

-- ---------- Armazenamento dos vídeos ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('videos-exercicios', 'videos-exercicios', true, 52428800, array['video/mp4', 'video/webm', 'video/quicktime', 'image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do nothing;

drop policy if exists "vídeos: leitura pública" on storage.objects;
create policy "vídeos: leitura pública" on storage.objects for select using (bucket_id = 'videos-exercicios');
drop policy if exists "vídeos: personal envia" on storage.objects;
create policy "vídeos: personal envia" on storage.objects for insert with check (bucket_id = 'videos-exercicios' and public.eh_personal());
drop policy if exists "vídeos: personal atualiza" on storage.objects;
create policy "vídeos: personal atualiza" on storage.objects for update using (bucket_id = 'videos-exercicios' and public.eh_personal());
drop policy if exists "vídeos: personal apaga" on storage.objects;
create policy "vídeos: personal apaga" on storage.objects for delete using (bucket_id = 'videos-exercicios' and public.eh_personal());
