// Gera supabase/seed.sql a partir de js/dados/seed.js.
// Uso: node scripts/gerar-seed-sql.mjs
// Rodar de novo atualiza textos e treinos sem apagar vídeos já enviados.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { CONTEUDOS, EXERCICIOS, FASES, TREINOS } from '../js/dados/seed.js';

const txt = (v) => (v === null || v === undefined ? 'null' : `'${String(v).replace(/'/g, "''")}'`);
const json = (v) => `${txt(JSON.stringify(v ?? []))}::jsonb`;
const num = (v) => (v === null || v === undefined ? 'null' : Number(v));

const linhas = ['-- Gerado por scripts/gerar-seed-sql.mjs. Não edite à mão.', 'begin;', ''];

linhas.push('-- Conteúdos');
CONTEUDOS.forEach((c, i) => {
  linhas.push(`insert into public.conteudos (id, titulo, categoria, aba, resumo, corpo, fontes, ordem) values (${txt(c.id)}, ${txt(c.titulo)}, ${txt(c.categoria)}, ${txt(c.aba)}, ${txt(c.resumo)}, ${json(c.corpo)}, ${json(c.fontes)}, ${i + 1})
  on conflict (id) do update set titulo = excluded.titulo, categoria = excluded.categoria, aba = excluded.aba, resumo = excluded.resumo, corpo = excluded.corpo, fontes = excluded.fontes, ordem = excluded.ordem, atualizado_em = now();`);
});

linhas.push('', '-- Exercícios (video_url não é sobrescrito)');
EXERCICIOS.forEach((e, i) => {
  linhas.push(`insert into public.exercicios (id, nome, grupo, descricao, dicas, cuidado, animacao, ordem) values (${txt(e.id)}, ${txt(e.nome)}, ${txt(e.grupo)}, ${txt(e.descricao)}, ${json(e.dicas)}, ${txt(e.cuidado)}, ${txt(e.animacao)}, ${i + 1})
  on conflict (id) do update set nome = excluded.nome, grupo = excluded.grupo, descricao = excluded.descricao, dicas = excluded.dicas, cuidado = excluded.cuidado, animacao = excluded.animacao, ordem = excluded.ordem, atualizado_em = now();`);
});

linhas.push('', '-- Fases');
FASES.forEach((f) => {
  linhas.push(`insert into public.fases (id, nome, descricao, ordem, sessoes_para_liberar) values (${txt(f.id)}, ${txt(f.nome)}, ${txt(f.descricao)}, ${num(f.ordem)}, ${num(f.sessoes_para_liberar)})
  on conflict (id) do update set nome = excluded.nome, descricao = excluded.descricao, ordem = excluded.ordem, sessoes_para_liberar = excluded.sessoes_para_liberar;`);
});

linhas.push('', '-- Treinos');
TREINOS.forEach((t) => {
  linhas.push(`insert into public.treinos (id, fase_id, nome, foco, duracao_min, ordem) values (${txt(t.id)}, ${txt(t.fase_id)}, ${txt(t.nome)}, ${txt(t.foco)}, ${num(t.duracao_min)}, ${num(t.ordem)})
  on conflict (id) do update set fase_id = excluded.fase_id, nome = excluded.nome, foco = excluded.foco, duracao_min = excluded.duracao_min, ordem = excluded.ordem;`);
});

linhas.push('', '-- Exercícios de cada treino');
linhas.push(`delete from public.treino_exercicios where treino_id in (${TREINOS.map((t) => txt(t.id)).join(', ')});`);
TREINOS.forEach((t) => {
  t.itens.forEach((it, i) => {
    linhas.push(`insert into public.treino_exercicios (treino_id, exercicio_id, ordem, series, repeticoes, descanso, observacao) values (${txt(t.id)}, ${txt(it.exercicio_id)}, ${i + 1}, ${txt(it.series)}, ${txt(it.repeticoes)}, ${txt(it.descanso)}, ${txt(it.observacao)});`);
  });
});

linhas.push('', 'commit;', '');
const destino = fileURLToPath(new URL('../supabase/seed.sql', import.meta.url));
writeFileSync(destino, linhas.join('\n'));
console.log('seed.sql gerado em', destino);
