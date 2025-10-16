// ===== CONFIGURE O NÚMERO QUE RECEBERÁ OS LEADS =====
const WAPP_DESTINO = '5581996221060'; // DDI + DDD + número (apenas dígitos)

const $ = sel => document.querySelector(sel);
const form = $('#leadForm');
const okEl = $('#leadOk');
const errEl = $('#leadErr');
const linkFallback = $('#leadLinkFallback');
const btnZapTopo = $('#btnZapTopo');
const btnZapBox = $('#btnZapBox');

function digits(s) { return (s || '').replace(/\D+/g, ''); }

function montarMensagemLead(data) {
    const { nome, tel, email, nivel, horario, msg } = data;
    const linhas = [
        '👋 *Novo interesse no Curso de Barbeiro*',
        `• *Nome:* ${nome}`,
        `• *Telefone:* ${tel}`,
        email ? `• *E-mail:* ${email}` : null,
        `• *Nível:* ${nivel}`,
        `• *Horário:* ${horario}`,
        msg ? `• *Mensagem:* ${msg}` : null
    ].filter(Boolean);

    return encodeURIComponent(linhas.join('\\n'));
}

function abrirZapComMensagem(data) {
    const texto = montarMensagemLead(data);
    const url = `https://wa.me/${WAPP_DESTINO}?text=${texto}`;
    try {
        // abre no mesmo contexto (menos chance de bloqueio no mobile)
        window.location.href = url;
    } catch (_) { }
    // mostra fallback clicável
    okEl.style.display = 'block';
    linkFallback.href = url;
}

// Botões diretos para WhatsApp (sem formulário)
function abrirZapDireto() {
    const texto = encodeURIComponent('Olá! Quero saber mais sobre o *Curso de Barbeiro* da RA Barbearia.');
    const url = `https://wa.me/${WAPP_DESTINO}?text=${texto}`;
    window.location.href = url;
}
btnZapTopo?.addEventListener('click', (e) => { e.preventDefault(); abrirZapDireto(); });
btnZapBox?.addEventListener('click', (e) => { e.preventDefault(); abrirZapDireto(); });

// Envio do formulário -> WhatsApp
form?.addEventListener('submit', (e) => {
    e.preventDefault();
    errEl.style.display = 'none'; okEl.style.display = 'none';

    const nome = $('#leadNome').value.trim();
    const tel = $('#leadTel').value.trim();
    const email = $('#leadEmail').value.trim();
    const nivel = $('#leadNivel').value;
    const horario = $('#leadHorario').value;
    const msg = $('#leadMsg').value.trim();

    if (!nome || !tel) {
        errEl.style.display = 'block';
        errEl.textContent = 'Preencha nome e telefone.';
        return;
    }

    abrirZapComMensagem({ nome, tel, email, nivel, horario, msg });
});