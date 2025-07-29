// Lista de cartas disponíveis no jogo
let cartas = [1, 2, 3, 4, 5, 6, 7, 8];

// Variáveis globais para controle do jogo
let cartasEmbaralhadas = []; // Armazena as cartas duplicadas e embaralhadas
let paresRestantes = 8; // Total de pares a serem encontrados
let tempoRestante = 60; // Tempo total do jogo (segundos)
let cartasViradas = []; // Guarda as cartas viradas temporariamente
let cartaAVirar = 1; // Controla a ordem das cartas viradas
let tempoIntervalo = null; // Referência do setInterval para parar depois

//Elementos HTML
const titulo = document.getElementById('titulo'); //título principal
const pares = document.getElementById('paresRestantes'); //Contador de pares restantes
const anuncio = document.getElementById('anuncio'); //Anúncio de vitória ou derrota
const botaoReiniciar = document.getElementById('botaoReiniciar'); //Botão que reinicia o jogo

// Função para organizar as cartas
function organizarCartas() {
  cartasEmbaralhadas = cartas.concat(cartas); // duplica as cartas
  cartasEmbaralhadas.sort(() => Math.random() - 0.5); // embaralha as cartas

  // Define as imagens das cartas viradas para baixo
  for (let i = 1; i <= 16; i++) {
    let frente = document.getElementById(`frente${i}`);
    let carta = cartasEmbaralhadas[i - 1];
    frente.style.backgroundImage = `url(cartas/carta${carta}.png)`;
  }
}

// Função para virar as cartas
function virarCarta(numeroCarta, verificar = true) {
  let frente = document.getElementById(`frente${numeroCarta}`); //pega a div "frente" da carta atual
  let verso = document.getElementById(`verso${numeroCarta}`); //pega a div "verso" da carta atual
  let carta = document.getElementById(`carta${numeroCarta}`); //pega a div geral da carta

  // Impede clicar em cartas já removidas
  if (carta.style.display === 'none') return;

  // Alterna o display entre frente e verso
  if (getComputedStyle(verso).display === 'block') {
    verso.style.display = 'none';
    frente.style.display = 'block';
  } else {
    verso.style.display = 'block';
    frente.style.display = 'none';
  }

  // Só organiza as variáveis se for um clique
  if (verificar) organizarVariaveis(numeroCarta);
}

// Função que guarda as cartas viradas e chama verificação
function organizarVariaveis(numeroCarta) {
  let index = numeroCarta - 1;

  // Impede clicar na mesma carta duas vezes
  if (cartasViradas.includes(index)) return;

  cartasViradas.push(index); // armazena o índice da carta
  cartaAVirar++;


  //Debug
  console.table(cartasViradas);
  console.log(`Cartas a virar: ${cartaAVirar}`);


  // Quando duas cartas forem viradas, verifica se formam par
  if (cartasViradas.length === 2) {
    setTimeout(verificarPar, 1000);
  }
}

// Verifica se as duas cartas viradas são um par
function verificarPar() {
  let primeira = cartasViradas[0];
  let segunda = cartasViradas[1];

  console.log("Comparando valores:", cartasEmbaralhadas[primeira], "e", cartasEmbaralhadas[segunda]);

  if (cartasEmbaralhadas[primeira] === cartasEmbaralhadas[segunda]) {
    paresRestantes--; // diminui a contagem de pares
    pares.innerHTML = `Pares restantes: ${paresRestantes} `;


    if (paresRestantes <= 0) fimDeJogo('venceu');

    ocultarCarta(primeira + 1);
    ocultarCarta(segunda + 1);
  } else {
    // Se não forem iguais, vira as cartas de volta
    virarCarta(primeira + 1, false);
    virarCarta(segunda + 1, false);
  }

  cartasViradas = [];
  cartaAVirar = 1;

  // Verifica se o jogador venceu o jogo
  if (paresRestantes === 0) {
    let texto = document.getElementById("texto");
    texto.innerHTML = "VOCÊ VENCEU!";
    clearInterval(tempoIntervalo);
  }
}

