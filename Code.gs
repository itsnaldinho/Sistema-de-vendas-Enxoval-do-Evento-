// ===== CONFIGURAÇÕES =====
const FOLDER_ID = '1NyqFY32LFX_YKdFieCpUWeW5ZN7Qtz2K'; // Pasta dos comprovantes
const ADMIN_EMAIL = "silva.patrickdasilva.patrick@gmail.com,patrick.silva@escoteiros.org.br";
const ADMIN_USER = 'patrick';
const ADMIN_PASS = '115tiradentes';
const CONTATO_NOME = 'Patrick Silva';
const CONTATO_TELEFONE = '38 9914-1153';
const CONTATO_DISTRITO = 'DNM - Distrito Norte Minas';

const EVENTO = 'XIV ELobin 2026';
const DISTRITO_FIXO = 'DNM - Distrito Norte Minas';
const PRECO_CAMISA = 38;
const PRECO_MEIA = 14;
const TAMANHOS = ['P', 'M', 'G', 'GG', 'EXG', 'Outra'];
// ===== PRAZO FINAL DOS PEDIDOS (mês começa em 0: 9 = outubro) =====
const PRAZO_FINAL = new Date(2026, 9, 19, 23, 59, 59);
const PRAZO_TXT = '19/10/2026';
const GRUPOS = ['19', '92', '99', '115', '140', '146', '170', '179', '223'];
// Imagens do Drive (lidas pelo servidor, não precisam ser públicas)
const IMG_IDS = {
  camisa: '1Xz_VW59Ug-iw019zsqpg9rfQ6AkLTegi',
  meia: '1bMig5Gw7KOy2IZMBo2aug-fill1IaUS-',
  pix: '1B81X8mY1r2oJMnYoR-v0zuVJ4Yk7kcmS'
};

// Devolve as imagens como data URI para o formulário (funciona em qualquer navegador)
function getImagens() {
  const out = {};
  Object.keys(IMG_IDS).forEach(function(k) {
    try {
      const b = DriveApp.getFileById(IMG_IDS[k]).getBlob();
      out[k] = 'data:' + b.getContentType() + ';base64,' + Utilities.base64Encode(b.getBytes());
    } catch (e) { out[k] = ''; }
  });
  return out;
}

// Imagem inline para os e-mails
function getLogoEmail() {
  return DriveApp.getFileById(IMG_IDS.camisa).getBlob().setName('logoCamisa');
}

