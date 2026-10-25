// Motor de animação dos exercícios.
// Desenha uma figura em vista lateral (SVG) e interpola entre "poses".
// Ângulos em graus. Membros: 0 = apontando para baixo, positivo = para a frente (+x).
// Tronco: 0 = em pé, positivo = inclinado para a frente.
// Pé: 0 = plano apontando para a frente, positivo = ponta mais baixa que o calcanhar.

const L = { tronco: 50, coxa: 38, canela: 38, braco: 29, antebraco: 27, pe: 13, pescoco: 5, cabeca: 9 };
const CHAO = 182;
const NS = 'http://www.w3.org/2000/svg';

const rad = (g) => (g * Math.PI) / 180;
const deBaixo = (p, ang, len) => [p[0] + Math.sin(rad(ang)) * len, p[1] + Math.cos(rad(ang)) * len];
const soma = (a, b) => [a[0] + b[0], a[1] + b[1]];
const sub = (a, b) => [a[0] - b[0], a[1] - b[1]];

const PADRAO = {
  tronco: 0, curva: 0, cabeca: 0,
  coxaP: 0, canelaP: 0, peP: 0,
  bracoP: 0, antebracoP: 0,
};

function completar(pose) {
  const p = { ...PADRAO, ...pose };
  for (const parte of ['coxa', 'canela', 'pe', 'braco', 'antebraco']) {
    if (p[parte + 'D'] === undefined) p[parte + 'D'] = p[parte + 'P'];
  }
  if (p.maoD === undefined && p.maoP !== undefined) p.maoD = p.maoP;
  if (p.maoAbsD === undefined && p.maoAbsP !== undefined) p.maoAbsD = p.maoAbsP;
  return p;
}

// Cinemática inversa de dois segmentos: devolve o ponto do cotovelo.
function ik(ombro, alvo, sinal) {
  const d = sub(alvo, ombro);
  let dist = Math.hypot(d[0], d[1]);
  const max = L.braco + L.antebraco - 0.01;
  if (dist > max) dist = max;
  const base = Math.atan2(d[0], d[1]) * (180 / Math.PI);
  const cos = (L.braco ** 2 + dist ** 2 - L.antebraco ** 2) / (2 * L.braco * dist);
  const alfa = Math.acos(Math.max(-1, Math.min(1, cos))) * (180 / Math.PI);
  const cotovelo = deBaixo(ombro, base + sinal * alfa, L.braco);
  const ang = Math.atan2(alvo[0] - cotovelo[0], alvo[1] - cotovelo[1]);
  const mao = [cotovelo[0] + Math.sin(ang) * L.antebraco, cotovelo[1] + Math.cos(ang) * L.antebraco];
  return { cotovelo, mao };
}

function calcular(poseBruta, ancora, dobra) {
  const p = completar(poseBruta);
  const pts = {};
  pts.quadril = [0, 0];
  const dir = [Math.sin(rad(p.tronco)), -Math.cos(rad(p.tronco))];
  pts.ombro = soma(pts.quadril, [dir[0] * L.tronco, dir[1] * L.tronco]);
  const angCabeca = p.tronco + p.cabeca;
  const dc = L.pescoco + L.cabeca;
  pts.cabeca = soma(pts.ombro, [Math.sin(rad(angCabeca)) * dc, -Math.cos(rad(angCabeca)) * dc]);

  for (const lado of ['P', 'D']) {
    const joelho = deBaixo(pts.quadril, p['coxa' + lado], L.coxa);
    const tornozelo = deBaixo(joelho, p['canela' + lado], L.canela);
    const pe = p['pe' + lado];
    const ponta = [tornozelo[0] + Math.cos(rad(pe)) * L.pe, tornozelo[1] + Math.sin(rad(pe)) * L.pe];
    pts['joelho' + lado] = joelho;
    pts['tornozelo' + lado] = tornozelo;
    pts['ponta' + lado] = ponta;
  }

  // Braços por ângulo (pode ser substituído por alvo depois).
  for (const lado of ['P', 'D']) {
    const cot = deBaixo(pts.ombro, p['braco' + lado], L.braco);
    pts['cotovelo' + lado] = cot;
    pts['mao' + lado] = deBaixo(cot, p['antebraco' + lado], L.antebraco);
  }
  // Alvo relativo ao ombro.
  for (const lado of ['P', 'D']) {
    const rel = p['mao' + lado];
    if (rel) {
      const r = ik(pts.ombro, soma(pts.ombro, rel), dobra[lado]);
      pts['cotovelo' + lado] = r.cotovelo;
      pts['mao' + lado] = r.mao;
    }
  }

  const chave = { pe: 'pontaP', ponta: 'pontaP', tornozelo: 'tornozeloP', joelho: 'joelhoP', cotovelo: 'cotoveloP', mao: 'maoP' }[ancora.parte] || ancora.parte;
  const desloc = sub([p.ax ?? ancora.x, p.ay ?? ancora.y], pts[chave]);
  for (const k of Object.keys(pts)) pts[k] = soma(pts[k], desloc);

  // Alvo absoluto (ex.: mãos apoiadas no banco), calculado depois do posicionamento.
  for (const lado of ['P', 'D']) {
    const abs = p['maoAbs' + lado];
    if (abs) {
      const r = ik(pts.ombro, abs, dobra[lado]);
      pts['cotovelo' + lado] = r.cotovelo;
      pts['mao' + lado] = r.mao;
    }
  }
  pts.curva = p.curva;
  pts.tronco = p.tronco;
  return pts;
}

