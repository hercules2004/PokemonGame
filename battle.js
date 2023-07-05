const battleBGimage=new Image();
battleBGimage.src='./Images/My project.png';

const battleBG=new positioning({
    position: {
        x: 0,
        y: 0
    },
    image: battleBGimage,
    frames:1

})

let renderedItems,battleAnimateId,charmander,weedle,queue;
let score=0;
const scoreEl=document.querySelector('#scoreEl');
const heading1=document.querySelector('#heading1');
let maxscore=0;
const max_score=document.querySelector('#heading2');

function initBattle(){
    document.querySelector('#userInterface').style.display='block';
    document.querySelector('#dialougeBox').style.display='none';
    document.querySelector('#enemyHealthBar').style.width='100%';
    document.querySelector('#playerHealthBar').style.width='100%';
    document.querySelector('#attacksBox').replaceChildren();
    
    charmander=new Pokemon(pokemons.Charmander)
    weedle=new Pokemon(pokemons.Weedle)
    renderedItems=[weedle,charmander]
    queue=[]

    charmander.attacks.forEach((attack)=>{
        const button=document.createElement('button');
        button.innerHTML=attack.name;
        document.querySelector('#attacksBox').append(button)
    })

    document.querySelectorAll('button').forEach((button)=>{
        button.addEventListener('click',(e)=>{
            const selectedAttack=attacks[e.currentTarget.innerHTML];
            charmander.attack({
                attack:selectedAttack,
                recipient : weedle,
                renderedItems
            })
    
            if(weedle.health<=0){
                queue.push(()=>{
                weedle.faint();
                score++;
                })
                queue.push(()=>{
                    gsap.to('#overLapping',{
                        opacity: 1,
                        onComplete: ()=>{
                            console.log("gush");
                            cancelAnimationFrame(battleAnimateId);
                        //   console.log(battleAnimateId);
                           animate();
                             document.querySelector('#userInterface').style.display='none';
                        scoreEl.innerHTML=score;
                            para.style.display='block';
                            gsap.to('#overLapping',{
                                opacity: 0
                            }),
                            battleInitiate=false;
                            audio.Map.play();
                        }
                    })
                })
            }

            const randomAttack= weedle.attacks[Math.floor(Math.random()* weedle.attacks.length)]
            
            queue.push(()=>{
                weedle.attack({
                    attack:randomAttack,
                    recipient : charmander,
                    renderedItems
                })
                if(charmander.health<=0){
                    queue.push(()=>{
                        charmander.faint();
                       // maxscore=max(maxscore,score);
                       if(maxscore<score) maxscore=score;
                        })   
                        queue.push(()=>{
                            gsap.to('#overLapping',{
                                opacity: 1,
                                onComplete: ()=>{
                                    cancelAnimationFrame(battleAnimateId);
                                    animate();
                                    document.querySelector('#userInterface').style.display='none';
                                    heading1.innerHTML="Hurray! You encountered "+ score+" Wild Pokemons.";
                                   max_score.innerHTML="Maximum Score: "+ maxscore;
                                    container2.style.display= 'flex';
                                    gsap.to('#overLapping',{
                                        opacity: 0
                                    }),
                                   //scoreEl.innerHTML=score;
                                    battleInitiate=false;
                                    
                                }
                            })
                        })
                    }
            })
            
        })
        button.addEventListener('mouseenter', (e)=>{
            const selectedAttack=attacks[e.currentTarget.innerHTML];
            document.querySelector('#attackType').innerHTML=selectedAttack.type;
            document.querySelector('#attackType').style.color=selectedAttack.color;
    
    
        })
    })
}

function animateBattle(){
    battleAnimateId=window.requestAnimationFrame(animateBattle);
    battleBG.draw();
   // console.log(battleAnimateId);
    
    renderedItems.forEach((e)=>{
        e.draw()
    })
}
// initBattle();
// animateBattle();

let lastkey =" ";




document.querySelector('#dialougeBox').addEventListener('click',(e)=>{
    if(queue.length>0){
        queue[0]();
        queue.shift();
    }else  e.currentTarget.style.display= 'none'
})