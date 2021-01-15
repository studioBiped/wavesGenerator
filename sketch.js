var waveLenSlider; //division of width
var ampSlider;
var speedSlider;
var xOffsetSlider; //portion of one full cos 
var ibtSlider; //multiple of 12
var vertCycleSlider;
var noiseSlider;
var peakSlider;

var underwaterButton;
var calmnessButton;
var calmnessSlider;

var drawButton;
var saveButton;
var loadButton;
var clearCanvasButton;
var recordButton;
var downloadFramesButton;
var clearFramesButton;

var modes = 'play';

var underwater = 1;
var calmness = 0;

var framesArr = [];
var exportArr = [];
var exportCounter = 0;

var preset = {
  waveLen: [2, 3],
  amp: [10, 20],
  speed: [3, 0],
  xOffset: [0.4, 0.4],
  ibt: [1, 5],
  vertCycle: [1.75, 1.75],
  noise: [8, 10],
  peak: [0.5, 0]
}

var brushSize = 6;
var col = [0, 1, 2, 0, 2, 0, 1];

function preload() {
  bg = loadImage('ref.jpg', loadImgSuccess);
}

function loadImgSuccess() {
  console.log('BG loaded successfully!');
}

function setup() {
  
  bg.loadPixels();
  
  createCanvas(1000, 1200);
  waveLenSlider = createSlider(1, 4, preset.waveLen[0], 1);
  waveLenSlider.position(10, 1000 + 10);
  waveLenSlider.style('width', '100px');

  ampSlider = createSlider(10, 20, preset.amp[0], 1);
  ampSlider.position(10, 1000 + 10 + 20);
  ampSlider.style('width', '100px');

  speedSlider = createSlider(0, 6, preset.speed[0], 1);
  speedSlider.position(10, 1000 + 10 + 20 * 2);
  speedSlider.style('width', '100px');

  xOffsetSlider = createSlider(0, 1, preset.xOffset[0], 0.1);
  xOffsetSlider.position(10, 1000 + 10 + 20 * 3);
  xOffsetSlider.style('width', '100px');

  ibtSlider = createSlider(1, 5, preset.ibt[0], 1);
  ibtSlider.position(10, 1000 + 10 + 20 * 4);
  ibtSlider.style('width', '100px');

  vertCycleSlider = createSlider(0.25, 2, preset.vertCycle[0], 0.25);
  vertCycleSlider.position(10, 1000 + 10 + 20 * 5);
  vertCycleSlider.style('width', '100px');

  noiseSlider = createSlider(0, 10, preset.noise[0], 1);
  noiseSlider.position(10, 1000 + 10 + 20 * 6);
  noiseSlider.style('width', '100px');

  peakSlider = createSlider(0, 1, preset.peak[0], 0.1);
  peakSlider.position(10, 1000 + 10 + 20 * 7);
  peakSlider.style('width', '100px');

  underwaterButton = createButton('Underwater');
  underwaterButton.position(width * 0.25, 1000 + 10);
  underwaterButton.mousePressed(underwaterSwitch);

  calmnessButton = createButton('Calmness Ow');
  calmnessButton.position(width * 0.25, 1000 + 10 + 20);
  calmnessButton.mousePressed(calmnessSwitch);

  calmnessSlider = createSlider(0, 1, 0, 0);
  calmnessSlider.position(width * 0.25, 1000 + 10 + 20 * 2);
  calmnessSlider.style('width', '100px');

  drawButton = createButton('Draw');
  drawButton.position(width / 2, 1000 + 10);
  drawButton.mousePressed(drawNow);

  saveButton = createButton('Save');
  saveButton.position(width / 2 + 62.5, 1000 + 10);
  saveButton.mousePressed(saveNow);

  loadButton = createButton('Load');
  loadButton.position(width / 2 + 125, 1000 + 10);
  loadButton.mousePressed(loadNow);

  clearCanvasButton = createButton('Clear Canvas');
  clearCanvasButton.position(width / 2 + 187.5, 1000 + 10);
  clearCanvasButton.mousePressed(clearCanvasNow);

  recordButton = createButton('Record');
  recordButton.position(width / 2, 1000 + 10 + 20 * 2);
  recordButton.mousePressed(recordNow);

  downloadFramesButton = createButton('Download Frames');
  downloadFramesButton.position(width / 2, 1000 + 10 + 20 * 3);
  downloadFramesButton.mousePressed(downloadFramesNow);

  clearFramesButton = createButton('Clear Frames');
  clearFramesButton.position(width / 2 + 125, 1000 + 10 + 20 * 3);
  clearFramesButton.mousePressed(clearFramesNow);
  
  exportNameInput = createInput('frameExport_wave_');
  exportNameInput.position(width / 2, 1000 + 10 + 20 * 5);
}