function interpolar(a, b, t) {
  const A = completar(a);
  const B = completar(b);
  const r = {};
  for (const k of new Set([...Object.keys(A), ...Object.keys(B)])) {
    const va = A[k] ?? B[k];
    const vb = B[k] ?? A[k];
    if (Array.isArray(va)) r[k] = [va[0] + (vb[0] - va[0]) * t, va[1] + (vb[1] - va[1]) * t];
    else if (typeof va === 'number') r[k] = va + (vb - va) * t;
    else r[k] = va;
  }
  return r;
}

const suave = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

function el(tag, attrs, pai) {
  const n = document.createElementNS(NS, tag);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  if (pai) pai.appendChild(n);
  return n;
}

function desenharProps(svg, props) {
  const g = el('g', { class: 'fig-props' }, svg);
  el('line', { x1: 8, y1: CHAO, x2: 192, y2: CHAO, class: 'fig-chao' }, g);
  for (const pr of props || []) {
    if (pr.tipo === 'colchonete') el('rect', { x: pr.x ?? 20, y: CHAO - 3, width: pr.w ?? 160, height: 4, rx: 2, class: 'fig-colchonete' }, g);
    if (pr.tipo === 'banco') el('rect', { x: pr.x, y: pr.y, width: pr.w, height: CHAO - pr.y, rx: 3, class: 'fig-banco' }, g);
  }
}

