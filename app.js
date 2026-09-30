// ========================================
// MEU APP - VERSÃO NATIVA iOS COMPLETA
// ========================================

// ========================================
// 1. ESTADO E DADOS (LOCALSTORAGE)
// ========================================

let entradas = JSON.parse(localStorage.getItem("meuAppEntradas")) || [];
let cartoes = JSON.parse(localStorage.getItem("meuAppCartoes")) || ["Nubank"];
let comprasCartao = JSON.parse(localStorage.getItem("meuAppComprasCartao")) || [];
let qualificacoesSalvas = JSON.parse(localStorage.getItem("meuAppQualificacoes")) || [];
let turnosSalvos = JSON.parse(localStorage.getItem("meuAppTurnos")) || [];
let redsSalvos = JSON.parse(localStorage.getItem("meuAppReds")) || [];
let veiculosSalvos = JSON.parse(localStorage.getItem("meuAppVeiculos")) || [];
let fichasAcademia = JSON.parse(localStorage.getItem("meuAppFichasAcademia")) || [];
let modulosOcultos = JSON.parse(localStorage.getItem("meuAppModulosOcultos")) || [];

let gastos = JSON.parse(localStorage.getItem("meuAppGastos")) || {
    mercado: [],
    lazer: [],
    fixos: [],
    transporte: [],
    assinaturas: []
};

let ordemFinancas = JSON.parse(localStorage.getItem("meuAppOrdemFinancas")) || [
    "entrada", "cartao", "fixos", "mercado", "transporte", "lazer", "assinaturas"
];

let categoriaAtualGasto = null;

// Mês atualmente selecionado no módulo Finanças
const hoje = new Date();

let mesFinanceiro = hoje.getMonth();
let anoFinanceiro = hoje.getFullYear();

const configCategorias = {
    mercado: { titulo: "Mercado", subtitulo: "Supermercado e compras do dia a dia" },
    lazer: { titulo: "Lazer", subtitulo: "Passeios, restaurantes e diversão" },
    fixos: { titulo: "Gastos Fixos", subtitulo: "Aluguel, luz, água e contas da casa" },
    transporte: { titulo: "Transporte", subtitulo: "Combustível, manutenção e transporte" },
    assinaturas: { titulo: "Assinaturas", subtitulo: "Streaming e serviços recorrentes" }
};


// ========================================
// 2. ELEMENTOS DO DOM (REFERÊNCIAS)
// ========================================

const telaInicio = document.getElementById("telaInicio");
const telaTrabalho = document.getElementById("telaTrabalho");
const telaQualificacao = document.getElementById("telaQualificacao");
const telaMeuTurno = document.getElementById("telaMeuTurno");
const telaFinancas = document.getElementById("telaFinancas");
const telaAcademia = document.getElementById("telaAcademia");
const telaEntradas = document.getElementById("telaEntradas");
const telaCartao = document.getElementById("telaCartao");
const telaGastosGenerica = document.getElementById("telaGastosGenerica");
const telaConfiguracoes = document.getElementById("telaConfiguracoes");
const telaHistoricoReds = document.getElementById("telaHistoricoReds");
const telaVeiculos = document.getElementById("telaVeiculos");

const todasTelas = [
    telaInicio, telaTrabalho, telaQualificacao, telaMeuTurno,
    telaHistoricoReds, telaVeiculos,
    telaFinancas, telaEntradas, telaCartao, telaGastosGenerica,
    telaAcademia, telaConfiguracoes
];

// Botões Principais da Tela Inicial
const btnTrabalho = document.getElementById("btnTrabalho");
const btnFinancas = document.getElementById("btnFinancas");
const btnAcademia = document.getElementById("btnAcademia");
const btnConfiguracoes = document.getElementById("btnConfiguracoes");

// Botões do Submenu Trabalho
const btnQualificacao = document.getElementById("btnQualificacao");
const btnMeuTurno = document.getElementById("btnMeuTurno");
const btnVoltarTrabalhoQualificacao = document.getElementById("btnVoltarTrabalhoQualificacao");
const btnVoltarTrabalhoTurno = document.getElementById("btnVoltarTrabalhoTurno");
const btnHistoricoReds = document.getElementById("btnHistoricoReds");
const btnVeiculos = document.getElementById("btnVeiculos");
const btnVoltarHistoricoReds = document.getElementById("btnVoltarHistoricoReds");
const btnVoltarVeiculos = document.getElementById("btnVoltarVeiculos");

// Botões do Submenu Finanças
const btnsVoltarFinancas = document.querySelectorAll(".btn-voltar-financas");
const btnEntrada = document.getElementById("btnEntrada");
const btnCartao = document.getElementById("btnCartao");
const btnFixos = document.getElementById("btnFixos");
const btnMercado = document.getElementById("btnMercado");
const btnTransporte = document.getElementById("btnTransporte");
const btnLazer = document.getElementById("btnLazer");
const btnAssinaturas = document.getElementById("btnAssinaturas");
const btnNovaEntrada = document.getElementById("btnNovaEntrada");
const btnNovoCartao = document.getElementById("btnNovoCartao");
const btnNovaCompraParcelada = document.getElementById("btnNovaCompraParcelada");
const btnNovoGastoCategoria = document.getElementById("btnNovoGastoCategoria");

// Seletor de mês das Finanças
const btnCompetenciaAnterior = document.getElementById("btnCompetenciaAnterior");


// Tab Bar
const tabInicio = document.getElementById("tabInicio");
const tabTrabalho = document.getElementById("tabTrabalho");
const tabFinancas = document.getElementById("tabFinancas");
const tabAcademia = document.getElementById("tabAcademia");
const tabConfiguracoes = document.getElementById("tabConfiguracoes");
const todasTabs = [tabInicio, tabTrabalho, tabFinancas, tabAcademia, tabConfiguracoes];

// Modal Bottom Sheet
const modalOverlay = document.getElementById("modalOverlay");
const modalTitulo = document.getElementById("modalTitulo");
const modalConteudo = document.getElementById("modalConteudo");
const btnModalConfirmar = document.getElementById("btnModalConfirmar");
const btnModalCancelar = document.getElementById("btnModalCancelar");
let acaoModalAtual = null;


// ========================================
// 3. NAVEGAÇÃO E TAB BAR
// ========================================

function mostrarTela(telaAlvo, tabAtiva) {
    todasTelas.forEach(tela => {
        if (tela) tela.hidden = true;
    });
    if (telaAlvo) {
        telaAlvo.hidden = false;
        window.scrollTo(0, 0);
    }

    if (tabAtiva) {
        todasTabs.forEach(tab => tab.classList.remove("ativo"));
        tabAtiva.classList.add("ativo");
    }
}

// Eventos da Tab Bar
if (tabInicio) tabInicio.addEventListener("click", () => mostrarTela(telaInicio, tabInicio));
if (tabTrabalho) tabTrabalho.addEventListener("click", () => mostrarTela(telaTrabalho, tabTrabalho));
if (tabAcademia) tabAcademia.addEventListener("click", () => {
    mostrarTela(telaAcademia, tabAcademia);
    renderizarAcademia();
});
if (tabFinancas) {
    tabFinancas.addEventListener("click", () => {
        mostrarTela(telaFinancas, tabFinancas);
        aplicarOrdemSalvaFinancas();
        atualizarBalançoGeral();
    });
}
if (tabConfiguracoes) tabConfiguracoes.addEventListener("click", () => mostrarTela(telaConfiguracoes, tabConfiguracoes));

// Navegação Interna
if (btnTrabalho) btnTrabalho.addEventListener("click", () => mostrarTela(telaTrabalho, tabTrabalho));
if (btnAcademia) btnAcademia.addEventListener("click", () => {
    mostrarTela(telaAcademia, tabAcademia);
    renderizarAcademia();
});
if (btnFinancas) {
    btnFinancas.addEventListener("click", () => {
        mostrarTela(telaFinancas, tabFinancas);
        aplicarOrdemSalvaFinancas();
        atualizarBalançoGeral();
    });
}
if (btnConfiguracoes) btnConfiguracoes.addEventListener("click", () => mostrarTela(telaConfiguracoes, tabConfiguracoes));

if (btnQualificacao) {
    btnQualificacao.addEventListener("click", () => {
        mostrarTela(telaQualificacao, tabTrabalho);
        renderizarQualificacoesSalvas();
    });
}

if (btnMeuTurno) {
    btnMeuTurno.addEventListener("click", () => {
        mostrarTela(telaMeuTurno, tabTrabalho);
        restaurarRascunhoTurno();
        renderizarTurnosSalvos();
    });
}

if (btnHistoricoReds) {
    btnHistoricoReds.addEventListener("click", () => {
        mostrarTela(telaHistoricoReds, tabTrabalho);
        renderizarReds();
    });
}

if (btnVeiculos) {
    btnVeiculos.addEventListener("click", () => {
        mostrarTela(telaVeiculos, tabTrabalho);
        renderizarVeiculos();
    });
}

if (btnVoltarHistoricoReds) {
    btnVoltarHistoricoReds.addEventListener("click", () => {
        mostrarTela(telaTrabalho, tabTrabalho);
    });
}

if (btnVoltarVeiculos) {
    btnVoltarVeiculos.addEventListener("click", () => {
        mostrarTela(telaTrabalho, tabTrabalho);
    });
}

if (btnVoltarTrabalhoQualificacao) btnVoltarTrabalhoQualificacao.addEventListener("click", () => mostrarTela(telaTrabalho, tabTrabalho));
if (btnVoltarTrabalhoTurno) btnVoltarTrabalhoTurno.addEventListener("click", () => mostrarTela(telaTrabalho, tabTrabalho));

btnsVoltarFinancas.forEach(btn => {
    btn.addEventListener("click", () => {
        mostrarTela(telaFinancas, tabFinancas);
        atualizarBalançoGeral();
    });
});


// ========================================
// 4. MÓDULO DE MODAIS (BOTTOM SHEET iOS)
// ========================================

function abrirModal(titulo, htmlConteudo, callbackConfirmar) {
    modalTitulo.textContent = titulo;
    modalConteudo.innerHTML = htmlConteudo;
    modalOverlay.hidden = false;
    acaoModalAtual = callbackConfirmar;
}

