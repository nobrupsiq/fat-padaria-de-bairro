/* =============================================
   PADARIA DO BAIRRO — app.js
   Módulo 3: Interatividade com JavaScript
   ============================================= */

// ============================================
// TEMA 9 — Variáveis, operadores e condicionais
// ============================================

// Variável com os horários de funcionamento da padaria
const horarios = {
  // 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
  0: { abre: 6, fecha: 13 }, // Domingo
  1: { abre: 6, fecha: 20 }, // Segunda
  2: { abre: 6, fecha: 20 }, // Terça
  3: { abre: 6, fecha: 20 }, // Quarta
  4: { abre: 6, fecha: 20 }, // Quinta
  5: { abre: 6, fecha: 20 }, // Sexta
  6: { abre: 6, fecha: 18 }, // Sábado
};

const diasDaSemana = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

// ============================================
// TEMA 10 — Funções e retornos
// ============================================

// Função que verifica se a padaria está aberta agora
function verificarStatus() {
  const agora = new Date();
  const diaSemana = agora.getDay(); // 0-6
  const horaAtual = agora.getHours(); // 0-23
  const minutos = agora.getMinutes(); // 0-59
  const horaDecimal = horaAtual + minutos / 60; // ex: 14h30 = 14.5

  const horarioDia = horarios[diaSemana];
  const estaAberto =
    horaDecimal >= horarioDia.abre && horaDecimal < horarioDia.fecha;

  return {
    aberto: estaAberto,
    dia: diasDaSemana[diaSemana],
    fechaAs: horarioDia.fecha,
    abreAs: horarioDia.abre,
  };
}

// Função que formata a hora para exibição
function formatarHora(hora) {
  return hora.toString().padStart(2, "0") + "h00";
}

// Função que calcula o total do pedido
function calcularTotal(itens) {
  let total = 0;
  for (let i = 0; i < itens.length; i++) {
    total = total + itens[i].preco;
  }
  return total;
}

