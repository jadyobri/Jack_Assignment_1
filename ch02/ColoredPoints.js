// ColoredPoint.js (c) 2012 matsuda
// Vertex shader program
var VSHADER_SOURCE =
  `attribute vec4 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = a_Position;
    //gl_PointSize = 10.0;
    gl_PointSize = u_Size;
    
  }`;

// Fragment shader program
var FSHADER_SOURCE =
  `precision mediump float;
  uniform vec4 u_FragColor;
  void main() {
    gl_FragColor = u_FragColor;
  }`;

let canvas;
let gl;
let a_Position;
let u_FragColor;
let u_Size;
let u_Seg;

function setupWebGL(){
  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  // Get the rendering context for WebGL
  // gl = getWebGLContext(canvas);

  gl = canvas.getContext("webgl", {preserveDrawingBuffer: true});
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
}

function connectVariablesToGLSL(){
  // Initialize shaders
  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // // Get the storage location of a_Position
  a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if (a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return;
  }

  // Get the storage location of u_FragColor
  u_FragColor = gl.getUniformLocation(gl.program, 'u_FragColor');
  if (!u_FragColor) {
    console.log('Failed to get the storage location of u_FragColor');
    return;
  }
  u_Size = gl.getUniformLocation(gl.program, 'u_Size');
  if (!u_Size) {
    console.log('Failed to get the storage location of u_Size');
    return;
  }

}

const POINT = 0;
const TRIANGLE = 1;
const CIRCLE = 2;

//Used chat GPT for help on placing these.
function drawPicture() {
   gl.uniform4f(u_FragColor, 1.0, 0.0, 0.0, 1.0); 
   drawTriangle([
     -0.3,  0.0,  
      0.0,  0.5,
      0.3,  0.0
   ]);
 
   gl.uniform4f(u_FragColor, 0.5, 0.3, 0.0, 1.0); // brownish
   // left half
   drawTriangle([
     -0.3,  0.0,
     -0.3, -0.3,
      0.3, -0.3
   ]);
   // right half
   drawTriangle([
     -0.3,  0.0,
      0.3, -0.3,
      0.3,  0.0
   ]);
 

   gl.uniform4f(u_FragColor, 0.3, 0.15, 0.0, 1.0);
   drawTriangle([
     -0.05, -0.3,
     -0.05, -0.15,
      0.05, -0.3
   ]);
   drawTriangle([
     -0.05, -0.15,
      0.05, -0.15,
      0.05, -0.3
   ]);
 

   gl.uniform4f(u_FragColor, 0.8, 0.95, 1.0, 1.0); // light-blue "glass"
   drawTriangle([
     -0.25, -0.1,
     -0.25, -0.2,
     -0.15, -0.2
   ]);
   drawTriangle([
     -0.25, -0.1,
     -0.15, -0.2,
     -0.15, -0.1
   ]);
   // Right window
   drawTriangle([
     0.15, -0.1,
     0.15, -0.2,
     0.25, -0.2
   ]);
   drawTriangle([
     0.15, -0.1,
     0.25, -0.2,
     0.25, -0.1
   ]);
 
 
   // 1) Trunk (2 triangles)
   gl.uniform4f(u_FragColor, 0.55, 0.27, 0.07, 1.0);
   drawTriangle([
     -0.8, -0.3,
     -0.8, -0.15,
     -0.7, -0.3
   ]);
   drawTriangle([
     -0.7, -0.3,
     -0.8, -0.15,
     -0.7, -0.15
   ]);
 
   // 2) Leaves: 3 triangles forming a cone
   gl.uniform4f(u_FragColor, 0.0, 0.6, 0.0, 1.0);
   // bottom
   drawTriangle([
     -0.85, -0.15,
     -0.65, -0.15,
     -0.75,  0.0
   ]);
   // middle
   drawTriangle([
     -0.83,  0.0,
     -0.67,  0.0,
     -0.75,  0.15
   ]);
   // top
   drawTriangle([
     -0.80,  0.15,
     -0.70,  0.15,
     -0.75,  0.25
   ]);
 
 

   gl.uniform4f(u_FragColor, 0.7, 0.65, 0.5, 1.0); // a light tan
   // Let's start at x=0.35 and step over by 0.05 each
   let startX = 0.35;
   for (let i = 0; i < 4; i++) {
     let leftX  = startX + i * 0.05; 
     let rightX = leftX + 0.03; // each post is 0.03 wide
     // bottom half
     drawTriangle([
       leftX, -0.3,
       leftX, -0.1,
       rightX, -0.3
     ]);
     // top half
     drawTriangle([
       leftX, -0.1,
       rightX, -0.3,
       rightX, -0.1
     ]);
   }
   // That’s 4 fence posts → 8 triangles.
 

   //sun, inspired from circles
   gl.uniform4f(u_FragColor, 1.0, 1.0, 0.0, 1.0); // yellow
   let centerX = -0.75;
   let centerY = 0.75;
   let r = 0.12;    // radius
   let wedgeNum = 6; 
   let angleStep = (2 * Math.PI) / wedgeNum;  // in radians
 
   for (let j = 0; j < wedgeNum; j++) {
     let angle1 = j * angleStep;
     let angle2 = (j + 1) * angleStep;
     // compute wedge corners
     let x1 = centerX + Math.cos(angle1) * r;
     let y1 = centerY + Math.sin(angle1) * r;
     let x2 = centerX + Math.cos(angle2) * r;
     let y2 = centerY + Math.sin(angle2) * r;
     drawTriangle([
       centerX, centerY,
       x1, y1,
       x2, y2
     ]);
   }
 

   // We'll do 3 "blobs," each is 2 triangles => circle-ish lumps
   gl.uniform4f(u_FragColor, 1.0, 1.0, 1.0, 1.0); // white
   // Each "blob" = a small rectangle with 2 triangles? We'll do something more "round"
   // or we can do a triangle fan for each. For simplicity, do 2 triangles per blob:
 
   // Blob 1
   drawTriangle([
     0.65, 0.65,
     0.75, 0.65,
     0.65, 0.75
   ]);
   drawTriangle([
     0.75, 0.65,
     0.65, 0.75,
     0.75, 0.75
   ]);
 
   // Blob 2 (shifted slightly)
   drawTriangle([
     0.70, 0.65,
     0.80, 0.65,
     0.70, 0.75
   ]);
   drawTriangle([
     0.80, 0.65,
     0.70, 0.75,
     0.80, 0.75
   ]);
 
   // Blob 3
   drawTriangle([
     0.75, 0.70,
     0.85, 0.70,
     0.75, 0.80
   ]);
   drawTriangle([
     0.85, 0.70,
     0.75, 0.80,
     0.85, 0.80
   ]);


}

