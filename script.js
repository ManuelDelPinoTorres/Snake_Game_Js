//cogemos los elementos que vamos a usar
const board = document.getElementById('board');
const ScoreBoard = document.getElementById('scoreBoard');
const startButton = document.getElementById('start');
const gameOverSign = document.getElementById('gameOver');


//elementos del juego tamaño de tablero y velocidad

const boardSize = 10;
const gameSpeed = 150;

//valores con los que pondremos en el tablero los elementos
const squareTypes = {
    emptySquare: 0,
    snakeSquare: 1,
    foodSquare: 2,
}

//direcciones en las que nos moveremos añaden o restan
const directions = {
    ArrowUp: -10,
    ArrowDown: 10,
    ArrowRight: 1,
    ArrowLeft: -1
}

//variables del juego
let snake;
let score;
//cada vez que apriete el usuario moveremos la direccion
let direction;
//array con info del tablero
let boardSquares;
//lugares vacios para no calcularla cada vez que nos movemos 
let emptySquares;
//intervalo que usaremos
let moveInterval;



const updateScore = () => {
    //introducimos el valore del score
    ScoreBoard.innerText = score;
}


//lo creamos al jugar 
const createBoard = () => {
    boardSquares.forEach((row, rowIndex) => {
        row.forEach((column, columnIndex) => {
            const squareValue = `${rowIndex}${columnIndex}`;

            //creamos un elemento div
            const squareElement = document.createElement('div');

            //ponemos una clase al elemento, para dar estilos
            squareElement.setAttribute('class', 'square emptySquare');
            //ponemos un id al elemento con su valor
            squareElement.setAttribute('id', squareValue);

            //agregamos al board el elemento que hemnos creado
            board.appendChild(squareElement);

            //guardamos en empty el valor del cuadrado vacio
            emptySquares.push(squareValue);

        });
    });
};


const moveSnake = () => {
    //necesitamos saber cual es el nuevo square
    //para ello miraremos en la posicion final y generaremos un string
    //formado por la ultima posicion del snake, el valor que vamos a sumar o restar
    //si queremos subir,bajar restamos o sumanos 10
    //izq o der sumanos o restamos 1

    const newSquare = String(
        Number(snake[snake.length - 1]) + directions[direction])
        .padStart(2, '0');
    //padStar agrega un 0 delante si este no tiene dos cifras

    //sacamos la columna y fila para seleccionar en el board square
    const [row, column] = newSquare.split('');

    //preguntamos 

    //1 juego se termina?
    //si el new es menor que 0 se salio del tablero
    //si es menor que el cuadrado se salio del ultimo
    //por ultimo ver si cuadrado esta ovupado por la serpiente se come y acaba
    if (newSquare < 0 || newSquare > boardSize * boardSize ||
        (direction === 'ArrowRight' && column == 0) ||
        (direction === 'ArrowLeft' && column == 9) ||
        boardSquares[row][column] === squareTypes.snakeSquare) {
        //llamamos a la funcion game over
        gameOver();
    } else {
        //si no termina hacemos push en la cola de snake
        snake.push(newSquare);
        //ahora preguntamos si es comida el siguiente
        if (boardSquares[row][column] == squareTypes.foodSquare) {
            //aqui crece
            addFood();
        } else {
            //en este caso no hay comida asi que elminamos el primer cuadrado de la serpiente
            const emptySquare= snake.shift();
            //pintamos como vacia la posicion que deja el snake
            drawSquare(emptySquare,'emptySquare');
        }
        //volvemos a pintar la serpiente cuando le hemos agregado el cuadrado
        drawSnake();
    }
}

//funcion que añade a la sepiente un elemento
const addFood = () => {
    score++;
    //actualizamos el score y generamos de nuevo comida
    updateScore();
    //creamos comida aleatoria
    createRandomFood();
}

const gameOver = () => {
    //aparece el gameOver sing
    gameOverSign.style.display = "block";
    //cortamos el intervalo
    clearInterval(moveInterval);
    //habilitamos el boton start
    startButton.disabled = false;
}

// esta funcion hara que cambiemos la direccion que tenemos asociada en la variable
const setDirection = newDirection => {
    direction = newDirection;
}


//funcion que comprueba cual es la tecla que se ha pulsado
const directionEvent = (key) => {
    //que tipo de codigo se toco
    switch (key.code) {
        case 'ArrowUp':
            //no debemos dejar que vaya en sentido contrario al que lleva
            //la repiente no se mueve al reves
            direction != 'ArrowDown' && setDirection(key.code);
            break;
        case 'ArrowDown':
            direction != 'ArrowUp' && setDirection(key.code);
            break;
        case 'ArrowLeft':
            direction != 'ArrowRight' && setDirection(key.code);
            break;
        case 'ArrowRight':
            direction != 'ArrowLeft' && setDirection(key.code);
            break;
    }
}


const setGame = () => {
    //valor inicial de la serpiente
    snake = ['00', '01', '02', '03'];
    //puntuacion
    score = snake.length;
    direction = 'ArrowRight';
    //creamos la matriz de 10 y luego la rellenamos con una funcion callback que recibe array por cada filla y rellena con cuadrados vacios
    //array de 10          //cada elemento sera un array y rellenaremos con 0 
    boardSquares = Array.from(Array(boardSize), () => new Array(boardSize).fill(squareTypes.emptySquare));
    console.log(boardSquares);
    //borramos para empezar el juego cada vez qeu pulse
    board.innerHTML = '';
    //igualamos los cuadrados vacios a un array
    emptySquares = [];

    //creamos el tablero con una funcion
    createBoard();
}



const drawSnake = () => {
    snake.forEach(square => drawSquare(square, 'snakeSquare'));
}



//square posicion del cuadrado que vamos a pintar
//type es el tipo de cuadrado que camos a pintar(empty,sankeSquare, foodsquare)

const drawSquare = (square, type) => {
    //obtenemos solo la columna y la fila del cuadrado, ya que los cuadrados 
    //solo tienen la posicion
    const [row, column] = square.split("");
    //añadimos en la matriz el tipo de cuadrado que pasemos por parametro
    boardSquares[row][column] = squareTypes[type]

    //pasamos a html

    //cojemos el elemento de la matriz 
    const squareElement = document.getElementById(square);

    //pintamos poniendo la clase
    squareElement.setAttribute('class', `square ${type}`);


    //si introducimos un emptysquare buscaremos en el array 
    //si no sacaremos de este

    if (type === 'emptySquare') {
        emptySquares.push(square);
    } else {
        //comprobaremos si este board contiene este elemetno
        //puede ser uno de los elementos del snake
        if (emptySquares.indexOf(square) !== -1) {
            //eliminamos el square con splice 
            emptySquares.splice(emptySquares.indexOf(square), 1);
        }
    }

}



//creamos comidas RandomFood
const createRandomFood = () => {
    //obtenemos un square random
    const randomEmptySquare = emptySquares[Math.floor(Math.random() * emptySquares.length)];

    //la dibujasmos
    drawSquare(randomEmptySquare, 'foodSquare');
}


//fucion startgame
const startGame = () => {
    //seteamos los valores del juego al empezar
    setGame();
    //ocultamos y bloqueamos el boton
    gameOverSign.style.display = "none";
    startButton.disabled = true;

    //dibujamos la serpiente
    drawSnake();
    //actualizamos el marcador
    updateScore();
    createRandomFood();

    //agregamos a las flechas del usuario las teclas
    document.addEventListener('keydown', directionEvent);
    moveInterval = setInterval(() => moveSnake(), gameSpeed);
}



//necesita que la funcion este declarada antes
startButton.addEventListener('click', startGame);