function mouseClicked() {
  if (modes == 'draw' && mouseX > 0 && mouseX < 1000 && mouseY > 0 && mouseY < 1000) {
    lineYs.push(
      mouseY - 500
    )
  }
}

function drawNow() {
  if (modes !== 'draw') {
    modes = 'draw';
  } else {
    modes = 'play';
  }
}

function saveNow() {
  var ysString = 'savedYs = [';
  for (var i = 0; i < lineYs.length; i++) {
    ysString = ysString + lineYs[i] + ', '
    if (i == lineYs.length - 1) {
      ysString = ysString.slice(0, -2);
    }
  }
  ysString = ysString + '];';

  saveStrings([ysString], 'lineExport.txt');
}

function loadNow() {
  if (savedYs) {
    lineYs = savedYs;
  }
}

function clearCanvasNow() {
  lineYs = [];
}

function recordNow() {
  if (modes !== 'record') {
    modes = 'record';
  } else {
    modes = 'play';
  }
}

function downloadFramesNow() {
  exportArr = [];
  var prevLight;
  var prevWet;

  for (var i = 0; i < framesArr.length; i++) {
    var framesString =
      'B   ' + brushSize.toFixed(5) + ' \n';

    for (var j = 0; j < framesArr[i].length; j++) {
      var lineCol = int(j % 3);
      framesString = framesString + 
        'C   ' + lineCol.toFixed(5) + '\n';
      
      for (var k = 0; k < framesArr[i][j].length; k++) {
        var dotRatio = k / (framesArr[i][j].length - 1);
        var x = ((framesArr[i][j][k].x - 500) / 1000 * 10).toFixed(5);
        var y = (framesArr[i][j][k].y / 500 * 5).toFixed(5);
        var pp = framesArr[i][j][k].weight * (1-pow(2*dotRatio-1, 10));
        var depth = (expresiiDotWeight(brushSize) * pp - 0.04).toFixed(5);
        var wet = expresiiWetVal(4 + int(8 * (1 - max(framesArr[i][j][k].light - 0.1, 0))));
        var light = int((1 - max(framesArr[i][j][k].light - 0.1, 0)) * 10) / 10;
        

        pp = (pp / 2).toFixed(5);

        if (light !== prevLight) {
          framesString = framesString + "a   0.00000   " + (-light).toFixed(5) + ' \n';
        }
        
        if (wet !== prevWet) {
          framesString = framesString + "w   " + (wet).toFixed(5) + ' \n';
        }

        if (k == 0) {
          framesString =
            framesString + 's  ' +
            x + '   ' +
            '0.10000   ' +
            y + '   ' +
            '0.00000' + '   ' +
            '0.00000' + '   ' +
            '0.00000    0.00000 \n';
        }
        framesString =
          framesString + 's  ' +
          x + '   ' +
          -depth + '   ' +
          y + '   ' +
          '-3.00000' + '   ' +
          '-3.00000' + '   ' +
          '0.00000  ' + '0.50000' + ' \n';

        if (k == framesArr[i][j].length - 1) {
          framesString =
            framesString + 's  ' +
            x + '   ' +
            '0.10000   ' +
            y + '   ' +
            '0.00000' + '   ' +
            '0.00000' + '   ' +
            '0.00000    0.00000 \n';
        }

        prevLight = light;
        prevWet = wet;
      }
    }
    exportArr.push(framesString);
  }
  //print(exportArr);
}

function expresiiDotWeight(brushSize) {
  var val = 0;
  if (brushSize == 9) {
    val = 1.3;
  } else if (brushSize == 8) {
    val = 0.9;
  } else if (brushSize == 7) {
    val = 0.5;
  } else if (brushSize == 6) {
    val = 0.4;
  } else if (brushSize == 5) {
    val = 0.3;
  } else if (brushSize == 4) {
    val = 0.2;
  } else if (brushSize == 3) {
    val = 0.1;
  } else if (brushSize == 2) {
    val = 0.08;
  } else if (brushSize == 1) {
    val = 0.06;
  }
  return val;
}

