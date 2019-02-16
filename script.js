let cellWidth = 20;
let cellHeight = 20;
//Получение холста ля отрисоовки
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

let width = 450;
let height = 650;
canvas.setAttribute("width",width+"px");
canvas.setAttribute("height",height+"px");
//Признак проигрыша
let lose = false;
//СОздание спрайтов
let doodle = new Image();
let desk = new Image();
let background = new Image();
doodle.src = "img/doodle.png";
desk.src = "img/desk.png";
let doodleWidth = 100;
let doodleHeight = 100;
//Для отпрыгивания визуально адекватного
let offsetLeft = 30;
let offsetRight = 50;
let offsetBottom = 25;
//Видимое количество досточек
let deskCount = 3;
//Координаты досточек
let desksXY = new Array();
// Генерация массива координат досок
for(let i = 0; i < deskCount; i++){
  let point = new Array();
  point.push(getRandomInt(0,width-desk.width));
  point.push(getRandomInt(0,height-desk.height));
  desksXY.push(point);
}

//Физические параметры
let gravity = 5;
let yPos = 0;
let xPos = 0;
let jumpHeight = 200;

// Признак прыжка
let jumped = false;
// Функции

// Прыжок по нажатию
let newY;
addEventListener("keydown", move)
function jump(){
  newY = yPos - jumpHeight;
  jumped = true;
}
//Движение
function move(e){
  switch(e.keyCode){
    case 37:  // если нажата клавиша влево
        if(xPos<0-doodleWidth)
          xPos = width;
        xPos-=10;
        break;
    case 39:   // если нажата клавиша вправо
        if(xPos>width+doodleHeight)
          xPos = 0;
        xPos+=10;
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
//Отрисовка сцены
function draw(){
  context.drawImage(background,0,0);
  context.drawImage(doodle,xPos,yPos,doodleWidth,doodleHeight);
  for(let i = 0; i < deskCount; i++){
    context.drawImage(desk,desksXY[i][0],desksXY[i][1],desk.width,desk.height);
  }
  //Логика столкновения
  for(let i = 0; i < deskCount; i++){
      if(yPos+doodleHeight - offsetBottom >= desksXY[i][1] &&
         yPos+doodleHeight - offsetBottom <  desksXY[i][1] + desk.height
         && xPos + doodleWidth - offsetRight > desksXY[i][0] &&
         xPos < desksXY[i][0] + desk.width - offsetLeft)
        jump();
  }
  if(jumped&&yPos>newY){
    yPos -= gravity;
  }else{
    jumped = false;
    yPos += gravity;
  }
  //
  if(yPos>height+100){
    alert("You lose!");
    lose = true;
  }
  if(!lose)
    requestAnimationFrame(draw);
    else return;
}
// Рандомное число
function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//Вызовы
drawBG();
desk.onload = draw;