//Global related UI elements
let g_selectedColor = [1.0,1.0,1.0,1.0]; 
let g_selectedSize = 10;
let g_segmentAmount = 5;
let g_selectedType = POINT;

function addActionsForHtmlUI(){
  
  //Button Events (Shape Type)
  document.getElementById('green').onclick = function() {g_selectedColor = [0.0,1.0,0.0,1.0];};
  document.getElementById('red').onclick = function() {g_selectedColor = [1.0,0.0,0.0,1.0];};
  document.getElementById('clearButton').onclick = function() {g_shapesList = []; renderAllShapes();};

  document.getElementById('pointButton').onclick = function() {g_selectedType=POINT};
  document.getElementById('triButton').onclick = function() {g_selectedType=TRIANGLE};
  document.getElementById('circleButton').onclick = function() {g_selectedType=CIRCLE};
  // Color Slider Events
  document.getElementById('redSlide').addEventListener('mouseup', function() { g_selectedColor[0] = this.value/100;});
  document.getElementById('greenSlide').addEventListener('mouseup', function() { g_selectedColor[1] = this.value/100;});
  document.getElementById('blueSlide').addEventListener('mouseup', function() { g_selectedColor[2] = this.value/100;});
  document.getElementById('segSlide').addEventListener('mouseup', function() { g_segmentAmount = parseInt(this.value, 10);});


  document.getElementById('drawPictureButton').onclick = drawPicture;

  // Size Slider Events
  document.getElementById('sizeSlide').addEventListener('mouseup', function() { g_selectedSize = this.value; // Update the shader uniform
    }); 
}
function main() {
  //Set up canvas and gl variables
  setupWebGL();

  //Set up GLSL shader programs and connect GLSL variables
  connectVariablesToGLSL();

  addActionsForHtmlUI();

  // Register function (event handler) to be called on a mouse press
  canvas.onmousedown = click;
  canvas.onmousemove = function(ev){if(ev.buttons == 1){click(ev)}};

  // Specify the color for clearing <canvas>
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);
}

var g_points = [];  // The array for the position of a mouse press
var g_colors = [];  // The array to store the color of a point
var g_sizes = [];
var g_segments = [];


var g_shapesList = [];

function convertCoordinatesEventToGL(ev){
  var x = ev.clientX; // x coordinate of a mouse pointer
  var y = ev.clientY; // y coordinate of a mouse pointer
  var rect = ev.target.getBoundingClientRect();

  x = ((x - rect.left) - canvas.width/2)/(canvas.width/2);
  y = (canvas.height/2 - (y - rect.top))/(canvas.height/2);
  return ([x, y]);
}



function renderAllShapes(){
  // Clear <canvas> (makes sure screen stays black when reloading)
  var startTime = performance.now();

  gl.clear(gl.COLOR_BUFFER_BIT);

  var len = g_shapesList.length;

  for(var i = 0; i < len; i++) {
    g_shapesList[i].render();

  }

  var duration = performance.now() - startTime;
  sendTextToHTML("numdot: " + len + "ms: "+ Math.floor(duration) + "fps: " + Math.floor(10000/duration), "numdot");

}
function sendTextToHTML(text, htmlID){
  var htmlElm = document.getElementById(htmlID);
  if(!htmlID){
    console.log("Failed to get "+ htmlID + " from HTML");
    return;
  }
  htmlElm.innerHTML = text;
}
function click(ev) {
  let [x,y] = convertCoordinatesEventToGL(ev)

  let point;
  if(g_selectedType==POINT){
    point = new Point();
  }
  else if(g_selectedType==TRIANGLE){
    point = new Triangle();
  }
  else{
    point = new Circle();
    console.log("Segments: "+ g_segmentAmount);
    point.segments = g_segmentAmount;
  }
  point.position = [x,y];
  point.color = g_selectedColor.slice();
  point.size = g_selectedSize;
  g_shapesList.push(point);



  // // Store the coordinates to g_points array
  // g_points.push([x,y]);

  // //pushes a pointer, .slice() used to make existing points not change color
  // g_colors.push(g_selectedColor.slice());
  // //Same as g_colors.push(g_selectedColor[0],g_selectedColor[1],g_selectedColor[2],g_selectedColor[3]);

  // g_sizes.push(g_selectedSize);

  // // Store the coordinates to g_points array
  // if (x >= 0.0 && y >= 0.0) {      // First quadrant
  //   g_colors.push([1.0, 0.0, 0.0, 1.0]);  // Red
  // } else if (x < 0.0 && y < 0.0) { // Third quadrant
  //   g_colors.push([0.0, 1.0, 0.0, 1.0]);  // Green
  // } else {                         // Others
  //   g_colors.push([1.0, 1.0, 1.0, 1.0]);  // White
  // }

  renderAllShapes();
}
