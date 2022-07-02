const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax : 6
})

const player = new Fighter({
  position:{
  x:0,
  y:0
  },
  velocity:{
   x: 0,
   y:0 
  },
  offset:{
    x:0,
    y:0
  },
  imageSrc: './img/Samurai mack/Idle.png',
  framesMax : 8,
  scale: 2.5,
  offset:{
    x: 215,
    y: 157
  },
  sprites: {
    Idle:{
      imageSrc: './img/Samurai mack/Idle.png',
      framesMax: 8
    },
    Run:{
      imageSrc: './img/Samurai mack/Run.png',
      framesMax: 8
      
    },
    Jump:{
      imageSrc: './img/Samurai mack/Jump.png',
      framesMax: 2
    
    },
    Fall: {
      imageSrc: './img/Samurai mack/Fall.png',
      framesMax: 2
    },
    Attack1: {
      imageSrc: './img/Samurai mack/Attack1.png',
      framesMax: 6
    },
    takeHit: {
      imageSrc: './img/Samurai mack/Take Hit - white silhouette.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/Samurai mack/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 160,
    height: 50
  }
})


const enemy = new Fighter({
  position:{
  x:400,
  y:100
  },
  velocity:{
   x: 0,
   y:0 
  },
  color: 'blue',
  offset:{
    x: -50,
    y: 0

  },
  imageSrc: './img/Kenji/Idle.png',
  framesMax : 4,
  scale: 2.5,
  offset:{
    x: 215,
    y: 167
  },
  sprites: {
    Idle:{
      imageSrc: './img/Kenji/Idle.png',
      framesMax: 4
    },
    Run:{
      imageSrc: './img/Kenji/Run.png',
      framesMax: 8
      
    },
    Jump:{
      imageSrc: './img/Kenji/Jump.png',
      framesMax: 2
    
    },
    Fall: {
      imageSrc: './img/Kenji/Fall.png',
      framesMax: 2
    },
    Attack1: {
      imageSrc: './img/Kenji/Attack1.png',
      framesMax: 4
    },
    takeHit: {
    imageSrc: './img/Kenji/Take hit.png',
    framesMax: 3
    },
    death: {
      imageSrc: './img/Kenji/Death.png',
      framesMax: 7
    }
  },
  attackBox: {
    offset: {
      x: -170,
      y: 50
    },
    width: 170,
    height: 50
  }
  
})



console.log(player)

const keys = {
  a: {
    pressed: false
  },

  d: {
    pressed: false
  },

  ArrowRight: {
    pressed: false 
  },

  ArrowLeft: {
    pressed: false
  }
}



decreaseTimer()

function animate(){
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle= 'rgba(255, 255, 255, 0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)
  player.update()
  enemy.update() //as update calls draw also
  
  player.velocity.x=0
  enemy.velocity.x=0

//player movement
  
  if(keys.a.pressed && player.lastKey==='a'){
    player.velocity.x= -5 //depending upon movement speed here we choose 5
    player.switchSprite('Run') 
  }
  else if(keys.d.pressed && player.lastKey==='d'){
    player.velocity.x= 5
    player.switchSprite('Run')
  }
  else{
    player.switchSprite('Idle')
  }

  //Jumping
if(player.velocity.y < 0){ 
  player.switchSprite('Jump')
}
else if(player.velocity.y>0){
player.switchSprite('Fall')
}

//enemy movement
  if(keys.ArrowLeft.pressed && enemy.lastKey==='ArrowLeft'){
    enemy.velocity.x= -5
    enemy.switchSprite('Run')
  }
  else if(keys.ArrowRight.pressed && enemy.lastKey==='ArrowRight'){
    enemy.velocity.x= 5
    enemy.switchSprite('Run')
  }
  else{
    enemy.switchSprite('Idle')
  }
   //Jumping
  if(enemy.velocity.y < 0){ 
    enemy.switchSprite('Jump')
  }
  else if(enemy.velocity.y>0){
    enemy.switchSprite('Fall')
  }

  //detect for collision & enemy gets hit
  if(rectangularCollision({
    rectangle1: player,
    rectangle2: enemy
  }) && player.isAttacking && player.framesCurrent=== 4){
    enemy.takeHit()
    player.isAttacking = false
    
  
    gsap.to('#enemyHealth', {
      width: enemy.health + '%' 
    })
  }

  //if player misses
  if(player.isAttacking && player.framesCurrent ===4){
    player.isAttacking= false
  }

  //this is where our player gets hit
  if(
    rectangularCollision({
    rectangle1: enemy,
    rectangle2: player
  }) && 
    enemy.isAttacking && 
    enemy.framesCurrent ===2
    ){
    player.takeHit()
    enemy.isAttacking = false

    gsap.to('#playerHealth', {
      width: player.health + '%' 
    })
  }

//if enemy misses
  if(enemy.isAttacking && enemy.framesCurrent ===2){
    enemy.isAttacking= false
  }
//end game based on health
  if(enemy.health<= 0 || player.health<= 0) {
    determineWinner({player, enemy, timerId})
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if(!player.dead){

  
  switch(event.key){
    case 'd' :
      keys.d.pressed = true
      player.lastKey = 'd'
      break

    case 'a' :
      keys.a.pressed = true
      player.lastKey = 'a'
      break

    case 'w' :
      player.velocity.y=-20
      break

    case ' ' :
      player.attack()
      break

    
  }
  }
  
  if(!enemy.dead){

  switch(event.key){
    case 'ArrowRight' :
      keys.ArrowRight.pressed = true
      enemy.lastKey = 'ArrowRight'
      break

    case 'ArrowLeft' :
      keys.ArrowLeft.pressed = true
      enemy.lastKey = 'ArrowLeft'
      break

    case 'ArrowUp' :
      enemy.velocity.y=-20
      break

    case 'ArrowDown' :
    enemy.attack()
    break
  }
  }

})

window.addEventListener('keyup', (event) => {
  switch(event.key){
    case 'd' :
      keys.d.pressed = false
      break

    case 'a' :
      keys.a.pressed = false
      break
  }

  //enemy keys
  switch(event.key){
    case 'ArrowRight' :
      keys.ArrowRight.pressed = false
      break

    case 'ArrowLeft' :
      keys.ArrowLeft.pressed = false
      break
  }

})