function expresiiWetVal(wetIdx) {
  var val = 0;
  if (wetIdx == 12 || wetIdx == 13) {
    val = 1;
  } else if (wetIdx == 11) {
    val = 0.65;
  } else if (wetIdx == 10) {
    val = 0.4;
  } else if (wetIdx == 9) {
    val = 0.19;
  } else if (wetIdx == 8) {
    val = 0.15;
  } else if (wetIdx == 7) {
    val = 0.10;
  } else if (wetIdx == 6) {
    val = 0.09;
  } else if (wetIdx == 5) {
    val = 0.08;
  } else if (wetIdx == 4) {
    val = 0.07;
  } else if (wetIdx == 3) {
    val = 0.06;
  } else if (wetIdx == 2) {
    val = 0.05;
  } else if (wetIdx == 1) {
    val = 0.04;
  }
  return val;
}

function clearFramesNow() {
  framesArr = [];
  exportCounter = 0;
}

function sharpWave(x) {
  var val;
  if (x >= 0 && x < 0.5) {
    val = (1 - pow(x * 2, 2)) * 2 - 1;
  } else if (x >= 0.5 && x <= 1) {
    val = (1 - pow((x - 0.5) * 2 - 1, 2)) * 2 - 1;
  } else {
    val = 0;
  }

  return val;
}

function calmnessSwitch() {
  calmness = calmness * -1;
  if (calmness) {
    calmness = 0;
  } else {
    calmness = 1;
  }
}

function underwaterSwitch() {
  underwater = underwater * -1;
}

var lineYs = [0, 15, 30, 60, 100, 115, 150];
var dotDist = 8;
var time = 0;
var ibtCounter = 0;
var ibtDir = [];
var waveLenState = [];
var noiseShape = [];
var prevWaveLen = 0;
var waveLenCache;

