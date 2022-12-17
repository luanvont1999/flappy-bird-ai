const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

const PIPE = document.getElementById('pipe');
const GROUND = document.getElementById('ground');
const CLOUD = document.getElementById('cloud');
const BUILDING = document.getElementById('building');
const BUSH = document.getElementById('bush');
const BIRD = document.getElementById('bird');

const WIDTH = 480;
const HEIGHT = 640;
const GRAVITY = 30;
const SPEED = 120;

const BIRD_W = 50;
const BIRD_H = 50;

const HOLE_H = 200;
const PIPE_W = 100;
const PIPE_H = 400;
const SPAWN_COOLDOWN = 2500;
let cooldown = SPAWN_COOLDOWN;
let running = false;
let delta = 0;
let prev = new Date().getTime()
let time = 0;
let isStart = false;
let isOver = false;
let isPause = false;
let triggerDestroy = false;

let birds = [new Bird()]
let pipes = []

const spawnPillar = () => {
  if (!running) return
  const y = Math.random() * 200 + 100;
  pipes.push(new Pipe({y, reverse: true}))
  pipes.push(new Pipe({y: y + HOLE_H}))
}

const drawBackgroundRepeat = ({ img, x, y, w, h, speed = SPEED}) => {
  for(let i = Math.ceil(x / w); (i - 1) * w <= WIDTH; i++) {
    offset = speed * time % w
    ctx.drawImage(img, i * w - offset, y, w, h)
  }
}

const drawGround = () => {
}

const update = () => {
  // Spawn Pipes
  if (cooldown <= 0) {
    spawnPillar()
    cooldown = SPAWN_COOLDOWN
  } else {
    cooldown -= delta * 1000
  }

  birds?.forEach(bird => {
    bird.update()
  })

  pipes?.forEach((pipe, index) => {
    pipe.update()
    if (pipe.x + PIPE_W <= 0) {
      delete pipes[index]
    }

    birds.forEach(bird => {
      if (bird.y + bird.r > HEIGHT - 50) {
        bird.alive = false
        triggerDestroy = true;
        setTimeout(init, 1000)
      }
      if (bird.isCollapse(pipe)) {
        bird.alive = false
        triggerDestroy = true;
        setTimeout(init, 1000)
      }
    })
  })
  pipes.filter(Boolean)
}

const render = () => {
  // Clear Screen
  ctx.clearRect(0, 0, WIDTH, HEIGHT)
  ctx.fillStyle = '#21aeeb'
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  drawBackgroundRepeat({
    img: CLOUD,
    x: 0,
    y: HEIGHT - 50 - 120,
    w: 100,
    h: 120,
    speed: SPEED * 0.4
  })
  drawBackgroundRepeat({
    img: BUILDING,
    x: 0,
    y: HEIGHT - 50 - 120,
    w: 100,
    h: 120,
    speed: SPEED * 0.5
  })
  drawBackgroundRepeat({
    img: BUSH,
    x: 0,
    y: HEIGHT - 50 - 120,
    w: 100,
    h: 120,
    speed: SPEED * 0.7
  })

  pipes?.forEach(bird => {
    bird.render()
  })


  birds?.forEach(bird => {
    bird.render()
  })

  drawBackgroundRepeat({
    img: GROUND,
    x: 0,
    y: HEIGHT - 50,
    w: 15,
    h: 50,
  })
}

const loop = () => {
  if (triggerDestroy) {
    triggerDestroy = false
    return
  }
  const now = new Date().getTime()
  delta = (now - prev) / 1000 
  prev = now

  running = !isOver && !isPause

  if (running) {
    time += delta
    isStart && update()
    render()
  }

  window.requestAnimationFrame(loop)
}

const bindKey = (event) => {
  const { code } = event
  switch (code) {
    case 'Space':
      if (!running) return
      if (!isStart) {
        isStart = true;
      }
      birds.forEach(bird => { bird.jump() })
      break;
    case 'KeyP': 
      isPause = !isPause;
      break;
    case 'KeyR':
      triggerDestroy = true;
      init();
      break;
    default:
      break;
  }
}

const init = () => {
  isStart = false;
  isOver = false;
  isPause = false;
  running = true;
  cooldown = SPAWN_COOLDOWN;
  delta = 0;
  prev = new Date().getTime()
  time = 0;
  birds = [new Bird()]
  pipes = []

  spawnPillar()

  document.removeEventListener('keypress', bindKey)
  document.addEventListener('keypress', bindKey)
  window.requestAnimationFrame(loop)
}

init()