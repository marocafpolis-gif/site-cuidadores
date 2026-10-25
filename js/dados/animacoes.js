// Poses de cada demonstração animada (vista lateral, figura olhando para a direita).
// "P" = lado mais perto de quem assiste, "D" = lado mais distante (desenhado mais claro).
// Quando a personal cadastrar um vídeo no banco, o vídeo substitui a animação.

const PISO = 178; // altura do tornozelo com o pé apoiado
const EM_PE = 102; // altura do quadril em pé

const emPe = { tronco: 0, coxaP: 0, canelaP: 0, bracoP: 4, antebracoP: 6 };

export const ANIMACOES = {
  'marcha-joelhos': {
    ancora: { parte: 'quadril', x: 96, y: EM_PE },
    transicao: 450, pausa: 120,
    poses: [
      { ...emPe, coxaP: 85, canelaP: 0, peP: 15, bracoP: -35, antebracoP: 50, bracoD: 40, antebracoD: 110, coxaD: 0, canelaD: 0, peD: 0 },
      { ...emPe, bracoD: 4, antebracoD: 6 },
      { ...emPe, coxaD: 85, canelaD: 0, peD: 15, bracoD: -35, antebracoD: 50, bracoP: 40, antebracoP: 110 },
      { ...emPe, bracoD: 4, antebracoD: 6 },
    ],
  },

  agachamento: {
    ancora: { parte: 'tornozelo', x: 104, y: PISO },
    poses: [
      { ...emPe, bracoP: 80, antebracoP: 85 },
      { tronco: 38, coxaP: 82, canelaP: -24, bracoP: 88, antebracoP: 90 },
    ],
  },

  'ponte-gluteo': {
    ancora: { parte: 'tornozelo', x: 132, y: PISO },
    props: [{ tipo: 'colchonete' }],
    poses: [
      { tronco: -92, cabeca: -6, coxaP: 135, canelaP: 10, bracoP: 90, antebracoP: 90 },
      { tronco: -115, cabeca: 4, coxaP: 100, canelaP: -15, bracoP: 90, antebracoP: 90 },
    ],
  },

  'flexao-inclinada': {
    ancora: { parte: 'tornozelo', x: 52, y: PISO - 2 },
    props: [{ tipo: 'banco', x: 118, y: 140, w: 62 }],
    dobra: -1,
    poses: [
      { tronco: 42, coxaP: -42, canelaP: -42, peP: 70, maoAbsP: [140, 138] },
      { tronco: 53, coxaP: -53, canelaP: -53, peP: 60, maoAbsP: [140, 138] },
    ],
  },

  'remada-curvada': {
    ancora: { parte: 'tornozelo', x: 102, y: PISO },
    props: [{ tipo: 'halter' }],
    dobra: -1,
    poses: [
      { tronco: 62, coxaP: 22, canelaP: -8, cabeca: -20, maoP: [2, 54] },
      { tronco: 62, coxaP: 22, canelaP: -8, cabeca: -20, maoP: [-14, 30] },
    ],
  },

  'terra-romeno': {
    ancora: { parte: 'tornozelo', x: 104, y: PISO },
    props: [{ tipo: 'halter' }],
    poses: [
      { tronco: 0, coxaP: 0, canelaP: 0, bracoP: 2, antebracoP: 2 },
      { tronco: 72, cabeca: -18, coxaP: 22, canelaP: -6, bracoP: -2, antebracoP: -2 },
    ],
  },

  desenvolvimento: {
    ancora: { parte: 'quadril', x: 100, y: EM_PE },
    props: [{ tipo: 'halter' }],
    dobra: -1,
    poses: [
      { ...emPe, maoP: [5, 0] },
      { ...emPe, maoP: [3, -52] },
    ],
  },

  afundo: {
    ancora: { parte: 'tornozelo', x: 132, y: PISO },
    poses: [
      { tronco: 2, coxaP: 16, canelaP: 4, coxaD: -22, canelaD: -22, peD: 35, bracoP: 3, antebracoP: 4 },
      { tronco: 4, coxaP: 82, canelaP: 2, coxaD: -8, canelaD: -82, peD: 70, bracoP: 3, antebracoP: 4 },
    ],
  },

  panturrilha: {
    ancora: { parte: 'ponta', x: 116, y: PISO },
    transicao: 800,
    poses: [
      { ...emPe, peP: 0 },
      { ...emPe, peP: 38 },
    ],
  },

  prancha: {
    ancora: { parte: 'cotovelo', x: 148, y: PISO },
    props: [{ tipo: 'colchonete' }],
    transicao: 1200, pausa: 1600,
    poses: [
      { tronco: 71, cabeca: 6, coxaP: -71, canelaP: -92, peP: 180, bracoP: 0, antebracoP: 90 },
      { tronco: 77, cabeca: 6, coxaP: -77, canelaP: -77, peP: 105, bracoP: 0, antebracoP: 90 },
    ],
  },

  perdigueiro: {
    ancora: { parte: 'joelho', x: 92, y: PISO },
    props: [{ tipo: 'colchonete' }],
    transicao: 1200, pausa: 700,
    poses: [
      { tronco: 72, cabeca: 10, coxaP: 0, canelaP: -90, peP: 180, bracoP: 0, antebracoP: 0 },
      { tronco: 76, cabeca: 0, coxaP: 0, canelaP: -90, peP: 180, bracoP: 98, antebracoP: 98, bracoD: 0, antebracoD: 0, coxaD: -92, canelaD: -92, peD: 180 },
    ],
  },

  'gato-camelo': {
    ancora: { parte: 'joelho', x: 92, y: PISO },
    props: [{ tipo: 'colchonete' }],
    transicao: 1500, pausa: 500,
    poses: [
      { tronco: 72, curva: -9, cabeca: 40, coxaP: 0, canelaP: -90, peP: 180, bracoP: 0, antebracoP: 0 },
      { tronco: 72, curva: 7, cabeca: -25, coxaP: 0, canelaP: -90, peP: 180, bracoP: 0, antebracoP: 0 },
    ],
  },
};
