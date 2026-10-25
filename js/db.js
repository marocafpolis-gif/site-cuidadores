// Camada de dados: um só lugar para ler e gravar informações.
// Modo "supabase": lê do banco e grava o histórico na conta da aluna.
// Modo "local": usa os dados de seed.js e guarda o histórico no aparelho.
import { CONFIG } from './config.js';
import { CONTEUDOS, EXERCICIOS, FASES, TREINOS } from './dados/seed.js';

const CDN_SUPABASE = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/+esm';
const CHAVE_LOCAL = 'ml-sessoes';

let sb = null;
let usuario = null;
const estado = { modo: 'local', conteudos: [], exercicios: [], fases: [], treinos: [] };

export const temBanco = () => Boolean(CONFIG.supabaseUrl && CONFIG.supabaseAnonKey);

export async function conectarSupabase() {
  if (sb || !temBanco()) return sb;
  const { createClient } = await import(CDN_SUPABASE);
  sb = createClient(CONFIG.supabaseUrl, CONFIG.supabaseAnonKey);
  return sb;
}

function usarSeed() {
  estado.conteudos = CONTEUDOS;
  estado.exercicios = EXERCICIOS;
  estado.fases = FASES;
  estado.treinos = TREINOS;
}

async function carregarDoBanco() {
  const [c, e, f, t, te] = await Promise.all([
    sb.from('conteudos').select('*').eq('publicado', true).order('ordem'),
    sb.from('exercicios').select('*').order('ordem'),
    sb.from('fases').select('*').order('ordem'),
    sb.from('treinos').select('*').order('ordem'),
    sb.from('treino_exercicios').select('*').order('ordem'),
  ]);
  const erro = [c, e, f, t, te].find((r) => r.error);
  if (erro) throw erro.error;
  estado.conteudos = c.data;
  estado.exercicios = e.data;
  estado.fases = f.data;
  estado.treinos = t.data.map((tr) => ({ ...tr, itens: te.data.filter((i) => i.treino_id === tr.id) }));
}

export async function iniciar() {
  usarSeed();
  if (!temBanco()) return estado;
  try {
    await conectarSupabase();
    await carregarDoBanco();
    estado.modo = 'supabase';
    const { data } = await sb.auth.getSession();
    usuario = data.session?.user ?? null;
  } catch (err) {
    console.warn('Banco indisponível, usando dados locais.', err);
    usarSeed();
    estado.modo = 'local';
  }
  return estado;
}

export const dados = () => estado;
export const usuarioAtual = () => usuario;

export function aoMudarLogin(fn) {
  if (!sb) return;
  sb.auth.onAuthStateChange(async (_evento, sessao) => {
    const antes = usuario?.id;
    usuario = sessao?.user ?? null;
    if (usuario && usuario.id !== antes) await enviarHistoricoLocal();
    if (usuario?.id !== antes) fn(usuario);
  });
}

export async function entrarComEmail(email) {
  const { error } = await sb.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: location.origin + location.pathname },
  });
  if (error) throw error;
}

export async function sair() {
  if (sb) await sb.auth.signOut();
}

// ---------- Histórico de treinos (sessões) ----------

function lerLocal() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE_LOCAL)) || [];
  } catch {
    return [];
  }
}

function gravarLocal(lista) {
  try {
    localStorage.setItem(CHAVE_LOCAL, JSON.stringify(lista));
  } catch {
    /* navegador sem armazenamento: o histórico vale só nesta visita */
  }
}

let memoria = null;

export async function listarSessoes() {
  if (sb && usuario && estado.modo === 'supabase') {
    const { data, error } = await sb.from('sessoes').select('*').eq('aluna_id', usuario.id).order('concluida_em', { ascending: false });
    if (!error) return data;
    console.warn(error);
  }
  if (memoria === null) memoria = lerLocal();
  return [...memoria].sort((a, b) => b.concluida_em.localeCompare(a.concluida_em));
}

export async function salvarSessao({ treino_id, percepcao, nota }) {
  const sessao = { treino_id, percepcao, nota: nota || null, concluida_em: new Date().toISOString() };
  if (sb && usuario && estado.modo === 'supabase') {
    const { error } = await sb.from('sessoes').insert({ ...sessao, aluna_id: usuario.id });
    if (error) throw error;
    return;
  }
  if (memoria === null) memoria = lerLocal();
  memoria.push({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), ...sessao });
  gravarLocal(memoria);
}

// Quando a aluna entra na conta, o que ela registrou no aparelho vai para o banco.
async function enviarHistoricoLocal() {
  const locais = lerLocal();
  if (!locais.length || !usuario) return;
  const linhas = locais.map(({ treino_id, percepcao, nota, concluida_em }) => ({ treino_id, percepcao, nota, concluida_em, aluna_id: usuario.id }));
  const { error } = await sb.from('sessoes').insert(linhas);
  if (!error) {
    memoria = [];
    gravarLocal([]);
  }
}