function fecharModal() {
    modalOverlay.hidden = true;
    modalConteudo.innerHTML = "";
    acaoModalAtual = null;
}

if (btnModalCancelar) btnModalCancelar.addEventListener("click", fecharModal);
if (btnModalConfirmar) {
    btnModalConfirmar.addEventListener("click", () => {
        try {
            if (acaoModalAtual) acaoModalAtual();
        } finally {
            fecharModal();
        }
    });
}


// ========================================
// MÓDULO: ACADEMIA E CONTROLE DE CARGAS
// ========================================
const academiaConteudo = document.getElementById("academiaConteudo");
const btnNovaFichaAcademia = document.getElementById("btnNovaFichaAcademia");
let academiaSelecionadaFichaId = null;

function escaparHTMLAcademia(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[caractere]);
}

function salvarFichasAcademia() {
    localStorage.setItem("meuAppFichasAcademia", JSON.stringify(fichasAcademia));
}

function gerarIdAcademia() {
    return window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function fichaAcademiaSelecionada() {
    return fichasAcademia.find(ficha => ficha.id === academiaSelecionadaFichaId) || null;
}

function renderizarAcademia() {
    if (!academiaConteudo) return;
    if (!fichasAcademia.length) {
        academiaSelecionadaFichaId = null;
        academiaConteudo.innerHTML = '<section class="academia-vazio"><div>🏋️</div><h3>Suas fichas aparecerão aqui</h3><p>Crie uma ficha, por exemplo, “Ficha A” ou “Peito e bíceps”, e adicione os exercícios.</p></section>';
        return;
    }
    if (!fichasAcademia.some(f => f.id === academiaSelecionadaFichaId)) academiaSelecionadaFichaId = fichasAcademia[0].id;
    const ficha = fichaAcademiaSelecionada();
    const abas = fichasAcademia.map(f => `<button class="academia-aba ${f.id === ficha.id ? "ativa" : ""}" data-ficha-id="${escaparHTMLAcademia(f.id)}">${escaparHTMLAcademia(f.nome)}</button>`).join("");
    const exercicios = (ficha.exercicios || []).map(ex => {
        const historico = (ex.historico || []).slice(-4).reverse();
        return `<article class="academia-exercicio">
            <div class="academia-exercicio-topo"><div><h3>${escaparHTMLAcademia(ex.nome)}</h3><p>${Number(ex.series) || 0} séries × ${escaparHTMLAcademia(ex.repeticoes || "—")} repetições</p></div><strong>${Number(ex.carga) || 0} kg</strong></div>
            ${historico.length ? `<details class="academia-historico"><summary>Histórico de cargas (${(ex.historico || []).length})</summary><ul>${historico.map(item => `<li><span>${escaparHTMLAcademia(item.data)}</span><strong>${Number(item.carga) || 0} kg</strong></li>`).join("")}</ul></details>` : ""}
            <div class="academia-acoes-exercicio"><button class="botao-secundario" data-acao="carga" data-exercicio-id="${escaparHTMLAcademia(ex.id)}">Registrar carga</button><button class="botao-secundario" data-acao="editar-exercicio" data-exercicio-id="${escaparHTMLAcademia(ex.id)}">Editar</button><button class="botao-excluir" data-acao="excluir-exercicio" data-exercicio-id="${escaparHTMLAcademia(ex.id)}">Excluir</button></div>
        </article>`;
    }).join("");
    academiaConteudo.innerHTML = `<div class="academia-abas" role="tablist">${abas}</div>
        <section class="academia-ficha">
            <div class="academia-ficha-topo"><div><h2>${escaparHTMLAcademia(ficha.nome)}</h2><p>${(ficha.exercicios || []).length} exercício(s)</p></div><div class="academia-acoes-ficha"><button class="botao-secundario" data-acao="renomear-ficha">Renomear</button><button class="botao-excluir" data-acao="excluir-ficha">Excluir ficha</button></div></div>
            <button class="botao-principal" data-acao="novo-exercicio">＋ Adicionar exercício</button>
            <div class="academia-lista-exercicios">${exercicios || '<p class="academia-vazio-menor">Ainda não há exercícios nesta ficha.</p>'}</div>
        </section>`;
}

function abrirModalFichaAcademia(ficha = null) {
    const nome = ficha?.nome || "";
    abrirModal(ficha ? "Renomear ficha" : "Criar ficha", `<div class="campo-form"><label for="academiaNomeFicha">Nome da ficha</label><input id="academiaNomeFicha" maxlength="50" value="${escaparHTMLAcademia(nome)}" placeholder="Ex.: Ficha A ou Peito e bíceps" required></div>`, () => {
        const campo = document.getElementById("academiaNomeFicha");
        const valor = campo?.value.trim();
        if (!valor) { alert("Digite um nome para a ficha."); return; }
        if (ficha) ficha.nome = valor;
        else {
            const novaFicha = { id: gerarIdAcademia(), nome: valor, exercicios: [] };
            fichasAcademia.push(novaFicha);
            academiaSelecionadaFichaId = novaFicha.id;
        }
        salvarFichasAcademia(); renderizarAcademia();
    });
}

function abrirModalExercicioAcademia(exercicio = null) {
    const ex = exercicio || { nome: "", series: 3, repeticoes: "10", carga: 0 };
    abrirModal(exercicio ? "Editar exercício" : "Adicionar exercício", `<div class="academia-form-grid">
        <div class="campo-form academia-campo-largo"><label for="academiaNomeExercicio">Exercício</label><input id="academiaNomeExercicio" maxlength="70" value="${escaparHTMLAcademia(ex.nome)}" placeholder="Ex.: Supino reto" required></div>
        <div class="campo-form"><label for="academiaSeries">Número de séries</label><input id="academiaSeries" type="number" min="1" max="30" step="1" value="${Number(ex.series) || 3}" inputmode="numeric"></div>
        <div class="campo-form"><label for="academiaRepeticoes">Repetições</label><input id="academiaRepeticoes" maxlength="20" value="${escaparHTMLAcademia(ex.repeticoes)}" placeholder="Ex.: 8–10"></div>
        <div class="campo-form academia-campo-largo"><label for="academiaCarga">Carga atual (kg)</label><input id="academiaCarga" type="number" min="0" max="999" step="0.25" value="${Number(ex.carga) || 0}" inputmode="decimal"></div>
        </div>`, () => {
        const nome = document.getElementById("academiaNomeExercicio")?.value.trim();
        const series = Number(document.getElementById("academiaSeries")?.value);
        const repeticoes = document.getElementById("academiaRepeticoes")?.value.trim();
        const carga = Number(document.getElementById("academiaCarga")?.value);
        if (!nome || !Number.isInteger(series) || series < 1 || !repeticoes || !Number.isFinite(carga) || carga < 0) { alert("Confira o nome, as séries, as repetições e a carga."); return; }
        const ficha = fichaAcademiaSelecionada();
        if (!ficha) return;
        if (exercicio) {
            if (Number(exercicio.carga) !== carga) exercicio.historico = [...(exercicio.historico || []), { data: new Date().toLocaleString("pt-BR"), carga }];
            Object.assign(exercicio, { nome, series, repeticoes, carga });
        } else {
            ficha.exercicios = ficha.exercicios || [];
            ficha.exercicios.push({ id: gerarIdAcademia(), nome, series, repeticoes, carga, historico: carga > 0 ? [{ data: new Date().toLocaleString("pt-BR"), carga }] : [] });
        }
        salvarFichasAcademia(); renderizarAcademia();
    });
}

function abrirModalCargaAcademia(exercicio) {
    abrirModal("Registrar carga", `<p class="academia-ajuda-modal">${escaparHTMLAcademia(exercicio.nome)} · carga atual: ${Number(exercicio.carga) || 0} kg</p><div class="campo-form"><label for="academiaNovaCarga">Nova carga (kg)</label><input id="academiaNovaCarga" type="number" min="0" max="999" step="0.25" value="${Number(exercicio.carga) || 0}" inputmode="decimal"></div>`, () => {
        const carga = Number(document.getElementById("academiaNovaCarga")?.value);
        if (!Number.isFinite(carga) || carga < 0) { alert("Digite uma carga válida."); return; }
        exercicio.carga = carga;
        exercicio.historico = [...(exercicio.historico || []), { data: new Date().toLocaleString("pt-BR"), carga }];
        salvarFichasAcademia(); renderizarAcademia();
    });
}

btnNovaFichaAcademia?.addEventListener("click", () => abrirModalFichaAcademia());
academiaConteudo?.addEventListener("click", event => {
    const aba = event.target.closest("[data-ficha-id]");
    if (aba) { academiaSelecionadaFichaId = aba.dataset.fichaId; renderizarAcademia(); return; }
    const botao = event.target.closest("[data-acao]");
    if (!botao) return;
    const ficha = fichaAcademiaSelecionada();
    const exercicio = ficha?.exercicios?.find(item => item.id === botao.dataset.exercicioId);
    switch (botao.dataset.acao) {
        case "novo-exercicio": abrirModalExercicioAcademia(); break;
        case "renomear-ficha": abrirModalFichaAcademia(ficha); break;
        case "excluir-ficha": if (confirm(`Excluir a ficha “${ficha.nome}” e seus exercícios?`)) { fichasAcademia = fichasAcademia.filter(item => item.id !== ficha.id); academiaSelecionadaFichaId = fichasAcademia[0]?.id || null; salvarFichasAcademia(); renderizarAcademia(); } break;
        case "editar-exercicio": if (exercicio) abrirModalExercicioAcademia(exercicio); break;
        case "carga": if (exercicio) abrirModalCargaAcademia(exercicio); break;
        case "excluir-exercicio": if (exercicio && confirm(`Excluir “${exercicio.nome}” desta ficha?`)) { ficha.exercicios = ficha.exercicios.filter(item => item.id !== exercicio.id); salvarFichasAcademia(); renderizarAcademia(); } break;
    }
});


// ========================================
// 5. MÓDULO: QUALIFICAÇÃO
// ========================================

const formQualificacao = document.getElementById("formQualificacao");
const btnCopiarQualificacao = document.getElementById("btnCopiarQualificacao");
const btnLimparFormQualificacao = document.getElementById("btnLimparFormQualificacao");

function obterDadosQualificacaoForm() {
    return {
        condicao: document.getElementById("qCondicao")?.value || "N/I",
        nome: document.getElementById("qNome")?.value.trim() || "",
        mae: document.getElementById("qMae")?.value.trim() || "",
        pai: document.getElementById("qPai")?.value.trim() || "",
        cpf: document.getElementById("qCpf")?.value.trim() || "",
        rg: document.getElementById("qRg")?.value.trim() || "",
        endereco: document.getElementById("qEndereco")?.value.trim() || "",
        telefone: document.getElementById("qTelefone")?.value.trim() || "",
        profissao: document.getElementById("qProfissao")?.value.trim() || "",
        ensino: document.getElementById("qEnsino")?.value || "N/I",
        estadoCivil: document.getElementById("qEstadoCivil")?.value || "N/I"
    };
}

function gerarTextoQualificacao(d) {
    return `*QUALIFICAÇÃO DO ENVOLVIDO*
Condição: ${d.condicao || "N/I"}
Nome: ${d.nome || "N/I"}
Mãe: ${d.mae || "N/I"}
Pai: ${d.pai || "N/I"}
CPF: ${d.cpf || "N/I"}
RG: ${d.rg || "N/I"}
Endereço: ${d.endereco || "N/I"}
Telefone: ${d.telefone || "N/I"}
Profissão: ${d.profissao || "N/I"}
Ensino: ${d.ensino || "N/I"}
Estado Civil: ${d.estadoCivil || "N/I"}`;
}

function copiarTextoFormatado(texto, msgSucesso) {
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(texto).then(() => alert(msgSucesso));
    } else {
        const textArea = document.createElement("textarea");
        textArea.value = texto;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
        alert(msgSucesso);
    }
}

