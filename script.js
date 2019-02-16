
let cellWidth = 20;
let cellHeight = 20;
//Получение холста ля отрисоовки
let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

let width = 450;
let height = 650;

canvas.setAttribute("width",width+"px");
canvas.setAttribute("height",height+"px");



function drawBg(){
  for (let i = 0; i < width; i+=cellHeight) {
    context.moveTo(i,0);
    context.lineTo(i,height);
  }
  for (let j = 0; j < height; j+=cellWidth) {
    context.moveTo(0,j);
    context.lineTo(width,j);
  }
  context.strokeStyle = "#1c1c1c";
  context.lineWidth = 0.3;
  context.stroke();
}
drawBg();
