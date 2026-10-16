# Sistema de Vendas de Enxoval para Eventos Escoteiros

Um sistema de e-commerce ágil, responsivo e de baixo custo desenvolvido em Google Apps Script (HTML, CSS, JS e Google Sheets)[cite: 5]. Foi projetado especificamente para diretorias e equipes de organização que precisam vender itens de enxoval (camisas, meias, lenços, etc.) para eventos distritais ou regionais de forma centralizada[cite: 5].

O sistema divide-se em uma "Vitrine/Formulário" para o cliente final fazer o pedido e um "Painel Administrativo" para a diretoria gerenciar o financeiro e a logística de entrega[cite: 5].

## 🌟 Detalhes e Benefícios

* **Contagem Regressiva Automática:** O sistema bloqueia automaticamente novos pedidos após a data limite configurada, exibindo um cronômetro em tempo real na tela do usuário[cite: 5].
* **Validação Segura no Servidor:** Para evitar fraudes, os cálculos de preços e a soma de itens são refeitos no backend (`Code.gs`) antes de salvar na planilha, garantindo que o valor cobrado seja sempre o oficial[cite: 5].
* **Gestão Inteligente de Tamanhos:** O formulário permite adicionar múltiplas camisas de tamanhos diferentes no mesmo pedido (incluindo tamanhos personalizados em texto aberto)[cite: 5]. O painel admin consolida automaticamente o total de cada tamanho vendido (ex: P, M, G) para facilitar o pedido à malharia[cite: 5].
* **Armazenamento de Imagens Seguro:** As imagens dos produtos e QR Code do PIX são puxadas diretamente do Google Drive pelo servidor e convertidas para o site, o que significa que as imagens não precisam ficar públicas na internet[cite: 5].
* **Painel de Gestão (Admin):** Protegido por senha, fornece métricas em tempo real (Total Arrecadado, Qtd. de Camisas, Qtd. de Meias, PIX Pendentes) e permite alterar o status dos pedidos para "Confirmado" ou "Cancelado"[cite: 5].

---

## 🚀 Pré-work (Como colocar o código em funcionamento)

Para ativar este sistema no seu ambiente Google, siga os passos abaixo:

### 1. Preparação do Google Drive
1. Crie uma **Pasta** no seu Drive para receber os comprovantes de pagamento[cite: 5]. Compartilhe-a como "Qualquer pessoa com o link pode editar" e copie o ID da pasta (código alfanumérico na URL)[cite: 5].
2. Faça o upload das **Imagens** do seu enxoval (foto da camisa, foto da meia, e imagem do QR Code do PIX). Pegue o ID de cada uma dessas imagens no Drive[cite: 5].

### 2. Preparação da Planilha (Banco de Dados)
1. Crie uma Planilha no Google Sheets.
2. Na primeira linha (cabeçalho), crie exatamente as seguintes colunas (de A até R):
   `Data`, `Nome`, `Email`, `Telefone`, `Distrito`, `Grupo`, `Entrega`, `CEP`, `Endereço`, `Número`, `Complemento` (esta coluna receberá os ITENS DO PEDIDO), `Bairro`, `Cidade`, `Estado`, `Quantidade`, `Valor`, `Comprovante`, `Status`[cite: 5].

### 3. Configuração do Google Apps Script
1. Na planilha, clique em **Extensões > Apps Script**.
2. Crie os três arquivos correspondentes e cole os códigos fornecidos:
   * `Code.gs` (Script do servidor)[cite: 5]
   * `Index.html` (Interface da loja)[cite: 5]
   * `admin.html` (Interface do painel)[cite: 5]

### 4. Deploy
1. Clique em **Implantar > Nova implantação**.
2. Tipo: **App da Web**.
3. Executar como: **Eu** | Quem pode acessar: **Qualquer pessoa**[cite: 5].
4. Autorize e copie a URL pública gerada.

---

## 🛠️ Customização: Implementando em um Novo Evento / Local

Para reaproveitar o sistema em outro Distrito ou para um evento diferente, você precisará alterar variáveis cruciais no arquivo **`Code.gs`** (logo no início do código) e alguns detalhes visuais no HTML[cite: 5].

### Alterações Obrigatórias no `Code.gs`:
* **Acessos e Pastas:**
  * `FOLDER_ID`: Insira o ID da nova pasta de comprovantes[cite: 5].
  * `ADMIN_EMAIL`: E-mails que receberão alertas de novas vendas[cite: 5].
  * `ADMIN_USER` e `ADMIN_PASS`: Defina a nova senha de acesso ao painel[cite: 5].
* **Dados do Evento e Preços:**
  * `EVENTO`: Nome do novo evento (Ex: "Acampamento Regional 2027")[cite: 5].
  * `PRECO_CAMISA` e `PRECO_MEIA`: Altere os valores numéricos cobrados[cite: 5]. (Se for vender outro tipo de item, como "Lenço", você pode renomear essas variáveis, mas precisará ajustar as referências no HTML e nas fórmulas do servidor)[cite: 5].
  * `PRAZO_FINAL` e `PRAZO_TXT`: Defina a data exata de encerramento das vendas. Lembre-se que no JavaScript, o mês começa em 0 (ex: `9` representa Outubro)[cite: 5].
  * `GRUPOS`: Atualize a lista de numerais dos grupos escoteiros participantes[cite: 5].
* **Imagens:**
  * No objeto `IMG_IDS`, atualize os IDs da `camisa`, `meia` e `pix` para as novas imagens do Drive[cite: 5].

### Alterações no `Index.html`:
* **Variáveis Locais:** No bloco `<script>` (linha 114 em diante), certifique-se de atualizar `PRECO_CAMISA`, `PRECO_MEIA`, `TAMANHOS`, `GRUPOS`, `PIX_CHAVE`, `PRAZO_FINAL` e `PRAZO_TXT` para refletir os mesmos dados colocados no `Code.gs`[cite: 5]. *Nota: Isso é necessário para o cálculo em tempo real na tela do usuário funcionar em sincronia com o servidor.*[cite: 5]
* **Textos Descritivos:** Procure e substitua textos estáticos no HTML, como a explicação sobre a retirada dos itens (`📍 Retirada pessoalmente...`) e os nomes dos produtos exibidos em tela[cite: 5].

### Como acessar o Painel Admin
Acesse o seu painel de controle adicionando `?page=admin` ao final do link do seu Web App[cite: 5].
Exemplo: `https://script.google.com/macros/s/.../exec?page=admin`
