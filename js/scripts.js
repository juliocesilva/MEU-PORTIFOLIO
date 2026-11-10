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

/* ---------- 3. Formulário de contato: validação com feedback visível ---------- */
function ancoraDoErro(campo) {
  // Radios mostram o erro depois do <fieldset>; os demais, depois do próprio campo
  return campo.type === 'radio' ? campo.closest('fieldset') : campo;
}

function limparErro(campo) {
  const ancora = ancoraDoErro(campo);
  const proximo = ancora.nextElementSibling;
  if (proximo && proximo.classList.contains('erro-campo')) proximo.remove();
  campo.removeAttribute('aria-invalid');
  campo.removeAttribute('aria-describedby');
}

function mostrarErro(campo, texto) {
  limparErro(campo);
  const aviso = document.createElement('span');
  aviso.className = 'erro-campo';
  aviso.id = 'erro-' + (campo.name || campo.id);
  aviso.textContent = texto;
  ancoraDoErro(campo).insertAdjacentElement('afterend', aviso);
  campo.setAttribute('aria-invalid', 'true');
  campo.setAttribute('aria-describedby', aviso.id);
}

// Devolve o texto do erro do campo ou '' se estiver tudo certo
function mensagemDeErro(campo) {
  const v = campo.validity;
  const valor = campo.value;
  const ehTexto = ['text', 'textarea', 'email', 'tel', 'url'].includes(campo.type);

  if (v.valueMissing || (campo.required && ehTexto && valor.trim() === '')) {
    if (campo.type === 'radio') return 'Escolha uma opção.';
    if (campo.tagName === 'SELECT') return 'Selecione uma opção.';
    return 'Preencha este campo.';
  }
  if (campo.minLength > 0 && valor.length > 0 && valor.length < campo.minLength) {
    return 'Digite pelo menos ' + campo.minLength + ' caracteres (agora: ' + valor.length + ').';
  }
  if (v.typeMismatch) {
    return campo.type === 'email'
      ? 'Digite um e-mail válido, como nome@exemplo.com.'
      : 'Digite um endereço válido, começando com https://';
  }
  if (v.patternMismatch) return 'Digite um telefone válido, como 11 99999-9999.';
  if (v.rangeUnderflow) return 'O valor mínimo é ' + campo.min + '.';
  if (v.rangeOverflow) return 'O valor máximo é ' + campo.max + '.';
  if (v.stepMismatch) return 'Use valores em múltiplos de ' + campo.step + '.';
  if (v.badInput) return 'Valor inválido.';
  return '';
}

function iniciarFormulario() {
  const form = document.getElementById('form-contato');
  if (!form) return; // só existe em formulario.html
  const caixa = document.getElementById('mensagem-form');

  // Campos que serão validados (ignora botões e fieldset; radio: só o 1º do grupo)
  const campos = Array.from(form.elements).filter((campo) => {
    if (campo.tagName === 'BUTTON' || campo.tagName === 'FIELDSET') return false;
    if (campo.type === 'radio') return campo === form.elements[campo.name][0];
    return true;
  });

  function mostrarMensagem(tipo, texto) {
    caixa.hidden = false;
    caixa.className = 'mensagem-form ' + tipo; // 'sucesso' ou 'erro'
    caixa.textContent = texto;
  }

  function validarCampo(campo) {
    const texto = mensagemDeErro(campo);
    if (texto) mostrarErro(campo, texto);
    else limparErro(campo);
    return texto === '';
  }

  form.addEventListener('submit', (evento) => {
    evento.preventDefault(); // não recarrega a página
    let primeiroInvalido = null;

    campos.forEach((campo) => {
      if (!validarCampo(campo) && !primeiroInvalido) primeiroInvalido = campo;
    });

    if (primeiroInvalido) {
      mostrarMensagem('erro', 'Corrija os campos destacados e tente novamente.');
      primeiroInvalido.focus();
      return;
    }

    const primeiroNome = form.elements['nome'].value.trim().split(' ')[0];
    mostrarMensagem(
      'sucesso',
      'Formulário validado com sucesso, ' + primeiroNome + '! ' +
      '(Demonstração: este site não tem servidor para receber mensagens.)'
    );
    form.reset();
  });

  // Enquanto o campo está com erro, revalida conforme a pessoa corrige
  form.addEventListener('input', (evento) => {
    const campo = evento.target;
    if (campo.getAttribute('aria-invalid') === 'true') validarCampo(campo);
  });
  form.addEventListener('change', (evento) => {
    const campo = evento.target;
    if (campo.getAttribute('aria-invalid') === 'true') validarCampo(campo);
  });

  form.addEventListener('reset', () => {
    campos.forEach(limparErro);
    caixa.hidden = true;
  });
}

/* ---------- Inicialização (quando o HTML terminar de carregar) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  iniciarBotaoTema();
  desenharCanvas();
  iniciarFormulario();
});
