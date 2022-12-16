const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

const PIPE = document.getElementById('pipe');
const GROUND = document.getElementById('ground');

const WIDTH = 480;
const HEIGHT = 640;
const GRAVITY = 1;
const SPEED = 2;

const BIRD_W = 50;
const BIRD_H = 50;

const HOLE_H = 200;
const PILLAR_W = 100;
const PILLAR_H = 500;
const SPAWN_COOLDOWN = 2500;

let running = false;

class Bird {
  constructor() {
    this.r = 50;
    this.x = 100;
    this.y = 50;

    this.vy = 0;

    document.addEventListener('mousedown', this.jump.bind(this))
  }

  jump () {
    this.vy = -10;
  }

  isCollapse = (rect) => {
    let testX = this.x;
    let testY = this.y;

    if (this.x < rect.x) {
      testX = rect.x
    } else if (this.x > rect.x + rect.w) {
      testX = rect.x + rect.w
    }
    if (this.y < rect.y) {
      testY = rect.y
    } else if (this.y > rect.y + rect.h) {
      testY = rect.y+rect.h
    }

    let distX = this.x - testX
    let distY = this.y - testY
    const distance = Math.sqrt((distX * distX) + (distY * distY))

    if (distance < this.r) {
      return true
    }
    return false
  }

  update () {
    this.vy += GRAVITY * 0.5;

    this.y += this.vy
    if (this.y >= HEIGHT - this.h - 40) {
      this.y = HEIGHT - this.h - 40
    }
  }

  render () {
    ctx.fillStyle = "green"
    ctx.fillRect(this.x, this.y, this.r, this.r)
  }
}

class Pipe {
  constructor (y, reverse = false) {
    this.x = WIDTH;
    this.y = y;
    this.w = PILLAR_W;
    this.h = PILLAR_H;

    this.reverse = reverse
  }

  update () {
    this.x -= SPEED
  }

  render () {
    ctx.fillStyle = 'red'
    if (this.reverse) {
      ctx.save();
      ctx.scale(1, -1);
      ctx.drawImage(PIPE, this.x, this.y * -1)
      ctx.restore();
    } else {
      ctx.drawImage(PIPE, this.x, this.y)
    }
  }
}


const birds = [new Bird()]
const pipes = []
const spawnCooldown = 1000

const spawnPillar = () => {
  const y = Math.random() * 300;
  
  pipes.push(new Pipe(y, true))
  pipes.push(new Pipe(y + HOLE_H))
}

const drawGround = () => {
  const pattern = ctx.createPattern(GROUND, 'repeat');
  ctx.fillStyle = pattern
  ctx.fillRect(0, HEIGHT - 40, WIDTH, 50)
}

const update = () => {
  birds?.forEach(bird => {
    bird.update()
  })

  pipes?.forEach((pipe, index) => {
    pipe.update()
    if (pipe.x + PILLAR_W <= 0) {
      delete pipes[index]
    }

    birds.forEach(bird => {
      if (bird.isCollapse(pipe)) {
        running = false
      }
    })
  })
  pipes.filter(Boolean)
}

const render = () => {
  // Clear Screen
  ctx.clearRect(0, 0, WIDTH, HEIGHT)

  birds?.forEach(bird => {
    bird.render()
  })

  pipes?.forEach(bird => {
    bird.render()
  })

  drawGround()
}

const loop = () => {
  update()
  render()

  running && window.requestAnimationFrame(loop)
}

const init = () => {
  running = true;
  spawnPillar()
  setInterval(spawnPillar, SPAWN_COOLDOWN)
  window.requestAnimationFrame(loop)
}

init()