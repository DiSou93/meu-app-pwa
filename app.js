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
let jogos = JSON.parse(localStorage.getItem("meuAppJogos")) || [];
if (!Array.isArray(jogos)) jogos = [];
let modulosOcultos = JSON.parse(localStorage.getItem("meuAppModulosOcultos")) || [];

let gastos = JSON.parse(localStorage.getItem("meuAppGastos")) || {
    mercado: [],
    lazer: [],
    fixos: [],
    transporte: [],
    assinaturas: [],
    trabalho: [],
    outros: []
};

// Compatibilidade com dados e backups anteriores às novas categorias.
if (!Array.isArray(gastos.trabalho)) gastos.trabalho = [];
if (!Array.isArray(gastos.outros)) gastos.outros = [];

let ordemFinancas = JSON.parse(localStorage.getItem("meuAppOrdemFinancas")) || [
    "entrada", "cartao", "fixos", "mercado", "transporte", "lazer", "assinaturas", "trabalho", "outros"
];

if (!ordemFinancas.includes("trabalho")) ordemFinancas.push("trabalho");
if (!ordemFinancas.includes("outros")) ordemFinancas.push("outros");

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
    assinaturas: { titulo: "Assinaturas", subtitulo: "Streaming e serviços recorrentes" },
    trabalho: { titulo: "Trabalho", subtitulo: "Despesas durante o trabalho no mês selecionado" },
    outros: { titulo: "Outros", subtitulo: "Saúde e despesas diversas no mês selecionado" }
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
const telaGames = document.getElementById("telaGames");
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
    telaAcademia, telaGames, telaConfiguracoes
];

// Botões Principais da Tela Inicial
const btnTrabalho = document.getElementById("btnTrabalho");
const btnFinancas = document.getElementById("btnFinancas");
const btnAcademia = document.getElementById("btnAcademia");
const btnGames = document.getElementById("btnGames");
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
const btnGastosTrabalho = document.getElementById("btnGastosTrabalho");
const btnOutros = document.getElementById("btnOutros");
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
const tabGames = document.getElementById("tabGames");
const tabConfiguracoes = document.getElementById("tabConfiguracoes");
const todasTabs = [tabInicio, tabTrabalho, tabFinancas, tabAcademia, tabGames, tabConfiguracoes];

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
    acaoModalAtual = typeof callbackConfirmar === "function" ? callbackConfirmar : null;
    btnModalConfirmar.textContent = acaoModalAtual ? "Confirmar" : "Concluir";
    modalConteudo.scrollTop = 0;
    document.body.classList.add("modal-aberto");
}

function fecharModal() {
    modalOverlay.hidden = true;
    modalConteudo.innerHTML = "";
    acaoModalAtual = null;
    document.body.classList.remove("modal-aberto");
}

