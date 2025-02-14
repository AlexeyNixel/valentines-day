<template>
  <div>
    <canvas class="w-full h-full" id="heart"></canvas>
  </div>
</template>

<script>
export default {
  mounted() {
    if (process.client) {
      this.initCanvas();
    }
  },
  methods: {
    initCanvas() {
      window.requestAnimationFrame =
        window.__requestAnimationFrame ||
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        (() => {
          return (callback, element) => {
            const lastTime = element.__lastTime || 0;
            const currTime = Date.now();
            const timeToCall = Math.max(1, 33 - (currTime - lastTime));
            window.setTimeout(callback, timeToCall);
            element.__lastTime = currTime + timeToCall;
          };
        })();

      window.isDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
          (
            navigator.userAgent ||
            navigator.vendor ||
            window.opera
          ).toLowerCase()
        );

      let loaded = false;
      let mousePos = { x: 0, y: 0 };

      // Обработчик для получения позиции мыши
      window.addEventListener('mousemove', (event) => {
        mousePos = { x: event.clientX, y: event.clientY };
      });

      const drawText = (ctx, width, height) => {
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#ff0062');
        gradient.addColorStop(1, '#f10c0c');

        ctx.font = '60px Pacifico';
        ctx.fillStyle = gradient;
        ctx.textAlign = 'center';
        ctx.marginTop = '20px';

        ctx.fillText('С днем святого Валентина, лю тя', width / 2, height / 2.2 + 400);
      };

      const heartPosition = (rad) => [
        Math.pow(Math.sin(rad), 3),
        -(
          15 * Math.cos(rad) -
          5 * Math.cos(2 * rad) -
          2 * Math.cos(3 * rad) -
          Math.cos(4 * rad)
        ),
      ];

      const scaleAndTranslate = (pos, sx, sy, dx, dy) => [
        dx + pos[0] * sx,
        dy + pos[1] * sy,
      ];

      const resizeCanvas = (canvas, ctx, koef) => {
        const width = (canvas.width =
          koef * window.innerWidth * window.devicePixelRatio);
        const height = (canvas.height =
          koef * window.innerHeight * window.devicePixelRatio);
        ctx.fillStyle = 'rgba(0,0,0,1)';
        ctx.fillRect(0, 0, width, height);
        return { width, height };
      };

      const pulse = (pointsOrigin, kx, ky, width, height) => {
        return pointsOrigin.map((point) => [
          kx * point[0] + width / 2,
          ky * point[1] + height / 2.2,
        ]);
      };

      const createParticles = (
        heartPointsCount,
        width,
        height,
        traceCount,
        rand
      ) => {
        return Array.from({ length: heartPointsCount }, (_, i) => {
          const x = rand() * width;
          const y = rand() * height;
          return {
            vx: 0,
            vy: 0,
            R: 2,
            speed: rand() + 5,
            q: Math.floor(rand() * heartPointsCount),
            D: 2 * (i % 2) - 1,
            force: 0.2 * rand() + 0.7,
            f: 'rgba(255,0,68,0.7)',
            trace: Array.from({ length: traceCount }, () => ({ x, y })),
          };
        });
      };

      const calculateRepulsion = (particle, mousePos) => {
        const dx = particle.trace[0].x - mousePos.x;
        const dy = particle.trace[0].y - mousePos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const repulsionForce = 0.3; // Сила отталкивания
          particle.vx += (dx / dist) * repulsionForce;
          particle.vy += (dy / dist) * repulsionForce;
        }
      };

      const loop = (e, targetPoints, ctx, width, height, time, rand) => {
        const n = -Math.cos(time);
        pulse(targetPoints, (1 + n) * 0.5, (1 + n) * 0.5, width, height);
        time += (Math.sin(time) < 0 ? 9 : n > 0.8 ? 0.2 : 1) * 0.6;

        ctx.fillStyle = 'rgba(0,0,0,.1)';
        ctx.fillRect(0, 0, width, height);

        e.forEach((u) => {
          const q = targetPoints[u.q];
          const dx = u.trace[0].x - q[0];
          const dy = u.trace[0].y - q[1];
          const length = Math.sqrt(dx * dx + dy * dy);

          if (length < 10) {
            if (rand() > 0.95) {
              u.q = Math.floor(rand() * targetPoints.length);
            } else {
              if (rand() > 0.99) u.D *= -1;
              u.q = (u.q + u.D) % targetPoints.length;
              if (u.q < 0) u.q += targetPoints.length;
            }
          }

          u.vx += (-dx / length) * u.speed;
          u.vy += (-dy / length) * u.speed;
          u.trace[0].x += u.vx;
          u.trace[0].y += u.vy;
          u.vx *= u.force;
          u.vy *= u.force;

          // Добавляем отталкивание от курсора
          calculateRepulsion(u, mousePos);

          for (let k = 0; k < u.trace.length - 1; k++) {
            const T = u.trace[k];
            const N = u.trace[k + 1];
            N.x -= 0.4 * (N.x - T.x);
            N.y -= 0.4 * (N.y - T.y);
          }

          ctx.fillStyle = u.f;
          u.trace.forEach((t) => ctx.fillRect(t.x, t.y, 1, 1));
        });

        drawText(ctx, width, height);
        window.requestAnimationFrame(
          () => loop(e, targetPoints, ctx, width, height, time, rand),
          canvas
        );
      };

      if (loaded) return;
      loaded = true;
      const mobile = window.isDevice;
      const koef = mobile ? 1.1 : 1;
      const canvas = document.getElementById('heart');
      const ctx = canvas.getContext('2d');
      let { width, height } = resizeCanvas(canvas, ctx, koef);
      const rand = Math.random;

      const traceCount = mobile ? 250 : 80;
      const pointsOrigin = [];
      const dr = mobile ? 0.3 : 0.1;
      for (let i = 0; i < Math.PI * 2; i += dr)
        pointsOrigin.push(scaleAndTranslate(heartPosition(i), 310, 19, 0, 0));
      for (let i = 0; i < Math.PI * 2; i += dr)
        pointsOrigin.push(scaleAndTranslate(heartPosition(i), 250, 15, 0, 0));
      for (let i = 0; i < Math.PI * 2; i += dr)
        pointsOrigin.push(scaleAndTranslate(heartPosition(i), 190, 11, 0, 0));

      const targetPoints = pulse(pointsOrigin, 1, 1, width, height);
      const e = createParticles(
        pointsOrigin.length,
        width,
        height,
        traceCount,
        rand
      );
      let time = 0;

      window.addEventListener('resize', () => {
        ({ width, height } = resizeCanvas(canvas, ctx, koef));
      });

      loop(e, targetPoints, ctx, width, height, time, rand);
    },
  },
};
</script>

<style scoped>
/* Убедитесь, что canvas правильно отображается на мобильных устройствах */
canvas {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