export function criarFigura(container, anim) {
  const svg = el('svg', { viewBox: '0 -14 200 204', class: 'figura', role: 'img', 'aria-label': anim.rotulo || 'Demonstração animada do exercício' });
  desenharProps(svg, anim.props);
  const longe = el('g', { class: 'fig-longe' }, svg);
  const perto = el('g', { class: 'fig-perto' }, svg);
  const mk = (g, cls) => el('path', { class: cls }, g);
  const partes = {
    pernaD: mk(longe, 'fig-membro'), bracoD: mk(longe, 'fig-membro'),
    tronco: mk(perto, 'fig-tronco'), cabeca: el('circle', { r: L.cabeca, class: 'fig-cabeca' }, perto),
    pernaP: mk(perto, 'fig-membro'), bracoP: mk(perto, 'fig-membro'),
  };
  const comHalter = (anim.props || []).some((p) => p.tipo === 'halter');
  if (comHalter) {
    partes.halterD = el('rect', { width: 14, height: 6, rx: 2, class: 'fig-halter longe' }, longe);
    partes.halterP = el('rect', { width: 14, height: 6, rx: 2, class: 'fig-halter' }, perto);
  }
  container.appendChild(svg);

  const ancora = anim.ancora;
  const dobra = { P: anim.dobra ?? 1, D: anim.dobraD ?? anim.dobra ?? 1 };
  const f = (n) => n.toFixed(1);
  const linha = (...ps) => 'M' + ps.map((p) => f(p[0]) + ' ' + f(p[1])).join(' L');

  function render(pose) {
    const p = calcular(pose, ancora, dobra);
    for (const lado of ['P', 'D']) {
      partes['perna' + lado].setAttribute('d', linha(p.quadril, p['joelho' + lado], p['tornozelo' + lado], p['ponta' + lado]));
      partes['braco' + lado].setAttribute('d', linha(p.ombro, p['cotovelo' + lado], p['mao' + lado]));
      if (comHalter) {
        const m = p['mao' + lado];
        partes['halter' + lado].setAttribute('x', f(m[0] - 7));
        partes['halter' + lado].setAttribute('y', f(m[1] - 3));
      }
    }
    const meio = [(p.quadril[0] + p.ombro[0]) / 2, (p.quadril[1] + p.ombro[1]) / 2];
    const perp = [Math.cos(rad(p.tronco)), Math.sin(rad(p.tronco))];
    const ctrl = [meio[0] + perp[0] * p.curva * 2, meio[1] + perp[1] * p.curva * 2];
    partes.tronco.setAttribute('d', `M${f(p.quadril[0])} ${f(p.quadril[1])} Q${f(ctrl[0])} ${f(ctrl[1])} ${f(p.ombro[0])} ${f(p.ombro[1])}`);
    partes.cabeca.setAttribute('cx', f(p.cabeca[0]));
    partes.cabeca.setAttribute('cy', f(p.cabeca[1]));
  }

  // Linha do tempo: cada pose tem transição (ms) e pausa (ms) ao chegar nela.
  const poses = anim.poses;
  const trans = anim.transicao ?? 1100;
  const pausa = anim.pausa ?? 350;
  const etapa = trans + pausa;
  const ciclo = etapa * poses.length;
  let inicio = null;
  let raf = null;
  let tempoPausado = 0;

  function quadro(agora) {
    if (inicio === null) inicio = agora - tempoPausado;
    const t = (agora - inicio) % ciclo;
    const i = Math.floor(t / etapa);
    const local = t - i * etapa;
    const de = poses[i];
    const para = poses[(i + 1) % poses.length];
    render(local < pausa ? de : interpolar(de, para, suave((local - pausa) / trans)));
    raf = requestAnimationFrame(quadro);
  }

  const controle = {
    tocando: false,
    tocar() {
      if (this.tocando) return;
      this.tocando = true;
      inicio = null;
      raf = requestAnimationFrame(quadro);
    },
    pausar() {
      if (!this.tocando) return;
      this.tocando = false;
      cancelAnimationFrame(raf);
      tempoPausado = inicio === null ? 0 : (performance.now() - inicio) % ciclo;
    },
    renderPose(i) { render(poses[i]); },
    svg,
  };
  render(poses[0]);
  return controle;
}

const reduzMovimento = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Monta a demonstração: vídeo (quando cadastrado no banco) ou animação.
// Só anima enquanto estiver visível na tela, para economizar bateria.
export function montarDemonstracao(container, exercicio, animacoes) {
  container.innerHTML = '';
  container.classList.add('demo');
  if (exercicio.video_url) {
    const v = document.createElement('video');
    v.src = exercicio.video_url;
    if (exercicio.video_poster) v.poster = exercicio.video_poster;
    v.muted = true;
    v.loop = true;
    v.playsInline = true;
    v.setAttribute('playsinline', '');
    v.preload = 'metadata';
    v.setAttribute('aria-label', 'Vídeo do exercício ' + exercicio.nome);
    container.appendChild(v);
    observar(container, () => v.play().catch(() => {}), () => v.pause());
    container.dataset.tipo = 'video';
    return;
  }
  const anim = animacoes[exercicio.animacao];
  if (!anim) {
    container.textContent = 'Demonstração em breve';
    return;
  }
  const ctl = criarFigura(container, { ...anim, rotulo: 'Animação do exercício ' + exercicio.nome });
  container.dataset.tipo = 'animacao';
  if (reduzMovimento()) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'demo-play';
    b.textContent = 'Ver movimento';
    b.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (ctl.tocando) { ctl.pausar(); b.textContent = 'Ver movimento'; } else { ctl.tocar(); b.textContent = 'Pausar'; }
    });
    container.appendChild(b);
    return;
  }
  observar(container, () => ctl.tocar(), () => ctl.pausar());
}

function observar(alvo, entrar, sair) {
  if (!('IntersectionObserver' in window)) { entrar(); return; }
  const io = new IntersectionObserver((ents) => {
    for (const e of ents) (e.isIntersecting ? entrar : sair)();
  }, { threshold: 0.15 });
  io.observe(alvo);
}
