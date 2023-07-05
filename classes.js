// const scoreEl=document.querySelector('#scoreEl');
// let score=0;

class Boundary{
    static width=48;
    static height=48;

    constructor({position}){
        this.position=position;
        this.width=48;
        this.height=48;
    }
    draw(){
        c.fillStyle='rgba(255,0,0,0)';
        c.fillRect(this.position.x,this.position.y,this.width,this.height);
    }
}

class positioning{
    constructor ({position,image,frames,animate = false,hold,rotate=0}){
        this.position=position;
        this.image=new Image();
        this.frames=frames;
        this.hold=hold;
        this.val=0;
        this.elapsed=0;
        this.image.onload=()=>{
            this.width=this.image.width/this.frames;
            this.height=this.image.height;
        }
        this.image.src=image.src;
        this.animate=animate;
        this.opacity=1;
        this.rotation=rotate;
    }
    draw(){
       // console.log(this.frames);
       c.save(),
       c.translate(this.position.x+this.width/2, this.position.y+this.height/2);
       c.rotate(this.rotation);
       c.translate(-this.position.x-this.width/2, -this.position.y-this.height/2);
       c.globalAlpha=this.opacity,
        c.drawImage(this.image,
            this.val*this.width,
            0,
            this.image.width/this.frames,
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width/this.frames,
            this.image.height
            )
         //console.log(this.image.width);
            c.restore()
        if(!this.animate) return;
        
        if(this.frames>1){
            this.elapsed++;
        }
        if(this.elapsed%this.hold===0){ 
        if(this.val<this.frames-1) this.val++;
        else this.val=0;
        }

    }
    
}

class Pokemon extends positioning{
    constructor({
        position,image,frames,animate = false,hold,rotate=0,isEnemy=false,health=100,variable,attacks
    }){
        super({
            position,image,frames,animate,hold,rotate 
    }),
        this.health=health;
        this.enemy=isEnemy;
        this.name= variable;
        this.attacks= attacks;
    }

    faint(){
        document.querySelector('#dialougeBox').innerHTML= this.name+" fainted!";
        // gsap.to(this.position,{
        //     y: this.position.y+20
        // })
        // gsap.to(this.position,{
        //     y: this.position.y-20
        // }
       // console.log(this);
        gsap.to(this,{
        opacity:0
    })
    // if(this.isEnemy){
    //      score++
    //      scoreEl.innerHTML=score;
    // }
    audio.battle.stop();
     audio.victory.play();
    }
    attack({attack,recipient,renderedItems}){
        document.querySelector('#dialougeBox').style.display= 'block';
        document.querySelector('#dialougeBox').innerHTML= this.name+" used "+ attack.name;

        let healthBar='#enemyHealthBar';
        let movementDist=20;
        let rotation=1;
        if(this.enemy){
             healthBar='#playerHealthBar';
             movementDist=-20;
             rotation=-2.2;

        }
        recipient.health-=attack.damage;

        switch(attack.name){
            case 'Tackle':
                const tl=gsap.timeline();

        tl.to(this.position,{
            x: this.position.x-movementDist
        }).to(this.position,{
            x: this.position.x+2*movementDist,
            duration: 0.1,
            onComplete: ()=>{
                //this is where attack takes place and enemy gets hit
                audio.tackleHit.play();
                gsap.to(healthBar,{
                    width: recipient.health + '%',
                })
                gsap.to(recipient.position,{
                    x: recipient.position.x+10,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.1
                })
                gsap.to(recipient,{
                    opacity:0,
                    yoyo: true,
                    repeat: 5,
                    duration: 0.1
                })
            }
        }).to(this.position,{
            x: this.position.x
        })
        break
        case 'FireBall':
            audio.initFireball.play();
            const fireballImage=new Image();
            fireballImage.src= './Images/fireball.png';
            const fireBall= new positioning({
                position: {
                    x: this.position.x+30,
                    y: this.position.y
                },
                image: fireballImage,
                frames: 4,
                hold: 10,
                animate: true,
                rotate: rotation
            })
            renderedItems.splice(1,0,fireBall);
            gsap.to(fireBall.position,{
                x: recipient.position.x,
                y: recipient.position.y,
                onComplete: ()=>{
                    audio.fireballHit.play();
                    gsap.to(healthBar,{
                        width: recipient.health + '%',
                    })
                    gsap.to(recipient.position,{
                        x: recipient.position.x+10,
                        yoyo: true,
                        repeat: 5,
                        duration: 0.1
                    })
                    gsap.to(recipient,{
                        opacity:0,
                        yoyo: true,
                        repeat: 5,
                        duration: 0.1
                    })
                    renderedItems.splice(1,1);
                }
            })
        break
        }
        
    }
}