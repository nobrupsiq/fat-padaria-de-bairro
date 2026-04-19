/* =============================================
   PADARIA DO BAIRRO — forms.js
   JS compartilhado para todas as páginas de formulário
   Tema 3: Formulários | Tema 11: Eventos | Tema 12: Validação
   ============================================= */

// ============================================
// Função reutilizável de validação de formulário
// Recebe o id do form e um array de regras
// ============================================
function configurarFormulario(formId, regras) {
  const form = document.getElementById(formId);
  if (!form) return;

  // Valida um campo individualmente
  function validarUm(regra) {
    let valor;

    if (regra.tipo === "checkbox") {
      valor = document.getElementById(regra.id).checked;
    } else if (regra.tipo === "hidden") {
      valor = document.getElementById(regra.id).value;
    } else if (regra.tipo === "radio") {
      const selecionado = form.querySelector(
        'input[name="' + regra.name + '"]:checked',
      );
      valor = selecionado ? selecionado.value : "";
    } else {
      valor = document.getElementById(regra.id).value.trim();
    }

    const campo = document.getElementById(regra.id);
    const erroEl = document.getElementById(regra.erro);
    const valido = regra.regra(valor);

    if (!valido) {
      if (campo && regra.tipo !== "hidden" && regra.tipo !== "radio")
        campo.classList.add("invalido");
      if (erroEl) erroEl.textContent = regra.msg;
    } else {
      if (campo && regra.tipo !== "hidden" && regra.tipo !== "radio")
        campo.classList.remove("invalido");
      if (erroEl) erroEl.textContent = "";
    }

    return valido;
  }

  // Validação em tempo real ao sair do campo
  regras.forEach(function (regra) {
    const campo = document.getElementById(regra.id);
    if (campo && regra.tipo !== "radio" && regra.tipo !== "hidden") {
      const evento =
        campo.type === "checkbox" || campo.tagName === "SELECT"
          ? "change"
          : "blur";
      campo.addEventListener(evento, function () {
        validarUm(regra);
      });
    }
  });

  // Envio do formulário
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Valida todos os campos
    let tudo_ok = true;
    regras.forEach(function (regra) {
      if (!validarUm(regra)) tudo_ok = false;
    });

    if (!tudo_ok) return;

    // Simula envio
    const btn = form.querySelector('[type="submit"]');
    const textoOriginal = btn.textContent;
    btn.textContent = "Enviando... ⏳";
    btn.disabled = true;

    setTimeout(function () {
      form.reset();
      btn.textContent = textoOriginal;
      btn.disabled = false;

      // Limpa estrelas se existirem
      form.querySelectorAll(".estrelas span").forEach(function (s) {
        s.classList.remove("ativa");
      });
      form.querySelectorAll('input[type="hidden"]').forEach(function (h) {
        h.value = "";
      });

      // Exibe mensagem de sucesso
      const sucesso = document.getElementById("sucesso");
      sucesso.style.display = "block";
      sucesso.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setTimeout(function () {
        sucesso.style.display = "none";
      }, 6000);
    }, 1500);
  });
}

// ============================================
// Contador de caracteres reutilizável
// ============================================
function configurarContador(textareaId, contadorId, max) {
  const textarea = document.getElementById(textareaId);
  const contador = document.getElementById(contadorId);
  if (!textarea || !contador) return;

  textarea.addEventListener("input", function () {
    const total = this.value.length;
    if (total > max) this.value = this.value.substring(0, max);
    contador.textContent = Math.min(total, max) + " / " + max;
    contador.style.color = total > max * 0.85 ? "#854F0B" : "#6B6560";
  });
}

// ============================================
// Menu hamburger (mobile) — aplicado em todas as páginas
// ============================================
document.addEventListener("DOMContentLoaded", function () {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks && !hamburger.dataset.menuBound) {
    hamburger.dataset.menuBound = "true";

    hamburger.addEventListener("click", function () {
      navLinks.classList.toggle("aberto");
    });

    navLinks.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navLinks.classList.remove("aberto");
      });
    });
  }

  // Scroll: sombra na navbar
  window.addEventListener("scroll", function () {
    const navbar = document.getElementById("navbar");
    if (navbar) {
      navbar.style.boxShadow =
        window.scrollY > 50
          ? "0 4px 24px rgba(0,0,0,0.35)"
          : "0 2px 16px rgba(0,0,0,0.25)";
    }
  });
});