if (btnModalCancelar) {
    btnModalCancelar.type = "button";
    btnModalCancelar.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        fecharModal();
    });
}
if (btnModalConfirmar) {
    btnModalConfirmar.type = "button";
    btnModalConfirmar.addEventListener("click", (event) => {
        event.preventDefault();
        try {
            if (acaoModalAtual && acaoModalAtual() === false) return;
            fecharModal();
        } catch (erro) {
            console.error(erro);
            alert("Não foi possível concluir. Confira os dados e tente novamente.");
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

let edicaoQualificacao = null;
const camposEdicaoQualificacao = {"condicao": "qCondicao", "nome": "qNome", "mae": "qMae", "pai": "qPai", "nascimento": "qNascimento", "cpf": "qCpf", "rg": "qRg", "endereco": "qEndereco", "telefone": "qTelefone", "profissao": "qProfissao", "ensino": "qEnsino", "estadoCivil": "qEstadoCivil", "corRaca": "qCorRaca"};
function terminarEdicaoQualificacao() {
    if (!edicaoQualificacao) return;
    const anterior = edicaoQualificacao;
    edicaoQualificacao = null;
    Object.entries(anterior.rascunho).forEach(([id, valor]) => { document.getElementById(id).value = valor; });
    formQualificacao.querySelector('[type="submit"]').textContent = anterior.rotulo;
    document.getElementById('btnLimparFormQualificacao').textContent = anterior.limpar;
}
window.editarQualificacao = function(id) {
    const item = qualificacoesSalvas.find(item => item.id === id);
    if (!item) return;
    if (edicaoQualificacao) {
        if (!confirm('Descartar as alterações não salvas e editar outro registro?')) return;
        terminarEdicaoQualificacao();
    }
    edicaoQualificacao = { id, rascunho: Object.fromEntries(Object.values(camposEdicaoQualificacao).map(id => [id, document.getElementById(id).value])),
        rotulo: formQualificacao.querySelector('[type="submit"]').textContent,
        limpar: document.getElementById('btnLimparFormQualificacao').textContent };
    Object.entries(camposEdicaoQualificacao).forEach(([chave, id]) => {
        const campo = document.getElementById(id);
        const valor = item[chave] ?? (chave === 'corRaca' ? 'Não informado' : '');
        if (campo.tagName === 'SELECT' && valor && !Array.from(campo.options).some(opcao => opcao.value === valor)) {
            campo.add(new Option(valor, valor));
        }
        campo.value = valor;
    });
    formQualificacao.querySelector('[type="submit"]').textContent = '💾 Salvar alterações';
    document.getElementById('btnLimparFormQualificacao').textContent = 'Cancelar edição';
    formQualificacao.scrollIntoView({ block: 'start', behavior: 'smooth' });
};

const btnCopiarQualificacao = document.getElementById("btnCopiarQualificacao");
const btnLimparFormQualificacao = document.getElementById("btnLimparFormQualificacao");

function obterDadosQualificacaoForm() {
    return {
        condicao: document.getElementById("qCondicao")?.value || "N/I",
        nome: document.getElementById("qNome")?.value.trim() || "",
        mae: document.getElementById("qMae")?.value.trim() || "",
        pai: document.getElementById("qPai")?.value.trim() || "",
        nascimento: document.getElementById("qNascimento")?.value || "",
        cpf: document.getElementById("qCpf")?.value.trim() || "",
        rg: document.getElementById("qRg")?.value.trim() || "",
        endereco: document.getElementById("qEndereco")?.value.trim() || "",
        telefone: document.getElementById("qTelefone")?.value.trim() || "",
        profissao: document.getElementById("qProfissao")?.value.trim() || "",
        ensino: document.getElementById("qEnsino")?.value || "N/I",
        estadoCivil: document.getElementById("qEstadoCivil")?.value || "N/I",
        corRaca: document.getElementById("qCorRaca")?.value || "Não informado"
    };
}

function gerarTextoQualificacao(d) {
    return `*QUALIFICAÇÃO DO ENVOLVIDO*
Condição: ${d.condicao || "N/I"}
Nome: ${d.nome || "N/I"}
Mãe: ${d.mae || "N/I"}
Pai: ${d.pai || "N/I"}
Data de nascimento: ${formatarDataTurno(d.nascimento)}
CPF: ${d.cpf || "N/I"}
RG: ${d.rg || "N/I"}
Endereço: ${d.endereco || "N/I"}
Telefone: ${d.telefone || "N/I"}
Profissão: ${d.profissao || "N/I"}
Ensino: ${d.ensino || "N/I"}
Estado Civil: ${d.estadoCivil || "N/I"}
Cor/Raça: ${d.corRaca || "Não informado"}`;
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

        const editando = edicaoQualificacao !== null;
        if (editando) {
            const indice = qualificacoesSalvas.findIndex(item => item.id === edicaoQualificacao.id);
            if (indice < 0) return alert("Registro não encontrado. Cancele a edição e tente novamente.");
            qualificacoesSalvas[indice] = { ...qualificacoesSalvas[indice], ...dados };
        } else {
            qualificacoesSalvas.unshift({ id: Date.now(), ...dados });
        }
        localStorage.setItem("meuAppQualificacoes", JSON.stringify(qualificacoesSalvas));

        if (editando) terminarEdicaoQualificacao();
        else formQualificacao.reset();
        renderizarQualificacoesSalvas();
        alert(editando ? "Qualificação atualizada!" : "Qualificação salva!");
    });
}

if (btnLimparFormQualificacao) {
    btnLimparFormQualificacao.addEventListener("click", () => {
        if (edicaoQualificacao) terminarEdicaoQualificacao();
        else formQualificacao?.reset();
    });
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
            <button class="botao-secundario" style="padding:8px 12px; font-size:12px;" onclick="editarQualificacao(${item.id})">✏️ Editar</button>
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
    if (edicaoQualificacao?.id === id) terminarEdicaoQualificacao();
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

let edicaoTurno = null;
const camposEdicaoTurno = {"data": "tDataTurno", "horaInicial": "tHoraInicial", "viatura": "tViatura", "box": "tBox", "kmInicial": "tKmInicial", "horaFinal": "tHoraFinal", "kmFinal": "tKmFinal"};
function terminarEdicaoTurno() {
    if (!edicaoTurno) return;
    const anterior = edicaoTurno;
    edicaoTurno = null;
    Object.entries(anterior.rascunho).forEach(([id, valor]) => { document.getElementById(id).value = valor; });
    formMeuTurno.querySelector('[type="submit"]').textContent = anterior.rotulo;
    document.getElementById('btnLimparFormTurno').textContent = anterior.limpar;
}
window.editarTurno = function(id) {
    const item = turnosSalvos.find(item => item.id === id);
    if (!item) return;
    if (edicaoTurno) {
        if (!confirm('Descartar as alterações não salvas e editar outro registro?')) return;
        terminarEdicaoTurno();
    }
    edicaoTurno = { id, rascunho: Object.fromEntries(Object.values(camposEdicaoTurno).map(id => [id, document.getElementById(id).value])),
        rotulo: formMeuTurno.querySelector('[type="submit"]').textContent,
        limpar: document.getElementById('btnLimparFormTurno').textContent };
    Object.entries(camposEdicaoTurno).forEach(([chave, id]) => {
        const campo = document.getElementById(id);
        const valor = item[chave] ?? (chave === 'corRaca' ? 'Não informado' : '');
        if (campo.tagName === 'SELECT' && valor && !Array.from(campo.options).some(opcao => opcao.value === valor)) {
            campo.add(new Option(valor, valor));
        }
        campo.value = valor;
    });
    formMeuTurno.querySelector('[type="submit"]').textContent = '💾 Salvar alterações';
    document.getElementById('btnLimparFormTurno').textContent = 'Cancelar edição';
    formMeuTurno.scrollIntoView({ block: 'start', behavior: 'smooth' });
};

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
    if (edicaoTurno) return;
    const dados = lerCamposTurno();
    const temDados = Object.values(dados).some(valor => String(valor).trim() !== "");

    if (!temDados) {
        localStorage.removeItem("meuAppTurnoAtivo");
        return;
    }

    localStorage.setItem("meuAppTurnoAtivo", JSON.stringify(dados));
}

function restaurarRascunhoTurno() {
    if (edicaoTurno) return;
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

        const editando = edicaoTurno !== null;
        if (editando) {
            const indice = turnosSalvos.findIndex(item => item.id === edicaoTurno.id);
            if (indice < 0) return alert("Registro não encontrado. Cancele a edição e tente novamente.");
            turnosSalvos[indice] = { ...turnosSalvos[indice], ...dados };
        } else {
            turnosSalvos.unshift({ id: Date.now(), ...dados });
        }
        localStorage.setItem("meuAppTurnos", JSON.stringify(turnosSalvos));

        if (editando) terminarEdicaoTurno();
        else {
            localStorage.removeItem("meuAppTurnoAtivo");
            formMeuTurno.reset();
        }
        renderizarTurnosSalvos();
        alert(editando ? "Turno atualizado!" : "Turno concluído e salvo no histórico!");
    });
}