if (btnCopiarQualificacao) {
    btnCopiarQualificacao.addEventListener("click", () => {
        const dados = obterDadosQualificacaoForm();
        if (!dados.nome) return alert("Preencha ao menos o Nome para copiar.");
        copiarTextoFormatado(gerarTextoQualificacao(dados), "Dados copiados!");
    });
}

if (formQualificacao) {
    formQualificacao.addEventListener("submit", (e) => {
        e.preventDefault();
        const dados = obterDadosQualificacaoForm();
        if (!dados.nome) return alert("Preencha ao menos o Nome antes de salvar.");

        qualificacoesSalvas.unshift({ id: Date.now(), ...dados });
        localStorage.setItem("meuAppQualificacoes", JSON.stringify(qualificacoesSalvas));

        formQualificacao.reset();
        renderizarQualificacoesSalvas();
        alert("Qualificação salva!");
    });
}

if (btnLimparFormQualificacao) {
    btnLimparFormQualificacao.addEventListener("click", () => formQualificacao && formQualificacao.reset());
}

function renderizarQualificacoesSalvas() {
    const lista = document.getElementById("listaQualificacoesSalvas");
    if (!lista) return;

    lista.innerHTML = "";
    const competencia = obterCompetenciaAtual();

const entradasDoMes = entradas.filter(
    item => item.competencia === competencia
);
    if (qualificacoesSalvas.length === 0) {
        lista.innerHTML = `<p style="text-align:center; opacity:0.6; padding:1rem;">Nenhuma qualificação salva.</p>`;
        return;
    }

    qualificacoesSalvas.forEach(item => {
        const div = document.createElement("div");
        div.className = "lancamento";
        div.style.flexDirection = "column";
        div.style.alignItems = "flex-start";
        div.style.gap = "8px";

        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                <strong>[${item.condicao}] ${item.nome}</strong>
                <button class="botao-excluir" onclick="excluirQualificacao(${item.id})">✕ Excluir</button>
            </div>
            <p style="font-size:13px; color:var(--text-muted);">CPF: ${item.cpf || "N/I"} | RG: ${item.rg || "N/I"}</p>
            <button class="botao-secundario" style="padding:8px 12px; font-size:12px; margin-top:4px;" onclick="copiarQualificacaoSalva(${item.id})">📋 Copiar Dados</button>
        `;
        lista.appendChild(div);
    });
}

window.copiarQualificacaoSalva = function(id) {
    const item = qualificacoesSalvas.find(q => q.id === id);
    if (item) copiarTextoFormatado(gerarTextoQualificacao(item), "Qualificação copiada!");
};

window.excluirQualificacao = function(id) {
    qualificacoesSalvas = qualificacoesSalvas.filter(q => q.id !== id);
    localStorage.setItem("meuAppQualificacoes", JSON.stringify(qualificacoesSalvas));
    renderizarQualificacoesSalvas();
};


// ========================================
// 6. MÓDULO: HISTÓRICO REDS (RASCUNHOS OFFLINE)
// ========================================

const formReds = document.getElementById("formReds");
let redsEmEdicaoId = null;

function obterDadosRedsForm() {
    return {
        natureza: document.getElementById("rNatureza")?.value.trim() || "",
        data: document.getElementById("rData")?.value || "",
        hora: document.getElementById("rHora")?.value || "",
        local: document.getElementById("rLocal")?.value.trim() || "",
        envolvidos: document.getElementById("rEnvolvidos")?.value.trim() || "",
        relato: document.getElementById("rRelato")?.value.trim() || ""
    };
}

function gerarTextoReds(d) {
    return `*RASCUNHO PARA REDS*
Natureza/assunto: ${d.natureza || "N/I"}
Data: ${d.data || "N/I"}
Horário: ${d.hora || "N/I"}
Local: ${d.local || "N/I"}
Envolvidos/veículos: ${d.envolvidos || "N/I"}

Relato-base:
${d.relato || "N/I"}`;
}

function renderizarReds() {
    const lista = document.getElementById("listaReds");
    if (!lista) return;
    lista.replaceChildren();
    if (!redsSalvos.length) {
        const vazio = document.createElement("p");
        vazio.textContent = "Nenhum rascunho salvo.";
        lista.appendChild(vazio);
        return;
    }

    redsSalvos.forEach(item => {
        const card = document.createElement("div");
        card.className = "lancamento";
        card.style.flexDirection = "column";
        card.style.alignItems = "stretch";
        card.style.gap = "8px";
        const titulo = document.createElement("strong");
        titulo.textContent = item.natureza || "Ocorrência sem título";
        const resumo = document.createElement("p");
        resumo.style.cssText = "font-size:13px;color:var(--text-muted);white-space:pre-wrap;";
        resumo.textContent = `${item.data || "Data não informada"}${item.hora ? ` • ${item.hora}` : ""}${item.local ? ` • ${item.local}` : ""}`;
        const acoes = document.createElement("div");
        acoes.style.cssText = "display:flex;flex-wrap:wrap;gap:8px;";
        [["Editar", () => editarReds(item.id)], ["Copiar texto", () => copiarTextoFormatado(gerarTextoReds(item), "Texto do rascunho copiado!")], ["Excluir", () => excluirReds(item.id)]].forEach(([rotulo, acao]) => {
            const botao = document.createElement("button");
            botao.type = "button";
            botao.className = rotulo === "Excluir" ? "botao-excluir" : "botao-secundario";
            botao.textContent = rotulo;
            botao.style.padding = "8px 12px";
            botao.addEventListener("click", acao);
            acoes.appendChild(botao);
        });
        card.append(titulo, resumo, acoes);
        lista.appendChild(card);
    });
}

function editarReds(id) {
    const item = redsSalvos.find(r => r.id === id);
    if (!item || !formReds) return;
    document.getElementById("rNatureza").value = item.natureza || "";
    document.getElementById("rData").value = item.data || "";
    document.getElementById("rHora").value = item.hora || "";
    document.getElementById("rLocal").value = item.local || "";
    document.getElementById("rEnvolvidos").value = item.envolvidos || "";
    document.getElementById("rRelato").value = item.relato || "";
    redsEmEdicaoId = id;
    document.getElementById("tituloFormReds").textContent = "Editar rascunho";
    document.getElementById("btnSalvarReds").textContent = "💾 Atualizar rascunho";
    formReds.scrollIntoView({ behavior: "smooth", block: "start" });
}

function excluirReds(id) {
    if (!confirm("Excluir este rascunho de ocorrência?")) return;
    redsSalvos = redsSalvos.filter(item => item.id !== id);
    localStorage.setItem("meuAppReds", JSON.stringify(redsSalvos));
    if (redsEmEdicaoId === id) limparFormReds();
    renderizarReds();
}

function limparFormReds() {
    formReds?.reset();
    redsEmEdicaoId = null;
    const titulo = document.getElementById("tituloFormReds");
    const botao = document.getElementById("btnSalvarReds");
    if (titulo) titulo.textContent = "Novo rascunho";
    if (botao) botao.textContent = "💾 Salvar rascunho";
}

if (formReds) {
    formReds.addEventListener("submit", event => {
        event.preventDefault();
        const dados = obterDadosRedsForm();
        if (!dados.natureza || !dados.relato) return alert("Preencha a natureza/assunto e o relato-base.");
        if (redsEmEdicaoId !== null) {
            const indice = redsSalvos.findIndex(item => item.id === redsEmEdicaoId);
            if (indice >= 0) redsSalvos[indice] = { ...redsSalvos[indice], ...dados };
        } else {
            redsSalvos.unshift({ id: Date.now(), ...dados });
        }
        localStorage.setItem("meuAppReds", JSON.stringify(redsSalvos));
        limparFormReds();
        renderizarReds();
        alert("Rascunho salvo neste aparelho.");
    });
}

document.getElementById("btnLimparReds")?.addEventListener("click", limparFormReds);


// ========================================
// 7. MÓDULO: VEÍCULOS FISCALIZADOS
// ========================================

const formVeiculo = document.getElementById("formVeiculo");

function salvarVeiculos() {
    localStorage.setItem("meuAppVeiculos", JSON.stringify(veiculosSalvos));
}

function formatarCpfVeiculo(cpf) {
    const digitos = String(cpf || "").replace(/\D/g, "").slice(0, 11);
    return digitos.length === 11 ? digitos.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4") : digitos;
}

function renderizarVeiculos() {
    const lista = document.getElementById("listaVeiculos");
    if (!lista) return;
    lista.replaceChildren();
    if (!veiculosSalvos.length) {
        const vazio = document.createElement("p");
        vazio.textContent = "Nenhum veículo registrado.";
        lista.appendChild(vazio);
        return;
    }

    veiculosSalvos.forEach(veiculo => {
        const card = document.createElement("article");
        card.className = "lancamento";
        card.style.cssText = "display:flex;flex-direction:column;align-items:stretch;gap:12px;";
        const topo = document.createElement("div");
        topo.style.cssText = "display:flex;justify-content:space-between;align-items:center;gap:8px;";
        const placa = document.createElement("strong");
        placa.textContent = veiculo.placa;
        const contador = document.createElement("span");
        contador.style.cssText = "font-size:13px;color:var(--text-muted);";
        contador.textContent = `${(veiculo.abordados || []).length} abordado(s)`;
        topo.append(placa, contador);

        const formPessoa = document.createElement("form");
        formPessoa.className = "formulario-qualificacao";
        formPessoa.style.cssText = "padding:12px;box-shadow:none;border:1px solid var(--border-color);gap:10px;";
        const nomeCampo = document.createElement("div");
        nomeCampo.className = "campo-form";
        const nomeLabel = document.createElement("label");
        nomeLabel.textContent = "Primeiro nome";
        const nomeInput = document.createElement("input");
        nomeInput.type = "text";
        nomeInput.placeholder = "Nome";
        nomeInput.autocomplete = "off";
        nomeInput.required = true;
        nomeCampo.append(nomeLabel, nomeInput);
        const cpfCampo = document.createElement("div");
        cpfCampo.className = "campo-form";
        const cpfLabel = document.createElement("label");
        cpfLabel.textContent = "CPF";
        const cpfInput = document.createElement("input");
        cpfInput.type = "text";
        cpfInput.inputMode = "numeric";
        cpfInput.placeholder = "000.000.000-00";
        cpfInput.maxLength = 14;
        cpfInput.autocomplete = "off";
        cpfInput.required = true;
        cpfCampo.append(cpfLabel, cpfInput);
        const addPessoa = document.createElement("button");
        addPessoa.type = "submit";
        addPessoa.className = "botao-secundario";
        addPessoa.textContent = "＋ Adicionar abordado";
        formPessoa.append(nomeCampo, cpfCampo, addPessoa);
        formPessoa.addEventListener("submit", event => {
            event.preventDefault();
            const nome = nomeInput.value.trim().split(/\s+/)[0];
            const cpf = cpfInput.value.replace(/\D/g, "");
            if (!nome) return alert("Informe o primeiro nome.");
            if (cpf.length !== 11) return alert("Confira o CPF: informe os 11 dígitos.");
            veiculo.abordados = veiculo.abordados || [];
            veiculo.abordados.push({ id: Date.now(), nome, cpf });
            salvarVeiculos();
            renderizarVeiculos();
        });

        const pessoas = document.createElement("div");
        pessoas.className = "lista-lancamentos";
        (veiculo.abordados || []).forEach(pessoa => {
            const linha = document.createElement("div");
            linha.className = "lancamento";
            linha.style.cssText = "padding:10px 12px;gap:8px;";
            const detalhe = document.createElement("span");
            detalhe.style.fontSize = "13px";
            detalhe.textContent = `${pessoa.nome} • CPF ${formatarCpfVeiculo(pessoa.cpf)}`;
            const remover = document.createElement("button");
            remover.type = "button";
            remover.className = "botao-excluir";
            remover.textContent = "Excluir";
            remover.addEventListener("click", () => {
                veiculo.abordados = veiculo.abordados.filter(item => item.id !== pessoa.id);
                salvarVeiculos();
                renderizarVeiculos();
            });
            linha.append(detalhe, remover);
            pessoas.appendChild(linha);
        });

        const excluirVeiculo = document.createElement("button");
        excluirVeiculo.type = "button";
        excluirVeiculo.className = "botao-excluir";
        excluirVeiculo.textContent = "Excluir veículo e abordados";
        excluirVeiculo.addEventListener("click", () => {
            if (!confirm(`Excluir ${veiculo.placa} e todos os abordados cadastrados nele?`)) return;
            veiculosSalvos = veiculosSalvos.filter(item => item.id !== veiculo.id);
            salvarVeiculos();
            renderizarVeiculos();
        });
        card.append(topo, formPessoa, pessoas, excluirVeiculo);
        lista.appendChild(card);
    });
}

if (formVeiculo) {
    formVeiculo.addEventListener("submit", event => {
        event.preventDefault();
        const input = document.getElementById("vPlaca");
        const placa = input.value.trim().toUpperCase().replace(/\s+/g, "");
        if (!placa) return alert("Informe a placa do veículo.");
        if (veiculosSalvos.some(item => item.placa === placa)) {
            input.value = "";
            renderizarVeiculos();
            return alert("Essa placa já está cadastrada. Adicione os abordados no veículo existente.");
        }
        veiculosSalvos.unshift({ id: Date.now(), placa, abordados: [] });
        salvarVeiculos();
        formVeiculo.reset();
        renderizarVeiculos();
    });
}


// ========================================
// 8. MÓDULO: MEU TURNO
// ========================================

const formMeuTurno = document.getElementById("formMeuTurno");
const btnCopiarTurno = document.getElementById("btnCopiarTurno");
const btnLimparFormTurno = document.getElementById("btnLimparFormTurno");

function lerCamposTurno() {
    return {
        data: document.getElementById("tDataTurno")?.value || "",
        horaInicial: document.getElementById("tHoraInicial")?.value || "",
        viatura: document.getElementById("tViatura")?.value.trim() || "",
        box: document.getElementById("tBox")?.value.trim() || "",
        kmInicial: document.getElementById("tKmInicial")?.value.trim() || "",
        horaFinal: document.getElementById("tHoraFinal")?.value || "",
        kmFinal: document.getElementById("tKmFinal")?.value.trim() || "",
    };
}

function obterDadosTurnoForm() {
    const dados = lerCamposTurno();
    const kmInicial = Number(dados.kmInicial);
    const kmFinal = Number(dados.kmFinal);

    return {
        ...dados,
        kmRodado: dados.kmInicial && dados.kmFinal && kmFinal >= kmInicial
            ? kmFinal - kmInicial
            : 0
    };
}

function formatarDataTurno(data) {
    if (!data || !data.includes("-")) return data || "N/I";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

function salvarRascunhoTurno() {
    const dados = lerCamposTurno();
    const temDados = Object.values(dados).some(valor => String(valor).trim() !== "");

    if (!temDados) {
        localStorage.removeItem("meuAppTurnoAtivo");
        return;
    }

    localStorage.setItem("meuAppTurnoAtivo", JSON.stringify(dados));
}

function restaurarRascunhoTurno() {
    const rascunhoSalvo = localStorage.getItem("meuAppTurnoAtivo");
    if (!rascunhoSalvo || !formMeuTurno) return;

    try {
        const dados = JSON.parse(rascunhoSalvo);
        document.getElementById("tDataTurno").value = dados.data || "";
        document.getElementById("tHoraInicial").value = dados.horaInicial || "";
        document.getElementById("tViatura").value = dados.viatura || "";
        document.getElementById("tBox").value = dados.box || "";
        document.getElementById("tKmInicial").value = dados.kmInicial || "";
        document.getElementById("tHoraFinal").value = dados.horaFinal || "";
        document.getElementById("tKmFinal").value = dados.kmFinal || "";
    } catch (erro) {
        localStorage.removeItem("meuAppTurnoAtivo");
        alert("O rascunho do turno não pôde ser lido e foi removido.");
    }
}

function gerarTextoTurno(d) {
    return `*REGISTRO DE TURNO*
📅 Data: ${formatarDataTurno(d.data)}
🕐 Horário inicial: ${d.horaInicial || "N/I"}
🕘 Horário final: ${d.horaFinal || "N/I"}
🚔 Viatura: ${d.viatura || "N/I"}
📍 Box de armamento: ${d.box || "N/I"}
🏎️ KM Inicial: ${d.kmInicial || "N/I"}
🏁 KM Final: ${d.kmFinal || "N/I"}
📊 KM Rodado: ${d.kmRodado} km`;
}

if (formMeuTurno) {
    restaurarRascunhoTurno();
    formMeuTurno.addEventListener("input", salvarRascunhoTurno);
    formMeuTurno.addEventListener("change", salvarRascunhoTurno);
}

if (btnCopiarTurno) {
    btnCopiarTurno.addEventListener("click", () => {
        const dados = obterDadosTurnoForm();
        if (!dados.viatura && !dados.box) return alert("Preencha ao menos a viatura ou o box.");
        copiarTextoFormatado(gerarTextoTurno(dados), "Resumo do turno copiado!");
    });
}

if (formMeuTurno) {
    formMeuTurno.addEventListener("submit", (e) => {
        e.preventDefault();
        const dados = obterDadosTurnoForm();
        const camposObrigatorios = [
            dados.data, dados.horaInicial, dados.viatura, dados.box,
            dados.kmInicial, dados.horaFinal, dados.kmFinal
        ];

        if (camposObrigatorios.some(valor => !String(valor).trim())) {
            return alert("Preencha todos os dados do turno antes de concluir.");
        }

        if (Number(dados.kmFinal) < Number(dados.kmInicial)) {
            return alert("O KM final não pode ser menor que o KM inicial.");
        }

        turnosSalvos.unshift({ id: Date.now(), ...dados });
        localStorage.setItem("meuAppTurnos", JSON.stringify(turnosSalvos));

        localStorage.removeItem("meuAppTurnoAtivo");
        formMeuTurno.reset();
        renderizarTurnosSalvos();
        alert("Turno concluído e salvo no histórico!");
    });
}

if (btnLimparFormTurno) {
    btnLimparFormTurno.addEventListener("click", () => {
        if (!formMeuTurno) return;
        if (!confirm("Apagar o rascunho atual do turno?")) return;

        formMeuTurno.reset();
        localStorage.removeItem("meuAppTurnoAtivo");
    });
}

function renderizarTurnosSalvos() {
    const lista = document.getElementById("listaTurnosSalvos");
    if (!lista) return;

    lista.innerHTML = "";
    if (turnosSalvos.length === 0) {
        lista.innerHTML = `<p style="text-align:center; opacity:0.6; padding:1rem;">Nenhum turno registrado.</p>`;
        return;
    }

    turnosSalvos.forEach(item => {
        const div = document.createElement("div");
        div.className = "lancamento";
        div.style.flexDirection = "column";
        div.style.alignItems = "flex-start";
        div.style.gap = "8px";

        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                <strong>🚔 ${item.viatura || "Viatura N/I"} (${formatarDataTurno(item.data)})</strong>
                <button class="botao-excluir" onclick="excluirTurno(${item.id})">✕ Excluir</button>
            </div>
            <p style="font-size:13px; color:var(--text-muted);">Horário: ${item.horaInicial || "N/I"}–${item.horaFinal || "N/I"}</p>
            <p style="font-size:13px; color:var(--text-muted);">Box de armamento: ${item.box || "N/I"}</p>
            <p style="font-size:13px; color:var(--text-muted);">KM: ${item.kmInicial || "0"} → ${item.kmFinal || "0"} (${item.kmRodado} km rodados)</p>
            <button class="botao-secundario" style="padding:8px 12px; font-size:12px; margin-top:4px;" onclick="copiarTurnoSalvo(${item.id})">📋 Copiar Dados</button>
        `;
        lista.appendChild(div);
    });
}

