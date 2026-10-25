import { iniciar, dados, listarSessoes, salvarSessao, usuarioAtual, aoMudarLogin, entrarComEmail, sair } from './db.js';
import { montarDemonstracao } from './animacao.js';
import { ANIMACOES } from './dados/animacoes.js';

const main = document.getElementById('conteudo-principal');
const botaoVoltar = document.querySelector('.voltar');
const dialogo = document.getElementById('dialogo-concluir');
const aviso = document.querySelector('.aviso-flutuante');

const ABAS = { Hoje: 'hoje', Treinos: 'treinos', 'Evolução': 'evolucao', Mais: 'mais' };
const SETA = '<svg class="seta" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';
const ROTULO_ESFORCO = ['', 'Muito leve', 'Leve', 'Na medida', 'Puxado', 'Muito puxado'];

const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const porOrdem = (a, b) => (a.ordem ?? 0) - (b.ordem ?? 0);
const dataCurta = new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' });
const exercicio = (id) => dados().exercicios.find((e) => e.id === id);
const treino = (id) => dados().treinos.find((t) => t.id === id);

// ---------- Progresso ----------

function calcularProgresso(sessoes) {
  const total = sessoes.length;
  const fases = [...dados().fases].sort(porOrdem);
  const liberadas = fases.filter((f) => total >= (f.sessoes_para_liberar ?? 0));
  const atual = liberadas[liberadas.length - 1] || fases[0];
  const proxima = fases.find((f) => total < (f.sessoes_para_liberar ?? 0));
  const seteDias = Date.now() - 7 * 864e5;
  const semana = sessoes.filter((s) => new Date(s.concluida_em).getTime() >= seteDias).length;
  const comNota = sessoes.filter((s) => s.percepcao);
  const media = comNota.length ? comNota.reduce((t, s) => t + Number(s.percepcao), 0) / comNota.length : null;
  return { total, fases, atual, proxima, semana, media, liberada: (faseId) => liberadas.some((f) => f.id === faseId) };
}

function treinoSugerido(prog, sessoes) {
  const lista = dados().treinos.filter((t) => t.fase_id === prog.atual?.id).sort(porOrdem);
  if (!lista.length) return null;
  const ultimo = sessoes.find((s) => lista.some((t) => t.id === s.treino_id));
  if (!ultimo) return lista[0];
  const i = lista.findIndex((t) => t.id === ultimo.treino_id);
  return lista[(i + 1) % lista.length];
}

// ---------- Peças reutilizáveis ----------

function cartaoConteudo(c) {
  return `<a class="cartao cartao-conteudo" href="#conteudo/${esc(c.id)}">
    <p class="olho">${esc(c.categoria)}</p>
    <h3>${esc(c.titulo)}</h3>
    <p>${esc(c.resumo)}</p>
  </a>`;
}

function secaoConteudos(aba, titulo = 'Para ler com calma') {
  const lista = dados().conteudos.filter((c) => c.aba === aba);
  if (!lista.length) return '';
  return `<section class="secao"><h2>${titulo}</h2><div class="lista">${lista.map(cartaoConteudo).join('')}</div></section>`;
}

function slotDemo(exId, classe = '') {
  return `<div class="demo ${classe}" data-demo="${esc(exId)}"></div>`;
}

function ativarDemos(raiz = main) {
  raiz.querySelectorAll('[data-demo]').forEach((el) => {
    const ex = exercicio(el.dataset.demo);
    if (!ex) return;
    montarDemonstracao(el, ex, ANIMACOES);
    if (ex.video_url) el.insertAdjacentHTML('beforeend', '<span class="selo-video">Vídeo</span>');
  });
}

function avisar(texto) {
  aviso.textContent = texto;
  aviso.classList.add('visivel');
  clearTimeout(avisar.t);
  avisar.t = setTimeout(() => aviso.classList.remove('visivel'), 2800);
}

// ---------- Telas ----------