// Função que formata valor como moeda brasileira
function formatarMoeda(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// ============================================
// TEMA 11 — Eventos e DOM
// ============================================

// Array que vai guardar os itens do pedido
let itensDoPedido = [];

// Função chamada quando o usuário clica em "Pedir"
function adicionarPedido(card, nome, preco) {
  // Adiciona o item ao array do pedido
  itensDoPedido.push({ nome: nome, preco: preco });

  // Feedback visual no card
  card.style.borderColor = "#EF9F27";
  setTimeout(() => {
    card.style.borderColor = "transparent";
  }, 600);

  // Atualiza a exibição do pedido
  atualizarCarrinho();
}

// Função que atualiza a lista do carrinho na tela
function atualizarCarrinho() {
  const pedidoBox = document.getElementById("pedidoBox");
  const pedidoLista = document.getElementById("pedidoLista");
  const pedidoTotal = document.getElementById("pedidoTotal");

  // Mostra a caixa de pedido
  pedidoBox.classList.add("ativo");

  // Limpa a lista atual
  pedidoLista.innerHTML = "";

  // Cria um item na lista para cada produto pedido
  itensDoPedido.forEach(function (item, index) {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${item.nome}</span>
      <span style="display:flex; align-items:center; gap:8px;">
        ${formatarMoeda(item.preco)}
        <button onclick="removerItem(${index})" style="background:none;border:none;color:#A32D2D;cursor:pointer;font-size:1rem;" title="Remover">✕</button>
      </span>
    `;
    pedidoLista.appendChild(li);
  });

  // Calcula e exibe o total
  const total = calcularTotal(itensDoPedido);
  pedidoTotal.textContent = formatarMoeda(total);
}

// Função para remover um item do pedido
function removerItem(index) {
  itensDoPedido.splice(index, 1);
  if (itensDoPedido.length === 0) {
    limparPedido();
  } else {
    atualizarCarrinho();
  }
}

// Função para limpar todos os itens do pedido
function limparPedido() {
  itensDoPedido = [];
  const pedidoBox = document.getElementById("pedidoBox");
  pedidoBox.classList.remove("ativo");
}

// ============================================
// TEMA 11 — Evento de scroll (navbar + botão topo)
// ============================================

window.addEventListener("scroll", function () {
  const navbar = document.getElementById("navbar");
  const topoBtn = document.getElementById("topoBtn");
  const scrollY = window.scrollY;

  // Adiciona sombra na navbar ao rolar
  if (scrollY > 50) {
    navbar.style.boxShadow = "0 4px 24px rgba(0,0,0,0.35)";
  } else {
    navbar.style.boxShadow = "0 2px 16px rgba(0,0,0,0.25)";
  }

  // Mostra ou esconde o botão "voltar ao topo"
  if (scrollY > 400) {
    topoBtn.classList.add("visivel");
  } else {
    topoBtn.classList.remove("visivel");
  }
});

// Função para rolar de volta ao topo
function voltarTopo() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============================================
// TEMA 11 — Menu hamburger (mobile)
// ============================================

const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger && navLinks && !hamburger.dataset.menuBound) {
  hamburger.dataset.menuBound = "true";

  hamburger.addEventListener("click", function () {
    navLinks.classList.toggle("aberto");
  });

  // Fecha o menu ao clicar em um link
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("aberto");
    });
  });
}

// ============================================
// TEMA 9 — Exibir status (aberto/fechado)
// ============================================

function exibirStatus() {
  const statusDot = document.getElementById("statusDot");
  const statusMsg = document.getElementById("statusMsg");
  const status = verificarStatus();

  if (status.aberto) {
    statusDot.className = "status-dot aberto";
    statusMsg.innerHTML = `
      <strong style="color:#5CBF77">Estamos ABERTOS!</strong>
      &nbsp;·&nbsp; ${status.dia} &nbsp;·&nbsp;
      Fechamos às ${formatarHora(status.fechaAs)} — aproveite!
    `;
  } else {
    statusDot.className = "status-dot fechado";
    statusMsg.innerHTML = `
      <strong style="color:#E24B4A">Estamos FECHADOS</strong> no momento.
      &nbsp;·&nbsp; Voltamos às ${formatarHora(status.abreAs)} ☀️
    `;
  }
}

// Atualiza o status ao carregar e a cada minuto
exibirStatus();
setInterval(exibirStatus, 60000);

// ============================================
// TEMA 12 — Validação de Formulário com JS
// ============================================

const form = document.getElementById("contatoForm");
const textarea = document.getElementById("mensagem");
const charCount = document.getElementById("charCount");
const MAX_CHARS = 500;

// Contador de caracteres em tempo real
textarea.addEventListener("input", function () {
  const total = textarea.value.length;
  charCount.textContent = total + " / " + MAX_CHARS + " caracteres";

  if (total > MAX_CHARS) {
    charCount.style.color = "#A32D2D";
    textarea.value = textarea.value.substring(0, MAX_CHARS);
  } else if (total > MAX_CHARS * 0.8) {
    charCount.style.color = "#854F0B";
  } else {
    charCount.style.color = "#6B6560";
  }
});

// Função de validação de cada campo
function validarCampo(id, erroId, regra, mensagemErro) {
  const campo = document.getElementById(id);
  const erro = document.getElementById(erroId);
  const valor = campo.value.trim();

  if (!regra(valor)) {
    campo.classList.add("invalido");
    erro.textContent = mensagemErro;
    return false;
  } else {
    campo.classList.remove("invalido");
    erro.textContent = "";
    return true;
  }
}

// Validações em tempo real (ao sair do campo)
document.getElementById("nome").addEventListener("blur", function () {
  validarCampo(
    "nome",
    "erroNome",
    function (v) {
      return v.length >= 3;
    },
    "Por favor, informe seu nome completo (mínimo 3 caracteres).",
  );
});

document.getElementById("email").addEventListener("blur", function () {
  validarCampo(
    "email",
    "erroEmail",
    function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    },
    "Por favor, informe um e-mail válido (ex: nome@email.com).",
  );
});

document.getElementById("assunto").addEventListener("change", function () {
  validarCampo(
    "assunto",
    "erroAssunto",
    function (v) {
      return v !== "";
    },
    "Por favor, selecione um assunto.",
  );
});

// Envio do formulário
form.addEventListener("submit", function (evento) {
  // Impede o comportamento padrão (recarregar a página)
  evento.preventDefault();

  // Valida todos os campos obrigatórios
  const nomeOk = validarCampo(
    "nome",
    "erroNome",
    function (v) {
      return v.length >= 3;
    },
    "Por favor, informe seu nome completo.",
  );

  const emailOk = validarCampo(
    "email",
    "erroEmail",
    function (v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    },
    "Por favor, informe um e-mail válido.",
  );

  const assuntoOk = validarCampo(
    "assunto",
    "erroAssunto",
    function (v) {
      return v !== "";
    },
    "Por favor, selecione um assunto.",
  );

  const mensagemOk = validarCampo(
    "mensagem",
    "erroMensagem",
    function (v) {
      return v.length >= 10;
    },
    "Por favor, escreva uma mensagem com pelo menos 10 caracteres.",
  );

  // Se todos os campos forem válidos, "envia" o formulário
  if (nomeOk && emailOk && assuntoOk && mensagemOk) {
    const btnEnviar = document.getElementById("btnEnviar");
    const formSucesso = document.getElementById("formSucesso");

    // Feedback visual no botão
    btnEnviar.textContent = "Enviando... ⏳";
    btnEnviar.disabled = true;

    // Simula um envio com delay (em produção seria uma chamada a uma API)
    setTimeout(function () {
      form.reset();
      charCount.textContent = "0 / 500 caracteres";
      btnEnviar.textContent = "Enviar mensagem 📨";
      btnEnviar.disabled = false;
      formSucesso.style.display = "block";

      // Esconde a mensagem de sucesso após 5 segundos
      setTimeout(function () {
        formSucesso.style.display = "none";
      }, 5000);
    }, 1500);
  }
});

// ============================================
// EXTRA: Animação de entrada ao rolar (Intersection Observer)
// Demonstra manipulação avançada do DOM
// ============================================

const observador = new IntersectionObserver(
  function (entradas) {
    entradas.forEach(function (entrada) {
      if (entrada.isIntersecting) {
        entrada.target.style.opacity = "1";
        entrada.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 },
);

// Aplica animação nos cards de produto e horário
document
  .querySelectorAll(".produto-card, .horario-card")
  .forEach(function (elemento) {
    elemento.style.opacity = "0";
    elemento.style.transform = "translateY(30px)";
    elemento.style.transition =
      "opacity 0.5s ease, transform 0.5s ease, border-color 0.25s ease, box-shadow 0.25s ease";
    observador.observe(elemento);
  });

// ============================================
// Mensagem no console para os estudantes 😄
// ============================================
console.log(
  "%c🍞 Padaria do Bairro — Código Fonte",
  "color:#EF9F27; font-size:18px; font-weight:bold;",
);
console.log(
  "%cParabéns por inspecionar o código! Isso é exatamente o que um dev faz. 👨‍💻",
  "color:#888; font-size:13px;",
);
console.log("Variáveis, funções, eventos, DOM e validação — tudo aqui!");