window.copiarTurnoSalvo = function(id) {
    const item = turnosSalvos.find(t => t.id === id);
    if (item) copiarTextoFormatado(gerarTextoTurno(item), "Dados do turno copiados!");
};

window.excluirTurno = function(id) {
    turnosSalvos = turnosSalvos.filter(t => t.id !== id);
    localStorage.setItem("meuAppTurnos", JSON.stringify(turnosSalvos));
    renderizarTurnosSalvos();
};

// ========================================
// CONTROLE DE COMPETÊNCIA FINANCEIRA
// ========================================

function atualizarMesFinanceiro() {
    const textoMesAtual = document.getElementById("textoMesAtual");
    if (!textoMesAtual) return;

    const data = new Date(anoFinanceiro, mesFinanceiro, 1);

    let texto = data.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
    });

    texto = texto.charAt(0).toUpperCase() + texto.slice(1);

    textoMesAtual.textContent = texto;
}

function alterarMesFinanceiro(diferenca) {
    mesFinanceiro += diferenca;

    if (mesFinanceiro < 0) {
        mesFinanceiro = 11;
        anoFinanceiro--;
    }

    if (mesFinanceiro > 11) {
        mesFinanceiro = 0;
        anoFinanceiro++;
    }

    atualizarMesFinanceiro();
    atualizarBalançoGeral();

if (!telaEntradas.hidden) {
    atualizarListaEntradas();
}
}

