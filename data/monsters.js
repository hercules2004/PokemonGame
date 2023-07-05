const weedleimage=new Image();
weedleimage.src='./Images/draggleSprite.png';

const charmanderImage=new Image();
charmanderImage.src='./Images/embySprite.png'

const pokemons={
    Charmander: {
        position: {
            x: 420,
            y: 480
        },
        image: {
            src: './Images/embySprite.png'
        },
        frames:4,
        animate:true,
        hold:30,
        health: 100,
        variable: 'Charmander',
        attacks: [attacks.Tackle,attacks.FireBall]
    },
    Weedle : {
        position: {
            x: 1130,
            y: 170
        },
        image: {
            src: './Images/draggleSprite.png'
        },
        frames:4,
        animate:true,
        hold: 30,
        isEnemy: true,
        health: 100,
        variable: 'Weedle',
        attacks: [attacks.Tackle,attacks.FireBall]
    
    }
}