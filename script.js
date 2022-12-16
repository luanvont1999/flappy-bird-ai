const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

const PIPE = document.getElementById('pipe');
const GROUND = document.getElementById('ground');
const BIRD = document.getElementById('bird');

const WIDTH = 480;
const HEIGHT = 640;
const GRAVITY = 1;
const SPEED = 2;

const BIRD_W = 50;
const BIRD_H = 50;

const HOLE_H = 200;
const PIPE_W = 100;
const PIPE_H = 400;
const SPAWN_COOLDOWN = 2500;
let frame = 0;

let running = false;

class Bird {
  constructor() {
    this.r = 25;
    this.x = 200;
    this.y = 200 ;

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
    ctx.save();
    ctx.translate(this.x, this.y)
    ctx.rotate(Math.atan2(this.vy, SPEED))
    ctx.drawImage(BIRD, 0 - this.r, 0 - this.r, this.r * 2, this.r * 2)
    ctx.restore();
  }
}

class Pipe {
  constructor ({ x = WIDTH, y, reverse = false}) {
    this.reverse = reverse
    this.w = PIPE_W;
    this.h = PIPE_H;

    this.x = x;
    this.y = reverse ? y - PIPE_H : y
  }

  update () {
    this.x -= SPEED
  }

  render () {
    ctx.fillStyle = 'red'

    // ctx.fillRect(this.x, this.y, this.w, this.h)
    if (this.reverse) {
      ctx.save();
      ctx.scale(1, -1);
      ctx.drawImage(PIPE, this.x, (this.y + this.h) * -1)
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
  if (!running) return
  const y = Math.random() * 200 + 100;
  pipes.push(new Pipe({y, reverse: true}))
  pipes.push(new Pipe({y: y + HOLE_H}))
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
    if (pipe.x + PIPE_W <= 0) {
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
  if (running) {
    frame++;
    update()
    render()
  }

  window.requestAnimationFrame(loop)
}

const init = () => {
  running = true;
  spawnPillar()
  setInterval(spawnPillar, SPAWN_COOLDOWN)

  document.addEventListener('keypress', () => {
    running = !running
    console.log(running)
  })
  window.requestAnimationFrame(loop)
}

init()