function obterCompetenciaAtual() {
    const mes = String(mesFinanceiro + 1).padStart(2, "0");
    return `${anoFinanceiro}-${mes}`;
}


const btnProximoMes = document.getElementById("btnProximoMes");

if (btnCompetenciaAnterior) {
    btnCompetenciaAnterior.addEventListener("click", () => {
        alterarMesFinanceiro(-1);
    });
}

if (btnProximoMes) {
    btnProximoMes.addEventListener("click", () => {
        alterarMesFinanceiro(1);
    });
}

function competenciaParaNumero(competencia) {
    const [ano, mes] = competencia.split("-").map(Number);
    return (ano * 12) + mes;
}

function recorrenciaAtivaNaCompetencia(item, competencia) {
    if (!item.recorrente) return false;

    const atual = competenciaParaNumero(competencia);
    const inicio = competenciaParaNumero(item.competenciaInicio);

    if (atual < inicio) return false;

    if (item.competenciaFim) {
        const fim = competenciaParaNumero(item.competenciaFim);

        if (atual > fim) return false;
    }

    return true;
}




// ========================================
// 9. MÓDULO: FINANÇAS & BALANÇO (COM BARRA)
// ========================================

function calcularTotalEntradas() {
    const competencia = obterCompetenciaAtual();

    return entradas
        .filter(item => item.competencia === competencia)
        .reduce((acc, item) => acc + Number(item.valor), 0);
}

function calcularTotalParcelasCartaoMes() {
    const competencia = obterCompetenciaAtual();

    return comprasCartao
        .filter(item => compraAtivaNaCompetencia(item, competencia))
        .reduce(
            (acc, item) =>
                acc + (Number(item.valorTotal) / Number(item.parcelas)),
            0
        );
}


function obterParcelasCartaoDaCompetencia() {
    const competencia = obterCompetenciaAtual();

    return comprasCartao
        .filter(compra => compraAtivaNaCompetencia(compra, competencia))
        .map(compra => {
            const [anoInicio, mesInicio] = compra.competencia.split("-").map(Number);
            const [anoAtual, mesAtual] = competencia.split("-").map(Number);

            const indiceInicio = anoInicio * 12 + (mesInicio - 1);
            const indiceAtual = anoAtual * 12 + (mesAtual - 1);

            const numeroParcela = indiceAtual - indiceInicio + 1;
            const valorParcela = Number(compra.valorTotal) / Number(compra.parcelas);

            return {
                ...compra,
                numeroParcela,
                valorParcela
            };
        });
}


function compraAtivaNaCompetencia(item, competencia) {
    if (!item.competencia || !item.parcelas) return false;

    const [anoInicio, mesInicio] = item.competencia.split("-").map(Number);
    const [anoAtual, mesAtual] = competencia.split("-").map(Number);

    const indiceInicio = anoInicio * 12 + (mesInicio - 1);
    const indiceAtual = anoAtual * 12 + (mesAtual - 1);

    const parcelaAtual = indiceAtual - indiceInicio + 1;

    return parcelaAtual >= 1 && parcelaAtual <= Number(item.parcelas);
}

function calcularTotalCategoria(categoria) {
    const competencia = obterCompetenciaAtual();
    const itens = gastos[categoria] || [];

    if (categoria === "fixos" || categoria === "assinaturas") {
        return itens
            .filter(item =>
                recorrenciaAtivaNaCompetencia(item, competencia)
            )
            .reduce(
                (acc, item) => acc + Number(item.valor),
                0
            );
    }

    return itens
        .filter(item => item.competencia === competencia)
        .reduce(
            (acc, item) => acc + Number(item.valor),
            0
        );
}

function calcularTotalGastosCategorias() {
    const competencia = obterCompetenciaAtual();

    let total = 0;

    // Gastos normais daquele mês
    ["mercado", "lazer", "transporte"].forEach(categoria => {

        const itens = gastos[categoria] || [];

        total += itens
            .filter(item => item.competencia === competencia)
            .reduce(
                (acc, item) => acc + Number(item.valor),
                0
            );
    });

    // Gastos recorrentes
    ["fixos", "assinaturas"].forEach(categoria => {

        const itens = gastos[categoria] || [];

        total += itens
            .filter(item =>
                recorrenciaAtivaNaCompetencia(
                    item,
                    competencia
                )
            )
            .reduce(
                (acc, item) => acc + Number(item.valor),
                0
            );
    });

    return total;
}

function atualizarBalançoGeral() {
    const elDisponivel = document.getElementById("valorDisponivel");
    const elResumoEntradas = document.getElementById("resumoEntradas");
    const elResumoGastos = document.getElementById("resumoGastos");
    const cardSaldoStatus = document.getElementById("cardSaldoStatus");
    const barraProgressoRenda = document.getElementById("barraProgressoRenda");
    const textoProgressoRenda = document.getElementById("textoProgressoRenda");

    const totalEntradas = calcularTotalEntradas();
    const totalGastos = calcularTotalGastosCategorias() + calcularTotalParcelasCartaoMes();
    const disponivel = totalEntradas - totalGastos;

    if (elDisponivel) elDisponivel.textContent = formatarMoeda(disponivel);
    if (elResumoEntradas) elResumoEntradas.textContent = formatarMoeda(totalEntradas);
    if (elResumoGastos) elResumoGastos.textContent = formatarMoeda(totalGastos);

    // Atualização da Barra de Progresso
    let porcentagemUso = totalEntradas > 0 ? Math.min(Math.round((totalGastos / totalEntradas) * 100), 100) : 0;
    
    if (barraProgressoRenda) {
        barraProgressoRenda.style.width = `${porcentagemUso}%`;
        if (porcentagemUso >= 100 || disponivel < 0) {
            barraProgressoRenda.style.backgroundColor = "var(--danger)";
        } else if (porcentagemUso >= 80) {
            barraProgressoRenda.style.backgroundColor = "var(--warning)";
        } else {
            barraProgressoRenda.style.backgroundColor = "var(--success)";
        }
    }

    if (textoProgressoRenda) {
        textoProgressoRenda.textContent = `${porcentagemUso}% da renda comprometida`;
    }

    if (cardSaldoStatus) {
        cardSaldoStatus.classList.remove("alerta-amarelo", "alerta-vermelho");
        if (disponivel < 0) {
            cardSaldoStatus.classList.add("alerta-vermelho");
        } else if (porcentagemUso >= 80) {
            cardSaldoStatus.classList.add("alerta-amarelo");
        }
    }
}


