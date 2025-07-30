import { create } from "kosha";
import { HTMLProps } from "react";

export type ComponentAnimation = {
  wrapper: keyof HTMLElementTagNameMap;
  props?: Omit<HTMLProps<HTMLElement>, "children">;
};

export interface ICommonProps {
  /** Typing speed in characters per second. @default 20 */
  speed: number;

  /** Deletion speed in characters per second. @default 40 */
  delSpeed: number;

  /** Whether to hide the blinking cursor. @default false */
  noCursor: boolean;

  /** Whether to hide the blinking cursor after completing the anim. @default false */
  noCursorAfterAnimEnd: boolean;

  /** Number of times to repeat the animation. @default Infinity */
  repeat: number;

  /** Whether to override user's reduced motion preference. @default false */
  force?: boolean;

  /** Controls whether the animation is paused. */
  paused: boolean;

  /** @beta Preference for animating custom components in steps or children */
  componentAnimation?: ComponentAnimation;
}

export const defaultCommonProps: ICommonProps = {
  speed: 20,
  delSpeed: 40,
  noCursor: false,
  noCursorAfterAnimEnd: false,
  repeat: Infinity,
  force: false,
  paused: false,
};

interface ITypeoutStore extends ICommonProps {
  // JSON.stringified variables to avoid unnecessary re-renders
  variables: string;
}

interface ITypeoutStoreActions {
  setSpeed: (speed: number) => void;
  setDelSpeed: (delSpeed: number) => void;
  setNoCursor: (noCursor: boolean) => void;
  setNoCursorAfterAnimEnd: (noCursorAfterAnimEnd: boolean) => void;
  setRepeat: (repeat: number) => void;
  setForce: (force: boolean) => void;
  setPaused: (paused: boolean) => void;
  setComponentAnimation: (componentAnimation: ComponentAnimation | undefined) => void;
  setVariables: (variables: string) => void;
}

export const useUpdate = create<ITypeoutStore & ITypeoutStoreActions>(set => ({
  ...defaultCommonProps,
  variables: "",
  setSpeed: speed => set({ speed }),
  setDelSpeed: delSpeed => set({ delSpeed }),
  setNoCursor: noCursor => set({ noCursor }),
  setNoCursorAfterAnimEnd: noCursorAfterAnimEnd => set({ noCursorAfterAnimEnd }),
  setRepeat: repeat => set({ repeat }),
  setForce: force => set({ force }),
  setPaused: paused => set({ paused }),
  setComponentAnimation: componentAnimation => set({ componentAnimation }),
  setVariables: variables => set({ variables }),
}));
