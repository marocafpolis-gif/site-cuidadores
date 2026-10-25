// Dados iniciais do site. Funcionam sozinhos (modo local) e também servem
// para popular o banco de dados (ver scripts/gerar-seed-sql.mjs).

export const CONTEUDOS = [
  {
    id: 'hidratacao',
    titulo: 'Hidratação: o quanto realmente importa',
    categoria: 'Segurança nos exercícios',
    aba: 'Hoje',
    resumo: 'Quanto beber antes, durante e depois do treino — sem exagero.',
    corpo: [
      'Beber água parece óbvio, mas na prática é comum treinar meio desidratada sem perceber — e isso afeta desde o seu desempenho até a sua disposição no resto do dia. Não precisa virar obsessão: pequenos ajustes já fazem diferença.',
      'Uma boa referência, usada pela Sociedade Brasileira de Medicina do Exercício e do Esporte, é beber entre 250 e 500 ml de água cerca de duas horas antes de treinar, e continuar bebendo aos poucos durante a sessão — principalmente se ela passar de uma hora. Depois do treino, o ideal é manter a hidratação ao longo do dia, não só naquele momento.',
      'Para treinos de até uma hora (a maioria dos nossos), água já é suficiente. Em sessões muito mais longas, beber só água sem repor sal também não é saudável — mas isso é exceção, não a regra do dia a dia.',
      'Se sentir sede intensa, tontura ou mal-estar durante o treino, pare e me avise — isso não é frescura, é seu corpo pedindo atenção.',
    ],
    fontes: [
      {
        label: 'Sociedade Brasileira de Medicina do Exercício e do Esporte (SBME) / ACSM — Exercise and Fluid Replacement, via Nutritotal PRO',
        url: 'https://nutritotal.com.br/pro/qual-a-a-recomendaa-a-o-de-reposia-a-o-ha-drica-no-exerca-cio-fa-sico/',
      },
    ],
  },
  {
    id: 'sono',
    titulo: 'Sono: a parte do treino que ninguém vê',
    categoria: 'Constância',
    aba: 'Mais',
    resumo: 'Por que dormir bem é parte do método, não um detalhe.',
    corpo: [
      'Todo mundo foca na hora do treino, mas boa parte do resultado acontece enquanto você dorme — é quando o corpo repara o músculo trabalhado. Dormir mal não anula o treino, mas atrapalha a recuperação e a disposição pros próximos dias.',
      'Um estudo publicado na revista científica Nutrients, sobre práticas de sono e recuperação de atletas, aponta a faixa de 7 a 9 horas de sono por noite como referência para quem treina com regularidade — podendo ser ainda mais para quem treina intenso.',
      'Na prática, ajuda manter um horário parecido pra dormir e acordar (inclusive no fim de semana), evitar tela cerca de uma hora antes de deitar, reduzir cafeína e álcool à noite, e deixar o quarto escuro, silencioso e fresco.',
      'Se você tem insônia frequente, ronco alto ou cansaço que não melhora com o descanso, vale conversar com um médico ou especialista em sono — isso vai além do que posso te orientar como personal.',
    ],
    fontes: [
      {
        label: 'Estudo "The Sleep and Recovery Practices of Athletes" (Nutrients), via Tua Saúde',
        url: 'https://www.tuasaude.com/news/2026/05/07/quantas-horas-de-sono-sao-necessarias-para-uma-recuperacao-muscular-eficaz/',
      },
    ],
  },
  {
    id: 'treino-seguro',
    titulo: 'Treino seguro: mitos e técnica',
    categoria: 'Segurança nos exercícios',
    aba: 'Treinos',
    resumo: 'Por que treino de força não deixa mulher "volumosa", e como treinar com segurança.',
    corpo: [
      'Um dos medos mais comuns entre as mulheres que começam a treinar força é "ficar grande" ou "muito volumosa". Vale desfazer esse mito com calma, porque ele afasta muita gente de um treino que faz muito bem.',
      'Mulheres têm bem menos testosterona circulante que homens, o que torna o ganho de massa muscular naturalmente mais lento e limitado. Um estudo com atletas mulheres, de 11 semanas, mostrou aumento real de força e uma aparência mais definida — sem o corpo ficar visivelmente volumoso. Os físicos muito musculosos de capa de revista vêm de anos de treino muito específico, volume muito alto e, em alguns casos, de recursos que não fazem parte do treino comum.',
      'Sobre segurança: a técnica sempre vem antes da carga. Isso significa aquecer antes de um esforço mais intenso, aumentar o peso aos poucos — nunca de uma vez — e respeitar o tempo de descanso entre séries. Descansar também é parte do treino, não preguiça.',
      'Cada corpo responde de um jeito, e é por isso que ajusto o treino de cada aluna com base no que ela me conta na avaliação inicial — não existe ficha genérica que sirva igual pra todo mundo.',
    ],
    fontes: [
      {
        label: 'Vikmoen et al., 2016, resumido por GetFitCraft — Fitness Myths Debunked',
        url: 'https://getfitcraft.com/pt/blog/fitness-myths-debunked',
      },
      {
        label: 'American Council on Exercise (ACE) — Common Exercise Mistakes and Fixes',
        url: 'https://www.acefitness.org/about-ace/press-room/press-releases/2481/american-council-on-exercise-shares-most-common-exericise-mistakes-and-fixes-to-avoid-them/',
      },
    ],
  },
  {
    id: 'habitos-alimentares',
    titulo: 'Hábitos alimentares, sem radicalismo',
    categoria: 'Constância',
    aba: 'Mais',
    resumo: 'O que a diretriz oficial do Brasil recomenda — sem dieta e sem radicalismo.',
    corpo: [
      'Eu não prescrevo dieta — isso é trabalho de nutricionista, e cada corpo tem uma necessidade diferente. O que posso compartilhar é a orientação oficial do Ministério da Saúde pra população brasileira, que é simples e não exige radicalismo nenhum.',
      'A "regra de ouro" do Guia Alimentar para a População Brasileira é direta: priorizar comida de verdade — arroz e feijão são o próprio exemplo que o documento usa — e evitar alimentos ultraprocessados, que estudos associam a mais risco de doenças cardiovasculares e outros problemas de saúde a longo prazo.',
      'Isso não significa cortar tudo de uma vez ou viver de prato perfeito. É sobre direção: ir trocando um pouco mais de comida de verdade no lugar do ultraprocessado, no seu ritmo. Se quiser uma orientação mais específica pro seu objetivo, posso te indicar uma nutricionista de confiança.',
    ],
    fontes: [
      {
        label: 'Guia Alimentar para a População Brasileira — Ministério da Saúde, resumido pelo Conselho Federal de Nutricionistas (CFN)',
        url: 'https://cfn.org.br/guia-alimentar-completa-dez-anos-por-que-o-documento-do-ministerio-da-saude-esta-mais-atual/',
      },
    ],
  },
  {
    id: 'forca-longevidade',
    titulo: 'Força e longevidade: o que a ciência diz',
    categoria: 'Longevidade',
    aba: 'Evolução',
    resumo: 'Por que o treino de força é a aposta mais sólida pra quem pensa em se mover bem por muito mais tempo.',
    corpo: [
      '"Movimento e Longevidade" não é só um nome bonito — é uma aposta baseada no que a ciência do esporte vem mostrando, ano após ano. Treino de força aparece entre as dez tendências mais fortes do mundo em 17 dos últimos 20 anos, segundo o ranking anual do American College of Sports Medicine (ACSM), a maior entidade científica da área.',
      'Para 2026, o ranking do ACSM coloca em destaque programas de exercício pra idade mais avançada — com foco em equilíbrio, massa muscular, força e mobilidade — e também o trabalho de equilíbrio e fluidez do corpo. Isso confirma algo que já é o centro do método: força não é sobre estética, é sobre continuar fazendo o que você gosta, com autonomia, daqui a 10, 20, 30 anos.',
      'Uma referência internacional em treino pra mulheres na meia-idade, o Flipping 50, reforça que o treino dessa fase da vida precisa respeitar as mudanças do corpo e tratar recuperação — sono, mobilidade — como parte do treino, não como extra. É exatamente assim que cada aluna é acompanhada aqui.',
    ],
    fontes: [
      { label: 'ACSM — Top Fitness Trends for 2026', url: 'https://acsm.org/top-fitness-trends-2026/' },
      { label: "Flipping 50 — Fitness Trends for 2026, Midlife Women's Edition", url: 'https://www.flippingfifty.com/fitness-trends-for-2026' },
    ],
  },
];