async function telaHoje() {
  const sessoes = await listarSessoes();
  const prog = calcularProgresso(sessoes);
  const sugerido = treinoSugerido(prog, sessoes);
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? 'Bom dia' : hora < 18 ? 'Boa tarde' : 'Boa noite';
  const demos = sugerido ? sugerido.itens.slice().sort(porOrdem).map((i) => i.exercicio_id).filter((id, i, a) => a.indexOf(id) === i) : [];
  const principais = demos.filter((id) => exercicio(id)?.grupo !== 'Aquecimento' && exercicio(id)?.grupo !== 'Mobilidade').slice(0, 3);

  return `
    <p class="olho">${saudacao}</p>
    <h1>Seu treino de hoje</h1>
    <p class="sutil">${prog.total ? `Você já concluiu ${prog.total} ${prog.total === 1 ? 'treino' : 'treinos'}. ${prog.semana ? `${prog.semana} nos últimos 7 dias.` : ''}` : 'Comece pelo primeiro treino da Fase 1. Cada movimento tem uma demonstração para você acompanhar.'}</p>
    ${sugerido ? `
    <section class="cartao destaque-treino">
      <p class="olho">${esc(prog.atual.nome)}</p>
      <h2>${esc(sugerido.nome)}</h2>
      <p class="sutil">${esc(sugerido.foco)} · cerca de ${esc(sugerido.duracao_min)} min · ${sugerido.itens.length} exercícios</p>
      <div class="mini-demos">${principais.map((id) => slotDemo(id)).join('')}</div>
      <a class="btn btn-largo" href="#treino/${esc(sugerido.id)}">Começar treino</a>
    </section>` : '<p class="vazio">Nenhum treino cadastrado ainda.</p>'}
    ${secaoConteudos('Hoje', 'Antes de começar')}
  `;
}

async function telaTreinos() {
  const sessoes = await listarSessoes();
  const prog = calcularProgresso(sessoes);
  const fases = prog.fases.map((f) => {
    const livre = prog.liberada(f.id);
    const faltam = (f.sessoes_para_liberar ?? 0) - prog.total;
    const treinos = dados().treinos.filter((t) => t.fase_id === f.id).sort(porOrdem);
    return `<section class="fase">
      <div class="fase-topo">
        <h3>${esc(f.nome)}</h3>
        ${livre ? `<span class="etiqueta">${f.id === prog.atual.id ? 'Fase atual' : 'Liberada'}</span>` : `<span class="etiqueta bloqueada">Faltam ${faltam} ${faltam === 1 ? 'treino' : 'treinos'}</span>`}
      </div>
      <p class="sutil">${esc(f.descricao)}</p>
      <div class="lista">
        ${treinos.map((t) => `<a class="cartao cartao-treino ${livre ? '' : 'bloqueado'}" href="#treino/${esc(t.id)}" ${livre ? '' : 'aria-disabled="true" tabindex="-1"'}>
          <div><h4>${esc(t.nome)}</h4><p>${esc(t.foco)} · ${t.itens.length} exercícios · ~${esc(t.duracao_min)} min</p></div>${SETA}
        </a>`).join('')}
      </div>
    </section>`;
  }).join('');

  const exercicios = [...dados().exercicios].sort(porOrdem);
  return `
    <h1>Treinos</h1>
    <p class="sutil">As fases vão sendo liberadas conforme você conclui os treinos. Assim a evolução acontece no tempo certo.</p>
    ${fases}
    <section class="secao">
      <div class="cabecalho-secao"><h2>Biblioteca de exercícios</h2></div>
      <p class="sutil">Toque em um exercício para ver o movimento completo e os cuidados.</p>
      <div class="grade">
        ${exercicios.map((e) => `<a class="cartao cartao-exercicio" href="#exercicio/${esc(e.id)}">${slotDemo(e.id)}<h3>${esc(e.nome)}</h3><p>${esc(e.grupo)}</p></a>`).join('')}
      </div>
    </section>
    ${secaoConteudos('Treinos', 'Treinar com segurança')}
  `;
}

