/**
 * ShapeGrid - Animated grid background (vanilla JS port)
 * Creates a canvas-based animated grid with hover effects.
 */
export class ShapeGrid {
  constructor(container, options = {}) {
    this.container = container;
    this.direction = options.direction || 'diagonal';
    this.speed = options.speed || 0.5;
    this.borderColor = options.borderColor || '#271E37';
    this.squareSize = options.squareSize || 40;
    this.hoverFillColor = options.hoverFillColor || '#222222';
    this.shape = options.shape || 'square';
    this.hoverTrailAmount = options.hoverTrailAmount || 0;

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'shapegrid-canvas';
    this.container.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.gridOffset = { x: 0, y: 0 };
    this.hoveredSquare = null;
    this.trailCells = [];
    this.cellOpacities = new Map();
    this.rafId = null;

    this.isHex = this.shape === 'hexagon';
    this.isTri = this.shape === 'triangle';
    this.hexHoriz = this.squareSize * 1.5;
    this.hexVert = this.squareSize * Math.sqrt(3);

    this._onResize = this._resizeCanvas.bind(this);
    this._onMouseMove = this._handleMouseMove.bind(this);
    this._onMouseLeave = this._handleMouseLeave.bind(this);

    window.addEventListener('resize', this._onResize);
    this.canvas.addEventListener('mousemove', this._onMouseMove);
    this.canvas.addEventListener('mouseleave', this._onMouseLeave);

    this._resizeCanvas();
    this._animate();
  }

  _resizeCanvas() {
    this.canvas.width = this.container.clientWidth;
    this.canvas.height = this.container.clientHeight;
  }

