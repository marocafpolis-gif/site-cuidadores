# Movimento e Longevidade

Site em formato de aplicativo para as alunas acompanharem os treinos, com
**demonstração em movimento de cada exercício** e conteúdos com fontes.

## O que tem no site

| Aba | O que mostra |
| --- | --- |
| **Hoje** | Treino sugerido do dia (alterna entre A e B da fase atual) + conteúdo *Hidratação* |
| **Treinos** | Fases e treinos, biblioteca de exercícios + conteúdo *Treino seguro* |
| **Evolução** | Treinos concluídos, esforço médio, progresso até a próxima fase, histórico + *Força e longevidade* |
| **Mais** | *Sono*, *Hábitos alimentares* e a conta da aluna |

- **Exercícios em movimento:** cada exercício tem uma animação em repetição.
  Quando a personal envia um vídeo pelo painel, o vídeo toma o lugar da animação
  (toca sozinho, sem som e em repetição, como um GIF).
- **Evolução por fases:** a Fase 2 é liberada com 8 treinos concluídos e a Fase 3 com 16.
  Esses números ficam no banco (`fases.sessoes_para_liberar`) e podem ser alterados.
- **Painel da personal** (`admin.html`): enviar e trocar os vídeos dos exercícios e ver a evolução de cada aluna.

## Estrutura

```
index.html            site das alunas
admin.html            painel da personal
css/styles.css        visual (claro e escuro)
js/app.js             telas e navegação
js/db.js              leitura e gravação de dados (banco ou modo local)
js/animacao.js        motor das animações dos exercícios
js/dados/seed.js      conteúdos, exercícios, fases e treinos iniciais
js/dados/animacoes.js movimentos de cada animação
js/config.js          dados de conexão com o banco
supabase/schema.sql   tabelas, regras de acesso e armazenamento dos vídeos
supabase/seed.sql     dados iniciais para o banco (gerado a partir de seed.js)
```

## Ver o site no computador

O site precisa ser aberto por um servidor (abrir o arquivo direto não funciona):

```bash
python3 -m http.server 8080
# abra http://localhost:8080
```

Sem banco configurado, o site funciona em **modo local**: os treinos vêm de
`js/dados/seed.js` e o histórico de cada aluna fica salvo no próprio aparelho.

## Ativar o banco de dados (Supabase)

O banco guarda os conteúdos, os treinos, os **vídeos** e o histórico de cada aluna.
O plano gratuito do Supabase serve para começar.

1. Crie uma conta e um projeto em <https://supabase.com>.
2. No projeto, abra **SQL Editor**, cole o conteúdo de `supabase/schema.sql` e clique em **Run**.
3. Faça o mesmo com `supabase/seed.sql` (carrega os 5 conteúdos, 12 exercícios, 3 fases e 6 treinos).
4. Em **Authentication → Users → Add user**, crie o usuário da personal com e-mail e senha.
5. Dê a ela o acesso de personal, no SQL Editor (troque o e-mail):
   ```sql
   update public.perfis set papel = 'personal'
   where id = (select id from auth.users where email = 'email-da-personal@exemplo.com');
   ```
6. Em **Project Settings → API**, copie a *Project URL* e a chave *anon public* para `js/config.js`.
7. Em **Authentication → URL Configuration**, coloque o endereço do site publicado em *Site URL*
   (é para onde o link de acesso das alunas leva).

Pronto: a personal entra em `admin.html` para enviar os vídeos, e as alunas entram pela aba **Mais**
com um link enviado por e-mail (sem senha). O que a aluna registrou no aparelho antes de entrar
vai junto para a conta dela.

### Editar treinos e conteúdos

- Pelo próprio Supabase: **Table Editor** → tabelas `treinos`, `treino_exercicios`, `conteudos`, `exercicios`.
- Ou editando `js/dados/seed.js` e rodando `npm run seed:sql` para gerar um novo `supabase/seed.sql`
  (rodar o seed de novo atualiza textos e treinos sem apagar os vídeos já enviados).

## Gravar os vídeos dos exercícios

- Vídeo curto (5 a 15 segundos), mostrando 2 ou 3 repetições.
- Câmera de lado e parada, com o corpo inteiro aparecendo; formato quadrado ou horizontal.
- MP4 ou WEBM, até 50 MB (o ideal é menos de 10 MB para carregar rápido no celular).
- O som não é usado: o vídeo toca sem som.

## Publicar

Como o site é feito só de arquivos (sem etapa de compilação), pode ser publicado no
GitHub Pages, Netlify ou Vercel apontando para a raiz do repositório.
