class Bird {
  constructor() {
    this.alive = true;
    this.r = 25;
    this.x = 200;
    this.y = 300;
    
    this.vy = 0;
  }

  jump () {
    this.alive && (this.vy = -10)
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
    if (!this.alive) return
    this.vx = SPEED * delta;
    this.vy += GRAVITY * delta;
    this.angle = Math.atan2(this.vy, this.vx)

    this.y += this.vy
    // if (this.y >= HEIGHT - this.h - 40) {
    //   this.y = HEIGHT - this.h - 40
    // }
  }

  render () {
    ctx.save();
    ctx.translate(this.x, this.y)
    ctx.rotate(this.angle)
    ctx.drawImage(BIRD, 0 - this.r, 0 - this.r, this.r * 2, this.r * 2)
    ctx.restore();
  }
}