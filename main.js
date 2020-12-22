let canvas = document.getElementById("canvas");

let ctx = canvas.getContext("2d");

let painting = false;
ctx.lineWidth = 15;

ctx.lineCap = "round";

let lastTrack = {};
let leftclick;
let rightclick;

let eraserEl = document.getElementsByClassName("eraser")[0];
let leftColorEl = document.getElementsByClassName("leftColor")[0];
let rightColorEl = document.getElementsByClassName("rightColor")[0];

let colorFirstRowEl = document.getElementsByClassName("colorFirstRow")[0];

colorFirstRowEl.addEventListener(
  "click",
  (e) => {
    let btnColor = window.getComputedStyle(e.path[0]).backgroundColor;
    color = btnColor;
  },
  false
);

eraserEl.onclick = () => {
  color = "white";
};

var isTouchDevice = "ontouchstart" in document.documentElement;

let color = "black";

if (isTouchDevice) {
  canvas.ontouchstart = (e) => {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    lastTrack = [x, y];
  };
  canvas.ontouchmove = (e) => {
    let x = e.touches[0].clientX;
    let y = e.touches[0].clientY;
    drawLine(lastTrack[0], lastTrack[1], x, y, "black");
    lastTrack = [x, y];
  };
} else {
  canvas.onmousedown = (e) => {
    if (e.button === 0) {
      //监听鼠标左键
      painting = true;

      lastTrack["x"] = e.clientX;
      lastTrack["y"] = e.offsetY;
      leftclick = true;
    } else if (e.button == 2) {
      // painting = true;
      // lastTrack = [e.clientX, e.clientY];
      // rightclick = true;
    }
  };

  canvas.onmousemove = (e) => {
    if (painting === true) {
      drawLine(lastTrack["x"], lastTrack["y"], e.clientX, e.offsetY, color);
      lastTrack["x"] = e.clientX;
      lastTrack["y"] = e.offsetY;
    }
  };

  canvas.onmouseup = () => {
    painting = false;
    leftclick = false;
    rightclick = false;
  };
}

function drawLine(x1, y1, x2, y2, color) {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}
