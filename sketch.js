var myCanvas;
var Lemur;
var LemurNight;
var Song;
var NightSounds;
var myAmplitude;
var EQ;
var drop = [];

function preload(){
   Song = loadSound('./assets/atom ant.mp3');
   NightSounds = loadSound('./assets/nightsounds.mp3');
   Lemur = loadImage('./assets/lemur.png');
   LemurNight = loadImage('./assets/lemurnight.png');
}

function setup() {
   background(155,25,120);
   angleMode(DEGREES);
   
   myCanvas = createCanvas(windowWidth,windowHeight);
   myAmplitude = new p5.Amplitude();
   Song.loop();
   Song.playMode('sustain');
   
   for (var k=0; k<500; k++) {
      drop[k] = new Drop();
   }
  
   EQ = new p5.FFT();
   Song.connect(EQ);
   myCanvas.mouseClicked (function() {
      if(Song.isPlaying()===true) {
         Song.pause();
         NightSounds.play();
         } else {
            Song.play();
            NightSounds.pause();
         }
   })
}

function draw() {
   background(155,25,120,20);
   
   if(width>height) {
      D=height;
   } else {
     D=width;
   }
   
   if(width>height) {
      D=width;
   } else {
     D=height;
   }
   
   var A = 1200;
   var B = 794;
   image(Lemur,windowWidth/2-A*D/2400,windowHeight/2-B*D/2200,A*D/1200,B*D/1200);
   tint(255,120);
   if(Song.isPlaying()===true) {
      fill(200,200,200,200);
      textSize(25*D/800);
      textFont('VT323');
      textAlign(LEFT);
      text("Hit the click, go to sleep",20*D/800,50*D/800);
      blendMode(BLEND);
      } else {
         push();
         for (var k=0; k<500; k++) {
            drop[k].show();
            drop[k].update();
         }
         image(LemurNight,windowWidth/2-A*D/2400,windowHeight/2-B*D/2200,A*D/1200,B*D/1200);
         blendMode(MULTIPLY);
         pop();
   }
   
   
   var spectrum = EQ.analyze();

   push();
   for (var i = 0; i< spectrum.length; i+=10) {
      var X1 = map(i, 0, spectrum.length/2, 0, width);
      var H1 = -height + map(spectrum[i], 0, 255, height, 0);
      fill(91,241,25,15);
      noStroke();
      rect(X1,height,width/spectrum.length*10,H1);
   pop();
   }

   push();
   for (var j = -20; j< spectrum.length; j+=10) {
      var X2 = map(j, 0, spectrum.length/4, 0, width);
      var H2 = -height + map(spectrum[j]+10, 0, 255, height, 0);
      fill(225,45,175,25);
      noStroke();
      rect(X2,height,width/spectrum.length*10,H2);
   pop();
   }
}

function Drop() {
   this.x = random(0,windowWidth);
   this.y = random(0,-windowHeight);
   this.show = function() {
      noStroke();
      fill(200,200,200,50);
      ellipse(this.x,this.y,5,30);
   }
   
   this.update = function() {
      this.speed = random(8,15);
      this.gravity = 1.1;
      this.y = this.y + this.speed*this.gravity;
      
      if (this.y > windowHeight) {
         this.y = random(0,-windowHeight);
      }
   }
}

function windowResized(){
  resizeCanvas(windowWidth,windowWidth);
}
