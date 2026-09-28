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
const telaEntradas = document.getElementById("telaEntradas");
const telaCartao = document.getElementById("telaCartao");
const telaGastosGenerica = document.getElementById("telaGastosGenerica");
const telaConfiguracoes = document.getElementById("telaConfiguracoes");

const todasTelas = [
    telaInicio, telaTrabalho, telaQualificacao, telaMeuTurno,
    telaFinancas, telaEntradas, telaCartao, telaGastosGenerica,
    telaConfiguracoes
];

// Botões Principais da Tela Inicial
const btnTrabalho = document.getElementById("btnTrabalho");
const btnFinancas = document.getElementById("btnFinancas");
const btnConfiguracoes = document.getElementById("btnConfiguracoes");

// Botões do Submenu Trabalho
const btnQualificacao = document.getElementById("btnQualificacao");
const btnMeuTurno = document.getElementById("btnMeuTurno");
const btnVoltarTrabalhoQualificacao = document.getElementById("btnVoltarTrabalhoQualificacao");
const btnVoltarTrabalhoTurno = document.getElementById("btnVoltarTrabalhoTurno");

// Botões do Submenu Finanças
const btnsVoltarFinancas = document.querySelectorAll(".btn-voltar-financas");
const btnEntrada = document.getElementById("btnEntrada");
const btnCartao = document.getElementById("btnCartao");
const btnFixos = document.getElementById("btnFixos");
const btnMercado = document.getElementById("btnMercado");
const btnTransporte = document.getElementById("btnTransporte");
const btnLazer = document.getElementById("btnLazer");
const btnAssinaturas = document.getElementById("btnAssinaturas");

// Tab Bar
const tabInicio = document.getElementById("tabInicio");
const tabTrabalho = document.getElementById("tabTrabalho");
const tabFinancas = document.getElementById("tabFinancas");
const tabConfiguracoes = document.getElementById("tabConfiguracoes");
const todasTabs = [tabInicio, tabTrabalho, tabFinancas, tabConfiguracoes];

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
        renderizarTurnosSalvos();
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
        if (acaoModalAtual) acaoModalAtual();
        fecharModal();
    });
}


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
// 6. MÓDULO: MEU TURNO
// ========================================

const formMeuTurno = document.getElementById("formMeuTurno");
const btnCopiarTurno = document.getElementById("btnCopiarTurno");
const btnLimparFormTurno = document.getElementById("btnLimparFormTurno");

function obterDadosTurnoForm() {
    const kmInicial = parseFloat(document.getElementById("tKmInicial")?.value) || 0;
    const kmFinal = parseFloat(document.getElementById("tKmFinal")?.value) || 0;
    const kmRodado = kmFinal >= kmInicial && kmInicial > 0 ? kmFinal - kmInicial : 0;

    return {
        viatura: document.getElementById("tViatura")?.value.trim() || "",
        box: document.getElementById("tBox")?.value.trim() || "",
        kmInicial: document.getElementById("tKmInicial")?.value.trim() || "",
        kmFinal: document.getElementById("tKmFinal")?.value.trim() || "",
        kmRodado: kmRodado,
        data: new Date().toLocaleDateString("pt-BR")
    };
}

function gerarTextoTurno(d) {
    return `*REGISTRO DE TURNO*
📅 Data: ${d.data}
🚔 Viatura: ${d.viatura || "N/I"}
📍 Box/Setor: ${d.box || "N/I"}
🏎️ KM Inicial: ${d.kmInicial || "N/I"}
🏁 KM Final: ${d.kmFinal || "N/I"}
📊 KM Rodado: ${d.kmRodado} km`;
}

if (btnCopiarTurno) {
    btnCopiarTurno.addEventListener("click", () => {
        const dados = obterDadosTurnoForm();
        if (!dados.viatura && !dados.box) return alert("Preencha ao menos a Viatura ou o Box.");
        copiarTextoFormatado(gerarTextoTurno(dados), "Resumo do turno copiado!");
    });
}

if (formMeuTurno) {
    formMeuTurno.addEventListener("submit", (e) => {
        e.preventDefault();
        const dados = obterDadosTurnoForm();
        if (!dados.viatura && !dados.box) return alert("Preencha os dados do turno antes de salvar.");

        turnosSalvos.unshift({ id: Date.now(), ...dados });
        localStorage.setItem("meuAppTurnos", JSON.stringify(turnosSalvos));

        formMeuTurno.reset();
        renderizarTurnosSalvos();
        alert("Turno salvo!");
    });
}

if (btnLimparFormTurno) {
    btnLimparFormTurno.addEventListener("click", () => formMeuTurno && formMeuTurno.reset());
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
                <strong>🚔 ${item.viatura || "Viatura N/I"} (${item.data})</strong>
                <button class="botao-excluir" onclick="excluirTurno(${item.id})">✕ Excluir</button>
            </div>
            <p style="font-size:13px; color:var(--text-muted);">Box/Setor: ${item.box || "N/I"}</p>
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
// 7. MÓDULO: FINANÇAS & BALANÇO (COM BARRA)
// ========================================

function calcularTotalEntradas() {
    return entradas.reduce((acc, item) => acc + Number(item.valor), 0);
}

function calcularTotalParcelasCartaoMes() {
    return comprasCartao.reduce((acc, item) => acc + (Number(item.valorTotal) / Number(item.parcelas)), 0);
}

function calcularTotalGastosCategorias() {
    let total = 0;
    Object.keys(gastos).forEach(cat => {
        total += gastos[cat].reduce((acc, item) => acc + Number(item.valor), 0);
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

            entradas.push({ id: Date.now(), descricao: desc, valor: val });
            localStorage.setItem("meuAppEntradas", JSON.stringify(entradas));
            atualizarListaEntradas();
        });
    });
}

