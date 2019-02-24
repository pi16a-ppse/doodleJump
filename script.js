// Ширина клетки фона
let cellWidth = 20;
// Высота клетки фона
let cellHeight = 20;
//Получение холста для отрисовки игрового поля
let canvas = document.getElementById('canvas');
// Создание объекта для работы с отрисовкой 
let context = canvas.getContext('2d');
// Ширина игрового поля
let width = 450;
// Высота игрового поля
let height = 610;
// Задаем игровому полю ширину
canvas.setAttribute("width",width+"px");
// Задаем высоту игровому полю
canvas.setAttribute("height",height+"px");
//Признак проигрыша
let lose = false;
//Создание спрайтов
//Создание картинки под дудлика
let doodle = new Image();
// Создание картинки под значок перегрузки
let reload = new Image();
// Создание картинки под фон
let background = new Image();
// Создание картинки под досточку
let desk = new Image();
// Создание картинки под значок звука
let audio = new Image();
// Присваевам ресурс для изображения кнопки звука
audio.src = "img/audio.png";
// Присваевам ресурс для изображения дудлика
doodle.src = "img/doodleRight.png";
// Присваевам ресурс для изображения досточки
desk.src = "img/desk.png";
// Присваевам ресурс для изображения кнопки перегрузки
reload.src = "img/reload.png";
// Ширина дудлика
let doodleWidth = 100;
// Высота дудлика
let doodleHeight = 100;
// Ширина досточки
let deskWidth = 100;
// Высота досточки
let deskHeight = 30;
// Ширина кнопок перегрузка и звук
let buttonWidth = 35;
// Высота кнопок перегрузка и звук
let buttonHeight = 35;

// Звуки
// Создание объекта для звука прыжка
let jumpAudio = new Audio();
// Присвоение объекту звука прыжка ресурса со звуком
jumpAudio.src = "audio/jump.mp3"
// Делаем предварительную загрузку звука прыжка
jumpAudio.preload = 'auto';
// Создание объекта для звука проигрыша
let failAudio = new Audio();
// Делаем предварительную загрузку звука проигрыша
failAudio.src = "audio/fail.mp3"
// Делаем предварительную загрузку звука проигрыша
failAudio.preload = 'auto';

// Для визуально адекватного отпрыгивания
// вводим отступы
// Отступ слева от картинки
let offsetLeft = 30;
// Отступ справа от картинки
let offsetRight = 50;
// Отступ снизу от картинки
let offsetBottom = 25;
// Видимое количество досточек
let deskCount = 15;
// Массив точек досточек
let desksXY;
// Счет
let score = 0;

// Физические параметры
// Количество пикселей притяжения
let gravity = 4;
// Начальное положение дудлика по оХ
let xPos = width/2 - doodleWidth/2;
// Начальное положение дудлика по оУ
let yPos = height - doodleHeight - deskHeight - offsetBottom;
// Высота прыжка
let jumpHeight = 130;
// Признак прыжка
// Находится ли еще дудлик в воздухе или нет
// Применяется для метода jump
let jumped = false;
// Прыжок по нажатию
let newY;

// Функции
/*
*Создание досок
*
*Принимает диапозон возможного положения досок
*
*@param int $minX Минимальное возможно значение координаты по оси оХ
*@param int $maxX Максимальное возможно значение координаты по оси оХ
*@param int $minY Минимальное возможно значение координаты по оси оУ
*@param int $maxY Максимальное возможно значение координаты по оси оУ
*/
function createDesk(minX,maxX,minY,maxY){
  // Прописать правило генерации
  let flag = false;
  let point;
  do{
    //Создаем точку
    point = new Array();
    point.push(getRandomInt(minX,maxX));
    point.push(getRandomInt(minY,maxY));
    for(let i = 0; i < desksXY.length; i++){
      if(
        point[1] > desksXY[i][1] - jumpHeight && 
        checkIntersektDesk(desksXY[i][0],desksXY[i][1],point[0],point[1])
        )
        flag = true;
    }
  }while(!flag)
  flag = false;
  desksXY.push(point);
}
/*
*Проверка на пересечение досточек
*
*Принимает коориданты новой потенциальной досточки
*и координаты существующей досточки. Если досточки будут пересекаться
*возвращает false иначе true
*
*@param int $x1 координата х первой досточки
*@param int $y1 оордината у первой досточки
*@param int $x координата х второй досточки
*@param int $y координата у второй досточки
*@return bool temp признак пересечения досточек
*/
function checkIntersektDesk(x1,y1,x,y){
  if(
      (x1 < x + deskWidth || x1 > x + deskWidth) &&
      (y1 < y - deskHeight || y1 > y + deskHeight)
    ){
    console.log(x1," < ",x+deskWidth,"; ",y1," < ",y - deskHeight);
    return true;
  }
  return false;
}
/*
*Генерация массива координат досок
*
*Данный метод формерует массив точек для досточек
*/
function createDesks(){
  let tempX = width/2 - deskWidth/2;
  let tempY = height - deskHeight;
  desksXY.push([tempX, tempY]);
  for(let i = 0; i < deskCount-1; i++)
    createDesk(0,width-deskWidth,-400,height-deskHeight);
}
/*
*Метод для прыжка дудлика
*
*Данный метод меняет значение переменной jumped в 
*следствии чего происходит прыжок
*/
function jump(){
  newY = yPos - jumpHeight;
  jumped = true;
  if(!mute)
    jumpAudio.play();
}

