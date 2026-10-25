// Configuração do banco de dados (Supabase).
// Deixe vazio para o site funcionar em "modo local": os treinos vêm de
// js/dados/seed.js e o histórico de cada aluna fica salvo no próprio aparelho.
// Para ativar o banco, preencha com os dados de Project Settings → API no Supabase.
// A chave "anon" é pública por natureza; a segurança vem das regras (RLS) do schema.sql.
export const CONFIG = {
  supabaseUrl: '',
  supabaseAnonKey: '',
  bucketVideos: 'videos-exercicios',
};
