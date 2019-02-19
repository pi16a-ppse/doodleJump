let cellWidth = 20;
let cellHeight = 20;
//Получение холста ля отрисоовки
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

let width = 450;
let height = 610;
canvas.setAttribute("width",width+"px");
canvas.setAttribute("height",height+"px");
//Признак проигрыша
let lose = false;
//СОздание спрайтов
let doodle = new Image();
let reload = new Image();
let background = new Image();
let desk = new Image();
doodle.src = "img/doodleRight.png";
desk.src = "img/desk.png";
reload.src = "img/reload.png";
let doodleWidth = 100;
let doodleHeight = 100;
let deskWidth = 100;
let deskHeight = 30;
let buttonWidth = 40;
let buttonHeight = 40;
//Звуки
let jumpAudio = new Audio();
jumpAudio.src = "audio/jump.mp3"
jumpAudio.preload = 'auto';
let failAudio = new Audio();
failAudio.src = "audio/fail.mp3"
failAudio.preload = 'auto';
//Для отпрыгивания визуально адекватного
let offsetLeft = 30;
let offsetRight = 50;
let offsetBottom = 25;
//Видимое количество досточек
let deskCount = 15;
//Массив точек
let desksXY;
//Счет
let score = 0;

//Физические параметры
let gravity = 5;
let xPos = width/2 - doodleWidth/2;
let yPos = height - doodleHeight - deskHeight - offsetBottom;
let jumpHeight = 170;
// Признак прыжка
let jumped = false;
// Прыжок по нажатию
let newY;

// Функции

//Создание доски
function createDesk(minX,maxX,minY,maxY){
  let point = new Array();
  point.push(getRandomInt(minX,maxX));
  point.push(getRandomInt(minY,maxY));
  desksXY.push(point);
}

// Генерация массива координат досок
function createDesks(){
  for(let i = 0; i < deskCount-1; i++)
    createDesk(0,width-deskWidth,-400,height-deskHeight)
  let tempX = width/2 - deskWidth/2;
  let tempY = height - deskHeight;
  desksXY.push([tempX, tempY]);
}

// Прыжок
function jump(){
  newY = yPos - jumpHeight;
  jumped = true;
  jumpAudio.play();
}

//Движение
function move(e){
  switch(e.keyCode){
    case 37:  // если нажата клавиша влево
        if(xPos<0-doodleWidth)
          xPos = width;
        xPos-=8;
        doodle.src = "img/doodleLeft.png";
        break;
    case 39:   // если нажата клавиша вправо
        if(xPos>width+doodleHeight)
          xPos = 0;
        xPos+=8;
        doodle.src = "img/doodleRight.png";
        break;
  }
}

// Отрисовка сетки
function drawBG(){
  context.fillStyle = "white";
  context.fillRect(0,0,width,height);
  for (let i = 0; i < width; i+=cellHeight) {
    context.moveTo(i,0);
    context.lineTo(i,height);
  }
  for (let j = 0; j < height; j+=cellWidth) {
    context.moveTo(0,j);
    context.lineTo(width,j);
  }
  context.strokeStyle = "#d1d1d1";
  context.lineWidth = 1;
  context.stroke();
  background.src = canvas.toDataURL();
}

//Признак движения камеры
let moveCamera = false;

//Отрисовка сцены
function draw(){
  //Если дудлик уже выше серидины
  if(yPos < height/5)
    moveCamera = true;
  else
    moveCamera = false;
  context.drawImage(background,0,0);
  context.drawImage(doodle,xPos,yPos,doodleWidth,doodleHeight);
  //Отрисовка досок
  drawDesks();
  //Логика столкновения
  for(let i = 0; i < desksXY.length; i++){
      if(yPos+doodleHeight - offsetBottom >= desksXY[i][1] &&
         yPos+doodleHeight - offsetBottom <  desksXY[i][1] + deskHeight
         && xPos + doodleWidth - offsetRight > desksXY[i][0] &&
         xPos < desksXY[i][0] + deskWidth - offsetLeft)
         // Если дудлик еще в полете - не прыгаем
         if(!jumped)
            jump();
  }
  //Направление движения
  if(jumped&&yPos>newY){
    yPos -= gravity;
  }else{
    jumped = false;
    yPos += gravity;
  }
  //Счет
  drawScore();
  //
  if(yPos>height+100){
    failAudio.play();
    alert("You lose!");
    lose = true;
  }
  context.drawImage(reload,width - buttonWidth - 10,10,buttonWidth,buttonHeight);
  //Если проиграл - выход
  if(!lose)
    requestAnimationFrame(draw);
    else
      return;
}
// Вывод счета
function drawScore(){
  context.fillStyle = "black";
  context.strokeStyle = "black";
  context.font = '32px sans-serif';
  context.strokeText(Math.floor(score), width/2-score/15, 32);
}
//Отрисовка досок
function drawDesks(){
  for(let i = 0; i < desksXY.length; i++){
    if(moveCamera){
      desksXY[i][1] += 5;
      //Увеличение счета
      score += 1/100;
      //Если счет увеличивается на 50, количество досок уменьшаем
      if(score!=0&&score%50==0)
        deskCount--;
    }
    context.drawImage(desk,desksXY[i][0],desksXY[i][1],deskWidth,deskHeight);
    if(desksXY[i][1] > height){
      desksXY.splice(i,1);
      if(desksXY.length < deskCount)
        createDesk(0,width-deskWidth,-200,0);
      }
  }
}
// Рандомное число
function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}


function createScene(){
  //Координаты досточек
  desksXY = new Array();

  createDesks();
  desk.onload = draw;
  addEventListener("keydown", move);
  // Обработка клика по канвасу
  let canvasLeft = canvas.offsetLeft;
  let canvasTop = canvas.offsetTop;
  canvas.addEventListener('click', function(event) {
    let x = event.pageX - canvasLeft;
    let y = event.pageY - canvasTop;
    if(x > width-buttonWidth - 10 && x < width - 10 && y > 10 && y < 10 + buttonHeight)
        createScene();
    }, false);
    // Отрисовка дудлика

    xPos = width/2 - doodleWidth/2;
    yPos = height - doodleHeight - deskHeight - offsetBottom;
    context.drawImage(doodle,xPos,yPos,doodleWidth,doodleHeight);
}

//Вызовы
drawBG();
createScene();