async function telaTreino(id) {
  const t = treino(id);
  if (!t) return naoEncontrado();
  const sessoes = await listarSessoes();
  const prog = calcularProgresso(sessoes);
  const fase = dados().fases.find((f) => f.id === t.fase_id);
  if (!prog.liberada(t.fase_id)) {
    const faltam = (fase.sessoes_para_liberar ?? 0) - prog.total;
    return `<p class="olho">${esc(fase.nome)}</p><h1>${esc(t.nome)}</h1>
      <div class="cartao"><p>Este treino é liberado depois de mais <strong>${faltam}</strong> ${faltam === 1 ? 'treino concluído' : 'treinos concluídos'}. Siga com a fase atual: é ela que prepara seu corpo para o próximo passo.</p>
      <a class="btn" href="#treinos">Ver treinos liberados</a></div>`;
  }
  const itens = t.itens.slice().sort(porOrdem);
  const vezes = sessoes.filter((s) => s.treino_id === t.id).length;
  return `
    <p class="olho">${esc(fase?.nome)}</p>
    <h1>${esc(t.nome)}</h1>
    <p class="sutil">${esc(t.foco)} · cerca de ${esc(t.duracao_min)} min${vezes ? ` · feito ${vezes} ${vezes === 1 ? 'vez' : 'vezes'}` : ''}</p>
    <p class="nota-modelo">Séries e repetições são o ponto de partida. Se algo doer ou parecer pesado demais, pare e me avise: o treino é ajustado para você.</p>
    <div class="lista secao" style="margin-top:20px">
      ${itens.map((i, n) => {
        const ex = exercicio(i.exercicio_id);
        if (!ex) return '';
        return `<a class="cartao item-exercicio" href="#exercicio/${esc(ex.id)}">
          ${slotDemo(ex.id)}
          <div>
            <h3><span class="numero">${n + 1}</span>${esc(ex.nome)}</h3>
            <p class="prescricao"><span><strong>${esc(i.series)}</strong> ${i.series === '1' ? 'série' : 'séries'}</span><span><strong>${esc(i.repeticoes)}</strong></span>${i.descanso && i.descanso !== '—' ? `<span>descanso ${esc(i.descanso)}</span>` : ''}</p>
            ${i.observacao ? `<p class="obs">${esc(i.observacao)}</p>` : ''}
          </div>
        </a>`;
      }).join('')}
    </div>
    <div class="secao"><button class="btn btn-largo" type="button" data-concluir="${esc(t.id)}">Concluí este treino</button></div>
  `;
}