// Exercícios. "animacao" aponta para js/dados/animacoes.js.
// "video_url" fica vazio até a personal enviar o vídeo pelo painel (admin.html).
export const EXERCICIOS = [
  {
    id: 'marcha-joelhos', nome: 'Marcha com elevação de joelhos', grupo: 'Aquecimento', animacao: 'marcha-joelhos', video_url: null,
    descricao: 'Marcha no lugar, subindo um joelho de cada vez e balançando os braços no ritmo.',
    dicas: ['Mantenha o tronco alto, sem jogar o corpo para trás.', 'Comece devagar e aumente o ritmo aos poucos.'],
    cuidado: 'Se tiver dor no joelho ou no quadril, diminua a altura da perna.',
  },
  {
    id: 'agachamento', nome: 'Agachamento livre', grupo: 'Pernas e glúteos', animacao: 'agachamento', video_url: null,
    descricao: 'Pés na largura do quadril. Leve o quadril para trás e para baixo, como quem vai sentar numa cadeira, e volte empurrando o chão.',
    dicas: ['Os joelhos acompanham a direção dos pés.', 'Calcanhares sempre no chão.', 'Desça só até onde consegue manter a coluna firme.'],
    cuidado: 'No começo, vale usar uma cadeira atrás de você como referência de altura.',
  },
  {
    id: 'ponte-gluteo', nome: 'Ponte de glúteo', grupo: 'Pernas e glúteos', animacao: 'ponte-gluteo', video_url: null,
    descricao: 'Deitada de barriga para cima, joelhos dobrados e pés no chão. Suba o quadril apertando o glúteo e desça com controle.',
    dicas: ['Empurre o chão com os calcanhares.', 'No alto, ombros, quadril e joelhos ficam alinhados.'],
    cuidado: 'Não force a lombar para subir mais: quem sobe é o quadril.',
  },
  {
    id: 'flexao-inclinada', nome: 'Flexão inclinada no banco', grupo: 'Peito e braços', animacao: 'flexao-inclinada', video_url: null,
    descricao: 'Mãos apoiadas num banco firme, corpo reto da cabeça aos pés. Dobre os cotovelos levando o peito até o banco e volte.',
    dicas: ['Cotovelos apontam um pouco para trás, não para os lados.', 'Abdômen firme para o quadril não cair.'],
    cuidado: 'Quanto mais alto o apoio, mais fácil. Uma parede também serve.',
  },
  {
    id: 'remada-curvada', nome: 'Remada curvada com halteres', grupo: 'Costas', animacao: 'remada-curvada', video_url: null,
    descricao: 'Joelhos levemente dobrados, tronco inclinado à frente com a coluna reta. Puxe os halteres em direção ao quadril e desça devagar.',
    dicas: ['Leve os cotovelos para trás, perto do corpo.', 'Aproxime as escápulas no final do movimento.'],
    cuidado: 'Se sentir a lombar, diminua a inclinação do tronco ou apoie uma mão num banco.',
  },
  {
    id: 'terra-romeno', nome: 'Levantamento terra romeno com halteres', grupo: 'Posterior e glúteos', animacao: 'terra-romeno', video_url: null,
    descricao: 'Em pé, halteres à frente das coxas. Leve o quadril para trás deslizando os halteres pelas pernas e volte apertando o glúteo.',
    dicas: ['O movimento é do quadril, não da coluna.', 'Halteres sempre perto das pernas.'],
    cuidado: 'Desça só até sentir alongar a parte de trás da coxa, sem arredondar as costas.',
  },
  {
    id: 'desenvolvimento', nome: 'Desenvolvimento com halteres', grupo: 'Ombros', animacao: 'desenvolvimento', video_url: null,
    descricao: 'Halteres na altura dos ombros. Empurre para cima até estender os braços e desça com controle.',
    dicas: ['Costelas para baixo, sem arquear as costas.', 'Pode ser feito sentada, com encosto.'],
    cuidado: 'Se tiver histórico de dor no ombro, avise antes de fazer este exercício.',
  },
  {
    id: 'afundo', nome: 'Afundo parado', grupo: 'Pernas e glúteos', animacao: 'afundo', video_url: null,
    descricao: 'Um pé à frente e outro atrás. Desça dobrando os dois joelhos e volte empurrando o pé da frente.',
    dicas: ['O tronco fica alto.', 'O joelho de trás vai em direção ao chão, sem bater.'],
    cuidado: 'Para mais equilíbrio, apoie uma mão na parede.',
  },
  {
    id: 'panturrilha', nome: 'Elevação de panturrilha', grupo: 'Pernas', animacao: 'panturrilha', video_url: null,
    descricao: 'Em pé, suba na ponta dos pés e desça devagar até apoiar os calcanhares.',
    dicas: ['Suba o mais alto que conseguir, sem pressa.', 'Pode apoiar as mãos numa parede.'],
    cuidado: 'Faça devagar se sentir câimbra.',
  },
  {
    id: 'prancha', nome: 'Prancha', grupo: 'Abdômen e core', animacao: 'prancha', video_url: null,
    descricao: 'Apoie antebraços e joelhos (versão mais leve) ou antebraços e pontas dos pés. Mantenha o corpo reto e respire.',
    dicas: ['Cotovelos embaixo dos ombros.', 'Não prenda a respiração.'],
    cuidado: 'Se a lombar incomodar, volte para a versão com joelhos no chão.',
  },
  {
    id: 'perdigueiro', nome: 'Perdigueiro', grupo: 'Abdômen e core', animacao: 'perdigueiro', video_url: null,
    descricao: 'Em quatro apoios, estenda um braço à frente e a perna oposta para trás. Volte e troque de lado.',
    dicas: ['Quadril parado, sem girar.', 'Pense em "crescer" para as duas pontas.'],
    cuidado: 'Comece estendendo só a perna, se o equilíbrio ainda for difícil.',
  },
  {
    id: 'gato-camelo', nome: 'Mobilidade gato-camelo', grupo: 'Mobilidade', animacao: 'gato-camelo', video_url: null,
    descricao: 'Em quatro apoios, arredonde as costas olhando para o umbigo e depois afunde levemente a coluna olhando para a frente.',
    dicas: ['Movimento lento, junto com a respiração.', 'Use toda a coluna, do quadril ao pescoço.'],
    cuidado: 'Faça numa amplitude confortável, sem dor.',
  },
];