if (btnLimparFormTurno) {
    btnLimparFormTurno.addEventListener("click", () => {
        if (!formMeuTurno) return;
        if (edicaoTurno) { terminarEdicaoTurno(); return; }
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
            <button class="botao-secundario" style="padding:8px 12px; font-size:12px;" onclick="editarTurno(${item.id})">✏️ Editar</button>
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
    if (edicaoTurno?.id === id) terminarEdicaoTurno();
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
if (!telaGastosGenerica.hidden) {
    atualizarListaGastosCategoria();
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
    ["mercado", "lazer", "transporte", "trabalho", "outros"].forEach(categoria => {

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
        assinaturas: "🔄 Assinaturas",
        trabalho: "💼 Trabalho",
        outros: "Outros"
    };

    const categorias = [
        "fixos",
        "mercado",
        "lazer",
        "transporte",
        "assinaturas",
        "trabalho",
        "outros"
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


// A data da compra é informativa; a competência parte do mês selecionado.
function competenciaDoPagamento(competenciaBase, metodo) {
    if (metodo !== "credito") return competenciaBase;
    const [ano, mes] = competenciaBase.split("-").map(Number);
    return mes === 12 ? `${ano + 1}-01` : `${ano}-${String(mes + 1).padStart(2, "0")}`;
}

function dataCompraValida(valor) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(valor)) return false;
    const [ano, mes, dia] = valor.split("-").map(Number);
    const data = new Date(ano, mes - 1, dia);
    return ano >= 1900 && data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;
}

function dataCompraInicial(competencia) {
    const hoje = new Date();
    const mesHoje = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}`;
    return competencia === mesHoje ? `${mesHoje}-${String(hoje.getDate()).padStart(2, "0")}` : `${competencia}-01`;
}

function rotuloCompetencia(competencia) {
    return competencia.split("-").reverse().join("/");
}

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

[btnMercado, btnLazer, btnFixos, btnTransporte, btnAssinaturas, btnGastosTrabalho, btnOutros].forEach(btn => {
    if (btn) {
        btn.addEventListener("click", () => abrirCategoriaGasto(btn.getAttribute("data-id")));
    }
});

if (btnNovoGastoCategoria) {
    btnNovoGastoCategoria.addEventListener("click", () => {
        if (!categoriaAtualGasto) return;
        
        const config = configCategorias[categoriaAtualGasto];
        const competenciaBase = obterCompetenciaAtual();

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
                    : categoriaAtualGasto === "outros"
                        ? "Ex: Farmácia, consulta ou presente"
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

    ${!categoriaRecorrente ? `
        <div class="campo-form" style="margin-top:12px;">
            <label for="mGastoDataCompra">Data da compra</label>
            <input type="date" id="mGastoDataCompra" value="${dataCompraInicial(competenciaBase)}" required>
        </div>
        <div class="campo-form" style="margin-top:12px;">
            <label for="mGastoPagamento">Forma de pagamento</label>
            <select id="mGastoPagamento" required>
                <option value="">Selecione</option>
                <option value="debito">Débito</option>
                <option value="pix">Pix</option>
                <option value="credito">Crédito</option>
            </select>
        </div>
        <p id="mGastoCompetencia" aria-live="polite" style="margin-top:12px; font-size:13px; color:var(--text-muted);"></p>
        <p style="margin-top:6px; font-size:12px; color:var(--text-muted);">A data registra o dia da compra. Débito/Pix entram no mês selecionado; Crédito, no seguinte.</p>
    ` : ""}
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

            if (!desc || !Number.isFinite(val) || val <= 0) {
                alert("Preencha a descrição e um valor maior que zero.");
                return false;
            }
            const dataCompra = document.getElementById("mGastoDataCompra")?.value;
            const metodoPagamento = document.getElementById("mGastoPagamento")?.value;
            if (!categoriaRecorrente && (!dataCompraValida(dataCompra || "") || !["debito", "pix", "credito"].includes(metodoPagamento))) {
                alert("Selecione uma data válida e a forma de pagamento.");
                return false;
            }

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
            
                    competencia: competenciaDoPagamento(competenciaBase, metodoPagamento),
                    competenciaOrigem: competenciaBase,
                    dataCompra,
                    metodoPagamento,
                    data: new Date().toISOString()
                });
            
            }
            localStorage.setItem("meuAppGastos", JSON.stringify(gastos));
            atualizarListaGastosCategoria();
            atualizarBalançoGeral();
            if (!categoriaRecorrente && metodoPagamento === "credito") {
                alert(`Gasto salvo em ${rotuloCompetencia(competenciaDoPagamento(competenciaBase, metodoPagamento))}. Avance para essa competência para consultá-lo.`);
            }
        });
        if (!categoriaRecorrente) {
            const pagamento = document.getElementById("mGastoPagamento");
            const atualizarPrevia = () => {
                document.getElementById("mGastoCompetencia").textContent = pagamento.value
                    ? `Será contabilizado em ${rotuloCompetencia(competenciaDoPagamento(competenciaBase, pagamento.value))}.`
                    : "Selecione a forma de pagamento para conferir a competência.";
            };
            pagamento.addEventListener("change", atualizarPrevia);
            atualizarPrevia();
        }
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
                    <strong>${escaparHTMLAcademia(item.descricao)}</strong>
                    <br>
                    ${indicadorRecorrente}
                    ${!item.recorrente ? `<small style="color:var(--text-muted);">${dataCompraValida(item.dataCompra || "") ? `Compra: ${formatarDataTurno(item.dataCompra)}` : "Data da compra não informada"} · ${{debito: "Débito", pix: "Pix", credito: "Crédito"}[item.metodoPagamento] || "Pagamento não informado"}</small>` : ""}
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

    // Encerra no mês selecionado, preservando apenas os meses anteriores.
    if (item.recorrente) {
        const competenciaAtual = obterCompetenciaAtual();
        const [ano, mes] = competenciaAtual.split("-").map(Number);
        const mesExibido = `${String(mes).padStart(2, "0")}/${ano}`;
        const confirmar = confirm(
            `Deseja encerrar "${item.descricao}" a partir de ${mesExibido}?\n\n` +
            `O gasto será excluído deste mês e dos seguintes. O histórico dos meses anteriores será mantido.`
        );
        if (!confirmar) return;

        if (competenciaParaNumero(competenciaAtual) <= competenciaParaNumero(item.competenciaInicio)) {
            gastos[categoriaAtualGasto] = itens.filter(gasto => gasto.id !== id);
        } else {
            const competenciaAnterior = mes === 1
                ? `${ano - 1}-12`
                : `${ano}-${String(mes - 1).padStart(2, "0")}`;
            // Não prolonga uma recorrência que já tenha sido encerrada antes.
            if (!item.competenciaFim ||
                competenciaParaNumero(item.competenciaFim) > competenciaParaNumero(competenciaAnterior)) {
                item.competenciaFim = competenciaAnterior;
            }
        }
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
// MÓDULO: GAMES — PROGRESSO, PLATINA E ORIGEM INDEPENDENTES
// ========================================
const gamesLista = document.getElementById("gamesLista");
const gamesFiltros = document.getElementById("gamesFiltros");
const gamesBusca = document.getElementById("gamesBusca");
const gamesOrigemFiltro = document.getElementById("gamesOrigemFiltro");
const gamesProgresso = { nao_iniciado: "Não iniciado", jogando: "Jogando", finalizado: "Finalizado", pausado: "Pausado", abandonado: "Abandonado" };
const gamesPlatina = { sem_planos: "Sem planos de platina", quero: "Quero platinar", em_andamento: "Platina em andamento", platinado: "Platinado", cancelada: "Platina cancelada", nao_aplicavel: "Sem platina / não se aplica" };
const gamesOrigens = { comprado: "Comprado", psplus: "PS Plus — resgatado", outro: "Outra origem" };
const gamesAbas = { todos: "Todos", jogando: "Jogando", finalizados: "Finalizados", quero_platinar: "Quero platinar", platinados: "Platinados", nao_iniciados: "Não iniciados", pausados: "Pausados", abandonados: "Abandonados" };
let gamesFiltroAtual = "todos";

function jogoNaAba(jogo, aba) {
    switch (aba) {
        case "jogando": return jogo.progresso === "jogando";
        case "finalizados": return jogo.progresso === "finalizado";
        case "quero_platinar": return ["quero", "em_andamento"].includes(jogo.platina);
        case "platinados": return jogo.platina === "platinado";
        case "nao_iniciados": return jogo.progresso === "nao_iniciado";
        case "pausados": return jogo.progresso === "pausado";
        case "abandonados": return jogo.progresso === "abandonado";
        default: return true;
    }
}

function textoBuscaGames(texto) {
    return String(texto ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("pt-BR");
}

function filtrarJogos(lista, aba, busca, origem) {
    const termo = textoBuscaGames(busca).trim();
    return lista.filter(jogo => jogoNaAba(jogo, aba) &&
        (origem === "todos" || jogo.origem === origem) &&
        textoBuscaGames([jogo.titulo, jogo.plataforma, jogo.genero].join(" ")).includes(termo)
    ).sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR") || a.plataforma.localeCompare(b.plataforma, "pt-BR"));
}

function renderizarGames() {
    if (!gamesLista || !gamesFiltros) return;
    const origem = gamesOrigemFiltro.value;
    const busca = gamesBusca.value;
    const base = filtrarJogos(jogos, "todos", busca, origem);
    const exibidos = base.filter(jogo => jogoNaAba(jogo, gamesFiltroAtual));
    document.getElementById("gamesResumo").textContent = `${jogos.length} jogos · ${jogos.filter(j => j.platina === "platinado").length} platinados`;
    gamesFiltros.innerHTML = Object.entries(gamesAbas).map(([chave, rotulo]) => `<button type="button" data-games-filtro="${chave}" aria-pressed="${gamesFiltroAtual === chave}">${rotulo} <span>${base.filter(j => jogoNaAba(j, chave)).length}</span></button>`).join("");
    document.getElementById("gamesResultado").textContent = `${exibidos.length} jogo(s) nesta seleção. As contagens podem se sobrepor entre progresso e platina.`;
    if (!exibidos.length) {
        gamesLista.innerHTML = `<div class="games-vazio">${jogos.length ? "Nenhum jogo nesta seleção. Experimente outra aba, origem ou busca." : "Seu acervo começa aqui. Toque em Adicionar jogo para cadastrar o primeiro."}</div>`;
        return;
    }
    const esc = escaparHTMLAcademia;
    gamesLista.innerHTML = exibidos.map(jogo => `
        <article class="games-card">
            <h3>${esc(jogo.titulo)}</h3>
            <p class="games-meta">${esc(jogo.plataforma)}${jogo.genero ? ` · ${esc(jogo.genero)}` : ""}</p>
            <div class="games-etiquetas"><span>${esc(gamesProgresso[jogo.progresso])}</span><span${jogo.platina === "platinado" ? ' class="games-platina"' : ""}>${esc(gamesPlatina[jogo.platina])}</span><span>${esc(gamesOrigens[jogo.origem])}</span></div>
            ${jogo.observacoes ? `<details class="games-notas"><summary>Anotações</summary><p>${esc(jogo.observacoes)}</p></details>` : ""}
            <div class="games-acoes"><button type="button" class="botao-secundario" data-games-editar="${esc(jogo.id)}" aria-label="Editar ${esc(jogo.titulo)}">Editar</button><button type="button" class="botao-secundario" data-games-excluir="${esc(jogo.id)}" aria-label="Excluir ${esc(jogo.titulo)}">Excluir</button></div>
        </article>`).join("");
}

function salvarJogos(novaLista) {
    // Só atualiza a memória depois que a gravação local for bem-sucedida.
    localStorage.setItem("meuAppJogos", JSON.stringify(novaLista));
    jogos = novaLista;
    renderizarGames();
}

function opcoesGames(opcoes, selecionada) {
    return Object.entries(opcoes).map(([valor, rotulo]) => `<option value="${valor}"${valor === selecionada ? " selected" : ""}>${escaparHTMLAcademia(rotulo)}</option>`).join("");
}

function abrirFormularioJogo(jogo = null) {
    const esc = escaparHTMLAcademia;
    abrirModal(jogo ? "Editar jogo" : "Adicionar jogo", `
        <div class="games-form">
            <div class="campo-form"><label for="gameTitulo">Nome do jogo *</label><input id="gameTitulo" type="text" maxlength="160" value="${esc(jogo?.titulo)}" placeholder="Ex: The Witcher 3" required></div>
            <div class="campo-form"><label for="gamePlataforma">Plataforma / versão *</label><input id="gamePlataforma" type="text" maxlength="80" value="${esc(jogo?.plataforma)}" placeholder="Ex: PS5, PS4 ou PC" required><small>Cadastre versões separadas se quiser acompanhar platinas diferentes.</small></div>
            <div class="campo-form"><label for="gameGenero">Gênero</label><input id="gameGenero" type="text" maxlength="80" value="${esc(jogo?.genero)}" placeholder="Ex: RPG, ação, aventura"></div>
            <div class="campo-form"><label for="gameOrigem">Origem *</label><select id="gameOrigem" required><option value="">Selecione</option>${opcoesGames(gamesOrigens, jogo?.origem)}</select></div>
            <p class="games-ajuda">PS Plus significa resgatado pela assinatura. Isso não marca o jogo como comprado, jogando ou com intenção de platinar.</p>
            <div class="campo-form"><label for="gameProgresso">Progresso</label><select id="gameProgresso">${opcoesGames(gamesProgresso, jogo?.progresso || "nao_iniciado")}</select></div>
            <div class="campo-form"><label for="gamePlatina">Platina</label><select id="gamePlatina">${opcoesGames(gamesPlatina, jogo?.platina || "sem_planos")}</select></div>
            <p class="games-ajuda">Finalizar e platinar são coisas distintas: você pode marcar Finalizado e manter a platina em andamento.</p>
            <div class="campo-form"><label for="gameObservacoes">Anotações</label><textarea id="gameObservacoes" rows="4" maxlength="5000" placeholder="Troféus pendentes, dicas ou onde parei...">${esc(jogo?.observacoes)}</textarea></div>
        </div>`, () => {
        const valor = id => document.getElementById(id).value.trim();
        const registro = {
            id: jogo?.id || gerarIdAcademia(),
            titulo: valor("gameTitulo"), plataforma: valor("gamePlataforma"), genero: valor("gameGenero"),
            origem: valor("gameOrigem"), progresso: valor("gameProgresso"), platina: valor("gamePlatina"),
            observacoes: valor("gameObservacoes"),
            criadoEm: jogo?.criadoEm || new Date().toISOString(), atualizadoEm: new Date().toISOString()
        };
        if (!validarJogosBackup([registro])) {
            alert("Informe nome, plataforma e origem válidos e confira os demais campos.");
            return false;
        }
        salvarJogos(jogo ? jogos.map(item => item.id === jogo.id ? registro : item) : [...jogos, registro]);
        if (!filtrarJogos([registro], gamesFiltroAtual, gamesBusca.value, gamesOrigemFiltro.value).length) {
            document.getElementById("gamesResultado").textContent = "Jogo salvo. Ele não aparece nos filtros atuais; consulte Todos, Todas as origens e limpe a busca para encontrá-lo.";
        }
    });
}

function validarJogosBackup(lista) {
    const texto = (valor, limite, obrigatorio = false) => typeof valor === "string" && valor.length <= limite && (!obrigatorio || valor.trim().length > 0);
    return Array.isArray(lista) && lista.every(jogo => jogo &&
        texto(jogo.id, 160, true) && texto(jogo.titulo, 160, true) && texto(jogo.plataforma, 80, true) &&
        texto(jogo.genero, 80) && texto(jogo.observacoes, 5000) &&
        Object.hasOwn(gamesOrigens, jogo.origem) && Object.hasOwn(gamesProgresso, jogo.progresso) && Object.hasOwn(gamesPlatina, jogo.platina)
    ) && new Set(lista.map(jogo => jogo.id)).size === lista.length;
}

[btnGames, tabGames].forEach(botao => botao?.addEventListener("click", () => {
    mostrarTela(telaGames, tabGames);
    renderizarGames();
}));
document.getElementById("btnNovoJogo")?.addEventListener("click", () => abrirFormularioJogo());
gamesBusca?.addEventListener("input", renderizarGames);
gamesOrigemFiltro?.addEventListener("change", renderizarGames);
gamesFiltros?.addEventListener("click", event => {
    const botao = event.target.closest("[data-games-filtro]");
    if (!botao) return;
    gamesFiltroAtual = botao.dataset.gamesFiltro;
    renderizarGames();
    gamesFiltros.querySelector(`[data-games-filtro="${gamesFiltroAtual}"]`)?.focus({ preventScroll: true });
});
gamesLista?.addEventListener("click", event => {
    const botao = event.target.closest("[data-games-editar], [data-games-excluir]");
    if (!botao) return;
    const jogo = jogos.find(item => item.id === (botao.dataset.gamesEditar || botao.dataset.gamesExcluir));
    if (!jogo) return;
    if (botao.dataset.gamesEditar) { abrirFormularioJogo(jogo); return; }
    if (confirm(`Excluir “${jogo.titulo}” (${jogo.plataforma})? Isso remove somente este registro de Games.`)) {
        try { salvarJogos(jogos.filter(item => item.id !== jogo.id)); }
        catch (erro) { console.error(erro); alert("Não foi possível salvar a exclusão. O jogo foi mantido."); }
    }
});

// ========================================
// 10. MÓDULO: CONFIGURAÇÕES & BACKUP
// ========================================

function aplicarModulosOcultos() {
    const ocultos = new Set(modulosOcultos);
    document.querySelectorAll("[data-modulo]").forEach(el => { el.hidden = ocultos.has(el.dataset.modulo); });
    const caixas = { trabalho: "mostrarModuloTrabalho", financas: "mostrarModuloFinancas", academia: "mostrarModuloAcademia", games: "mostrarModuloGames" };
    Object.entries(caixas).forEach(([modulo, id]) => {
        const caixa = document.getElementById(id);
        if (caixa) caixa.checked = !ocultos.has(modulo);
    });
}

["trabalho", "financas", "academia", "games"].forEach(modulo => {
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
            gastos: gastos,
            qualificacoes: JSON.parse(localStorage.getItem("meuAppQualificacoes")) || [],
            turnos: JSON.parse(localStorage.getItem("meuAppTurnos")) || [],
            reds: JSON.parse(localStorage.getItem("meuAppReds")) || [],
            veiculosFiscalizados: JSON.parse(localStorage.getItem("meuAppVeiculos")) || [],
            fichasAcademia: JSON.parse(localStorage.getItem("meuAppFichasAcademia")) || [],
            jogos: jogos,
            modulosOcultos: JSON.parse(localStorage.getItem("meuAppModulosOcultos")) || [],
            turnoAtivo: JSON.parse(localStorage.getItem("meuAppTurnoAtivo")) || null,
            dataExportacao: new Date().toISOString(),
            ordemFinancas: [...ordemFinancas],
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
                if (Object.prototype.hasOwnProperty.call(dados, "jogos") && !validarJogosBackup(dados.jogos)) {
                    throw new Error("Dados de Games inválidos no backup.");
                }
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
                    // Backups antigos sem Games mantêm os jogos já cadastrados.
                    if (Array.isArray(dados.jogos)) localStorage.setItem("meuAppJogos", JSON.stringify(dados.jogos));
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

// Alterar junto com APP_VERSION em sw.js em cada publicação.
const APP_VERSION = "18.0";
const btnAtualizarApp = document.getElementById("btnAtualizarApp");
const statusAtualizacao = document.getElementById("statusAtualizacao");
const versaoApp = document.getElementById("versaoApp");
if (versaoApp) versaoApp.textContent = `Versão instalada: ${APP_VERSION}`;
let registroAppPromise = null;
let buscandoAtualizacao = false;

function informarAtualizacao(texto) {
    if (statusAtualizacao) statusAtualizacao.textContent = texto;
}

function registrarApp() {
    if (!registroAppPromise) {
        registroAppPromise = navigator.serviceWorker.register("./sw.js", { updateViaCache: "none" }).then(reg => {
            const avisar = () => {
                if (reg.waiting && !buscandoAtualizacao) informarAtualizacao("Nova versão pronta. Toque em Buscar atualização para aplicar.");
            };
            reg.addEventListener("updatefound", () => reg.installing?.addEventListener("statechange", avisar));
            avisar();
            return reg;
        }).catch(erro => { registroAppPromise = null; throw erro; });
    }
    return registroAppPromise;
}

function limitarEspera(promessa, ms = 25000) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => reject(new Error("Tempo de espera excedido.")), ms);
        promessa.then(valor => { clearTimeout(timer); resolve(valor); }, erro => { clearTimeout(timer); reject(erro); });
    });
}

function aguardarInstalacao(worker) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => terminar(new Error("Download ainda não concluído.")), 30000);
        function terminar(erro) {
            clearTimeout(timer); worker.removeEventListener("statechange", verificar);
            if (erro) reject(erro); else resolve();
        }
        function verificar() {
            if (["installed", "activating", "activated"].includes(worker.state)) terminar();
            else if (worker.state === "redundant") terminar(new Error("Falha ao baixar a versão completa."));
        }
        worker.addEventListener("statechange", verificar);
        verificar();
    });
}

function consultarVersaoWorker(worker) {
    return new Promise((resolve, reject) => {
        const canal = new MessageChannel();
        const fechar = () => { clearTimeout(timer); canal.port1.close(); canal.port2.close(); };
        const timer = setTimeout(() => { fechar(); reject(new Error("Não foi possível confirmar a versão.")); }, 5000);
        canal.port1.onmessage = evento => { fechar(); resolve(evento.data?.version); };
        try { worker.postMessage({ type: "GET_VERSION" }, [canal.port2]); }
        catch (erro) { fechar(); reject(erro); }
    });
}

function ativarAtualizacao(worker) {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => terminar(new Error("Ativação não confirmada.")), 20000);
        function terminar(erro) {
            clearTimeout(timer); navigator.serviceWorker.removeEventListener("controllerchange", verificar);
            if (erro) reject(erro); else resolve();
        }
        function verificar() { if (navigator.serviceWorker.controller === worker) terminar(); }
        navigator.serviceWorker.addEventListener("controllerchange", verificar);
        try { worker.postMessage({ type: "SKIP_WAITING" }); verificar(); }
        catch (erro) { terminar(erro); }
    });
}

async function buscarAtualizacaoApp() {
    if (buscandoAtualizacao) return;
    if (!("serviceWorker" in navigator)) { informarAtualizacao("Abra o app pelo endereço publicado no Safari ou pelo ícone da tela inicial para atualizar."); return; }
    if (navigator.onLine === false) { informarAtualizacao("Você está offline. Conecte-se à internet para buscar atualizações. O app continua disponível."); return; }
    buscandoAtualizacao = true;
    if (btnAtualizarApp) btnAtualizarApp.disabled = true;
    informarAtualizacao("Buscando atualização…");
    try {
        const reg = await limitarEspera(registrarApp());
        if (!reg.waiting) await limitarEspera(reg.update());
        if (reg.installing) { informarAtualizacao("Baixando a nova versão…"); await aguardarInstalacao(reg.installing); }
        const worker = reg.waiting || reg.active;
        if (!worker) throw new Error("Preparação offline ainda não concluída.");
        const versao = await consultarVersaoWorker(worker);
        if (!versao) throw new Error("Versão não identificada.");
        if (!reg.waiting && versao === APP_VERSION && navigator.serviceWorker.controller === worker) {
            informarAtualizacao(`Você já está na versão mais recente disponível (${APP_VERSION}).`); return;
        }
        informarAtualizacao(`Versão ${versao} pronta para aplicar.`);
        if (!confirm(`Aplicar a versão ${versao} agora? O app será recarregado.\n\nSeus registros salvos serão mantidos. Salve antes qualquer preenchimento ainda não concluído.`)) {
            informarAtualizacao("Atualização pronta. Toque em Buscar atualização quando quiser aplicar."); return;
        }
        informarAtualizacao("Aplicando atualização…");
        if (navigator.serviceWorker.controller !== worker) await ativarAtualizacao(worker);
        window.location.reload();
    } catch (erro) {
        console.error("[PWA] Atualização:", erro);
        informarAtualizacao("Não foi possível concluir a atualização. Confira a conexão e tente novamente. Se persistir, feche e reabra o app. Seus dados salvos foram mantidos.");
    } finally {
        buscandoAtualizacao = false;
        if (btnAtualizarApp) btnAtualizarApp.disabled = false;
    }
}

btnAtualizarApp?.addEventListener("click", buscarAtualizacaoApp);
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => registrarApp().catch(erro => console.log("[PWA] Registro indisponível:", erro)));
}

document.addEventListener("DOMContentLoaded", () => {
    aplicarModulosOcultos();
    mostrarTela(telaInicio, tabInicio);

    atualizarMesFinanceiro();

    console.log("App com layout nativo iOS carregado!");
});
