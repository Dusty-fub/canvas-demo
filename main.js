let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let painting = false;
ctx.lineWidth = 15;

ctx.lineCap = "round";

let color = "black";

ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, canvas.width, canvas.height);

let lastTrack = {};
let leftclick;
let rightclick;

let savePicEl = document.getElementsByClassName("savePic")[0];
let eraserEl = document.getElementsByClassName("eraser")[0];
let fontSizeBtnEl = document.getElementsByClassName("fontSizeBtn")[0];
let textEl = document.getElementsByClassName("textBtn")[0];
let undoEl = document.getElementsByClassName("undo")[0];
let clearEl = document.getElementsByClassName("clear")[0];
let rangeEl = document.getElementsByClassName("range")[0];
let leftColorEl = document.getElementsByClassName("leftColor")[0];
let rightColorEl = document.getElementsByClassName("rightColor")[0];
let fontSizeListEl = document.getElementById("fontSizeList");

let colorFirstRowEl = document.getElementsByClassName("colorFirstRow")[0];
let colorSecondRowEl = document.getElementsByClassName("colorSecondRow")[0];

let canvasWrapEl = document.getElementsByClassName("canvasWrap")[0];

let canvasToRightEl = document.getElementsByClassName("canvasToRight")[0];
let canvasToBottomEl = document.getElementsByClassName("canvasToBottom")[0];
let canvasToRightBottomEl = document.getElementsByClassName(
  "canvasToRightBottom"
)[0];
let isMouseDown = false;

canvasToBottomEl.onmousedown = () => {
  isMouseDown = true;
};
canvasToRightBottomEl.onmousedown = () => {
  isMouseDown = true;
};

canvasToBottomEl.onmousemove = (e) => {
  isMouseDown && updateHeight(e.pageY);
};
canvasToBottomEl.onmouseup = (e) => {
  isMouseDown = false;
};

canvasToRightBottomEl.onmousemove = (e) => {
  if (isMouseDown) {
    updateWidth(e.pageX);
    updateHeight(e.pageY);
  }
};

canvasToRightBottomEl.onmouseup = (e) => {
  isMouseDown = false;
};

function updateWidth(newWidth) {
  canvasWrapEl.style.width = newWidth + "px";

  var width = canvas.getAttribute("width");
  var height = canvas.getAttribute("height");
  var dataBeforeMove = ctx.getImageData(0, 0, width, height);
  width = newWidth - 6;
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  ctx.putImageData(dataBeforeMove, 0, 0);
}

function updateHeight(newHeight) {
  newHeight = newHeight - 82;
  canvasWrapEl.style.height = newHeight + "px";
  var width = canvas.getAttribute("width");
  var height = canvas.getAttribute("height");
  var dataBeforeMove = ctx.getImageData(0, 0, width, height);
  height = newHeight - 6;
  canvas.setAttribute("width", width);
  canvas.setAttribute("height", height);
  ctx.putImageData(dataBeforeMove, 0, 0);
}

canvasToRightEl.onmousedown = () => {
  isMouseDown = true;
};

canvasToRightEl.onmousemove = (e) => {
  isMouseDown && updateWidth(e.pageX);
};

canvasWrapEl.onmouseup = (e) => {
  if (e.target.className === "canvasToRight") {
    updateWidth(e.pageX);
  }
  isMouseDown = false;
};

for (let i = 12; i < 73; i++) {
  let optionEl = document.createElement("option");
  optionEl.innerText = i;
  fontSizeListEl.appendChild(optionEl);
}

let mouseColorEl = leftColorEl;

let isText = false;
let inputFontSize = 18;

fontSizeBtnEl.onclick = function () {
  fontSizeBtnEl.value = "";
};

fontSizeBtnEl.onblur = function () {
  if (fontSizeBtnEl.value === "") {
    fontSizeBtnEl.value = "18";
  }
};
fontSizeBtnEl.onchange = function () {
  let currentInputEl = document.getElementsByClassName("insertInput")[0];
  if (currentInputEl) {
    currentInputEl.style.fontSize = this.value + "px";
    currentInputEl.focus();
  }
  inputFontSize = this.value;
};

textEl.addEventListener(
  "click",
  () => {
    canvas.style.cursor = "text";

    isText = true;
  },
  false
);

