const canvas= document.querySelector('canvas');

canvas.width=window.innerWidth;
canvas.height=window.innerHeight;

const c=canvas.getContext('2d');


c.fillRect(0,0,canvas.width,canvas.height);

const collisionsMap=[];
for(let i=0;i<collisions.length;i+=70){
    collisionsMap.push(collisions.slice(i,i+70));
}

const battleZoneMap=[];
for(let i=0;i<battleZones.length;i+=70){
    battleZoneMap.push(battleZones.slice(i,i+70));
}

const container1= document.querySelector('#container');
const container2= document.querySelector('#container2');

const para= document.querySelector('#para');


// container1.style.display='block';
// container2.style.display='none';


const offset={
    x: -735,
    y: -620
}

const boundaries=[]

collisionsMap.forEach((row,i) => {
    row.forEach((symbol,j) =>{
        if(symbol){
            boundaries.push(
                new Boundary({
                    position: {
                        x:j*Boundary.width+offset.x,
                        y: i*Boundary.height+offset.y
                    }
                })
            )
        }
    })
});

//console.log(boundaries);

const battleZone=[]

battleZoneMap.forEach((row,i) => {
    row.forEach((symbol,j) =>{
        if(symbol){
            battleZone.push(
                new Boundary({
                    position: {
                        x:j*Boundary.width+offset.x,
                        y: i*Boundary.height+offset.y
                    }
                })
            )
        }
    })
});

//console.log(battleZone);

const image=new Image();
image.src='./Images/Pellet Town.png';

const bGimage=new Image();
bGimage.src='./Images/foreground.png';

const playerDownimage=new Image();
playerDownimage.src='./Images/playerDown.png';

const playerUpimage=new Image();
playerUpimage.src='./Images/playerUp.png';

const playerLeftimage=new Image();
playerLeftimage.src='./Images/playerLeft.png';

const playerRightimage=new Image();
playerRightimage.src='./Images/playerRight.png';


const player=new positioning({
    position: {
        x: canvas.width/2 -225,
        y: canvas.height/2-115
    },
    image: playerDownimage,
    frames:4,
    hold:10

})

console.log(player.position);

const keys={
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    }
}


const background=new positioning({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: image,
    frames:1
})

const bG=new positioning({
    position: {
        x: offset.x,
        y: offset.y
    },
    image: bGimage,
    frames:1
})


function rectangularCollisions({rectangle1, rectangle2}){
    return(
        rectangle1.position.x+rectangle1.width>=rectangle2.position.x &&
        rectangle1.position.x<=rectangle2.position.x+rectangle2.width &&
        rectangle1.position.y<=rectangle2.position.y+rectangle2.height &&
        rectangle1.position.y+rectangle1.height>=rectangle2.position.y
        )
}

