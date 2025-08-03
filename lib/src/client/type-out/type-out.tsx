import { HTMLProps, memo, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import styles from "./type-out.module.scss";
import { Optional } from "@m2d/core";
import { addAnimationListeners, listElements, setupTypingFX } from "./utils";
import { defaultCommonProps, ICommonProps, useUpdate } from "./store";

/**
 * Props for the TypeOut component.
 * Provides fine-grained control over typing behavior, repetition, and accessibility.
 */
interface DefaultTypeOutProps extends HTMLProps<HTMLDivElement>, ICommonProps {
  /** Sequence of steps (lines or phrases) to animate through. */
  steps: ReactNode[];
  storeId?: string;
}

const defaultTypeOutProps: DefaultTypeOutProps = {
  children: "",
  steps: [""],
  ...defaultCommonProps,
};

export type TypeOutProps = Optional<DefaultTypeOutProps>;

const TypingAnimation = ({
  children,
  className,
  steps,
  style,
  storeId,
  ...props
}: Pick<DefaultTypeOutProps, "steps" | "storeId"> & HTMLProps<HTMLDivElement>) => {
  const [processing, setProcessing] = useState(true);

  const { componentAnimation, delSpeed, noCursor, noCursorAfterAnimEnd, repeat, speed, paused } =
    useUpdate(storeId)();

  const animatedSteps = useMemo(() => {
    const newSteps = children ? [...steps, children] : steps;
    if (newSteps.length < 2) newSteps.unshift("", "");
    return setupTypingFX(newSteps, componentAnimation);
  }, [children, steps, componentAnimation]);

  const containerRef = useRef<HTMLDivElement>(null);

  // Trigger animations on mount or changes
  useEffect(() => {
    setProcessing(true);

    let elements: HTMLElement[][];
    requestAnimationFrame(() => {
      if (!containerRef.current) return;
      elements = listElements(containerRef.current);

      for (let i = 0; i < elements[0].length; i++) {
        const el = elements[0][i] as HTMLElement;
        const nextEl = elements[0][i + 1] as HTMLElement;
        el.onanimationend = (e: AnimationEvent) => {
          e.stopPropagation();
          el.style.width = el.style.getPropertyValue("--w");
          el.classList.remove(styles.type, styles.hk);

          // skipcq: JS-0354
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          nextEl
            ? nextEl.classList.add(styles.type)
            : (addAnimationListeners(elements as HTMLElement[][], repeat, noCursorAfterAnimEnd),
              el.classList.add(styles.del));
        };
      }

      requestAnimationFrame(() => elements[0][0].classList.add(styles.type));
      setProcessing(false);
    });
    return () => elements?.flat().forEach(el => (el.onanimationend = null));
  }, [animatedSteps, repeat, noCursorAfterAnimEnd]);

  // Respect pause and pause on visibility hidden
  useEffect(() => {
    if (paused) {
      containerRef.current?.classList.add(styles.paused);
      return () => null;
    }
    const handleVisibilityChange = () => {
      containerRef.current?.classList[document.visibilityState === "visible" ? "remove" : "add"](
        styles.paused,
      );
    };
    handleVisibilityChange();
    addEventListener("visibilitychange", handleVisibilityChange);
    return () => removeEventListener("visibilitychange", handleVisibilityChange);
  }, [paused]);

  return (
    <div
      {...props}
      className={[
        className,
        styles.typeout,
        processing ? styles.processing : "",
        noCursor ? "" : styles.cursor,
      ].join(" ")}
      ref={containerRef}
      // @ts-expect-error -- using custom CSS variables
      style={{ "--speed": speed, "--delSpeed": delSpeed, ...style }}
      data-testid="type-out">
      {animatedSteps.map((step, i) => (
        <div key={i} className={styles.hk}>
          {step}
        </div>
      ))}
    </div>
  );
};

/**
 * TypeOut component — main entry point.
 * Handles prefers-reduced-motion and conditional rendering.
 *
 * @example
 * ```tsx
 * <TypeOut steps={["Hello", "World"]} />
 * ```
 */
export const TypeOut = memo(
  (props_: TypeOutProps) => {
    const {
      children,
      steps,
      componentAnimation,
      delSpeed,
      noCursor,
      noCursorAfterAnimEnd,
      repeat,
      speed,
      force,
      paused,
      storeId,
      ...props
    } = {
      ...defaultTypeOutProps,
      ...props_,
    };
    const [suppressAnimation, setSuppressAnimation] = useState(false);

    const force_ = useUpdate(storeId)(state => state.force);

    useEffect(() => {
      useUpdate(storeId).setState({
        componentAnimation,
        delSpeed,
        noCursor,
        noCursorAfterAnimEnd,
        repeat,
        speed,
        force,
        paused,
      });
      const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      // Respect reduced motion setting of OS
      const handleReducedMotion = () => setSuppressAnimation(motionQuery.matches);
      handleReducedMotion();
      motionQuery.addEventListener("change", handleReducedMotion);
      return () => motionQuery.removeEventListener("change", handleReducedMotion);
    }, []);

    return !force_ && suppressAnimation ? (
      <div {...props}>{steps[steps.length - 1] || children || steps[0]}</div>
    ) : (
      <TypingAnimation {...props} {...{ children, storeId, steps }} />
    );
  },
  () => true,
);
