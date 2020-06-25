const socket = io.connect("https://devblackboard.herokuapp.com/");
const snbar=document.createElement("div");
const wpad=document.createElement("textArea");

const ic=document.createElement("div");
ic.setAttribute("class","icons");
ic.innerHTML='<img class="X" src="CloseButton.svg" height=25px align="right"><img src="mini.png" id="mini" height=25px align="right">';
snbar.append(ic);

snbar.setAttribute("class","sbar");
wpad.setAttribute("class","wpad");

snote.appendChild(snbar);
snote.appendChild(wpad);

const min=document.getElementById('mini');
min.addEventListener("click",function(e){
    if(wpad.style.display=='none')
        wpad.style.display='block';
    else
        wpad.style.display='none';
});

let inx=null;
let iny=null;
let undoStack=[];

function work(tool){

if(tool=='p'||tool=='e'){
    board.addEventListener("mousedown",function(e){
        isMouseDown=true;
        ctx.beginPath();
        var h=e.clientX
        var k=e.clientY-y
        let point={
            x:h,
            y:k,
            type:'start',
            color:ctx.strokestlye,
            width:ctx.lineWidth
        }
        ctx.moveTo(h,k);
        undoStack.push(point);
        socket.emit("start",point)
    })


    board.addEventListener("mousemove",function(e){
        if(!isMouseDown)
            return; 
        var h=e.clientX
        var k=e.clientY-y
        ctx.lineTo(h,k); 
        ctx.stroke(); 
        let point={
            x:h,
            y:k,
            type:'end',
            color:ctx.strokestlye,
            width:ctx.lineWidth
        }
        undoStack.push(point)
        socket.emit("end",point)
    })


    board.addEventListener("mouseup",function(){
        isMouseDown=false;
        ctx.closePath();
        return;
    });
}
else if(tool=='sn'){
    let isStickyDown=false;
    snote.addEventListener("mousedown",function(e){
        inx=e.clientX;
        iny=e.clientY;
        isStickyDown=true;
    })
    
    
    snote.addEventListener("mousemove",function(e){
            if(!isStickyDown)
                return;
            let fx=e.clientX;
            let fy=e.clientY;
            let dx=fx-inx;
            let dy=fy-iny;
            let {top,left}=snote.getBoundingClientRect();
            snote.style.top=top+dy+'px';
            snote.style.left=left+dx+'px';
            inx=fx;
            iny=fy;
    })
    
    snote.addEventListener("mouseleave",function(){
        isStickyDown=false;
    });
    
    snote.addEventListener("mouseup",function(){
        isStickyDown=false;
    });
}

}

undo=document.querySelector(".undo");
undo.addEventListener("click",function(){
    ctx.fillRect(0,0,board.width,board.height)
    undoStack.pop();
    redraw();
})
function redraw(){
    for(let i=0;i<undoStack.length;i++){
        let {x,y,type,color,width}=undoStack[i];
        ctx.strokestlye=color;
        ctx.lineWidth=width
        if(type=='start'){
            ctx.beginPath();
            ctx.moveTo(x,y);
        }
        else if(type=='end'){
            ctx.lineTo(x,y)
            ctx.stroke()
        }
    }
}
const X=document.querySelector(".X");
X.addEventListener("click",function(){
    snote.style.display='none';
})
function download(){
    var link = document.createElement('a');
    link.download = 'filename.png';
    // canvas board => link
    link.href = board.toDataURL("image/png");
    // click 
    link.click();
  }

  const inputTag=document.getElementById("inputFile");

  
  inputTag.addEventListener("change",function(){
      const imgFile=inputTag.files[0];
      const img = document.createElement("img");

      img.src = URL.createObjectURL(imgFile);
      
      img.height = 60;
      const body=document.querySelector("body");
      body.appendChild(img);
      
      /*let img1=new Image();
      img1.src=img.src;
      img1.onload = function () {
        ctx.drawImage(img1, 0, 0,100,60);
  }*/
  })