  _drawHex(cx, cy, size) {
    this.ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const vx = cx + size * Math.cos(angle);
      const vy = cy + size * Math.sin(angle);
      if (i === 0) this.ctx.moveTo(vx, vy);
      else this.ctx.lineTo(vx, vy);
    }
    this.ctx.closePath();
  }

  _drawCircle(cx, cy, size) {
    this.ctx.beginPath();
    this.ctx.arc(cx, cy, size / 2, 0, Math.PI * 2);
    this.ctx.closePath();
  }

  _drawTriangle(cx, cy, size, flip) {
    this.ctx.beginPath();
    if (flip) {
      this.ctx.moveTo(cx, cy + size / 2);
      this.ctx.lineTo(cx + size / 2, cy - size / 2);
      this.ctx.lineTo(cx - size / 2, cy - size / 2);
    } else {
      this.ctx.moveTo(cx, cy - size / 2);
      this.ctx.lineTo(cx + size / 2, cy + size / 2);
      this.ctx.lineTo(cx - size / 2, cy + size / 2);
    }
    this.ctx.closePath();
  }

  _drawGrid() {
    const ctx = this.ctx;
    const canvas = this.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const sz = this.squareSize;
    const offsetX = ((this.gridOffset.x % sz) + sz) % sz;
    const offsetY = ((this.gridOffset.y % sz) + sz) % sz;

    const cols = Math.ceil(canvas.width / sz) + 3;
    const rows = Math.ceil(canvas.height / sz) + 3;

    for (let col = -2; col < cols; col++) {
      for (let row = -2; row < rows; row++) {
        const sx = col * sz + offsetX;
        const sy = row * sz + offsetY;

        const cellKey = `${col},${row}`;
        const alpha = this.cellOpacities.get(cellKey);
        if (alpha) {
          ctx.globalAlpha = alpha;
          ctx.fillStyle = this.hoverFillColor;
          ctx.fillRect(sx, sy, sz, sz);
          ctx.globalAlpha = 1;
        }

        ctx.strokeStyle = this.borderColor;
        ctx.strokeRect(sx, sy, sz, sz);
      }
    }

    // Radial vignette
    const gradient = ctx.createRadialGradient(
      canvas.width / 2,
      canvas.height / 2,
      0,
      canvas.width / 2,
      canvas.height / 2,
      Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
    );
    gradient.addColorStop(0, 'rgba(10, 10, 15, 0)');
    gradient.addColorStop(1, 'rgba(10, 10, 15, 0.6)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  _updateAnimation() {
    const effectiveSpeed = Math.max(this.speed, 0.1);
    const wrapX = this.squareSize;
    const wrapY = this.squareSize;

    switch (this.direction) {
      case 'right':
        this.gridOffset.x = (this.gridOffset.x - effectiveSpeed + wrapX) % wrapX;
        break;
      case 'left':
        this.gridOffset.x = (this.gridOffset.x + effectiveSpeed + wrapX) % wrapX;
        break;
      case 'up':
        this.gridOffset.y = (this.gridOffset.y + effectiveSpeed + wrapY) % wrapY;
        break;
      case 'down':
        this.gridOffset.y = (this.gridOffset.y - effectiveSpeed + wrapY) % wrapY;
        break;
      case 'diagonal':
        this.gridOffset.x = (this.gridOffset.x - effectiveSpeed + wrapX) % wrapX;
        this.gridOffset.y = (this.gridOffset.y - effectiveSpeed + wrapY) % wrapY;
        break;
    }

    this._updateCellOpacities();
    this._drawGrid();
  }

  _updateCellOpacities() {
    const targets = new Map();

    if (this.hoveredSquare) {
      targets.set(`${this.hoveredSquare.x},${this.hoveredSquare.y}`, 1);
    }

    if (this.hoverTrailAmount > 0) {
      for (let i = 0; i < this.trailCells.length; i++) {
        const t = this.trailCells[i];
        const key = `${t.x},${t.y}`;
        if (!targets.has(key)) {
          targets.set(key, (this.trailCells.length - i) / (this.trailCells.length + 1));
        }
      }
    }

    for (const [key] of targets) {
      if (!this.cellOpacities.has(key)) {
        this.cellOpacities.set(key, 0);
      }
    }

    for (const [key, opacity] of this.cellOpacities) {
      const target = targets.get(key) || 0;
      const next = opacity + (target - opacity) * 0.15;
      if (next < 0.005) {
        this.cellOpacities.delete(key);
      } else {
        this.cellOpacities.set(key, next);
      }
    }
  }

  _handleMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const sz = this.squareSize;
    const offsetX = ((this.gridOffset.x % sz) + sz) % sz;
    const offsetY = ((this.gridOffset.y % sz) + sz) % sz;

    const adjustedX = mouseX - offsetX;
    const adjustedY = mouseY - offsetY;

    const col = Math.floor(adjustedX / sz);
    const row = Math.floor(adjustedY / sz);

    if (
      !this.hoveredSquare ||
      this.hoveredSquare.x !== col ||
      this.hoveredSquare.y !== row
    ) {
      if (this.hoveredSquare && this.hoverTrailAmount > 0) {
        this.trailCells.unshift({ ...this.hoveredSquare });
        if (this.trailCells.length > this.hoverTrailAmount) {
          this.trailCells.length = this.hoverTrailAmount;
        }
      }
      this.hoveredSquare = { x: col, y: row };
    }
  }

  _handleMouseLeave() {
    if (this.hoveredSquare && this.hoverTrailAmount > 0) {
      this.trailCells.unshift({ ...this.hoveredSquare });
      if (this.trailCells.length > this.hoverTrailAmount) {
        this.trailCells.length = this.hoverTrailAmount;
      }
    }
    this.hoveredSquare = null;
  }

  _animate() {
    this._updateAnimation();
    this.rafId = requestAnimationFrame(() => this._animate());
  }

  destroy() {
    window.removeEventListener('resize', this._onResize);
    this.canvas.removeEventListener('mousemove', this._onMouseMove);
    this.canvas.removeEventListener('mouseleave', this._onMouseLeave);
    cancelAnimationFrame(this.rafId);
    this.canvas.remove();
  }
}
