import { useEffect, useRef } from "react";
import { useTransform, useScroll, motion } from "framer-motion";

function Background() {
  const { scrollY } = useScroll();
  const ref = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number | null>(null);

  const y = useTransform(scrollY, [50, 500], [0, -200]);

  const input = [0, 0, 500];
  const output = [1, 1, 0];
  const opacity = useTransform(scrollY, input, output);

  useEffect(() => {
    if (!ref.current) return;

    const $ = ref.current.getContext("2d");

    const col = function (
      x: number,
      y: number,
      r: number,
      g: number,
      b: number
    ) {
      if (!$) return;
      $.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
      $.fillRect(x, y, 1, 1);
    };
    const R = function (x: number, y: number, t: number) {
      return Math.floor(192 + 64 * Math.cos((x * x - y * y) / 300 + t));
    };

    const G = function (x: number, y: number, t: number) {
      return Math.floor(
        192 +
          64 *
            Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300)
      );
    };

    const B = function (x: number, y: number, t: number) {
      return Math.floor(
        192 +
          64 *
            Math.sin(
              5 * Math.sin(t / 9) +
                ((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100
            )
      );
    };

    let t = 0;

    const run = () => {
      for (let x = 0; x <= 35; x++) {
        for (let y = 0; y <= 35; y++) {
          col(x, y, R(x, y, t), G(x, y, t), B(x, y, t));
        }
      }
      t = t + 0.01;
      frameRef.current = window.requestAnimationFrame(run);
    };

    run();

    return () => {
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      style={{
        opacity,
        y,
      }}
      className="inset background-clip fixed top-0 -z-10 h-3/4 w-screen shadow-[0_0px_0px_4px_0px_rgba(0,0,0,0.75)]"
    >
      <canvas
        id="canv"
        width="32"
        height="32"
        ref={ref}
        className=" h-full w-screen"
      ></canvas>
    </motion.div>
  );
}

export default Background;