// Fases do método. A próxima fase é liberada quando a aluna conclui
// o número de sessões indicado em "sessoes_para_liberar" da fase anterior.
export const FASES = [
  { id: 'fase-1', nome: 'Fase 1 · Base', ordem: 1, sessoes_para_liberar: 0, descricao: 'Aprender os movimentos com o peso do corpo e criar o hábito.' },
  { id: 'fase-2', nome: 'Fase 2 · Construção', ordem: 2, sessoes_para_liberar: 8, descricao: 'Introduzir halteres e ganhar força com segurança.' },
  { id: 'fase-3', nome: 'Fase 3 · Fortalecimento', ordem: 3, sessoes_para_liberar: 16, descricao: 'Mais desafio de força, equilíbrio e estabilidade.' },
];

// Treinos-modelo. Séries e repetições são um ponto de partida editável:
// a personal ajusta para cada aluna depois da avaliação.
export const TREINOS = [
  {
    id: 'f1-a', fase_id: 'fase-1', ordem: 1, nome: 'Treino A · Corpo todo', foco: 'Pernas, peito e core', duracao_min: 35,
    itens: [
      { exercicio_id: 'marcha-joelhos', series: '1', repeticoes: '2 min', descanso: '—' },
      { exercicio_id: 'gato-camelo', series: '1', repeticoes: '8', descanso: '—' },
      { exercicio_id: 'agachamento', series: '2', repeticoes: '10', descanso: '60 s' },
      { exercicio_id: 'flexao-inclinada', series: '2', repeticoes: '8', descanso: '60 s' },
      { exercicio_id: 'ponte-gluteo', series: '2', repeticoes: '12', descanso: '45 s' },
      { exercicio_id: 'prancha', series: '2', repeticoes: '20 s', descanso: '45 s', observacao: 'Versão com joelhos no chão' },
    ],
  },
  {
    id: 'f1-b', fase_id: 'fase-1', ordem: 2, nome: 'Treino B · Corpo todo', foco: 'Pernas, equilíbrio e core', duracao_min: 35,
    itens: [
      { exercicio_id: 'marcha-joelhos', series: '1', repeticoes: '2 min', descanso: '—' },
      { exercicio_id: 'afundo', series: '2', repeticoes: '8 cada perna', descanso: '60 s', observacao: 'Com apoio na parede' },
      { exercicio_id: 'panturrilha', series: '2', repeticoes: '12', descanso: '45 s' },
      { exercicio_id: 'perdigueiro', series: '2', repeticoes: '6 cada lado', descanso: '45 s' },
      { exercicio_id: 'gato-camelo', series: '1', repeticoes: '8', descanso: '—' },
    ],
  },
  {
    id: 'f2-a', fase_id: 'fase-2', ordem: 1, nome: 'Treino A · Inferiores', foco: 'Pernas e glúteos com halteres', duracao_min: 40,
    itens: [
      { exercicio_id: 'marcha-joelhos', series: '1', repeticoes: '3 min', descanso: '—' },
      { exercicio_id: 'agachamento', series: '3', repeticoes: '10', descanso: '75 s' },
      { exercicio_id: 'terra-romeno', series: '3', repeticoes: '10', descanso: '75 s' },
      { exercicio_id: 'afundo', series: '2', repeticoes: '10 cada perna', descanso: '60 s' },
      { exercicio_id: 'ponte-gluteo', series: '3', repeticoes: '12', descanso: '45 s' },
    ],
  },
  {
    id: 'f2-b', fase_id: 'fase-2', ordem: 2, nome: 'Treino B · Superiores e core', foco: 'Costas, ombros e abdômen', duracao_min: 40,
    itens: [
      { exercicio_id: 'gato-camelo', series: '1', repeticoes: '8', descanso: '—' },
      { exercicio_id: 'remada-curvada', series: '3', repeticoes: '10', descanso: '60 s' },
      { exercicio_id: 'desenvolvimento', series: '3', repeticoes: '10', descanso: '60 s' },
      { exercicio_id: 'flexao-inclinada', series: '3', repeticoes: '10', descanso: '60 s' },
      { exercicio_id: 'prancha', series: '3', repeticoes: '25 s', descanso: '45 s' },
    ],
  },
  {
    id: 'f3-a', fase_id: 'fase-3', ordem: 1, nome: 'Treino A · Força total', foco: 'Corpo todo com mais carga', duracao_min: 45,
    itens: [
      { exercicio_id: 'marcha-joelhos', series: '1', repeticoes: '3 min', descanso: '—' },
      { exercicio_id: 'agachamento', series: '4', repeticoes: '8', descanso: '90 s', observacao: 'Segurando halteres' },
      { exercicio_id: 'remada-curvada', series: '4', repeticoes: '8', descanso: '90 s' },
      { exercicio_id: 'terra-romeno', series: '3', repeticoes: '8', descanso: '90 s' },
      { exercicio_id: 'desenvolvimento', series: '3', repeticoes: '8', descanso: '75 s' },
      { exercicio_id: 'prancha', series: '3', repeticoes: '30 s', descanso: '45 s' },
    ],
  },
  {
    id: 'f3-b', fase_id: 'fase-3', ordem: 2, nome: 'Treino B · Equilíbrio e estabilidade', foco: 'Pernas unilaterais e core', duracao_min: 40,
    itens: [
      { exercicio_id: 'gato-camelo', series: '1', repeticoes: '8', descanso: '—' },
      { exercicio_id: 'afundo', series: '3', repeticoes: '10 cada perna', descanso: '75 s', observacao: 'Sem apoio, se estiver estável' },
      { exercicio_id: 'ponte-gluteo', series: '3', repeticoes: '12', descanso: '45 s', observacao: 'Pode usar halter no quadril' },
      { exercicio_id: 'panturrilha', series: '3', repeticoes: '15', descanso: '45 s' },
      { exercicio_id: 'perdigueiro', series: '3', repeticoes: '8 cada lado', descanso: '45 s' },
      { exercicio_id: 'flexao-inclinada', series: '3', repeticoes: '12', descanso: '60 s' },
    ],
  },
];