function draw() {
  background(220);
  


  push();
  fill(150);
  rect(0, 0, 1000, 1000);
  pop();
  
      if (max(bg.width, bg.height) == bg.width) {
    image(bg, 0,
      width / 2 - bg.height / bg.width * width / 2, width, bg.height / bg.width * width);
  } else {
    image(bg, width / 2 - bg.width / bg.height * width / 2,
      0, bg.width / bg.height * width, width);
  }

  angleMode(DEGREES);
  frameRate(24);

  var calmnessVal = calmnessSlider.value();
  var waveLen;
  var amp;
  var speed;
  var xOffset;
  var ibt = 60;
  var ibtPlus;
  var vertCycle;
  var noiseVal;
  var peak;

  if (calmness) {
    waveLen = pow(2, int(map(calmnessVal, 0, 1, preset.waveLen[0], preset.waveLen[1])));
    amp = map(calmnessVal, 0, 1, preset.amp[0], preset.amp[1]);
    speed = map(calmnessVal, 0, 1, preset.speed[0], preset.speed[1]);
    xOffset = map(calmnessVal, 0, 1, preset.xOffset[0], preset.xOffset[1]);
    ibtPlus = map(calmnessVal, 0, 1, preset.ibt[0], preset.ibt[1]);
    vertCycle = map(calmnessVal, 0, 1, preset.vertCycle[0], preset.vertCycle[1]);
    noiseVal = map(calmnessVal, 0, 1, preset.noise[0], preset.noise[1]);
    peak = map(calmnessVal, 0, 1, preset.peak[0], preset.peak[1]);
  } else {
    waveLen = pow(2, waveLenSlider.value());
    amp = ampSlider.value();
    speed = speedSlider.value();
    xOffset = xOffsetSlider.value();
    ibtPlus = ibtSlider.value();
    vertCycle = vertCycleSlider.value();
    noiseVal = noiseSlider.value();
    peak = peakSlider.value();
  }

  if (waveLen !== prevWaveLen) {
    waveLenCache = waveLen;
  }

  prevWaveLen = waveLen;



  noStroke();
  fill(0);

  push();
  translate(0, 1000 / 2);

  if (modes == 'play' || modes == 'record') {
    var linesArr = [];
    for (var i = 0; i < lineYs.length; i++) {
      var ibtState = (ibtCounter + int((i / lineYs.length) * ibt * vertCycle)) % ibt;

      if (ibtState == 0 || ibtDir[i] == null) {
        ibtDir[i] = round(random()) * 2 - 1;
      }

      var dotsArr = [];

      for (var j = 0; j <= width / dotDist; j++) {
        var x = j * dotDist;

        var ibtVal = ibtDir[i] * (-cos(ibtState / ibt * 180) / 2 + 0.5);
        var ibtRatio = cos(ibtState / ibt * 360) / 2 + 0.5;
        var ibtRatioRev = -cos(ibtState / ibt * 360) / 2 + 0.5;

        if (ibtRatio >= -ibtPlus / 50 && ibtRatio <= ibtPlus / 50 || waveLenState[i] == null) {
          waveLenState[i] = waveLenCache;
          noiseShape[i] = random() * 100;
        }

        var waveY1 =
          cos((x / (width / waveLenState[i]) + xOffset * i + ibtVal) * 360 + time);
        var waveY2 =
          sharpWave((x + width + (xOffset * i + ibtVal + time / 360) * (width / waveLenState[i])) % (width / waveLenState[i]) / (width / waveLenState[i]));

        var waveY = ibtRatio * //(0.4 + ibtRatio * 0.6) *
          (waveY1 * (1 - peak) + waveY2 * (peak));

        x =
          x + (noise((i * (width / dotDist) + j + noiseShape[i]) * 0.02) - 0.5) * noiseVal * 30;
        x =
          x - ibtRatio * (dotDist * waveY1) * ibtRatioRev * ibtDir[i];

        var r = 2 + 10 * (waveY + 1) * ibtRatio; //(waveY * underwater + 0.5) * 5 * ibtRatio;

        waveY =
          waveY + ibtRatio * (noise((i * (width / dotDist) + j + noiseShape[i]) * 0.02) - 0.5) * noiseVal / 5;

        var y =
          lineYs[i] + amp * waveY;

        if (ibtRatio < -ibtPlus / 50 || ibtRatio > ibtPlus / 50) {
          ellipse(x, y, r, r);
          dotsArr.push({
            x: x,
            y: y,
            weight: (waveY + 1) * ibtRatio / 2,
            light: ibtRatio
          })
        }
      }

      linesArr.push(dotsArr);
    }

    if (modes == 'record' && frameCount % 2 == 0) {
      framesArr.push(linesArr)
    }

    time = time + speed;
    ibtCounter = ibtCounter + ibtPlus;

  } else {
    stroke(255, 0, 0, 128);
    noFill();
    for (var ii = 0; ii < lineYs.length; ii++) {
      line(0, lineYs[ii], width, lineYs[ii]);
    }
  }

  if (modes == 'draw') {
    stroke(255);
    noFill();
    line(0, mouseY - 500, width, mouseY - 500);
  }
  pop();

  push();
  noFill();
  strokeWeight(10);
  if (modes == 'play') {
    stroke(0, 255, 0);
  } else if (modes == 'record') {
    stroke('RED');
  } else if (modes == 'draw') {
    stroke('BLUE');
    fill(255, 255, 255, 125);
  } else {
    noStroke();
  }

  rect(0, 0, 1000, 1000);
  noStroke();
  fill(220);
  rect(0, 1000 + 2.5, 1000, 200 - 2.5);
  pop();

  if (exportArr.length > 0 && frameCount % 2 == 0) {
    saveStrings([exportArr[0]], exportNameInput.value() + exportCounter, 'xst');
    exportCounter ++;
    exportArr.shift();
  }

  textAlign(LEFT, TOP);
  text('waveLen: ' + waveLen, 120, 1000 + 10);
  text('amp: ' + amp, 120, 1000 + 10 + 20);
  text('speed: ' + speed, 120, 1000 + 10 + 20 * 2);
  text('xOffset: ' + xOffset, 120, 1000 + 10 + 20 * 3);
  text('ibtPlus: ' + ibtPlus, 120, 1000 + 10 + 20 * 4);
  text('verCycle: ' + vertCycle, 120, 1000 + 10 + 20 * 5);
  text('noise: ' + noiseVal, 120, 1000 + 10 + 20 * 6);
  text('peak: ' + peak, 120, 1000 + 10 + 20 * 7);
  text('underwater: ' + underwater, width * 0.25 + 110, 1000 + 10);
  text('calmness: ' + calmness, width * 0.25 + 110, 1000 + 10 + 20);
  text('calmnessVal: ' + calmnessVal, width * 0.25 + 110, 1000 + 10 + 20 * 2);
  text('Recorded Frames: ' + framesArr.length, width / 2 + 110, 1000 + 10 + 20 * 2);

}