function atualizarListaEntradas() {
    const lista = document.getElementById("listaEntradas");
    const total = document.getElementById("totalEntradas");
    if (!lista || !total) return;

    lista.innerHTML = "";
    const totalValor = calcularTotalEntradas();

    if (entradas.length === 0) {
        lista.innerHTML = `<p style="text-align:center; opacity:0.6; padding:1rem;">Nenhuma entrada registrada.</p>`;
    } else {
        entradas.forEach(item => {
            const div = document.createElement("div");
            div.className = "lancamento";
            div.innerHTML = `
                <div><strong>${item.descricao}</strong></div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="color:var(--success); font-weight:600;">${formatarMoeda(Number(item.valor))}</span>
                    <button class="botao-excluir" onclick="excluirEntrada(${item.id})">✕</button>
                </div>
            `;
            lista.appendChild(div);
        });
    }

    total.textContent = formatarMoeda(totalValor);
}

window.excluirEntrada = function(id) {
    entradas = entradas.filter(item => item.id !== id);
    localStorage.setItem("meuAppEntradas", JSON.stringify(entradas));
    atualizarListaEntradas();
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
                <input type="number" id="mCompraParcelas" value="2" min="1">
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
                cartao: cartaoSel
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

        const comprasDoCartao = comprasCartao.filter(c => c.cartao === cartao);
        let subtotalCartaoMes = 0;

        let comprasHTML = "";
        if (comprasDoCartao.length === 0) {
            comprasHTML = `<p style="font-size:13px; color:var(--text-muted); margin-top:8px;">Nenhuma compra neste cartão.</p>`;
        } else {
            comprasDoCartao.forEach(compra => {
                const valorParcela = compra.valorTotal / compra.parcelas;
                subtotalCartaoMes += valorParcela;

                comprasHTML += `
                    <div class="lancamento" style="margin-top:8px;">
                        <div>
                            <strong>${compra.descricao}</strong><br>
                            <small style="color:var(--text-muted);">${compra.parcelas}x de ${formatarMoeda(valorParcela)}</small>
                        </div>
                        <button class="botao-excluir" onclick="excluirCompraCartao(${compra.id})">✕</button>
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

window.excluirCartao = function(nomeCartao) {
    if (!confirm(`Deseja apagar o cartão "${nomeCartao}"?`)) return;
    cartoes = cartoes.filter(c => c !== nomeCartao);
    comprasCartao = comprasCartao.filter(c => c.cartao !== nomeCartao);

    localStorage.setItem("meuAppCartoes", JSON.stringify(cartoes));
    localStorage.setItem("meuAppComprasCartao", JSON.stringify(comprasCartao));
    renderizarCartoesECompras();
    atualizarBalançoGeral();
};

window.excluirCompraCartao = function(id) {
    comprasCartao = comprasCartao.filter(c => c.id !== id);
    localStorage.setItem("meuAppComprasCartao", JSON.stringify(comprasCartao));
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

        const html = `
            <div class="campo-form" style="margin-bottom:12px;">
                <label>Descrição</label>
                <input type="text" id="mGastoDesc" placeholder="Ex: Compra quinzenal">
            </div>
            <div class="campo-form">
                <label>Valor (R$)</label>
                <input type="number" step="0.01" id="mGastoValor" placeholder="Ex: 150.00">
            </div>
        `;

        abrirModal(`Novo Gasto em ${config.titulo}`, html, () => {
            const desc = document.getElementById("mGastoDesc")?.value.trim();
            const val = parseFloat(document.getElementById("mGastoValor")?.value);

            if (!desc || isNaN(val) || val <= 0) return alert("Preencha os campos corretamente.");

            gastos[categoriaAtualGasto].push({ id: Date.now(), descricao: desc, valor: val });
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

    lista.innerHTML = "";
    const itens = gastos[categoriaAtualGasto] || [];
    const total = itens.reduce((acc, item) => acc + Number(item.valor), 0);

    if (itens.length === 0) {
        lista.innerHTML = `<p style="text-align:center; opacity:0.6; padding:1rem;">Nenhum gasto registrado.</p>`;
    } else {
        itens.forEach(item => {
            const div = document.createElement("div");
            div.className = "lancamento";
            div.innerHTML = `
                <div><strong>${item.descricao}</strong></div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <span style="font-weight:600;">${formatarMoeda(Number(item.valor))}</span>
                    <button class="botao-excluir" onclick="excluirGastoCategoria(${item.id})">✕</button>
                </div>
            `;
            lista.appendChild(div);
        });
    }

    elTotal.textContent = formatarMoeda(total);
}

window.excluirGastoCategoria = function(id) {
    if (!categoriaAtualGasto) return;
    gastos[categoriaAtualGasto] = gastos[categoriaAtualGasto].filter(item => item.id !== id);
    localStorage.setItem("meuAppGastos", JSON.stringify(gastos));
    atualizarListaGastosCategoria();
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
// 8. MÓDULO: CONFIGURAÇÕES & BACKUP
// ========================================

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
            dataExportacao: new Date().toISOString()
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
// 9. REGISTRO DE SERVICE WORKER & INICIALIZAÇÃO
// ========================================

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./sw.js")
            .then(reg => console.log("[PWA] Service Worker registrado com sucesso:", reg.scope))
            .catch(err => console.log("[PWA] Falha ao registrar Service Worker:", err));
    });
}

document.addEventListener("DOMContentLoaded", () => {
    mostrarTela(telaInicio, tabInicio);
    console.log("App com layout nativo iOS carregado!");
});
