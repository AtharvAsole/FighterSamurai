class Sprite{
  constructor({
    position, 
    imageSrc, 
    scale= 1, 
    framesMax= 1, 
    offset= {x:0 , y:0}
  }) { 
    this.position = position
    this.width = 50
    this.height = 150
    this.image = new Image()
    this.image.src = imageSrc
    this.scale = scale
    this.framesMax = framesMax
    this.framesCurrent= 0
    this.framesCurrent = 0
    this.framesElapsed= 0
    this.framesHold= 10
    this.offset= offset
  } 

  draw() {
    c.drawImage(
      this.image, 
      this.framesCurrent * (this.image.width/this.framesMax),
      0,
      this.image.width / this.framesMax, //for single frame = total width / no.of frames
      this.image.height,
      this.position.x - this.offset.x, 
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale, 
      this.image.height * this.scale,
    )
  }

  animateFrames(){
    this.framesElapsed++

    if(this.framesElapsed % this.framesHold===0){
      if (this.framesCurrent< this.framesMax-1){
       this.framesCurrent++
      }
      else{
       this.framesCurrent= 0
      }
    }
  }

  update() {
    this.draw()
    this.animateFrames()
  }
}



class Fighter extends Sprite{
  constructor({
  position , 
  velocity , 
  color = 'red',
  imageSrc, 
  scale= 1, 
  framesMax= 1,
  offset= {x:0 , y:0},
  sprites,
  attackBox= {offset: {}, width: undefined, height: undefined}
  }){ //wraping this two arguements in one single object so that order doesnt matter
    super({
     position,
     imageSrc, 
     scale, 
     framesMax,
     offset
    })
    
    this.velocity = velocity
    this.width = 50
    this.height = 150
    this.lastKey
    this.attackBox ={
      position: {
      x: this.position.x,
      y: this.position.y
    },
      offset: attackBox.offset,
      width:attackBox.width,
      height: attackBox.height
    }
    this.color = color
    this.isAttacking
    this.health=100
    this.framesCurrent = 0
    this.framesElapsed= 0
    this.framesHold= 10
    this.sprites= sprites
    this.dead =false


    for(const sprite in this.sprites){
      sprites[sprite].image= new Image()
      sprites[sprite].image.src=  sprites[sprite].imageSrc

    }
  }




  update() { //movement of shapes
   this.draw()
   if (!this.dead) this.animateFrames()

   //attack boxes
   this.attackBox.position.x =this.position.x + this.attackBox.offset.x
   this.attackBox.position.y =this.position.y + this.attackBox.offset.y

//draw the attack box 
   // c.fillRect(
   //  this.attackBox.position.x, 
   //  this.attackBox.position.y, 
   //  this.attackBox.width, 
   //  this.attackBox.height
   //  )

   this.position.y += this.velocity.y //this.position.y= this.position.y+10
   this.position.x += this.velocity.x 

  //Gravity function
   if (this.position.y + this.height + this.velocity.y >= canvas.height-96) {
    this.velocity.y = 0
    this.position.y= 330
   }
   else{
    this.velocity.y +=gravity
   }
   
  }

  attack() {
    this.switchSprite('Attack1')
    this.isAttacking = true
  }

  takeHit(){
    this.health-=20

    if(this.health <= 0){
      this.switchSprite('death')
    } else this.switchSprite('takeHit')
  }


  switchSprite(sprite){
    if(this.image=== this.sprites.death.image) {
      if(this.framesCurrent === this.sprites.death.framesMax -1) 
         this.dead= true
         return
  } 

  //overriding all other animations with the attack animations
  if (
    this.image === this.sprites.Attack1.image && 
    this.framesCurrent < this.sprites.Attack1.framesMax -1
    ) 
    return

  //override when fighter gets hit
  if(
    this.image === this.sprites.takeHit.image && 
    this.framesCurrent < this.sprites.takeHit.framesMax -1
    )
    return

  switch(sprite){
    case 'Idle':
    if(this.image !== this.sprites.Idle.image){
      this.image= this.sprites.Idle.image
      this.framesMax= this.sprites.Idle.framesMax
      this.framesCurrent= 0
    }
     break   

    case 'Run':
    if(this.image !== this.sprites.Run.image){
      this.image= this.sprites.Run.image
      this.framesMax= this.sprites.Run.framesMax
      this.framesCurrent= 0
    }
     break

    case 'Jump':
    if(this.image !== this.sprites.Jump.image){
       this.image = this.sprites.Jump.image
       this.framesMax= this.sprites.Jump.framesMax
       this.framesCurrent= 0
    }
     break

    case 'Fall':
    if(this.image !== this.sprites.Fall.image){
       this.image = this.sprites.Fall.image
       this.framesMax= this.sprites.Fall.framesMax
       this.framesCurrent= 0
    }
    break
    
    case 'Attack1':
    if(this.image !== this.sprites.Attack1.image){
       this.image = this.sprites.Attack1.image
       this.framesMax= this.sprites.Attack1.framesMax
       this.framesCurrent= 0
    }
     break

    case 'takeHit':
    if(this.image !== this.sprites.takeHit.image){
       this.image = this.sprites.takeHit.image
       this.framesMax= this.sprites.takeHit.framesMax
       this.framesCurrent= 0
    }
     break

    case 'death':
    if(this.image !== this.sprites.death.image){
       this.image = this.sprites.death.image
       this.framesMax= this.sprites.death.framesMax
       this.framesCurrent= 0
    }
     break
  }
}
}