function abrirDetalhamentoGastos() {
    const competencia = obterCompetenciaAtual();

    const nomes = {
        fixos: "🏠 Gastos Fixos",
        mercado: "🛒 Mercado",
        lazer: "🎮 Lazer",
        transporte: "🚗 Transporte",
        assinaturas: "🔄 Assinaturas"
    };

    const categorias = [
        "fixos",
        "mercado",
        "lazer",
        "transporte",
        "assinaturas"
    ];

    let html = "";
    let total = 0;

    categorias.forEach(categoria => {
        const itens = gastos[categoria] || [];

        let subtotal = 0;

        if (categoria === "fixos" || categoria === "assinaturas") {
            subtotal = itens
                .filter(item =>
                    recorrenciaAtivaNaCompetencia(item, competencia)
                )
                .reduce(
                    (acc, item) => acc + Number(item.valor),
                    0
                );
        } else {
            subtotal = itens
                .filter(item => item.competencia === competencia)
                .reduce(
                    (acc, item) => acc + Number(item.valor),
                    0
                );
        }

        total += subtotal;

        html += `
  <div style="
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:12px 0;
    border-bottom:1px solid var(--border-color);
  ">
    <span>${nomes[categoria]}</span>
    <strong>${formatarMoeda(subtotal)}</strong>
  </div>
`;
});

const cartoes = calcularTotalParcelasCartaoMes();
total += cartoes;

html += `
  <div id="linhaDetalheCartoes" style="
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:12px 0;
    border-bottom:1px solid var(--border-color);
  ">
    <span>💳 Cartões</span>
    <strong>${formatarMoeda(cartoes)}</strong>
  </div>

  <div style="
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding-top:18px;
    font-size:17px;
  ">
    <strong>Total</strong>
    <strong>${formatarMoeda(total)}</strong>
  </div>
`;

abrirModal("Detalhamento de Gastos", html);

setTimeout(() => {
    const linhaCartoes = document.getElementById("linhaDetalheCartoes");
  
    if (linhaCartoes) {
      linhaCartoes.style.cursor = "pointer";
      linhaCartoes.addEventListener("click", () => {
        window.abrirDetalhamentoCartoes();
      });
    }
  }, 0);
}


window.abrirDetalhamentoCartoes = function() {
    const parcelas = obterParcelasCartaoDaCompetencia()
    .sort((a, b) => {
        const restantesA = a.parcelas - a.numeroParcela;
        const restantesB = b.parcelas - b.numeroParcela;

        return restantesB - restantesA;
    });

    let html = "";

    if (parcelas.length === 0) {
        html = `
            <p style="text-align:center; opacity:0.6; padding:20px 0;">
                Nenhuma parcela de cartão nesta competência.
            </p>
        `;
    } else {
        parcelas.forEach(compra => {
            html += `
                <div style="
                    padding:12px 0;
                    border-bottom:1px solid var(--border-color);
                ">
                    <div style="
                        display:flex;
                        justify-content:space-between;
                        gap:15px;
                    ">
                        <strong>${compra.descricao}</strong>
                        <strong>${formatarMoeda(compra.valorParcela)}</strong>
                    </div>

                    <small style="opacity:0.65;">
                        ${compra.cartao} • Parcela ${compra.numeroParcela}/${compra.parcelas}
                    </small>
                </div>
            `;
        });

        const total = parcelas.reduce(
            (acc, compra) => acc + compra.valorParcela,
            0
        );

        html += `
            <div style="
                display:flex;
                justify-content:space-between;
                padding-top:18px;
                font-size:17px;
            ">
                <strong>Total dos cartões</strong>
                <strong>${formatarMoeda(total)}</strong>
            </div>
        `;
    }

    abrirModal("Parcelas do Mês", html);
};


const btnDetalharGastos = document.getElementById("btnDetalharGastos");

if (btnDetalharGastos) {
    btnDetalharGastos.addEventListener("click", abrirDetalhamentoGastos);
}


// Entradas com Modal
if (btnEntrada) {
    btnEntrada.addEventListener("click", () => {
        mostrarTela(telaEntradas, tabFinancas);
        atualizarListaEntradas();
    });
}

if (btnNovaEntrada) {
    btnNovaEntrada.addEventListener("click", () => {
        const html = `
            <div class="campo-form" style="margin-bottom:12px;">
                <label>Descrição</label>
                <input type="text" id="mEntradaDesc" placeholder="Ex: Salário, PIX">
            </div>
            <div class="campo-form">
                <label>Valor (R$)</label>
                <input type="number" step="0.01" id="mEntradaValor" placeholder="Ex: 2500.00">
            </div>
        `;

        abrirModal("Nova Entrada", html, () => {
            const desc = document.getElementById("mEntradaDesc")?.value.trim();
            const val = parseFloat(document.getElementById("mEntradaValor")?.value);

            if (!desc || isNaN(val) || val <= 0) return alert("Preencha os campos corretamente.");

            entradas.push({
                id: Date.now(),
                descricao: desc,
                valor: val,
                competencia: obterCompetenciaAtual(),
                data: new Date().toISOString()
            });
            
            localStorage.setItem(
                "meuAppEntradas",
                JSON.stringify(entradas)
            );
            
            atualizarListaEntradas();
            atualizarBalançoGeral();
        });
    });
}

function atualizarListaEntradas() {
    const lista = document.getElementById("listaEntradas");
    const total = document.getElementById("totalEntradas");

    if (!lista || !total) return;

    const competencia = obterCompetenciaAtual();

    const entradasDoMes = entradas.filter(
        item => item.competencia === competencia
    );

    lista.innerHTML = "";

    const totalValor = entradasDoMes.reduce(
        (acc, item) => acc + Number(item.valor),
        0
    );

    if (entradasDoMes.length === 0) {
        lista.innerHTML = `
            <p style="text-align:center; opacity:0.6; padding:1rem;">
                Nenhuma entrada registrada neste mês.
            </p>
        `;
    } else {
        entradasDoMes.forEach(item => {
            const div = document.createElement("div");
            div.className = "lancamento";

            div.innerHTML = `
                <div>
                    <strong>${item.descricao}</strong>
                </div>

                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="
                        color:var(--success);
                        font-weight:600;
                    ">
                        ${formatarMoeda(Number(item.valor))}
                    </span>

                    <button
                        class="botao-excluir"
                        onclick="excluirEntrada(${item.id})"
                    >
                        ✕
                    </button>
                </div>
            `;

            lista.appendChild(div);
        });
    }

    total.textContent = formatarMoeda(totalValor);
}

window.excluirEntrada = function(id) {
    const entrada = entradas.find(item => item.id === id);
    if (!entrada) return;

    const confirmar = confirm(
        `Deseja excluir a entrada "${entrada.descricao}"?\n\n` +
        `${formatarMoeda(Number(entrada.valor))}`
    );

    if (!confirmar) return;

    entradas = entradas.filter(item => item.id !== id);

    localStorage.setItem(
        "meuAppEntradas",
        JSON.stringify(entradas)
    );

    atualizarListaEntradas();
    atualizarBalançoGeral();
};


// Cartões de Crédito com Modal
if (btnCartao) {
    btnCartao.addEventListener("click", () => {
        mostrarTela(telaCartao, tabFinancas);
        renderizarCartoesECompras();
    });
}

if (btnNovoCartao) {
    btnNovoCartao.addEventListener("click", () => {
        const html = `
            <div class="campo-form">
                <label>Nome do Cartão</label>
                <input type="text" id="mNomeCartao" placeholder="Ex: Inter, Itaú, Nubank">
            </div>
        `;

        abrirModal("Novo Cartão", html, () => {
            const nome = document.getElementById("mNomeCartao")?.value.trim();
            if (!nome) return alert("Nome inválido.");

            if (!cartoes.includes(nome)) {
                cartoes.push(nome);
                localStorage.setItem("meuAppCartoes", JSON.stringify(cartoes));
                renderizarCartoesECompras();
            } else {
                alert("Cartão já existente.");
            }
        });
    });
}

if (btnNovaCompraParcelada) {
    btnNovaCompraParcelada.addEventListener("click", () => {
        if (cartoes.length === 0) return alert("Cadastre ao menos um cartão.");

        const opcoesCartoes = cartoes.map(c => `<option value="${c}">${c}</option>`).join("");

        const html = `
            <div class="campo-form" style="margin-bottom:12px;">
                <label>Descrição da Compra</label>
                <input type="text" id="mCompraDesc" placeholder="Ex: Celular Novo">
            </div>
            <div class="campo-form" style="margin-bottom:12px;">
                <label>Valor TOTAL (R$)</label>
                <input type="number" step="0.01" id="mCompraValor" placeholder="Ex: 1200.00">
            </div>
            <div class="campo-form" style="margin-bottom:12px;">
    <label>Número de Parcelas</label>
    <select id="mCompraParcelas">
        <option value="1">1x</option>
        <option value="2">2x</option>
        <option value="3">3x</option>
        <option value="4">4x</option>
        <option value="5">5x</option>
        <option value="6">6x</option>
        <option value="7">7x</option>
        <option value="8">8x</option>
        <option value="9">9x</option>
        <option value="10">10x</option>
        <option value="11">11x</option>
        <option value="12">12x</option>
    </select>
</div>
            <div class="campo-form">
                <label>Selecione o Cartão</label>
                <select id="mCompraCartao">${opcoesCartoes}</select>
            </div>
        `;

        abrirModal("Nova Compra Parcelada", html, () => {
            const desc = document.getElementById("mCompraDesc")?.value.trim();
            const valorTotal = parseFloat(document.getElementById("mCompraValor")?.value);
            const parcelas = parseInt(document.getElementById("mCompraParcelas")?.value, 10);
            const cartaoSel = document.getElementById("mCompraCartao")?.value;

            if (!desc || isNaN(valorTotal) || isNaN(parcelas) || valorTotal <= 0 || parcelas <= 0) {
                return alert("Dados incorretos.");
            }

            comprasCartao.push({
                id: Date.now(),
                descricao: desc,
                valorTotal,
                parcelas,
                cartao: cartaoSel,
                competencia: obterCompetenciaAtual()
            });

            localStorage.setItem("meuAppComprasCartao", JSON.stringify(comprasCartao));
            renderizarCartoesECompras();
        });
    });
}

