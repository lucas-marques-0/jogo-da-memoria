const FRENTE = "carta_frente";
const VERSO = "carta_verso";
let icones = ["dustin", "eleven", "hopper", "jonathan", "lucas", "max", "mike", "robin", "steve", "will"];

let cartas = null;
iniciarGame();
function iniciarGame(){
    erros = 0;
    cartas = criarCartas(icones);
    embaralharCartas(cartas);
    iniciarCartas(cartas);
}

function removerTelaInicio(){
    let tela_inicio = document.getElementById("tela_inicio");
    tela_inicio.style.display = "none";
    reiniciarCartas();
    iniciarGame();
    musica.play();
}

function criarCartas(icones){
    let cartas = [];
    for(let icone of icones){
        cartas.push(criarPares(icone));
    }
    return cartas.flatMap(array => array);
}

function criarPares(icone){
    return [{
        id: criarId(icone),
        icone: icone,
        virada: false
    }, {
        id: criarId(icone),
        icone: icone,
        virada: false
    }]
}

function criarId(icone){
    return icone + parseInt(Math.random() * 1000);
}

function embaralharCartas(cartas){
    let index_Atual = cartas.length;
    let index_Aleatorio = 0;
    while(index_Atual !== 0){
        index_Aleatorio = Math.floor(Math.random() * index_Atual);
        index_Atual--;
        [cartas[index_Atual], cartas[index_Aleatorio]] = [cartas[index_Aleatorio], cartas[index_Atual]]
    }
}

function iniciarCartas(cartas){
    let tabuleiro = document.getElementById("tabuleiro");
    tabuleiro.innerHTML = "";
    cartas.forEach(carta => {
        let carta_Elemento = document.createElement("div");
        carta_Elemento.id = carta.id;
        carta_Elemento.classList.add("carta");
        carta_Elemento.dataset.icone = carta.icone;
        criarConteudoDaCarta(carta, carta_Elemento);
        carta_Elemento.addEventListener("click", virarCarta);
        tabuleiro.appendChild(carta_Elemento);
    });
}

function criarConteudoDaCarta(carta, carta_Elemento){
    criarFace(FRENTE, carta, carta_Elemento);
    criarFace(VERSO, carta, carta_Elemento);
}

function criarFace(face, carta, carta_Elemento){
    let carta_Elemento_Face = document.createElement("div");
    carta_Elemento_Face.classList.add(face);
    if(face == FRENTE){
        let icone_Elemento = document.createElement("img");
        icone_Elemento.classList.add("icone");
        icone_Elemento.src = "./icones/" + carta.icone + ".jpg";
        carta_Elemento_Face.appendChild(icone_Elemento);
    } else {
        //carta_Elemento_Face.innerHTML = "&lt/&gt";
        let icone_carta = document.createElement("img");
        icone_carta.classList.add("icone_carta");
        icone_carta.src = "./icones/carta_icone2.png";
        carta_Elemento_Face.appendChild(icone_carta);
    }
    carta_Elemento.appendChild(carta_Elemento_Face);
}

var erros = 0;
function virarCarta(){
    if(setarCarta(this.id)){
        this.classList.add("virar");
        if(segundaCarta != null){
            if(checarJogada()){
                reiniciarCartas();
                if(checarGameOver()){
                    let telaGameOver = document.getElementById("gameOver");
                    telaGameOver.style.display = "flex";

                    let tempo = musica.duration - musica.currentTime;
                    let tempo_restante = segundosParaMinutos(Math.floor(tempo));

                    let infos = document.getElementsByClassName("infos")[0];
                    infos.innerHTML = `<div>Você errou ${erros} vezes até se salvar</div> 
                                       <div>Faltava ${tempo_restante} até o demogorgon te pegar</div>`;

                    musica.pause();
                    musica.currentTime = 0;
                };
            } else {
                setTimeout(() => {
                    erros++;

                    let carta1 = document.getElementById(primeiraCarta.id);
                    let carta2 = document.getElementById(segundaCarta.id);
                    carta1.classList.remove("virar");
                    carta2.classList.remove("virar");
                    desvirarCartas();
                }, 1000);
            }
        }
    }
}

let bloqueio = false;
let primeiraCarta = null;
let segundaCarta = null;
function setarCarta(id){
    let carta = cartas.filter(carta => carta.id === id)[0];
    if(carta.virada || bloqueio){
        return false;
    }
    if(primeiraCarta == null){
        primeiraCarta = carta;
        primeiraCarta.virada = true;
        return true;
    } else {
        segundaCarta = carta;
        segundaCarta.virada = true;
        bloqueio = true;
        return true;
    }
}

function checarJogada(){
    if(primeiraCarta.icone === segundaCarta.icone){
        return true;
    }
    if(primeiraCarta == null || segundaCarta == null){
        return false;
    }
}

function reiniciarCartas(){
    bloqueio = false;
    primeiraCarta = null;
    segundaCarta = null;
}

function checarGameOver(){
    return cartas.filter(carta => !carta.virada).length == 0;
}


function desvirarCartas(){
    primeiraCarta.virada = false;
    segundaCarta.virada = false;
    reiniciarCartas();
}

function restart(){
    let tela_inicio = document.getElementById("tela_inicio");
    tela_inicio.style.display = "flex";
    reiniciarCartas();
    iniciarGame();
    let telaGameOver = document.getElementById("gameOver");
    telaGameOver.style.display = "none";
}

function restart2(){
    let tela_inicio = document.getElementById("tela_inicio");
    tela_inicio.style.display = "flex";
    let tela_gameOver_perdedor = document.getElementById("gameOver_perdedor");
    tela_gameOver_perdedor.style.display = "none";
}

let musica = document.getElementById("musica");
musica.addEventListener("timeupdate", atualizarBarra);
function atualizarBarra(){
    let barra = document.getElementsByClassName("avanco")[0];
    barra.style.height = Math.floor((musica.currentTime / musica.duration) * 100) + "%"; 

    let tempoDecorrido = document.getElementsByClassName("inicio")[0];
    tempoDecorrido.textContent = segundosParaMinutos(Math.floor(musica.currentTime));


    if(barra.style.height == "100%" && checarGameOver() == false){
        let tela_gameOver_perdedor = document.getElementById("gameOver_perdedor");
        tela_gameOver_perdedor.style.display = "flex";

        let personagens_ocultos = cartas.filter(carta => !carta.virada).length / 2;
        let info_perdedor = document.getElementById("infos_perdedor");
        info_perdedor.innerHTML = `<div>Faltaram ${personagens_ocultos} personagens para descobrir</div>`;
    }
}

function segundosParaMinutos(segundos){
    let campoMinutos = Math.floor(segundos / 60);
    let campoSegundos = segundos % 60;
    if (campoSegundos < 10){
        campoSegundos = "0" + campoSegundos
    }
    
    return campoMinutos + ":" + campoSegundos;
}
