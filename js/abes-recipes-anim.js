// 0 = Talk
// 1 = like 0

charPerLine=30;
document.bgColor="black";
function writeOut(s) {
 zwi="";
 for (i=0;i<1-s.length/charPerLine;i++) {zwi+="<br>";}
 while (window.frames[1]==null) {}
 with (window.frames[1].document) {
  close();
  open();
  write("<html><body bgColor=\"black\"><h5 align=center style=\"font-size: 12pt; color: white\">"+zwi+s+"</h5></body></html>");
 }
}
function exec(s) {
 anim=s.charAt(0);
 s=s.substring(2,s.length);
 writeOut(s);
 len=s.length/4;
 setTimeout("anim"+anim+"("+len+")",0)
}
// animation subroutines
picIdle=new Image();
picIdle.src="../../img/abes-recipes/picIdle.jpg";
pic0=new Array(5);picInit(pic0,5,'0');
pic1=new Array(4);picInit(pic1,4,'1');
picW=new Array(4);picInit(picW,4,'W');
queueSize=100;
commandQueue=new Array(queueSize);
speedQueue=new Array(queueSize);
queueInit();
function picInit(picNum,subNum,typeChar) {
 for (i=0;i<subNum;i++) {
  picNum[i]=new Image();
  picNum[i].src="../../img/abes-recipes/pic"+typeChar+i+".jpg";
 }
}
function queueInit() {
 comQueueReadPos=0;
 comQueueWritePos=0;
}
function queueTop() {
 if (comQueueReadPos!=comQueueWritePos) {
  speed=speedQueue[comQueueReadPos];
  return commandQueue[comQueueReadPos];
 }
 else {return null};
}
function queuePop() {
 zwi=queueTop();
 if (zwi!=null) {
  comQueueReadPos++;
  if (comQueueReadPos==queueSize) {comQueuePos=0;}
 }
 return zwi;
}
function queuePush(zwi,sudu) {
 speedQueue[comQueueWritePos]=sudu;
 commandQueue[comQueueWritePos++]=zwi;
 if (comQueueWritePos==queueSize) {comQueuePos=0;}
}
function queueSpeed() {
 return speed;
}
function anim0(len) {
 bT=40;
 queueInit();
 j=0;
 for (i=0;i<len;i++) {
  if (j<1) {
   queuePush(picIdle,bT*1.3);
   if (j<0.7) {
    queuePush(pic0[0],bT*1.6);
    queuePush(picIdle,bT*1.3);
   }
   j=Math.random()*4+1;
  }
  queuePush(pic0[4],bT*1.4);
  queuePush(pic0[1],bT);
  queuePush(pic0[3],bT*1.5);
  queuePush(pic0[1],bT);
  queuePush(pic0[4],bT*1.4);
  queuePush(pic0[2],bT*2);
  j--;
 }
 queuePush(picIdle,bT);
 queuePush(pic0[0],bT);
 clearTimeout(timerID);
 timerID=setTimeout("animPlayer()",0);
}
function anim1(len) {
 anim0(len);
}
function animW() {
 if (true) {
  bT=100;
  queueInit();
  queuePush(picW[0],bT);
  queuePush(picW[2],bT);
  queuePush(picW[3],bT*1.5);
  queuePush(picW[2],bT);
  queuePush(picW[0],bT);
  clearTimeout(timerID);
  timerID=setTimeout("animPlayer()",0);
 }
}
function setPic(pic) {
 window.frames[0].document.animFrame.src=pic.src;
}
// the heart: animPlayer
timerID=null;
function animPlayer() {
 zwi=queuePop();
 if (zwi!=null) {
  clearTimeout(timerID);
  setPic(zwi);
  timerID=setTimeout("animPlayer()",queueSpeed());
 }
 else {
  setPic(picIdle);
  clearTimeout(timerID);
  timerID=setTimeout("animW()",Math.random()*6000+3000);
 }
}
