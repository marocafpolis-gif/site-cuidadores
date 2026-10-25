// Painel da personal: envio dos vídeos de cada exercício e evolução das alunas.
import { CONFIG } from './config.js';
import { conectarSupabase, temBanco } from './db.js';
import { montarDemonstracao } from './animacao.js';
import { ANIMACOES } from './dados/animacoes.js';

const painel = document.getElementById('painel');
const aviso = document.querySelector('.aviso-flutuante');
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const dataHora = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const LIMITE_MB = 50;
let sb;

function avisar(texto) {
  aviso.textContent = texto;
  aviso.classList.add('visivel');
  clearTimeout(avisar.t);
  avisar.t = setTimeout(() => aviso.classList.remove('visivel'), 3200);
}

function telaSemBanco() {
  painel.innerHTML = `
    <h1>Painel da personal</h1>
    <div class="cartao">
      <p>O banco de dados ainda não foi conectado. Enquanto isso, o site funciona com os treinos e conteúdos de <code>js/dados/seed.js</code>, e cada aluna guarda o próprio histórico no aparelho.</p>
      <p>Para enviar vídeos e acompanhar as alunas, siga o passo a passo do arquivo <code>README.md</code> (seção "Ativar o banco de dados") e preencha <code>js/config.js</code>.</p>
    </div>`;
}

function telaLogin(erro = '') {
  painel.innerHTML = `
    <h1>Entrar no painel</h1>
    <form class="cartao" data-login>
      <label class="campo"><span>E-mail</span><input type="email" name="email" required autocomplete="email"></label>
      <label class="campo"><span>Senha</span><input type="password" name="senha" required autocomplete="current-password"></label>
      ${erro ? `<p class="alerta">${esc(erro)}</p>` : ''}
      <button class="btn" type="submit">Entrar</button>
    </form>`;
  painel.querySelector('[data-login]').addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = e.target;
    f.querySelector('button').disabled = true;
    const { error } = await sb.auth.signInWithPassword({ email: f.email.value.trim(), password: f.senha.value });
    if (error) telaLogin('E-mail ou senha incorretos.');
    else iniciarPainel();
  });
}

async function ehPersonal(userId) {
  const { data } = await sb.from('perfis').select('papel').eq('id', userId).maybeSingle();
  return data?.papel === 'personal';
}

async function iniciarPainel() {
  const { data } = await sb.auth.getSession();
  const user = data.session?.user;
  if (!user) return telaLogin();
  if (!(await ehPersonal(user.id))) {
    painel.innerHTML = `<h1>Acesso restrito</h1><div class="cartao"><p>A conta <strong>${esc(user.email)}</strong> não tem permissão de personal. Veja no README como liberar o acesso.</p><button class="btn btn-sec" data-sair>Sair</button></div>`;
    painel.querySelector('[data-sair]').addEventListener('click', async () => { await sb.auth.signOut(); telaLogin(); });
    return;
  }
  painel.innerHTML = `
    <div class="cabecalho-secao"><h1>Painel da personal</h1><button class="btn btn-sec" data-sair>Sair</button></div>
    <p class="sutil">Conectada como ${esc(user.email)}.</p>
    <section class="secao"><h2>Vídeos dos exercícios</h2>
      <p class="sutil">Envie um vídeo curto (MP4 ou WEBM, até ${LIMITE_MB} MB) de cada exercício. Ele toca em repetição, sem som, no lugar da animação. Dica: grave na horizontal ou quadrado, de lado, mostrando o corpo inteiro.</p>
      <div class="lista" id="lista-exercicios"><p class="carregando">Carregando exercícios…</p></div>
    </section>
    <section class="secao"><h2>Evolução das alunas</h2><div id="alunas"><p class="carregando">Carregando…</p></div></section>`;
  painel.querySelector('[data-sair]').addEventListener('click', async () => { await sb.auth.signOut(); telaLogin(); });
  carregarExercicios();
  carregarAlunas();
}

async function carregarExercicios() {
  const alvo = document.getElementById('lista-exercicios');
  const { data, error } = await sb.from('exercicios').select('*').order('ordem');
  if (error) { alvo.innerHTML = `<p class="alerta">Erro ao carregar: ${esc(error.message)}</p>`; return; }
  alvo.innerHTML = data.map((ex) => `
    <div class="cartao item-exercicio" data-id="${esc(ex.id)}">
      <div class="demo" data-demo></div>
      <div>
        <h3>${esc(ex.nome)}</h3>
        <p class="sutil" style="margin:0 0 10px">${ex.video_url ? 'Com vídeo' : 'Usando animação'}</p>
        <label class="btn btn-sec" style="cursor:pointer">
          ${ex.video_url ? 'Trocar vídeo' : 'Enviar vídeo'}
          <input type="file" accept="video/mp4,video/webm,video/quicktime" hidden data-arquivo>
        </label>
        ${ex.video_url ? '<button class="btn btn-sec" type="button" data-remover>Remover</button>' : ''}
      </div>
    </div>`).join('');
  data.forEach((ex) => {
    const card = alvo.querySelector(`[data-id="${CSS.escape(ex.id)}"]`);
    montarDemonstracao(card.querySelector('[data-demo]'), ex, ANIMACOES);
    card.querySelector('[data-arquivo]').addEventListener('change', (e) => enviarVideo(ex, e.target.files[0], card));
    card.querySelector('[data-remover]')?.addEventListener('click', () => removerVideo(ex));
  });
}

