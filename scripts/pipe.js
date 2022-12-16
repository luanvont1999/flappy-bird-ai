class Pipe {
  constructor ({ x = WIDTH, y, reverse = false}) {
    this.reverse = reverse
    this.w = PIPE_W;
    this.h = PIPE_H;

    this.x = x;
    this.y = reverse ? y - PIPE_H : y
  }

  update () {
    this.x -= SPEED * delta
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
