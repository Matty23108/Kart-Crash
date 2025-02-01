// # FASE DI PREPARAZIONE
// Raccogliamo gli elementi di interesse della pagina
const grid = document.querySelector(".grid");
const leftButton = document.querySelector(".left-button");
const rightButton = document.querySelector(".right-button");
const scoreCounter = document.querySelector(".score-counter");
const endGameScreen = document.querySelector(".end-game-screen");
const finalScore = document.querySelector(".final-score");
const playAgainButton = document.querySelector(".play-again"); 



// Prepariamo la griglia iniziale
const gridMatrix = [
    ['', '', '', '', '', 'grass', ''],
    ['', 'cones', '', '', '', '', 'fence'],
    ['', '', 'rock', '', '', '', ''],
    ['fence', '', '', '', '', '', ''],
    ['', '', 'grass', '', '', 'water', ''],
    ['', '', '', '', 'cones', '', ''],
    ['', 'water', '', '', '', '', ''],
    ['', '', '', '', '', '', ''],
    ['', '', '', '', '', 'rock', ''],
  ];

  // Impostazioni iniziali
  let score = 0;
  let speed = 1000;
  const KartPosition = { y:7, x:3 }


  // # FUNZIONI RELATIVE ALLA GRIGLIA
  // Funzione per renderizzare la griglia
function renderGrid(){
    // Prima di tutto svuota la griglia
    grid.innerHTML = "";



    // Recupero ogni riga dela matrice
    gridMatrix.forEach(function (rowCells) {
        // Per ogniuna delle caselle...
        rowCells.forEach(function(cellContent) {
            // Creiamo un elemento div
            const cell = document.createElement("div")

            // Inseriamo la classe "cell"
            cell.className = "cell";

            // Se c'e qualcosa nella cella aggiungi anche una classe con lo stesso nome
            if(cellContent) cell.classList.add(cellContent)

            // Ora metti l'elemento nella griglia
            grid.appendChild(cell);
        })
    })
}

// Funzione che raggruppa le operazioni di rendering
function renderElements(){
    // Posiziono il kart
    placeKart();

    // Renderizzo la griglia
    renderGrid();
}

// # FUNZIONI RELATIVE AL KART
// Funzione per posizionare il kart
function placeKart(){
    // Recuperiamo il valore della cella in cui dobbia posizionare il kart
    const contentBeforeKart =  gridMatrix[KartPosition.y][KartPosition.x]

    // Se c'è una monetina prendi punti bonus , altrimenti è collisione
    if (contentBeforeKart === "coin") getBonusPoints();
    else if (contentBeforeKart) gameover();

    // Inserisco la classe cart, nella cella corrispondente alle coordinate di kartPosition
    gridMatrix[KartPosition.y][KartPosition.x] = "kart";
}


// Funzione per muovere il Kart
function moveKart(direction){

    // Solleviamo il Kart per spostarlo da un'altra parte
    gridMatrix[KartPosition.y][KartPosition.x] = "";


    // Aggiorniamo le cordinate a seconda della direzione 
    switch(direction){
        case "left":
            if (KartPosition.x > 0) KartPosition.x--;
            break;
        case "right":
           if(KartPosition.x < 6) KartPosition.x++;
           break;
        default:
            gridMatrix[KartPosition.y][KartPosition.x] = "kart";
    }

    // Rirenderizzare tutti gli elementi 
    renderElements();
}

// # FUNZIONI RELATIVE AGLI OSTACOLI
// Funzione per far scorrere gli ostacoli
function scrollObstacles(){
    // Rmimuoviamo temparaniamente il kart
    gridMatrix[KartPosition.y][KartPosition.x] = "";

    // Controllo se c'e una moneta in gico 
    const isCoinInGame = lookForCoin();

    // Recupariamo l'ultima riga e la mettiamo da parte
    let lastrow = gridMatrix.pop();

    // Se non ci sono monetine in gico, inseriamo una monetina nella riga
    if(isCoinInGame === false) lastrow = insertCoin(lastrow);


    // Mescoliamo casualmente gli elementi da parte
    lastrow = shuffleElements(lastrow);


    // Riporto la riga in cima  
    gridMatrix.unshift(lastrow);


    // Rirenderizziamo tutto
    renderElements();

}