function caminhoNoBucket(url) {
  const marca = `/object/public/${CONFIG.bucketVideos}/`;
  const i = url ? url.indexOf(marca) : -1;
  return i >= 0 ? decodeURIComponent(url.slice(i + marca.length)) : null;
}

async function enviarVideo(ex, arquivo, card) {
  if (!arquivo) return;
  if (arquivo.size > LIMITE_MB * 1024 * 1024) { avisar(`O vídeo passa de ${LIMITE_MB} MB. Corte ou comprima antes de enviar.`); return; }
  const ext = (arquivo.name.split('.').pop() || 'mp4').toLowerCase();
  const caminho = `${ex.id}/${Date.now()}.${ext}`;
  card.querySelector('.sutil').textContent = 'Enviando… não feche a página.';
  const bucket = sb.storage.from(CONFIG.bucketVideos);
  const { error } = await bucket.upload(caminho, arquivo, { contentType: arquivo.type || 'video/mp4', upsert: false });
  if (error) { avisar('Não foi possível enviar: ' + error.message); carregarExercicios(); return; }
  const url = bucket.getPublicUrl(caminho).data.publicUrl;
  const { error: e2 } = await sb.from('exercicios').update({ video_url: url, atualizado_em: new Date().toISOString() }).eq('id', ex.id);
  if (e2) { avisar('Vídeo enviado, mas não foi salvo no exercício: ' + e2.message); return; }
  const antigo = caminhoNoBucket(ex.video_url);
  if (antigo) await bucket.remove([antigo]);
  avisar(`Vídeo de "${ex.nome}" publicado.`);
  carregarExercicios();
}

async function removerVideo(ex) {
  if (!confirm(`Remover o vídeo de "${ex.nome}"? O exercício volta a mostrar a animação.`)) return;
  const { error } = await sb.from('exercicios').update({ video_url: null, atualizado_em: new Date().toISOString() }).eq('id', ex.id);
  if (error) { avisar('Não foi possível remover: ' + error.message); return; }
  const antigo = caminhoNoBucket(ex.video_url);
  if (antigo) await sb.storage.from(CONFIG.bucketVideos).remove([antigo]);
  avisar('Vídeo removido.');
  carregarExercicios();
}

async function carregarAlunas() {
  const alvo = document.getElementById('alunas');
  const [s, p, t] = await Promise.all([
    sb.from('sessoes').select('*').order('concluida_em', { ascending: false }).limit(500),
    sb.from('perfis').select('id, nome, papel'),
    sb.from('treinos').select('id, nome'),
  ]);
  if (s.error) { alvo.innerHTML = `<p class="alerta">Erro ao carregar: ${esc(s.error.message)}</p>`; return; }
  const nomes = Object.fromEntries((p.data || []).map((x) => [x.id, x.nome]));
  const treinos = Object.fromEntries((t.data || []).map((x) => [x.id, x.nome]));
  const porAluna = new Map();
  for (const sessao of s.data) {
    if (!porAluna.has(sessao.aluna_id)) porAluna.set(sessao.aluna_id, []);
    porAluna.get(sessao.aluna_id).push(sessao);
  }
  if (!porAluna.size) { alvo.innerHTML = '<p class="vazio cartao">Nenhum treino registrado pelas alunas ainda.</p>'; return; }
  alvo.innerHTML = `<div class="lista">${[...porAluna].map(([id, lista]) => {
    const ultima = lista[0];
    const comNota = lista.filter((x) => x.percepcao);
    const media = comNota.length ? (comNota.reduce((a, x) => a + x.percepcao, 0) / comNota.length).toFixed(1).replace('.', ',') : '–';
    return `<details class="cartao">
      <summary><strong>${esc(nomes[id] || 'Aluna')}</strong> · ${lista.length} treinos · esforço médio ${media} · último em ${dataHora.format(new Date(ultima.concluida_em))}</summary>
      <ul class="historico">${lista.slice(0, 20).map((x) => `<li><div>${esc(treinos[x.treino_id] || x.treino_id)}<small>${dataHora.format(new Date(x.concluida_em))}${x.nota ? ' · ' + esc(x.nota) : ''}</small></div><span class="sutil">${x.percepcao ? 'Esforço ' + x.percepcao : ''}</span></li>`).join('')}</ul>
    </details>`;
  }).join('')}</div>`;
}

if (!temBanco()) {
  telaSemBanco();
} else {
  try {
    sb = await conectarSupabase();
    iniciarPainel();
  } catch (err) {
    console.error(err);
    painel.innerHTML = '<h1>Painel da personal</h1><p class="alerta">Não foi possível conectar ao banco de dados. Confira os dados em js/config.js.</p>';
  }
}