function renderizarCartoesECompras() {
    const container = document.getElementById("containerCartoes");
    const elTotalParcelasMes = document.getElementById("totalParcelasMes");
    if (!container) return;

    container.innerHTML = "";
    const totalMes = calcularTotalParcelasCartaoMes();
    if (elTotalParcelasMes) elTotalParcelasMes.textContent = formatarMoeda(totalMes);

    if (cartoes.length === 0) {
        container.innerHTML = `<p style="text-align:center; opacity:0.6; padding:1.5rem;">Nenhum cartão cadastrado.</p>`;
        return;
    }

    cartoes.forEach(cartao => {
        const bloco = document.createElement("div");
        bloco.style.background = "var(--card-bg)";
        bloco.style.borderRadius = "16px";
        bloco.style.padding = "16px";
        bloco.style.marginBottom = "14px";

        const competencia = obterCompetenciaAtual();

const comprasDoCartao = comprasCartao.filter(c =>
    c.cartao === cartao &&
    compraAtivaNaCompetencia(c, competencia)
);
        let subtotalCartaoMes = 0;

        let comprasHTML = "";
        if (comprasDoCartao.length === 0) {
            comprasHTML = `<p style="font-size:13px; color:var(--text-muted); margin-top:8px;">Nenhuma compra neste cartão.</p>`;
        } else {
            [...comprasDoCartao]
    .sort((a, b) => {
        const calcularRestantes = (compra) => {
            const [anoInicio, mesInicio] = compra.competencia.split("-").map(Number);
            const [anoAtual, mesAtual] = competencia.split("-").map(Number);

            const indiceInicio = anoInicio * 12 + (mesInicio - 1);
            const indiceAtual = anoAtual * 12 + (mesAtual - 1);

            const numeroParcela = indiceAtual - indiceInicio + 1;
            return compra.parcelas - numeroParcela + 1;
        };

        return calcularRestantes(b) - calcularRestantes(a);
    })
    .forEach(compra => {
                const valorParcela = compra.valorTotal / compra.parcelas;
            
                const [anoInicio, mesInicio] = compra.competencia
                    .split("-")
                    .map(Number);
            
                const [anoAtual, mesAtual] = competencia
                    .split("-")
                    .map(Number);
            
                const indiceInicio = anoInicio * 12 + (mesInicio - 1);
                const indiceAtual = anoAtual * 12 + (mesAtual - 1);
            
                const numeroParcela = indiceAtual - indiceInicio + 1;
            
                subtotalCartaoMes += valorParcela;

                const parcelasRestantes = compra.parcelas - numeroParcela + 1;
                const saldoRestante = valorParcela * parcelasRestantes;
            
                comprasHTML += `
                    <div class="lancamento" style="margin-top:8px;">
                        <div>
                            <strong>${compra.descricao}</strong><br>
                            <small style="color:var(--text-muted);">
    Parcela ${numeroParcela}/${compra.parcelas} • ${formatarMoeda(valorParcela)}<br>
    Restam ${parcelasRestantes} parcela${parcelasRestantes !== 1 ? "s" : ""} • 
    Saldo: ${formatarMoeda(saldoRestante)}
</small>
                        </div>
            
                        <div style="display:flex; gap:8px; align-items:center;">
    <button
        onclick="editarCompraCartao(${compra.id})"
        style="
            border:none;
            background:transparent;
            cursor:pointer;
            font-size:16px;
        "
        title="Editar"
    >✏️</button>

    <button
        class="botao-excluir"
        onclick="excluirCompraCartao(${compra.id})"
    >×</button>
</div>
                    </div>
                `;
            });
        }

        bloco.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
                <div>
                    <h3 style="font-size:16px;">💳 ${cartao}</h3>
                    <small style="color:var(--text-muted);">Parcelas no Mês: ${formatarMoeda(subtotalCartaoMes)}</small>
                </div>
                <button class="botao-excluir" style="font-size:12px;" onclick="excluirCartao('${cartao}')">Excluir</button>
            </div>
            <div>${comprasHTML}</div>
        `;

        container.appendChild(bloco);
    });
}

window.editarCompraCartao = function(id) {
    const compra = comprasCartao.find(c => c.id === id);
    if (!compra) return;

    const opcoesCartoes = cartoes.map(c =>
        `<option value="${c}" ${c === compra.cartao ? "selected" : ""}>${c}</option>`
    ).join("");

    const html = `
        <div class="campo-form" style="margin-bottom:12px;">
            <label>Descrição da Compra</label>
            <input
                type="text"
                id="mEditarCompraDesc"
                value="${compra.descricao}"
            >
        </div>

        <div class="campo-form" style="margin-bottom:12px;">
            <label>Valor TOTAL (R$)</label>
            <input
                type="number"
                step="0.01"
                id="mEditarCompraValor"
                value="${compra.valorTotal}"
            >
        </div>

        <div class="campo-form" style="margin-bottom:12px;">
            <label>Número de Parcelas</label>
            <select id="mEditarCompraParcelas">
                ${Array.from({ length: 12 }, (_, i) => {
                    const n = i + 1;
                    return `<option value="${n}" ${n === compra.parcelas ? "selected" : ""}>${n}x</option>`;
                }).join("")}
            </select>
        </div>

        <div class="campo-form">
            <label>Cartão</label>
            <select id="mEditarCompraCartao">
                ${opcoesCartoes}
            </select>
        </div>
    `;

    abrirModal("Editar Compra", html, () => {
        const desc = document.getElementById("mEditarCompraDesc")?.value.trim();
        const valorTotal = parseFloat(
            document.getElementById("mEditarCompraValor")?.value
        );
        const parcelas = parseInt(
            document.getElementById("mEditarCompraParcelas")?.value,
            10
        );
        const cartao = document.getElementById("mEditarCompraCartao")?.value;

        if (
            !desc ||
            isNaN(valorTotal) ||
            valorTotal <= 0 ||
            isNaN(parcelas) ||
            parcelas <= 0 ||
            !cartao
        ) {
            return alert("Dados incorretos.");
        }

        compra.descricao = desc;
        compra.valorTotal = valorTotal;
        compra.parcelas = parcelas;
        compra.cartao = cartao;

        localStorage.setItem(
            "meuAppComprasCartao",
            JSON.stringify(comprasCartao)
        );

        renderizarCartoesECompras();
        atualizarBalançoGeral();
    });
};

window.excluirCartao = function(nomeCartao) {
    const comprasVinculadas = comprasCartao.filter(
        compra => compra.cartao === nomeCartao
    );

    if (comprasVinculadas.length > 0) {
        const confirmar = confirm(
            `O cartão "${nomeCartao}" possui ${comprasVinculadas.length} ` +
            `compra${comprasVinculadas.length !== 1 ? "s" : ""} cadastrada${comprasVinculadas.length !== 1 ? "s" : ""}.\n\n` +
            `Excluir o cartão também apagará TODAS essas compras e o histórico delas.\n\n` +
            `Deseja continuar?`
        );

        if (!confirmar) return;

        const confirmarNovamente = confirm(
            `Confirmar exclusão definitiva do cartão "${nomeCartao}" e de todas as compras vinculadas?`
        );

        if (!confirmarNovamente) return;
    } else {
        const confirmar = confirm(
            `Deseja excluir o cartão "${nomeCartao}"?`
        );

        if (!confirmar) return;
    }

    cartoes = cartoes.filter(c => c !== nomeCartao);

    comprasCartao = comprasCartao.filter(
        compra => compra.cartao !== nomeCartao
    );

    localStorage.setItem(
        "meuAppCartoes",
        JSON.stringify(cartoes)
    );

    localStorage.setItem(
        "meuAppComprasCartao",
        JSON.stringify(comprasCartao)
    );

    renderizarCartoesECompras();
    atualizarBalançoGeral();
};

window.excluirCompraCartao = function(id) {
    const compra = comprasCartao.find(c => c.id === id);
    if (!compra) return;

    const confirmar = confirm(
        `Deseja excluir a compra "${compra.descricao}"?\n\n` +
        `Valor total: ${formatarMoeda(Number(compra.valorTotal))}\n` +
        `Parcelas: ${compra.parcelas}x`
    );

    if (!confirmar) return;

    comprasCartao = comprasCartao.filter(c => c.id !== id);

    localStorage.setItem(
        "meuAppComprasCartao",
        JSON.stringify(comprasCartao)
    );

    renderizarCartoesECompras();
    atualizarBalançoGeral();
};


// Gastos por Categoria
function abrirCategoriaGasto(categoriaKey) {
    categoriaAtualGasto = categoriaKey;
    const config = configCategorias[categoriaKey];

    const elTitulo = document.getElementById("tituloTelaGasto");
    const elSubtitulo = document.getElementById("subtituloTelaGasto");

    if (elTitulo) elTitulo.textContent = config.titulo;
    if (elSubtitulo) elSubtitulo.textContent = config.subtitulo;

    mostrarTela(telaGastosGenerica, tabFinancas);
    atualizarListaGastosCategoria();
}

[btnMercado, btnLazer, btnFixos, btnTransporte, btnAssinaturas].forEach(btn => {
    if (btn) {
        btn.addEventListener("click", () => abrirCategoriaGasto(btn.getAttribute("data-id")));
    }
});

if (btnNovoGastoCategoria) {
    btnNovoGastoCategoria.addEventListener("click", () => {
        if (!categoriaAtualGasto) return;
        
        const config = configCategorias[categoriaAtualGasto];

        const categoriaRecorrente =
    categoriaAtualGasto === "fixos" ||
    categoriaAtualGasto === "assinaturas";

    const html = `
    <div class="campo-form" style="margin-bottom:12px;">
        <label>Descrição</label>
        <input
            type="text"
            id="mGastoDesc"
            placeholder="${
                categoriaRecorrente
                    ? "Ex: Internet, Netflix"
                    : "Ex: Compra quinzenal"
            }"
        >
    </div>

    <div class="campo-form">
        <label>Valor (R$)</label>
        <input
            type="number"
            step="0.01"
            id="mGastoValor"
            placeholder="Ex: 150.00"
        >
    </div>

    ${
        categoriaRecorrente
            ? `
                <div
                    style="
                        margin-top:14px;
                        padding:12px;
                        background:var(--bg-app);
                        border-radius:12px;
                    "
                >
                    <strong style="font-size:13px;">
                        🔄 Cobrança recorrente
                    </strong>

                    <p
                        style="
                            font-size:12px;
                            color:var(--text-muted);
                            margin-top:4px;
                        "
                    >
                        Será repetida automaticamente nos próximos meses.
                    </p>
                </div>
            `
            : ""
    }
`;

        abrirModal(`Novo Gasto em ${config.titulo}`, html, () => {
            const desc = document.getElementById("mGastoDesc")?.value.trim();
            const val = parseFloat(document.getElementById("mGastoValor")?.value);

            if (!desc || isNaN(val) || val <= 0) return alert("Preencha os campos corretamente.");

            if (categoriaRecorrente) {

                gastos[categoriaAtualGasto].push({
                    id: Date.now(),
                    descricao: desc,
                    valor: val,
            
                    recorrente: true,
            
                    competenciaInicio: obterCompetenciaAtual(),
                    competenciaFim: null,
            
                    dataCriacao: new Date().toISOString()
                });
            
            } else {
            
                gastos[categoriaAtualGasto].push({
                    id: Date.now(),
                    descricao: desc,
                    valor: val,
            
                    competencia: obterCompetenciaAtual(),
            
                    data: new Date().toISOString()
                });
            
            }
            localStorage.setItem("meuAppGastos", JSON.stringify(gastos));
            atualizarListaGastosCategoria();
        });
    });
}

function atualizarListaGastosCategoria() {
    if (!categoriaAtualGasto) return;

    const lista = document.getElementById("listaGastosCategoria");
    const elTotal = document.getElementById("totalCategoriaGasto");

    if (!lista || !elTotal) return;

    const competencia = obterCompetenciaAtual();

    const categoriaRecorrente =
        categoriaAtualGasto === "fixos" ||
        categoriaAtualGasto === "assinaturas";

    const todosItens = gastos[categoriaAtualGasto] || [];

    let itens;

    if (categoriaRecorrente) {
        itens = todosItens.filter(item =>
            recorrenciaAtivaNaCompetencia(item, competencia)
        );
    } else {
        itens = todosItens.filter(item =>
            item.competencia === competencia
        );
    }

    lista.innerHTML = "";

    const total = itens.reduce(
        (acc, item) => acc + Number(item.valor),
        0
    );

    if (itens.length === 0) {
        lista.innerHTML = `
            <p style="text-align:center; opacity:0.6; padding:1rem;">
                Nenhum gasto registrado neste mês.
            </p>
        `;
    } else {
        itens.forEach(item => {
            const div = document.createElement("div");
            div.className = "lancamento";

            const indicadorRecorrente = item.recorrente
                ? `<small style="color:var(--text-muted);">🔄 Recorrente</small>`
                : "";

            div.innerHTML = `
                <div>
                    <strong>${item.descricao}</strong>
                    <br>
                    ${indicadorRecorrente}
                </div>

                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-weight:600;">
                        ${formatarMoeda(Number(item.valor))}
                    </span>

                    <button
    class="botao-excluir"
    onclick="excluirGastoCategoria(${item.id})"
>
    ${item.recorrente ? "Encerrar" : "×"}
</button>
                </div>
            `;

            lista.appendChild(div);
        });
    }

    elTotal.textContent = formatarMoeda(total);
}

window.excluirGastoCategoria = function(id) {
    if (!categoriaAtualGasto) return;

    const itens = gastos[categoriaAtualGasto] || [];
    const item = itens.find(item => item.id === id);

    if (!item) return;

    // FIXOS E ASSINATURAS: encerra a recorrência
    if (item.recorrente) {
        const competenciaAtual = obterCompetenciaAtual();

        const confirmar = confirm(
            `Deseja encerrar "${item.descricao}" a partir desta competência?\n\n` +
            `O histórico dos meses anteriores será mantido.`
        );

        if (!confirmar) return;

        item.competenciaFim = competenciaAtual;
    }

    // GASTOS NORMAIS: exclui normalmente
    else {
        const confirmar = confirm(
            `Deseja excluir "${item.descricao}"?`
        );

        if (!confirmar) return;

        gastos[categoriaAtualGasto] =
            itens.filter(gasto => gasto.id !== id);
    }

    localStorage.setItem(
        "meuAppGastos",
        JSON.stringify(gastos)
    );

    atualizarListaGastosCategoria();
    atualizarBalançoGeral();
};


// Auxiliares
function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function aplicarOrdemSalvaFinancas() {
    const container = document.getElementById("containerFinancas");
    if (!container) return;
    ordemFinancas.forEach(id => {
        const card = container.querySelector(`[data-id="${id}"]`);
        if (card) container.appendChild(card);
    });
}


// ========================================
// 10. MÓDULO: CONFIGURAÇÕES & BACKUP
// ========================================

function aplicarModulosOcultos() {
    const ocultos = new Set(modulosOcultos);
    document.querySelectorAll("[data-modulo]").forEach(el => { el.hidden = ocultos.has(el.dataset.modulo); });
    const caixas = { trabalho: "mostrarModuloTrabalho", financas: "mostrarModuloFinancas", academia: "mostrarModuloAcademia" };
    Object.entries(caixas).forEach(([modulo, id]) => {
        const caixa = document.getElementById(id);
        if (caixa) caixa.checked = !ocultos.has(modulo);
    });
}

["trabalho", "financas", "academia"].forEach(modulo => {
    const caixa = document.getElementById(`mostrarModulo${modulo[0].toUpperCase()}${modulo.slice(1)}`);
    caixa?.addEventListener("change", () => {
        modulosOcultos = modulosOcultos.filter(item => item !== modulo);
        if (!caixa.checked) modulosOcultos.push(modulo);
        localStorage.setItem("meuAppModulosOcultos", JSON.stringify(modulosOcultos));
        aplicarModulosOcultos();
        const telaVisivelDoModulo = document.querySelector(`.tela:not([hidden])[data-modulo-tela="${modulo}"]`);
        if (!caixa.checked && telaVisivelDoModulo) mostrarTela(telaInicio, tabInicio);
    });
});

const btnExportarBackup = document.getElementById("btnExportarBackup");
const btnImportarBackup = document.getElementById("btnImportarBackup");
const inputImportarBackup = document.getElementById("inputImportarBackup");
const btnResetarDados = document.getElementById("btnResetarDados");

if (btnExportarBackup) {
    btnExportarBackup.addEventListener("click", () => {
        const dadosCompletos = {
            entradas: JSON.parse(localStorage.getItem("meuAppEntradas")) || [],
            cartoes: JSON.parse(localStorage.getItem("meuAppCartoes")) || ["Nubank"],
            comprasCartao: JSON.parse(localStorage.getItem("meuAppComprasCartao")) || [],
            gastos: JSON.parse(localStorage.getItem("meuAppGastos")) || {},
            qualificacoes: JSON.parse(localStorage.getItem("meuAppQualificacoes")) || [],
            turnos: JSON.parse(localStorage.getItem("meuAppTurnos")) || [],
            reds: JSON.parse(localStorage.getItem("meuAppReds")) || [],
            veiculosFiscalizados: JSON.parse(localStorage.getItem("meuAppVeiculos")) || [],
            fichasAcademia: JSON.parse(localStorage.getItem("meuAppFichasAcademia")) || [],
            modulosOcultos: JSON.parse(localStorage.getItem("meuAppModulosOcultos")) || [],
            turnoAtivo: JSON.parse(localStorage.getItem("meuAppTurnoAtivo")) || null,
            dataExportacao: new Date().toISOString(),
            ordemFinancas: JSON.parse(localStorage.getItem("meuAppOrdemFinancas")) || [
            "entrada", "cartao", "fixos", "mercado", "transporte", "lazer", "assinaturas"
            ],
        };

        const blob = new Blob([JSON.stringify(dadosCompletos, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `meu_app_backup_${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}

if (btnImportarBackup && inputImportarBackup) {
    btnImportarBackup.addEventListener("click", () => inputImportarBackup.click());

    inputImportarBackup.addEventListener("change", (e) => {
        const arquivo = e.target.files[0];
        if (!arquivo) return;

        const leitor = new FileReader();
        leitor.onload = (evento) => {
            try {
                const dados = JSON.parse(evento.target.result);
                if (confirm("Deseja substituir os dados atuais por este backup?")) {
                    if (dados.entradas) localStorage.setItem("meuAppEntradas", JSON.stringify(dados.entradas));
                    if (dados.cartoes) localStorage.setItem("meuAppCartoes", JSON.stringify(dados.cartoes));
                    if (dados.comprasCartao) localStorage.setItem("meuAppComprasCartao", JSON.stringify(dados.comprasCartao));
                    if (dados.gastos) localStorage.setItem("meuAppGastos", JSON.stringify(dados.gastos));
                    if (dados.qualificacoes) localStorage.setItem("meuAppQualificacoes", JSON.stringify(dados.qualificacoes));
                    if (dados.turnos) localStorage.setItem("meuAppTurnos", JSON.stringify(dados.turnos));
                    if (Array.isArray(dados.reds)) localStorage.setItem("meuAppReds", JSON.stringify(dados.reds));
                    if (Array.isArray(dados.veiculosFiscalizados)) localStorage.setItem("meuAppVeiculos", JSON.stringify(dados.veiculosFiscalizados));
                    if (Array.isArray(dados.fichasAcademia)) localStorage.setItem("meuAppFichasAcademia", JSON.stringify(dados.fichasAcademia));
                    if (Array.isArray(dados.modulosOcultos)) localStorage.setItem("meuAppModulosOcultos", JSON.stringify(dados.modulosOcultos));
                    if (Object.prototype.hasOwnProperty.call(dados, "turnoAtivo")) {
                        if (dados.turnoAtivo) {
                            localStorage.setItem("meuAppTurnoAtivo", JSON.stringify(dados.turnoAtivo));
                        } else {
                            localStorage.removeItem("meuAppTurnoAtivo");
                        }
                    }
                    if (Array.isArray(dados.ordemFinancas)) {
                        localStorage.setItem("meuAppOrdemFinancas", JSON.stringify(dados.ordemFinancas));
                    }

                    alert("Backup restaurado!");
                    window.location.reload();
                }
            } catch (err) {
                alert("Arquivo de backup inválido.");
            }
        };
        leitor.readAsText(arquivo);
    });
}

if (btnResetarDados) {
    btnResetarDados.addEventListener("click", () => {
        if (confirm("TEM CERTEZA? Isso apagará todos os dados definitivamente.")) {
            localStorage.clear();
            alert("Dados limpos!");
            window.location.reload();
        }
    });
}


// ========================================
// 11. REGISTRO DE SERVICE WORKER & INICIALIZAÇÃO
// ========================================

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then(reg => console.log("[PWA] Service Worker registrado com sucesso:", reg.scope))
            .catch(err => console.log("[PWA] Falha ao registrar Service Worker:", err));
    });
}

document.addEventListener("DOMContentLoaded", () => {
    aplicarModulosOcultos();
    mostrarTela(telaInicio, tabInicio);

    atualizarMesFinanceiro();

    console.log("App com layout nativo iOS carregado!");
});