// Funzione per mescolare gli elementi di una riga
function shuffleElements(row){
    // Algoritmo di Fisher-Yates
for (let i = row.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [row[i], row[j]] = [row[j], row[i]];
  }

  return row;
}

// # FUNZIONE DI FINE PARTITA
function gameover(){
    // Interrompo il flusso di gioco
    clearInterval(gameLoop);


    // Inserisco il punteggio finale
    finalScore.innerText = score;
  

    // Rivelo la schermata di gameover
    endGameScreen.classList.remove ("hidden");

    // Porto il focus sul tasto gioca ancora
    playAgainButton.focus();

}



// # FUNZIONI RELATIVE AI PUNTI E ALLA VELOCITA
// Funzione che incrementa il punteggio
function incrementScore(){
    // Aumento il punteggio di 1 e lo inserisco in pagina
    scoreCounter.innerText = ++score;

}

// Fuzione che incrementa la velocita 
function  incrementSpeed(){
    // Se siamo gia troppo veloci...
 if(speed > 100) {
 // Interrompo il flusso attuale
 clearInterval(gameLoop);


 // Decremento l'intervallo (aumentando la velocita)
 speed -= 100;
// Rilanciamo un nuovo flusso 
gameLoop = setInterval(runGameFlow, speed);
}
}

// # FUNZIONI RELATIVE AL BONUS
// Funzione per ottenere punti bonus
function getBonusPoints(){
    // Incrementiamo il punteggio di 30
    score +=30;

    // Inseriamo il punteggio aggiornato in pagina
    scoreCounter.innerText = score;


    // Aggiungiamo la classe bonus al contatore
    scoreCounter.classList.add("bonus");


    // Rimuoviamo la classe subito dopo in modo da poterla riasseganre (e vedere l'effetto)
    setTimeout(function(){
        scoreCounter.classList.remove("bonus");
    }, 1000)



}

// Funzione per inserire un coin all'interno di una riga
function insertCoin(row){
// Individuiamo l'indice del primo elemento vuoto 
const emptyIndex = row.indexOf("");

// Inseriamo un coin in quella posizione
row[emptyIndex] = "coin";

// Restituitre la riga aggiornata (con il coin)
return row;

}

// Funzione per sapere se c'è un coin in gioco
function lookForCoin(){
    // Creo un flag
    let coinFound = false;

    // Recupero tutte le righe 
    gridMatrix.forEach(function(row){
        // Per ogni riga controllo se c'è un coin
        if(row.includes("coin")) coinFound = true;
    });

    return coinFound;
}

// # FUNZIONI RELATIVE AL FLUSSSO DI GIOCO
// F unzione che raggruppoa le operazioni da ripetere ciclicamente
function runGameFlow(){
    // Aumentare il punteggio
    incrementScore();

    // Aumentare la velocita
    if (score % 10 === 0) incrementSpeed();

    // Far muovere gli ostacoli
    scrollObstacles();
}




// # EVENTI DI GIOCO

// Click sul bottone di gioca ancora
playAgainButton.addEventListener("click", function(){
    location.reload();
})

// Click sul bottone di sinistra
leftButton.addEventListener("click",function(){
    moveKart("left")
})


// Click sul bottone di destra
rightButton.addEventListener("click", function(){
    moveKart("right")
})


// Reazione alle freccette
document.addEventListener("keyup",function (event){
    switch(event.key) {
        case "ArrowLeft" :
            moveKart("left");
            break;
        case "ArrowRight" :
            moveKart("right");
            break;
        default: return;
    }
})


// # ESECUZIONE DELLE FUNZIONI DI GIOCO 
// Scrollo automaticamente gli ostacoli
let gameLoop = setInterval(runGameFlow, speed);



