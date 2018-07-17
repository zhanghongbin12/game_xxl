document.ontouchmove = function(ev){
 ev.preventDefault(); 
};
 
$(function(){
 var Game = {
 colNum : 7,
 wH : 70,
 timeBtn : true,
 defen:0,
 guanqia:Number(sessionStorage.getItem("gq"))||0,
 dir : 0,
 dirThis : null,
 init : function(){   //默认处理函数方法
 this.oUl = $('#ul1');
 this.createMap();
  
 },
 createMap : function(){   //创建一个游戏的html和样式
 this.oUl.css({width : this.colNum*this.wH , height : this.colNum*this.wH});
 var numX = 0;
 var numY = 0;
 this.oUl.html(""); 
 for(var i=0;i<Math.pow(this.colNum,2);i++){
 var oLi = $('<li>');
 oLi.attr('class','box'+ Math.floor(Math.random()*6));
  
 oLi.data({x : numX , y : numY});
  
 numX++;
  
 if( numX == this.colNum ){
  numX = 0;
  numY++;
 }
// $("#fen").text(this.defen);
 this.oUl.append( oLi );
 }
  
 this.positionShow();
  
 this.removeShow();
  
 this.bindTouch();
  
 },
 positionShow : function(){  //遍历li设置每一个li的位置
  
 this.aLi = this.oUl[0].getElementsByTagName('li');
  
 var arr = [];
 $(this.aLi).each(function(i,elem){
 arr.push( [ elem.offsetLeft , elem.offsetTop ] );
 });
 $(this.aLi).each(function(i,elem){
 $(elem).css({position : 'absolute',left : arr[i][0] , top : arr[i][1]});
  
 });
  
 this.arr = arr;
  
 },
 bindTouch : function(){ //绑定touch事件
  
 var startX = 0;
 var startY = 0;
 var This = this;
 var izIndex = 2;
 var startThis = null;
  
 this.oUl.delegate('li','touchstart mousedown',function(event){
  
  var data = event.originalEvent.changedTouches ? event.originalEvent.changedTouches[ 0 ] : event;
  startX = data.clientX;
  startY = data.clientY;
   
  startThis = this;
   
  return false;
 });
  
 this.oUl.delegate('li','touchend mouseup',function(event){
  
 var data = event.originalEvent.changedTouches ? event.originalEvent.changedTouches[ 0 ] : event;
  
 if(This.timeBtn && ( Math.abs(startX - data.clientX)>10 || Math.abs(startY - data.clientY) > 10 )){
   
 $(startThis).css('zIndex',izIndex++);
  
 if( Math.abs(startX - data.clientX) > Math.abs(startY - data.clientY) ){// 左右
  if(startX < data.clientX){ //→
   
  if( $(startThis).data('x') != This.colNum-1 ){
   
  This.dir = 1;
   
  var index = $(startThis).data('x')+1 + $(startThis).data('y')*This.colNum;
   
  var nextLi = $(This.oUl).find('li').eq(index);
   
  $(startThis).insertAfter( nextLi ); 
   
  $(startThis).animate({left : This.arr[index][0]},300); 
  nextLi.animate({left : This.arr[index-1][0]},300); 
   
  $(startThis).data('x',$(startThis).data('x')+1);
  nextLi.data('x',nextLi.data('x')-1);
   
  This.dirThis = nextLi;
   
  }
   
  }
  else{ //←
   
  if( $(startThis).data('x') != 0 ){
   
  This.dir = 2;
   
  var index = $(startThis).data('x')-1 + $(startThis).data('y')*This.colNum;
   
  var prevLi = $(This.oUl).find('li').eq(index);
   
  $(startThis).insertBefore( prevLi ); 
  $(startThis).animate({left : This.arr[index][0]},300); 
  prevLi.animate({left : This.arr[index+1][0]},300); 
   
  $(startThis).data('x',$(startThis).data('x')-1);
  prevLi.data('x',prevLi.data('x')+1);
   
  This.dirThis = prevLi;
   
  }
   
  }
 }
 else{ //上下
  
  if(startY < data.clientY){ //↓
   
  if( $(startThis).data('y') != This.colNum-1 ){
   
  This.dir = 3;
   
  var index = $(startThis).data('x') + ($(startThis).data('y')+1)*This.colNum; 
   
  var downLi = $(This.oUl).find('li').eq(index);
   
  var prevThis = $(startThis).prev();
   
  $(startThis).insertAfter( downLi ); 
  downLi.insertAfter( prevThis );
   
  $(startThis).animate({top : This.arr[index][1]},300); 
  downLi.animate({top : This.arr[index-This.colNum][1]},300); 
   
  $(startThis).data('y',$(startThis).data('y')+1);
  downLi.data('y',downLi.data('y')-1);
   
  This.dirThis = downLi;
   
  }
   
  }
  else{ //↑
  
  if( $(startThis).data('y') != 0 ){
   
  This.dir = 4;
   
  var index = $(startThis).data('x') + ($(startThis).data('y')-1)*This.colNum; 
   
  var upLi = $(This.oUl).find('li').eq(index);
   
  var prevThis = $(startThis).prev();
   
  $(startThis).insertAfter( upLi ); 
  upLi.insertAfter( prevThis );
   
  $(startThis).animate({top : This.arr[index][1]},300); 
  upLi.animate({top : This.arr[index+This.colNum][1]},300); 
   
  $(startThis).data('y',$(startThis).data('y')-1);
  upLi.data('y',upLi.data('y')+1);
   
  This.dirThis = upLi;
   
  }
   
  }
  
 }
   
  This.removeShow();
 }
  
 return false;
  
 });
 },
 removeShow : function(){  //消除相同的三个
  
 var arr = [];
 var This = this;
  
 function addArr(aLi){
  
 var prevLi = aLi[0];
 var iNum = 0;
  
 for(var i=0;i<aLi.length;i++){
  if( aLi[i].className == prevLi.className && i%7!=0 ){
  iNum++;
  }
  else{
   
  if(iNum >= 2){
  for(var j=0;j<=iNum;j++){
  arr.unshift( aLi[(i-1)-j] );
  }
  //This.defennum +=iNum;
   This.defen +=iNum;       //计算每一次的得分数
   $("#fen-content").html("当前得分：<span id='fen' class='animate'>"+This.defen +"</span>")  //赋值
    //  if(This.defennum>=20){ 
    //     setTimeout(This.jinji(This),3000);
    //  }
  }
   
  iNum = 0;
  }
  prevLi = aLi[i]; 
 }
  
 if(iNum >= 2){
  for(var j=0;j<=iNum;j++){
  arr.unshift( aLi[(i-1)-j] );
  }
   
 }
  
 }
  
 addArr(this.aLi);
 addArr(this.xyChange(this.aLi));
  
 for(var i=0;i<arr.length;i++){
  
 for(var j=0;j<this.aLi.length;j++){
  if( arr[i] == this.aLi[j] ){
  this.aLi[j].bBtn = true;
  }
 }
 }
  
 var removeNum = 0;
 var removeY = [];
 var changeArr = [];
  
 for(var i=0;i<this.aLi.length;i++){
 if( this.aLi[i].bBtn ){
  removeNum++;
  removeY.push( this.aLi[i] );
 }
 }
  
 if(removeY.length){
 this.timeBtn = false;
 this.dir = 0;
 }
 else{
 this.toReset();
 return;
 }
  
 for(var i=0;i<removeY.length;i++){
 for(var j=0;j<this.arrY[ $(removeY[i]).data('x') ].length;j++ ){
   
  if( removeY[i] == this.arrY[ $(removeY[i]).data('x') ][j] ){
  this.arrY[ $(removeY[i]).data('x') ].iNum++;
  this.arrY[ $(removeY[i]).data('x') ].splice(j,1);
  this.arrY[ $(removeY[i]).data('x') ].unshift( this.oneLi( $(removeY[i]).data('x') , this.arrY[ $(removeY[i]).data('x') ].iNum ) );
   
  }
 }
 }
  
 for(var i=0;i<this.colNum;i++){
 changeArr = changeArr.concat( this.arrY[i] );
 }
  
 var c = this.xyChange( changeArr );
 var removeYnum = 0;
  
 for(var i=0;i<removeY.length;i++){
  
 $(removeY[i]).animate({opacity:0},function(){
  $(this).remove();
   
  removeYnum++;
   
  if(removeYnum == removeY.length){
   
   
  for(var i=0;i<c.length;i++){
  This.oUl.append( c[i] );
  }
   
  var numX = 0;
  var numY = 0;
   
  for(var i=0;i<This.aLi.length;i++){
   
  $(This.aLi).eq(i).data({x : numX , y : numY});
   
  numX++;
   
  if( numX == This.colNum ){
  numX = 0;
  numY++;
  }
   
  }
   
  This.movePos();
  }
   
 });
 }
  
 },
 xyChange : function(aLi){
  
 var arr = [];
 var This = this;
 this.arrY = {};
 iNum = 0;
  
 for(var i=0;i<this.colNum;i++){
 this.arrY[i] = [];
 this.arrY[i].iNum = 0;
 }
  
 (function(){
  
 if(iNum==This.colNum){
  return;
 }
  
 for(var i=0;i<aLi.length;i++){
  if(i%This.colNum == iNum){
  arr.push( aLi[i] );
  This.arrY[iNum].push( aLi[i] );
  }
 }
 iNum++;
 arguments.callee();
  
 })();
  
 return arr;
  
 },
 oneLi : function(x,iNum){    //加入一个li
  
 var oLi = $('<li>');
 oLi.attr('class','box'+ Math.floor(Math.random()*6));
 oLi.css({ position : 'absolute' , left : x*this.wH , top : -iNum*this.wH });
 this.oUl.append( oLi );
  
 return oLi.get(0);
  
 },
 movePos : function(){  //
  
 var bBtn = true;
 var This = this;
  
 for(var i=0;i<this.aLi.length;i++){
    $(this.aLi[i]).animate({top : this.arr[i][1] },function(){
        if(bBtn){
            bBtn = false;
            
            This.timeBtn = true;
            
            This.removeShow();
        }
    });
 }
  
},
 toReset : function(){  //重新排列
  
 switch(this.dir){  //判断哪个方向的移动
 case 1:
   
  var index = $(this.dirThis).data('x')+1 + $(this.dirThis).data('y')*this.colNum;
   
  var nextLi = $(this.oUl).find('li').eq(index);
   
  $(this.dirThis).insertAfter( nextLi ); 
   
  $(this.dirThis).animate({left : this.arr[index][0]},300); 
  nextLi.animate({left : this.arr[index-1][0]},300); 
   
  $(this.dirThis).data('x',$(this.dirThis).data('x')+1);
  nextLi.data('x',nextLi.data('x')-1);
   
 break;
 case 2:
  
  var index = $(this.dirThis).data('x')-1 + $(this.dirThis).data('y')*this.colNum;
   
  var prevLi = $(this.oUl).find('li').eq(index);
   
  $(this.dirThis).insertBefore( prevLi ); 
  $(this.dirThis).animate({left : this.arr[index][0]},300); 
  prevLi.animate({left : this.arr[index+1][0]},300); 
   
  $(this.dirThis).data('x',$(this.dirThis).data('x')-1);
  prevLi.data('x',prevLi.data('x')+1);
  
 break;
 case 3:
  
  var index = $(this.dirThis).data('x') + ($(this.dirThis).data('y')+1)*this.colNum; 
   
  var downLi = $(this.oUl).find('li').eq(index);
   
  var prevThis = $(this.dirThis).prev();
   
  $(this.dirThis).insertAfter( downLi ); 
  downLi.insertAfter( prevThis );
   
  $(this.dirThis).animate({top : this.arr[index][1]},300); 
  downLi.animate({top : this.arr[index-this.colNum][1]},300); 
   
  $(this.dirThis).data('y',$(this.dirThis).data('y')+1);
  downLi.data('y',downLi.data('y')-1);
  
 break;
 case 4:
  
  var index = $(this.dirThis).data('x') + ($(this.dirThis).data('y')-1)*this.colNum; 
   
  var upLi = $(this.oUl).find('li').eq(index);
   
  var prevThis = $(this.dirThis).prev();
   
  $(this.dirThis).insertAfter( upLi ); 
  upLi.insertAfter( prevThis );
   
  $(this.dirThis).animate({top : this.arr[index][1]},300); 
  upLi.animate({top : this.arr[index+this.colNum][1]},300); 
   
  $(this.dirThis).data('y',$(this.dirThis).data('y')-1);
  upLi.data('y',upLi.data('y')+1);
  
 break;
 }
  
  
 },
 calculagraph: function (){  //倒计时任务
      var defualt = m+" : "+n;
       $("#time").html("开始计时 "+defualt);
       $("#db").html("闯关达标："+(20+Game.guanqia*5)+"分");
       $("#currtent").html("当前第"+(Game.guanqia+1)+"关");
       n = secend(n); // 秒
       m = minte(m,n);  // 分
       if(n=="59"&&m=="0-1"){
           if(Game.defen>=20+Game.guanqia*5){
               alert("恭喜通过第"+(Game.guanqia+1)+"过关！");
               Game.guanqia +=1;
               sessionStorage.setItem("gq",Game.guanqia);
               window.location.reload();

           }else{
               alert("挑战失败！你需要重新开始")
               sessionStorage.removeItem("gq");
               window.location.reload();
           }
            //当时间定格在00：00就结束
       }else{
           setTimeout(Game.calculagraph,1000);
       }
  }
 };

  Game.init();
  var m="00";
  var n = "20";
  var calcu;
  Game.calculagraph();

  function secend(o){  //秒倒计时
       var o1 = parseInt(o)-1;
       if(o1==-1){
           o1=59;
       }
       return getzore(o1); 
  }
  function minte(q,w){  //分倒计时
      if(w=="59"){
          return getzore(parseInt(q)-1);
      }else{
           return getzore(parseInt(q));
      }
  }
  function getzore(p){ //单数加上0
      if(p<10){
          return "0"+p;
      }else{
          return p;
      }
  }

});