/*
*Метод для передвижения дулика влево/вправо
*
*Принимает событие нажатия клавиши
*Изменяет положение дудлика на игровом поле
*
*@param event $e событие нажатия клавиши
*/
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

/*
*Метод для формирования картинки фона
*
*Формирует клетчатое поле и присвает его переменной картинке background
*
*/
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

/*
*Метод для отрисовки объектов на сцене
*
*Отображает все объекты на сцене игры
*Вызыввается асинхронным методом бесконечное число раз
*/
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
  //Вызов метода для отрисовки счета
  drawScore();
  //
  if(yPos>height+100){
    if(!mute)
      failAudio.play();
    alert("You lose!");
    lose = true;
  }
  //Отрисовка кнопки аудио и перегрузки
  context.drawImage(reload,width - buttonWidth - 10,10,buttonWidth,buttonHeight);
  context.drawImage(audio,10,10,buttonWidth,buttonHeight);
  //Если проиграл - выход
  if(!lose)
    requestAnimationFrame(draw);
    else
      return;
}
/*
*Метод для отрисовки счета
*
*отрисовыает счет на игровом поле
*/
function drawScore(){
  context.fillStyle = "black";
  context.strokeStyle = "black";
  context.font = '32px sans-serif';
  context.strokeText(Math.floor(score), width/2-score/15, 32);
}
/*
*Метод для отрисовки досок
*
*отрисовыает все доски на игровом поле
*/
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
    //Для корректировки количества досок
    context.drawImage(desk,desksXY[i][0],desksXY[i][1],deskWidth,deskHeight);
    if(desksXY[i][1] > height){
      desksXY.splice(i,1);
      if(desksXY.length < deskCount)
        createDesk(0,width-deskWidth,-200,0);
      }
  }
}
/*
*Метод для получения случайного числа в диапоззоне
*
*Принимает минимальное и максимально значение 
*Возвращает случайное число в диапозоне
*
*@param int $min Минимальное значение
*@param int $max Максимальное значение
*/
function getRandomInt(min, max){
  return Math.floor(Math.random() * (max - min + 1) + min);
}
/*
*Метод для создание игровой сцены
*
*/
function createScene(){
  //Координаты досточек
  desksXY = new Array();
  //Признак прыжка
  moveCamera = false;
  createDesks();
  desk.onload = draw;
  addEventListener("keydown", move);
  // Обработка клика по канвасу
  let canvasLeft = canvas.offsetLeft;
  let canvasTop = canvas.offsetTop;
  // Клик по перегрузке
  canvas.addEventListener('click', function(event) {
    let x = event.pageX - canvasLeft;
    let y = event.pageY - canvasTop;
    if(x > width-buttonWidth - 10 && x < width - 10 && y > 10 && y < 10 + buttonHeight)
        createScene();
    if(x > 10 && x < buttonWidth + 10 && y > 10 && y < 10 + buttonHeight)
        if(mute)
          setAudioOn();
        else setAudioOff();
    }, false);
    // Отрисовка дудлика в начальном положении
    xPos = width/2 - doodleWidth/2;
    yPos = height - doodleHeight - deskHeight - offsetBottom;
    context.drawImage(doodle,xPos,yPos,doodleWidth,doodleHeight);
}

//Переменная состояния звука
let mute = false;
/*
*Метод для включения звука
*
*/
function setAudioOn(){
  audio.src = "img/audio.png";
  mute = false;
}
/*
*Метод для выключения звука
*
*/
function setAudioOff(){
  audio.src = "img/audioPause.png";
  mute = true;
}
//Вызовы
// Создание фона
drawBG();
// Создание игроовой сцены
createScene();