function doGet(e) {
  if (e.parameter.page === 'admin') {
    return HtmlService.createHtmlOutputFromFile('admin')
      .setTitle('Admin - Enxoval ' + EVENTO)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Pedido - Enxoval ' + EVENTO)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function checkAdminLogin(user, pass) { return (user === ADMIN_USER && pass === ADMIN_PASS); }

function getContatoInfo() {
  return { nome: CONTATO_NOME, telefone: CONTATO_TELEFONE, distrito: CONTATO_DISTRITO };
}

function getExtensionFromMime(mime) {
  const map = { 'application/pdf': 'pdf', 'image/png': 'png', 'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/webp': 'webp' };
  return map[mime] || 'dat';
}

// ===== E-MAIL =====
const COR_AZUL = '#0033A0', COR_VERDE = '#00853F', COR_AMARELO = '#FFDF00';

function emailWrapper(titulo, conteudo) {
  return '<div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:0 auto;background:#f0f4f8;padding:24px 0;">' +
    '<div style="background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.08);">' +
    '<div style="background:linear-gradient(135deg,' + COR_AZUL + ',#0052cc);padding:28px 24px;text-align:center;">' +
    '<img src="cid:logoCamisa" alt="Enxoval" style="width:110px;border-radius:10px;border:3px solid #fff;margin-bottom:12px;">' +
    '<div style="color:' + COR_AMARELO + ';font-size:20px;font-weight:700;">' + titulo + '</div></div>' +
    '<div style="padding:28px 26px;color:#333;font-size:14px;line-height:1.6;">' + conteudo + '</div>' +
    '<div style="background:#f7f9fc;padding:20px 26px;text-align:center;">' +
    '<div style="font-size:12px;color:#888;margin-bottom:14px;">DNM &bull; Distrito Norte Minas &bull; ' + EVENTO + '</div>' +
    '<div style="border-top:1px solid #e2e6ec;padding-top:14px;">' +
    '<div style="font-size:13px;font-weight:700;">' + CONTATO_NOME + '</div>' +
    '<div style="font-size:12px;color:#666;">patrick.silva@escoteiros.org.br</div>' +
    '<div style="font-size:12px;color:#666;">' + CONTATO_TELEFONE + '</div></div></div></div></div>';
}

function linhaResumo(label, valor) {
  return '<tr><td style="padding:8px 0;color:#666;font-size:13px;width:35%;vertical-align:top;">' + label + '</td>' +
    '<td style="padding:8px 0;color:#222;font-size:14px;font-weight:600;">' + valor + '</td></tr>';
}

function fmtMoeda(v) { return 'R$ ' + v.toFixed(2).replace('.', ','); }

function buildUserEmailHtml(data, itensHtml, total) {
  let c = '<p style="font-size:16px;margin:0 0 4px;">Olá, <strong>' + data.nome + '</strong>! Sempre Alerta! 🏕️</p>';
  c += '<p style="margin:0 0 20px;">Recebemos o seu pedido do enxoval do <strong>' + EVENTO + '</strong>.</p>';
  c += '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafc;border-radius:10px;padding:16px 18px;margin-bottom:18px;">';
  c += linhaResumo('Grupo', data.grupo) + linhaResumo('Itens', itensHtml) + linhaResumo('Valor Total', fmtMoeda(total));
  c += linhaResumo('Entrega', 'Retirada pessoalmente') + '</table>';
  c += '<p style="margin:0 0 12px;">Seu pagamento será conferido e o pedido confirmado. A retirada é feita pessoalmente, e avisaremos o local e a data.</p>';
  c += '<p style="margin:0;">Obrigado por fortalecer o nosso Distrito! 💙💚</p>';
  return emailWrapper('Pedido Confirmado', c);
}

function buildAdminEmailHtml(data, itensHtml, total, fileUrl, adminUrl) {
  let c = '<p style="margin:0 0 16px;">Novo pedido realizado. <strong>Verifique se o valor do PIX confere.</strong></p>';
  c += '<table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafc;border-radius:10px;padding:16px 18px;margin-bottom:18px;">';
  c += linhaResumo('Nome', data.nome) + linhaResumo('E-mail', data.email) + linhaResumo('Telefone', data.telefone);
  c += linhaResumo('Grupo', data.grupo) + linhaResumo('Itens', itensHtml) + linhaResumo('Valor Declarado', fmtMoeda(total)) + '</table>';
  c += '<div style="text-align:center;margin:20px 0;">' +
    '<a href="' + fileUrl + '" style="display:inline-block;background:' + COR_AZUL + ';color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;font-size:13px;margin:4px;">📎 Ver Comprovante</a>' +
    '<a href="' + adminUrl + '" style="display:inline-block;background:' + COR_VERDE + ';color:#fff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;font-size:13px;margin:4px;">📋 Abrir Painel Admin</a></div>';
  return emailWrapper('Novo Pedido Recebido', c);
}

// ===== PROCESSAMENTO =====
// data: {nome,email,telefone,grupo,camisas:[{tamanho,qtd}],meias,fileData,fileMimeType}
function processForm(data) {
  try {
    if (new Date() > PRAZO_FINAL) throw new Error('Pedidos encerrados em ' + PRAZO_TXT + '.');
    if (GRUPOS.indexOf(String(data.grupo)) === -1) throw new Error('Grupo inválido.');

    // Recalcula tudo no servidor (não confia no valor vindo do navegador)
    const camisas = (data.camisas || []).map(function(c) {
      return { tamanho: String(c.tamanho).substring(0, 40), qtd: parseInt(c.qtd, 10) || 0 };
    }).filter(function(c) { return c.qtd > 0; });
    const meias = parseInt(data.meias, 10) || 0;
    const qtdCamisas = camisas.reduce(function(s, c) { return s + c.qtd; }, 0);
    if (qtdCamisas + meias === 0) throw new Error('Nenhum item no pedido.');

    const total = qtdCamisas * PRECO_CAMISA + meias * PRECO_MEIA;
    const partes = camisas.map(function(c) { return 'Camisa ' + c.tamanho + ' x' + c.qtd; });
    if (meias > 0) partes.push('Meia x' + meias);
    const itensTexto = partes.join(' | ');
    const itensHtml = partes.join('<br>');

    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const ext = getExtensionFromMime(data.fileMimeType);
    const fileBlob = Utilities.newBlob(Utilities.base64Decode(data.fileData), data.fileMimeType,
      'Comprovante_' + data.nome + '_' + data.telefone + '.' + ext);
    const fileUrl = folder.createFile(fileBlob).getUrl();

    // Colunas: Data | Nome | Email | Telefone | Distrito | Grupo | Entrega | CEP | Endereço |
    // Número | Complemento (=ITENS DO PEDIDO) | Bairro | Cidade | Estado | Quantidade (total de peças) | Valor | Comprovante | Status
    sheet.appendRow([
      new Date(), data.nome, data.email, data.telefone, DISTRITO_FIXO, data.grupo, 'Retirada',
      '-', '-', '-', itensTexto, '-', '-', '-',
      qtdCamisas + meias, total, fileUrl, 'Pendente'
    ]);

    const adminUrl = ScriptApp.getService().getUrl() + '?page=admin';

    MailApp.sendEmail({ to: data.email, subject: 'Confirmação de Pedido - Enxoval ' + EVENTO,
      htmlBody: buildUserEmailHtml(data, itensHtml, total), attachments: [fileBlob], inlineImages: { logoCamisa: getLogoEmail() } });
    MailApp.sendEmail({ to: ADMIN_EMAIL, subject: 'Novo Pedido: ' + data.nome + ' - ' + fmtMoeda(total),
      htmlBody: buildAdminEmailHtml(data, itensHtml, total, fileUrl, adminUrl), attachments: [fileBlob], inlineImages: { logoCamisa: getLogoEmail() } });

    return 'Sucesso';
  } catch (error) {
    return 'Erro: ' + error.toString();
  }
}

function getAdminData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  const rows = sheet.getDataRange().getValues().slice(1);
  return rows.map(function(row, i) {
    return {
      rowIndex: i + 2,
      data: Utilities.formatDate(new Date(row[0]), Session.getScriptTimeZone(), 'dd/MM/yyyy HH:mm'),
      nome: row[1], email: row[2], telefone: row[3], grupo: String(row[5]),
      itens: String(row[10]), quantidade: row[14], valor: row[15], comprovante: row[16], status: row[17]
    };
  });
}

function updateStatus(rowIndex, novoStatus) {
  try {
    SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getRange(rowIndex, 18).setValue(novoStatus);
    return 'OK';
  } catch (error) {
    return 'Erro: ' + error.toString();
  }
}
