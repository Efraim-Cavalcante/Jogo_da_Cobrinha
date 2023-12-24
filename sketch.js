let img;
let img2;
let img3;
let imgG;
var tela = 0;
let snake;
let rez = 20;
let food;
let w;
let h;

// Pré-Imagens
function preload() {
  img = loadImage('Cobrinha1.jpg');
  img2 = loadImage('Cobrinha2.jpg');
  img3 = loadImage('Musgo.jpg');
  imgG = loadImage('Graduando.jpg')
}

function setup() {
  createCanvas(400, 400);
  w = floor(width / rez);
  h = floor(height / rez);
  snake = new Snake();
  foodLocation();
  frameRate(5); // Diminuir a velocidade da cobrinha
}

function draw() {
  if (tela == 0) {
    menu();
  } else if (tela == 1) {
    background(220);
    jogar();
  } else if (tela == 2) {
    instrucoes();
  } else if (tela == 3) {
    creditos();
  }
}

// Menu
function menu() {
  background(220);
  image(img, -185, -100);
  fill(0, 245, 255);
  rect(150, 160, 150, 50, 30);
  rect(150, 220, 150, 50, 30);
  rect(150, 280, 150, 50, 30);
  textSize(30);
  textAlign(CENTER);
  fill(248, 248, 255);
  text("Jogar", 220, 195);
  text("Instruções", 225, 255);
  text("Creditos", 220, 315);
}

function jogar() {
  image(img3, 0, 0);
  scale(rez);
  snake.update();
  snake.show();

  if (snake.eat(food)) {
    foodLocation();
    snake.grow(); // Faz a cobra crescer ao comer
  }

  // Desenha a comida
  noStroke();
  fill(255, 0, 0); // Cor vermelha para a comida
  rect(food.x, food.y, 1, 1);
}

function instrucoes() {
  background(220);
  image(img2, -40, 0);
  fill(0, 245, 255);
  rect(5, 85, 310, 125, 30);
  textSize(22);
  textAlign(LEFT);
  fill(248, 248, 255);
  text("Utilize as setas para mover a"+"\n"+"cobrinha" + "\n" + "e coma as frutas para crescer!", 10, 150);

  // Botão de voltar
  fill(0, 245, 255);
  rect(10, 10, 80, 30, 10);
  fill(248, 248, 255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Voltar", 50, 25);
}

function creditos() {
  background(220);
  image(imgG,0,-90);
  fill(248, 248, 255);
  rect(140, 10, 300, 80, 30);
  textSize(16);
  textAlign(LEFT);
  fill(0, 0, 0);
  text("Efraim Cavalcante Dias" + "\n" + "- Graduando em C&T, UFRN." + "\n" + "Orientador: Prof. Orivaldo", 150, 50);
  fill(0, 245, 255);
  rect(10, 10, 80, 30, 10);
  fill(248, 248, 255);
  textSize(18);
  textAlign(CENTER, CENTER);
  text("Voltar", 50, 25);
}

// Botões do Menu
function mouseClicked() {
  if (tela == 0) {
    if (mouseX > 150 && mouseX < 300 && mouseY > 160 && mouseY < 210) {
      tela = 1;
    }
    if (mouseX > 150 && mouseX < 300 && mouseY > 220 && mouseY < 270) {
      tela = 2;
    }
    if (mouseX > 150 && mouseX < 300 && mouseY > 280 && mouseY < 330) {
      tela = 3;
    }
  }else if (tela == 2 || tela == 3) { // Se estiver na tela de instruções ou créditos
    if (mouseX > 10 && mouseX < 90 && mouseY > 10 && mouseY < 40) {
      tela = 0; // Voltar para o menu
    }
  }
}

function foodLocation() {
  let x = floor(random(w));
  let y = floor(random(h));
  food = createVector(x, y);
}

function keyPressed() {
  if (keyCode === UP_ARROW && snake.yspeed !== 1) {
    snake.setDirection(0, -1);
  } else if (keyCode === DOWN_ARROW && snake.yspeed !== -1) {
    snake.setDirection(0, 1);
  } else if (keyCode === RIGHT_ARROW && snake.xspeed !== -1) {
    snake.setDirection(1, 0);
  } else if (keyCode === LEFT_ARROW && snake.xspeed !== 1) {
    snake.setDirection(-1, 0);
  }
}

class Snake {
  constructor() {
    this.body = [];
    this.body[0] = createVector(floor(w / 2), floor(h / 2));
    this.xspeed = 0;
    this.yspeed = 0;
    this.len = 1;
  }

  setDirection(x, y) {
    this.xspeed = x;
    this.yspeed = y;
  }

  update() {
    let head = this.body[this.body.length - 1].copy();
    this.body.shift();
    head.x += this.xspeed;
    head.y += this.yspeed;

    // Verificar se a cobra colide com as paredes (nova lógica)
    if (head.x >= w) {
      head.x = 0;
    } else if (head.x < 0) {
      head.x = w - 1;
    }
    if (head.y >= h) {
      head.y = 0;
    } else if (head.y < 0) {
      head.y = h - 1;
    }

    // Verificar se a cobra colide com seu próprio corpo
    this.body.push(head);
    if (this.body.length > this.len) {
      this.body.shift();
    }

    // Verificar se a cobra bateu em seu próprio corpo
    if (this.endGame()) {
      tela = 0; // Voltar para o menu quando o jogo terminar
      alert("Game Over! Sua cobra colidiu consigo mesma."); // Mostrar o alerta
      this.body = []; // Reiniciar o corpo da cobra
      this.body[0] = createVector(floor(w / 2), floor(h / 2)); // Posição inicial da cobra
      this.xspeed = 0; // Resetar a velocidade da cobra
      this.yspeed = 0;
      this.len = 1; // Resetar o comprimento da cobra
    }
  }
  grow() {
    let head = this.body[this.body.length - 1].copy();
    this.len++;
    this.body.push(head);
  }

  endGame() {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;

    for (let i = 0; i < this.body.length - 1; i++) {
      let part = this.body[i];
      if (part.x === x && part.y === y) {
        return true;
      }
    }
    return false;
  }

  eat(pos) {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
    if (x === pos.x && y === pos.y) {
      return true;
    }
    return false;
  }

  show() {
    for (let i = 0; i < this.body.length; i++) {
      fill(0);
      noStroke();
      rect(this.body[i].x, this.body[i].y, 1, 1);
    }
  }
}