savePicEl.addEventListener(
  "click",
  () => {
    let imgUrl = canvas.toDataURL("image/png");
    let saveA = document.createElement("a");
    document.body.append(saveA);
    saveA.href = imgUrl;
    saveA.download = new Date().getTime();
    saveA.target = "_blank";
    saveA.click();
  },
  false
);

let historyLines = [];

function recordLines(line) {
  historyLines.unshift(line);
}

undoEl.onclick = () => {
  historyLines.shift();
  if (historyLines.length < 1) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.putImageData(historyLines[0], 0, 0);
  }
};

clearEl.addEventListener(
  "click",
  () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  },
  false
);

rangeEl.onchange = function () {
  ctx.lineWidth = this.value;
};

let chooseMouseColor = (clickEl, anotherEl) => {
  return () => {
    if (clickEl.className.indexOf("mouseColorActive") === -1) {
      anotherEl.className = anotherEl.className.replace(
        " mouseColorActive",
        ""
      );
      clickEl.className = clickEl.className.concat(" mouseColorActive");
    }
    mouseColorEl = clickEl;
  };
};

leftColorEl.addEventListener(
  "click",
  chooseMouseColor(leftColorEl, rightColorEl),
  false
);

rightColorEl.addEventListener(
  "click",
  chooseMouseColor(rightColorEl, leftColorEl),
  false
);

const updateColor = (event) => {
  btnColor = window.getComputedStyle(event.path[0]).backgroundColor;
  mouseColorEl.style.backgroundColor = btnColor;
  if (mouseColorEl === leftColorEl) {
    color = btnColor;
  }
  let currentInputEl = document.getElementsByClassName("insertInput")[0];
  if (currentInputEl) {
    currentInputEl.style.color = btnColor;
    currentInputEl.focus();
  }
};

colorFirstRowEl.addEventListener("click", updateColor, false);
colorSecondRowEl.addEventListener("click", updateColor, false);

eraserEl.onclick = () => {
  color = "white";
};

var isTouchDevice = "ontouchstart" in document.documentElement;

let isInput = false;

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

      if (isText) {
        if (isInput === false) {
          let emptyEls = [...document.getElementsByClassName("insertInput")];
          emptyEls.length !== 0 &&
            emptyEls.forEach((item) => {
              item.parentElement.removeChild(item);
            });
        }

        let x = e.pageX;
        let y = e.offsetY;
        let inputEl = document.createElement("textarea");
        inputEl.className = "insertInput";
        inputEl.style.position = "fixed";

        inputEl.style.top = e.clientY - inputEl.offsetHeight + "px";

        inputEl.style.left = e.clientX + "px";
        inputEl.style.resize = "both";
        inputEl.style.fontSize = inputFontSize + "px";
        inputEl.style.backgroundColor = "transparent";
        inputEl.style.border = ".5px dashed #0078d7";
        inputEl.style.outline = "none";
        inputEl.style.color = color;
        document.body.appendChild(inputEl);
        setTimeout(() => {
          inputEl.focus();
        });

        inputEl.oninput = (e) => {
          if (e.target.value !== "") {
            isInput = true;
          }
        };

        inputEl.onchange = (e) => {
          isInput = false;
          let writeContent = e.target.value;
          ctx.fillStyle = color;
          ctx.lineWidth = 5;
          ctx.save();
          ctx.beginPath();
          ctx.font = inputFontSize + "px monospace";
          let yOffset;
          if (inputFontSize === "31" || inputFontSize === "32") {
            yOffset = 30;
          } else {
            yOffset =
              0.942857142857142857 * inputFontSize +
              8.2285714285714286 / inputFontSize;
          }
          ctx.fillText(writeContent, x + 1, y + yOffset);

          ctx.restore();
          ctx.closePath();
          inputEl.parentElement.removeChild(inputEl);
        };
      } else {
        painting = true;

        lastTrack["x"] = e.clientX;
        lastTrack["y"] = e.offsetY;
        leftclick = true;
        drawCircle(e.clientX, e.offsetY, ctx.lineWidth / 2);
      }
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

    let line = ctx.getImageData(0, 0, canvas.width, canvas.height);
    recordLines(line);
  };
}

function drawCircle(x, y, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
}

function drawLine(x1, y1, x2, y2, color) {
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
  ctx.closePath();
}
