(() => {
  'use strict';

  const width = 1024;
  const height = 1536;
  const defaults = Object.freeze({ seed: '2564', wobble: 48, grain: 56 });
  const paper = '#faf3e3';
  const inks = ['#2e8246', '#a0c84c', '#0498b8', '#f6ca35'];
  const contrastingInk = [[1, 3], [0, 2], [1, 3], [0, 2]];
  const shapeGrid = [
    ['circle', 'triangle', 'square', 'hexagon'],
    ['cutout', 'square', 'circle', 'triangle'],
    ['hexagon', 'circle', 'cutout', 'square'],
    ['triangle', 'hexagon', 'square', 'circle'],
    ['square', 'cutout', 'triangle', 'hexagon'],
    ['circle', 'triangle', 'hexagon', 'square'],
  ];
  const patterns = ['wave', 'zigzag', 'stripe', 'dot', 'dash', 'contour'];
  const tau = Math.PI * 2;
  const sin = Math.sin;
  const cos = Math.cos;
  const between = (random, low, high) => low + random() * (high - low);
  const pick = (random, items) => items[Math.floor(random() * items.length)];

  function randomFrom(key) {
    let state = 2166136261;
    for (let index = 0; index < key.length; index++) {
      state = Math.imul(state ^ key.charCodeAt(index), 16777619);
    }
    return () => {
      state = (state + 0x6d2b79f5) | 0;
      let mixed = Math.imul(state ^ (state >>> 15), state | 1);
      mixed ^= mixed + Math.imul(mixed ^ (mixed >>> 7), mixed | 61);
      return ((mixed ^ (mixed >>> 14)) >>> 0) / 4294967296;
    };
  }

  function shuffle(items, random) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
      const other = Math.floor(random() * (index + 1));
      [result[index], result[other]] = [result[other], result[index]];
    }
    return result;
  }

  function createPosterLayout(seed = defaults.seed) {
    const random = randomFrom(normalizeSeed(seed) + '|layout');
    const rows = random() < 0.5 ? [...shapeGrid].reverse() : shapeGrid;
    const reverseColumns = random() < 0.5;
    const grid = rows.flatMap(row => reverseColumns ? [...row].reverse() : row);
    const patternOrder = Array.from({ length: 4 }, () => shuffle(patterns, random)).flat();
    const inkOrder = shuffle(inks.map((_, index) => index), random);
    const lineCells = [];
    const sprigs = [];
    const open = [];
    for (let index = 0; index < grid.length; index++) {
      const pattern = patternOrder[index];
      if (['wave', 'stripe', 'zigzag'].includes(pattern)) lineCells.push(index);
      if (['wave', 'dot', 'dash'].includes(pattern) && grid[index] !== 'triangle') sprigs.push(index);
      if (['dot', 'dash', 'stripe'].includes(pattern)) open.push(index);
    }
    const overhangs = shuffle(lineCells, random).slice(0, 3);
    const sprigCells = shuffle(sprigs.filter(index => !overhangs.includes(index)), random).slice(0, 3);
    const openCells = shuffle(open.filter(index => !overhangs.includes(index) && !sprigCells.includes(index)), random).slice(0, 3);
    const overprintCells = shuffle(grid.map((_, index) => index).filter(index =>
      !overhangs.includes(index) && !openCells.includes(index) && !sprigCells.includes(index)
    ), random).slice(0, 4);
    return grid.map((shape, index) => {
      const column = index % 4;
      const row = Math.floor(index / 4);
      return {
        shape, pattern: patternOrder[index], ink: inkOrder[(column + row) % 4],
        overhang: overhangs.includes(index), open: openCells.includes(index),
        sprig: sprigCells.includes(index), overprint: overprintCells.includes(index),
        x: 194 + 212 * column, y: 238 + 212 * row,
      };
    });
  }

  function normalizeSeed(seed) {
    return String(seed ?? '').trim() || defaults.seed;
  }

  function outline(shape, random, wobble) {
    const points = [];
    const phase = random() * tau;
    if (shape === 'circle' || shape === 'cutout') {
      const cutout = shape === 'cutout';
      const bulges = pick(random, [3, 4, 5]);
      for (let index = 0; index < 120; index++) {
        const angle = index * tau / 120;
        const distortion = (1.3 + wobble * 1.7) * sin(5 * angle + phase)
          + wobble * sin(11 * angle - phase);
        const radius = cutout
          ? 69 + 15 * cos(bulges * angle + phase) + 6 * sin(2 * angle - phase) + distortion
          : 75 + distortion;
        points.push([radius * cos(angle), radius * sin(angle)]);
      }
      return points;
    }

    const corners = {
      triangle: [[0, -88], [88, 66], [-88, 66]],
      square: [[-67, -67], [67, -67], [67, 67], [-67, 67]],
      hexagon: [[-45, -68], [45, -68], [83, 0], [45, 68], [-45, 68], [-83, 0]],
    }[shape].map(([x, y]) => [x + between(random, -3, 3), y + between(random, -3, 3)]);

    corners.forEach(([x, y], index) => {
      const [nextX, nextY] = corners[(index + 1) % corners.length];
      const dx = nextX - x;
      const dy = nextY - y;
      const length = Math.hypot(dx, dy);
      for (let step = 0; step < 24; step++) {
        const t = step / 24;
        const ripple = sin(Math.PI * t) * (0.6 + wobble * 2.4)
          * (sin(tau * t + phase + index) + 0.28 * sin(3 * tau * t - phase));
        points.push([x + t * dx - ripple * dy / length, y + t * dy + ripple * dx / length]);
      }
    });
    return points;
  }

  function trace(points, closed = false) {
    const path = new Path2D();
    points.forEach(([x, y], index) => {
      if (index === 0) path.moveTo(x, y);
      else path.lineTo(x, y);
    });
    if (closed) path.closePath();
    return path;
  }

  function insideOutline(points, x, y) {
    let inside = false;
    for (let index = 0, previous = points.length - 1; index < points.length; previous = index++) {
      const [ax, ay] = points[index];
      const [bx, by] = points[previous];
      if ((ay > y) !== (by > y) && x < (bx - ax) * (y - ay) / (by - ay) + ax) {
        inside = !inside;
      }
    }
    return inside;
  }

  function drawLines(context, pattern, random, wobble) {
    const spacing = between(random, 15, 22);
    const period = between(random, 40, 61);
    const phase = random() * tau;
    const slant = pattern === 'stripe' ? pick(random, [-1.08, -0.55, 0.38, 0.89, 1.52]) : 0;
    const rows = [];
    for (let row = -7; row <= 7; row++) {
      const offset = row * spacing;
      const width = between(random, 2.6, 4.7);
      const rowPhase = phase + between(random, -0.33, 0.33);
      const baseline = offset + between(random, -2, 2);
      const points = [];
      for (let x = -123; x <= 123; x += 3) {
        const angle = x * tau / period + rowPhase;
        let y = baseline + (0.45 + wobble * 2.8) * sin(x / 11 + rowPhase + offset / 23);
        if (pattern === 'wave') y += (5 + 2 * wobble) * sin(angle);
        if (pattern === 'zigzag') y += (5 + 2 * wobble) * 2 / Math.PI * Math.asin(sin(angle));
        points.push([x * cos(slant) - y * sin(slant), x * sin(slant) + y * cos(slant)]);
      }
      context.lineWidth = width;
      context.stroke(trace(points));
      rows.push({ points, width, offset });
    }
    return rows;
  }

  function drawContours(context, random, wobble) {
    const phase = random() * tau;
    const centerX = between(random, -22, 22);
    const centerY = between(random, -19, 19);
    const squeeze = between(random, 0.78, 1.15);
    const spacing = between(random, 12, 17);
    for (let radius = between(random, 9, 15); radius < 134; radius += spacing) {
      const points = [];
      for (let step = 0; step < 96; step++) {
        const angle = step * tau / 96;
        const ripple = 1 + 0.15 * sin(3 * angle + phase + radius / 55)
          + 0.07 * cos(4 * angle - phase) + wobble * 0.045 * sin(7 * angle + radius / 13);
        points.push([
          centerX + radius * ripple * cos(angle),
          centerY + radius * ripple * sin(angle) * squeeze,
        ]);
      }
      context.lineWidth = between(random, 2.5, 4.2);
      context.stroke(trace(points, true));
    }
  }

  function drawMarks(context, pattern, random, wobble) {
    const spacing = between(random, 18, 23);
    const dots = pattern === 'dot';
    for (let row = -6; row <= 6; row++) {
      for (let column = -6; column <= 6; column++) {
        const x = (column + (row % 2) * 0.5) * spacing + between(random, -3.3, 3.3);
        const y = row * spacing + between(random, -3.8, 3.8);
        const angle = between(random, -1.9, 1.9);
        if (dots) {
          const radius = between(random, 2.0, 3.8);
          context.beginPath();
          context.ellipse(x, y, radius, radius * between(random, 0.76, 1.15), angle, 0, tau);
          context.fill();
        } else {
          const length = between(random, 7, 12);
          const dx = cos(angle) * length / 2;
          const dy = sin(angle) * length / 2;
          context.lineWidth = between(random, 2.3, 3.7);
          context.beginPath();
          context.moveTo(x - dx, y - dy);
          context.quadraticCurveTo(x - dy * wobble * 0.4, y + dx * wobble * 0.4, x + dx, y + dy);
          context.stroke();
        }
      }
    }
  }

  function drawOverhangs(context, points, rows, random) {
    const candidates = rows.filter(row => Math.abs(row.offset) < 47);
    const side = random() < 0.5 ? -1 : 1;
    for (const row of shuffle(candidates, random).slice(0, 2)) {
      const line = side > 0 ? row.points : [...row.points].reverse();
      const edge = line.findLastIndex(([x, y]) => insideOutline(points, x, y));
      if (edge < 2 || edge >= line.length - 2) continue;
      const extension = pick(random, [3, 4, 5]);
      context.lineWidth = row.width;
      context.stroke(trace(line.slice(edge - 2, edge + extension + 1)));
    }
  }

  function drawSprig(context, random) {
    context.save();
    context.translate(between(random, 19, 27), between(random, 41, 49));
    context.rotate(between(random, 0.16, 0.45));
    context.strokeStyle = paper;
    context.fillStyle = paper;
    context.lineWidth = 2.6;
    context.beginPath();
    context.moveTo(-3, 11);
    context.quadraticCurveTo(3, -13, -2, -50);
    context.stroke();
    for (const [side, y, length] of [[-1, -5, 20], [1, -12, 20], [-1, -22, 18], [1, -29, 17], [1, -44, 13]]) {
      context.beginPath();
      context.moveTo(0, y);
      context.quadraticCurveTo(side * length * 0.86, y + 1, side * length, y - 14);
      context.quadraticCurveTo(side * length * 0.28, y - 16, 0, y);
      context.fill();
    }
    context.restore();
  }

  function drawGrain(context, path, points, random, amount) {
    if (amount === 0) return;
    context.save();
    context.clip(path);
    context.fillStyle = paper;
    for (let index = 0; index < 780; index++) {
      const x = between(random, -91, 91);
      const y = between(random, -91, 91);
      const size = between(random, 0.36, 1.35);
      const opacity = between(random, 0.26, 0.8);
      if (random() > amount) continue;
      context.globalAlpha = opacity;
      context.fillRect(x, y, size, size * 0.76);
    }
    for (let index = 0; index < 460; index++) {
      const [x, y] = pick(random, points);
      const offsetX = between(random, -2.9, 2.9);
      const offsetY = between(random, -2.9, 2.9);
      const size = between(random, 0.5, 1.85);
      const opacity = between(random, 0.4, 0.98);
      if (random() > amount) continue;
      context.globalAlpha = opacity;
      context.fillRect(x + offsetX, y + offsetY, size, size);
    }
    context.restore();
  }

  function drawMotif(context, motif, seed, wobble, grain) {
    const random = randomFrom(seed + '|motif');
    const points = outline(motif.shape, randomFrom(seed + '|edge'), wobble);
    const path = trace(points, true);
    const firstInk = inks[motif.ink];
    const secondInk = inks[pick(random, contrastingInk[motif.ink])];
    const patternInk = motif.open ? firstInk : motif.overhang || motif.overprint ? secondInk : paper;
    const scale = between(random, 0.94, 1.045);
    context.save();
    context.translate(motif.x, motif.y);
    context.rotate(between(random, -0.11, 0.11));
    context.scale(scale, scale);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    if (!motif.open) {
      context.fillStyle = firstInk;
      context.fill(path);
    }

    context.save();
    context.clip(path);
    context.fillStyle = patternInk;
    context.strokeStyle = patternInk;
    let rows;
    if (motif.pattern === 'contour') drawContours(context, random, wobble);
    else if (['dot', 'dash'].includes(motif.pattern)) drawMarks(context, motif.pattern, random, wobble);
    else rows = drawLines(context, motif.pattern, random, wobble);
    if (motif.sprig) {
      context.save();
      context.fillStyle = firstInk;
      context.beginPath();
      context.ellipse(22, 22, 23, 35, 0.32, 0, tau);
      context.fill();
      context.restore();
      drawSprig(context, random);
    }
    context.restore();
    if (motif.overhang && rows) {
      context.strokeStyle = patternInk;
      drawOverhangs(context, points, rows, randomFrom(seed + '|overhang'));
    }
    drawGrain(context, path, points, randomFrom(seed + '|grain'), grain);
    context.restore();
  }

  function drawPoster(context, settings = {}) {
    const { width: canvasWidth, height: canvasHeight } = context.canvas;
    if (canvasWidth <= 0 || canvasWidth * 3 !== canvasHeight * 2) {
      throw new RangeError('The poster canvas must have a 2:3 aspect ratio.');
    }
    const seed = normalizeSeed(settings.seed);
    const wobble = normalizeAmount(settings.wobble, defaults.wobble);
    const grain = normalizeAmount(settings.grain, defaults.grain);
    const scale = canvasWidth / width;
    if (scale !== 1) {
      context.save();
      context.scale(scale, scale);
    }
    try {
      context.fillStyle = paper;
      context.fillRect(0, 0, width, height);
      createPosterLayout(seed).forEach((motif, index) => {
        drawMotif(context, motif, seed + '|' + index, wobble, grain);
      });
    } finally {
      if (scale !== 1) context.restore();
    }
  }

  function normalizeAmount(value, fallback) {
    return (Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : fallback) / 100;
  }

  const api = Object.freeze({ width, height, defaults, createPosterLayout, drawPoster });
  if (typeof module === 'object' && module.exports) module.exports = api;
  else globalThis.NiltaviBanner = api;
})();