function telaExercicio(id) {
  const ex = exercicio(id);
  if (!ex) return naoEncontrado();
  const emTreinos = dados().treinos.filter((t) => t.itens.some((i) => i.exercicio_id === id));
  const dicas = Array.isArray(ex.dicas) ? ex.dicas : [];
  return `
    ${slotDemo(ex.id, 'demo-grande')}
    <p class="olho">${esc(ex.grupo)}</p>
    <h1>${esc(ex.nome)}</h1>
    <p>${esc(ex.descricao)}</p>
    ${dicas.length ? `<h2>Pontos de atenção</h2><ul class="dicas">${dicas.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
    ${ex.cuidado ? `<p class="alerta"><strong>Cuidado:</strong> ${esc(ex.cuidado)}</p>` : ''}
    ${emTreinos.length ? `<section class="secao"><h2>Aparece em</h2><div class="lista">${emTreinos.map((t) => `<a class="cartao cartao-treino" href="#treino/${esc(t.id)}"><div><h4>${esc(t.nome)}</h4><p>${esc(dados().fases.find((f) => f.id === t.fase_id)?.nome)}</p></div>${SETA}</a>`).join('')}</div></section>` : ''}
  `;
}

async function telaEvolucao() {
  const sessoes = await listarSessoes();
  const prog = calcularProgresso(sessoes);
  let barra = '';
  if (prog.proxima) {
    const base = prog.atual.sessoes_para_liberar ?? 0;
    const alvo = prog.proxima.sessoes_para_liberar;
    const pct = Math.min(100, Math.round(((prog.total - base) / (alvo - base)) * 100));
    const faltam = alvo - prog.total;
    barra = `<div class="barra" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}" aria-label="Progresso até a próxima fase"><i style="width:${pct}%"></i></div>
      <p class="sutil">Faltam <strong>${faltam}</strong> ${faltam === 1 ? 'treino' : 'treinos'} para liberar a <strong>${esc(prog.proxima.nome)}</strong>.</p>`;
  } else {
    barra = '<p class="sutil">Você chegou à última fase do programa. Agora o foco é manter a constância e ir ajustando as cargas comigo.</p>';
  }
  const historico = sessoes.slice(0, 30).map((s) => `<li>
      <div>${esc(treino(s.treino_id)?.nome || 'Treino')}<small>${dataCurta.format(new Date(s.concluida_em))}${s.nota ? ' · ' + esc(s.nota) : ''}</small></div>
      <span class="sutil">${s.percepcao ? esc(ROTULO_ESFORCO[s.percepcao]) : ''}</span>
    </li>`).join('');
  return `
    <h1>Sua evolução</h1>
    <div class="numeros">
      <div class="cartao"><strong>${prog.total}</strong><span>treinos concluídos</span></div>
      <div class="cartao"><strong>${prog.semana}</strong><span>nos últimos 7 dias</span></div>
      <div class="cartao"><strong>${prog.media ? prog.media.toFixed(1).replace('.', ',') : '–'}</strong><span>esforço médio (1 a 5)</span></div>
    </div>
    <section class="secao cartao">
      <p class="olho">Fase atual</p>
      <h2>${esc(prog.atual?.nome)}</h2>
      ${barra}
    </section>
    <section class="secao">
      <h2>Histórico</h2>
      ${historico ? `<ul class="historico cartao">${historico}</ul>` : '<p class="vazio cartao">Quando você concluir um treino, ele aparece aqui.</p>'}
    </section>
    ${secaoConteudos('Evolução', 'Por que isso importa')}
  `;
}

function telaMais() {
  const { modo } = dados();
  const u = usuarioAtual();
  let conta;
  if (modo === 'supabase') {
    conta = u
      ? `<p>Você está conectada como <strong>${esc(u.email)}</strong>. Seu histórico fica salvo na sua conta e acompanha você em qualquer aparelho.</p>
         <button class="btn btn-sec" type="button" data-sair>Sair da conta</button>`
      : `<p class="sutil">Entre com seu e-mail para guardar seu histórico na sua conta e acompanhar sua evolução em qualquer aparelho. Você recebe um link de acesso, sem senha.</p>
         <form data-login><label class="campo"><span>Seu e-mail</span><input type="email" name="email" required autocomplete="email" placeholder="voce@email.com"></label>
         <button class="btn" type="submit">Receber link de acesso</button></form>`;
  } else {
    conta = '<p class="sutil">Seu histórico de treinos fica salvo neste aparelho. Se trocar de celular ou limpar os dados do navegador, ele recomeça do zero.</p>';
  }
  return `
    <h1>Mais</h1>
    ${secaoConteudos('Mais', 'Cuidados fora do treino')}
    <section class="secao cartao"><h2>Sua conta</h2>${conta}</section>
  `;
}

function telaConteudo(id) {
  const c = dados().conteudos.find((x) => x.id === id);
  if (!c) return naoEncontrado();
  const corpo = Array.isArray(c.corpo) ? c.corpo : [];
  const fontes = Array.isArray(c.fontes) ? c.fontes : [];
  return `<article class="artigo">
    <p class="olho">${esc(c.categoria)}</p>
    <h1>${esc(c.titulo)}</h1>
    <p class="resumo">${esc(c.resumo)}</p>
    ${corpo.map((p) => `<p>${esc(p)}</p>`).join('')}
    ${fontes.length ? `<footer class="fontes"><h2>Fontes</h2><ul>${fontes.map((f) => `<li><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.label)}</a></li>`).join('')}</ul></footer>` : ''}
  </article>`;
}

function naoEncontrado() {
  return '<h1>Página não encontrada</h1><p><a href="#hoje">Voltar para o início</a></p>';
}

// ---------- Navegação ----------

function abaDaRota(rota, param) {
  if (['hoje', 'treinos', 'evolucao', 'mais'].includes(rota)) return rota;
  if (rota === 'treino' || rota === 'exercicio') return 'treinos';
  if (rota === 'conteudo') return ABAS[dados().conteudos.find((c) => c.id === param)?.aba] || 'mais';
  return 'hoje';
}

let primeiraTela = true;

async function render() {
  const [rota = 'hoje', param] = decodeURIComponent(location.hash.slice(1)).split('/');
  const telas = {
    hoje: telaHoje, treinos: telaTreinos, evolucao: telaEvolucao, mais: telaMais,
    treino: () => telaTreino(param), exercicio: () => telaExercicio(param), conteudo: () => telaConteudo(param),
  };
  const fn = telas[rota] || telaHoje;
  main.innerHTML = await fn();
  ativarDemos();

  const aba = abaDaRota(rota, param);
  document.querySelectorAll('.abas a').forEach((a) => {
    if (a.dataset.aba === aba) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  const detalhe = Boolean(param);
  botaoVoltar.hidden = !detalhe;
  botaoVoltar.dataset.destino = aba;
  document.title = (main.querySelector('h1')?.textContent || 'Início') + ' · Movimento e Longevidade';
  window.scrollTo(0, 0);
  if (!primeiraTela) main.focus({ preventScroll: true });
  primeiraTela = false;
}

// Só volta pelo histórico se a tela anterior foi dentro do site;
// quem chegou por um link direto volta para a aba correspondente.
let navegouDentro = false;
botaoVoltar.addEventListener('click', () => {
  if (navegouDentro) history.back();
  else location.hash = botaoVoltar.dataset.destino || 'hoje';
});
window.addEventListener('hashchange', () => { navegouDentro = true; render(); });

// ---------- Ações ----------

let treinoParaConcluir = null;

main.addEventListener('click', (e) => {
  const concluir = e.target.closest('[data-concluir]');
  if (concluir) {
    treinoParaConcluir = concluir.dataset.concluir;
    dialogo.querySelector('form').reset();
    dialogo.showModal();
  }
  if (e.target.closest('[data-sair]')) {
    sair().then(() => { avisar('Você saiu da conta.'); render(); });
  }
});

main.addEventListener('submit', async (e) => {
  const form = e.target.closest('[data-login]');
  if (!form) return;
  e.preventDefault();
  const botao = form.querySelector('button');
  botao.disabled = true;
  try {
    await entrarComEmail(form.email.value.trim());
    form.innerHTML = '<p>Pronto! Enviamos um link para o seu e-mail. Abra por este mesmo aparelho para entrar.</p>';
  } catch (err) {
    console.error(err);
    avisar('Não foi possível enviar o link. Confira o e-mail e tente de novo.');
    botao.disabled = false;
  }
});

dialogo.querySelector('[data-fechar]').addEventListener('click', () => dialogo.close());
dialogo.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const botao = form.querySelector('[type="submit"]');
  botao.disabled = true;
  try {
    const antes = calcularProgresso(await listarSessoes());
    await salvarSessao({ treino_id: treinoParaConcluir, percepcao: Number(form.percepcao.value), nota: form.nota.value.trim() });
    const depois = calcularProgresso(await listarSessoes());
    dialogo.close();
    if (depois.atual?.id !== antes.atual?.id) avisar(`Parabéns! ${depois.atual.nome} liberada.`);
    else avisar('Treino registrado. Muito bem!');
    location.hash = 'evolucao';
  } catch (err) {
    console.error(err);
    avisar('Não foi possível salvar agora. Tente de novo.');
  } finally {
    botao.disabled = false;
  }
});

// ---------- Início ----------

await iniciar();
aoMudarLogin(() => render());
render();
