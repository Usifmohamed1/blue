import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'framer-motion';
export default function useAnimatedCounter(target, enabled = true) {
  const ref = useRef();
  const visible = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [value, setValue] = useState(target);
  useEffect(() => {
    if (!visible || reduce || !enabled) return;
    const controls = animate(0, target, {
      duration: 1,
      onUpdate: (next) => setValue(Math.round(next)),
    });
    return () => controls.stop();
  }, [visible, reduce, target, enabled]);
  return { ref, value, visible, reduce };
}
