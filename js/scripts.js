/* ==========================================================
   js/scripts.js — CP3 (Git, deploy e JavaScript)
   Usado em TODAS as páginas do site.
   ========================================================== */

/* ---------- 1. Tema claro/escuro com localStorage ---------- */
const CHAVE_TEMA = 'tema-site'; // nome da "gaveta" no localStorage

function lerTemaSalvo() {
  try {
    return localStorage.getItem(CHAVE_TEMA); // 'light', 'dark' ou null
  } catch (erro) {
    return null; // localStorage bloqueado (ex.: navegação restrita)
  }
}

function salvarTema(tema) {
  try {
    localStorage.setItem(CHAVE_TEMA, tema);
  } catch (erro) {
    /* sem localStorage: o tema só vale até recarregar */
  }
}

function descobrirTemaInicial() {
  const salvo = lerTemaSalvo();
  if (salvo === 'light' || salvo === 'dark') return salvo;
  // Primeira visita: segue a preferência do sistema do visitante
  const sistemaEscuro = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return sistemaEscuro ? 'dark' : 'light';
}

function atualizarBotaoTema(tema) {
  const botao = document.getElementById('btn-tema');
  if (!botao) return;
  const escuro = tema === 'dark';
  botao.textContent = escuro ? '☀️ Tema claro' : '🌙 Tema escuro';
  botao.setAttribute('aria-pressed', String(escuro));
}

function aplicarTema(tema) {
  document.documentElement.setAttribute('data-theme', tema);
  atualizarBotaoTema(tema);
}

function iniciarBotaoTema() {
  const botao = document.getElementById('btn-tema');
  if (!botao) return;
  atualizarBotaoTema(document.documentElement.getAttribute('data-theme'));

  botao.addEventListener('click', () => {
    const atual = document.documentElement.getAttribute('data-theme');
    const novo = atual === 'dark' ? 'light' : 'dark';
    aplicarTema(novo);
    salvarTema(novo); // <- aqui o localStorage guarda a escolha
    desenharCanvas(); // redesenha o canvas com as cores do novo tema
  });
}

// Roda já no <head>, antes da página aparecer (evita "piscar" de tema)
aplicarTema(descobrirTemaInicial());

/* ---------- 2. Canvas da página de gráficos ---------- */
function desenharCanvas() {
  const canvas = document.getElementById('meuCanvas');
  if (!canvas) return; // só existe em graficos.html
  const ctx = canvas.getContext('2d');
  const escuro = document.documentElement.getAttribute('data-theme') === 'dark';

  ctx.fillStyle = escuro ? '#243248' : '#dfeeff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#4f9dff';
  ctx.fillRect(70, 170, 120, 110);

  ctx.fillStyle = escuro ? '#9cc9ff' : '#1f3a5f';
  ctx.fillRect(240, 120, 120, 160);

  ctx.fillStyle = '#1f9d7a';
  ctx.fillRect(410, 90, 120, 190);

  ctx.beginPath();
  ctx.arc(585, 95, 50, 0, Math.PI * 2);
  ctx.fillStyle = '#ffb703';
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(230, 240);
  ctx.lineTo(350, 115);
  ctx.lineTo(470, 240);
  ctx.closePath();
  ctx.fillStyle = '#ef476f';
  ctx.fill();
}

/* ---------- Inicialização (quando o HTML terminar de carregar) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  iniciarBotaoTema();
  desenharCanvas();
});