// Esconde a carta após encontrar o par
function ocultarCarta(numeroCarta) {

  console.log(`Carta a ser oculta: ${numeroCarta}`);

  let carta = document.getElementById(`carta${numeroCarta}`);
  ocultarOuExibirDiv(carta.id, 'ocultar');
  console.log(`Carta nº ${numeroCarta} ocultada`);
}

function ocultarOuExibirDiv(div, funcao) {

  console.log(`Elemento a ser oculto: ${div}`);

  let elemento = document.getElementById(div);
  if (funcao == 'exibir') elemento.style.display = 'flex';
  if (funcao == 'ocultar') elemento.style.display = 'none';
}

// Função para controlar o tempo e exibir na tela
function contarTempo() {
  let tempo = document.getElementById('tempo');
  tempo.innerHTML = `Tempo: ${tempoRestante} segundos`;
  tempoRestante--;

  // Quando o tempo acaba, o jogador perde
  if (tempoRestante < 0) {
    clearInterval(tempoIntervalo);
    fimDeJogo('perdeu');

    // Impede novas jogadas após derrota
    document.querySelectorAll(".carta").forEach(carta => {
      carta.onclick = null;
    });
  }
}

// Controla a contagem inicial de "PRONTO > 3 > 2 > 1 > VALENDO!"
let textoAtual = 0;
function atualizarTexto() {
  let textos = ['채영이가', '좋아하는', 'RANDOM', 'GAME', 'RANDOM', 'GAME', 'GAME', 'START!'];
  let texto = document.getElementById("texto");

  if (textoAtual <= textos.length) {
    texto.innerHTML = textos[textoAtual];
    balancarTexto(texto, 700, 0.01, 2.5)
    textoAtual++;
  }
}

// Inicia o jogo após a contagem regressiva
function iniciarJogo() {
  let textoIntervalo = setInterval(atualizarTexto, 750);

  setTimeout(() => {
    clearInterval(textoIntervalo);
    ocultarOuExibirDiv('pagPrincipal', 'exibir');
    ocultarOuExibirDiv('contagem', 'ocultar')
    organizarCartas(); // embaralha e mostra as cartas
    // Inicia o cronômetro do jogo
    tempoIntervalo = setInterval(contarTempo, 1000);
  }, 6750); // espera os 5 segundos da contagem
}

function fimDeJogo(resultado) {
  anuncio.innerHTML = `Você ${resultado}`;
  ocultarOuExibirDiv('paginaFinal', 'exibir');
}

// Ao clicar no botão "iniciar", o jogo começa
let iniciar = document.getElementById('iniciar');
iniciar.addEventListener("click", () => {
  pares.innerHTML = `Pares restantes: ${paresRestantes} `;
  ocultarOuExibirDiv('inicio', 'ocultar') // esconde o botão
  ocultarOuExibirDiv('contagem', 'exibir');  // mostra o cronômetro
  iniciarJogo(); // chama o início do jogo
});

botaoReiniciar.addEventListener("click", () => {
  document.location.reload();
});

titulo.addEventListener("mouseover", () => {
  balancarTexto(titulo, 0.1)
});

titulo.addEventListener("mouseout", () => {
  titulo.style.transform = "scale(1)"; // volta ao normal
});

function balancarTexto(texto, velocidade, aumentoEscala = 0.05, limite = 1.10) {
  let escala = 1;
  let crescendo = true;

  const intervalo = setInterval(() => {
    if (crescendo) {
      escala += aumentoEscala;
      if (escala >= limite) crescendo = false;
    } else {
      escala -= aumentoEscala; // mesmo ritmo que o aumento
      if (escala <= 1) crescendo = true;
    }
    texto.style.transform = `scale(${escala})`;
  }, velocidade);

  return intervalo; // permite parar depois com clearInterval
}

function adicionarElementosCaindo() {
  for (let i = 0; i <= 6; i++) {
    const elemento = document.createElement('div');
    elemento.classList.add('elementoCaindo');
    elemento.style.position = 'fixed';
    elemento.style.top = '0px';
    elemento.style.backgroundImage = `url(elementos/elemento1.png)`
    elemento.style.left = `${15 * i}%`;
    document.body.appendChild(elemento);

  }
}

setInterval(adicionarElementosCaindo, 600);