const movables=[background,...boundaries,bG,...battleZone]
let battleInitiate=false;
function animate(){
    const animateId=window.requestAnimationFrame(animate);
   //console.log("ji");
    background.draw();
    boundaries.forEach(boundary =>{
        boundary.draw();
        
    })
    battleZone.forEach(boundary=>{
        boundary.draw();
    })
    player.draw();
    bG.draw();
    
    let moving=true;
    player.animate=false;

    if(battleInitiate) return;

    if(keys.w.pressed|| keys.a.pressed||keys.s.pressed||keys.d.pressed){
        for(let i=0;i<battleZone.length;i++){
            const battleArea=battleZone[i];
            const overlappingArea=(Math.min(player.position.x+player.width,battleArea.position.x+battleArea.width)
            -Math.max(player.position.x,battleArea.position.x))*
            (Math.min(player.position.y+player.height,battleArea.position.y+battleArea.height)-Math.max(player.position.y,battleArea.position.y));
                    
            if(rectangularCollisions({
                rectangle1: player,
                rectangle2: battleArea
            }) && 
            overlappingArea>(player.width*player.height)/2
            &&
            Math.random()<0.03){
                    console.log("colliding in battle area");
                     battleInitiate=true;
                     audio.Map.stop();
                     audio.initBattle.play();
                     audio.battle.play();
                     //deactivate current animation loop
                    window.cancelAnimationFrame(animateId);
                    para.style.display='none';

                     gsap.to('#overLapping',{
                        opacity:1,
                        repeat: 3,
                        yoyo:true,
                        duration: 0.4,
                        onComplete(){
                            gsap.to('#overLapping',{
                                opacity:1,
                                duration: 0.4,
                                onComplete(){
                                    initBattle();
                                    animateBattle()
                                    gsap.to('#overLapping',{
                                       opacity:0,
                                       duration:0.4
                                    })
                                }
                            })

                    //activate new animation
                    initBattle();
                    animateBattle();
                        }
                    })
                    break;
                }
        }
    }
         if(keys.w.pressed && lastkey==='w') {
            player.image=playerUpimage;
            player.animate=true;
            for(let i=0;i<boundaries.length;i++){
                const boundary=boundaries[i];
                if(rectangularCollisions({
                    rectangle1: player,
                    rectangle2: {...boundary,
                        position:{
                        x:boundary.position.x,
                        y: boundary.position.y+3
                    }}
                })){
                        //console.log("colliding");
                        moving=false;
                        break;
                    }
            }

          
            //console.log(moving);
            if(moving){
            movables.forEach(movable=>{
            movable.position.y+=3;
         })
        }
        }
         else if(keys.a.pressed && lastkey==='a'){
            player.animate=true;
            player.image=playerLeftimage;
            for(let i=0;i<boundaries.length;i++){
                const boundary=boundaries[i];
                if(rectangularCollisions({
                    rectangle1: player,
                    rectangle2: {...boundary,
                        position:{
                        x:boundary.position.x+3,
                        y: boundary.position.y
                    }}
                })){
                        //console.log("colliding");
                        moving=false;
                        break;
                    }
            }

           // console.log(moving);
            if(moving){
            movables.forEach(movable=>{
            movable.position.x+=3;
         })
        }
         } 
         else if(keys.s.pressed && lastkey==='s'){
            player.animate=true;
            player.image=playerDownimage;
            for(let i=0;i<boundaries.length;i++){
                const boundary=boundaries[i];
                if(rectangularCollisions({
                    rectangle1: player,
                    rectangle2: {...boundary,
                        position:{
                        x:boundary.position.x,
                        y: boundary.position.y-3
                    }}
                })){
                        //console.log("colliding");
                        moving=false;
                        break;
                    }
            }

           //nsole.log(moving);
            if(moving){
            movables.forEach(movable=>{
            movable.position.y-=3;
         })
        }
         }
         else if(keys.d.pressed && lastkey==='d'){
            player.image=playerRightimage;
            player.animate=true;
            for(let i=0;i<boundaries.length;i++){
                const boundary=boundaries[i];
                if(rectangularCollisions({
                    rectangle1: player,
                    rectangle2: {...boundary,
                        position:{
                        x:boundary.position.x-3,
                        y: boundary.position.y
                    }}
                })){
                        //console.log("colliding");
                        moving=false;
                        break;
                    }
            }

            // console.log(moving);
            if(moving){
            movables.forEach(movable=>{
            movable.position.x-=3;
         })
        }
         }

        
}

 //console.log(charmander.attacks[0]);

 

animate();



window.addEventListener('keydown',(e)=>{
    switch(e.key){
        case 'w':
            keys.w.pressed=true;
            lastkey="w";
            break;
        case 'a':
            keys.a.pressed=true;
            lastkey="a";
            break;
        case 's':
            keys.s.pressed=true;
            lastkey="s";
            break;
        case 'd':
            keys.d.pressed=true;
            lastkey="d";
            break;

    }
})

window.addEventListener('keyup',(e)=>{
    switch(e.key){
        case 'w':
            keys.w.pressed=false;
            break;
        case 'a':
            keys.a.pressed=false;
            break;
        case 's':
            keys.s.pressed=false;
            break;
        case 'd':
            keys.d.pressed=false;
            break;

    }
})

let clicked=false;
document.querySelector('#start-button').addEventListener('click',()=>{
    if(!clicked){
        audio.Map.play();
        clicked=true;
        document.querySelector('#container').style.display= 'none';
        para.style.display='block';
    }
})
document.querySelector('#start-button2').addEventListener('click',()=>{

    score=0;
    scoreEl.innerHTML=0;
    para.style.display='block';
    audio.Map.play();
    document.querySelector('#container2').style.display= 'none';
 //   window.cancelAnimationFrame(animateId);
    animate();
    //console.log(player.position);
        
})



// console.log(keys);

