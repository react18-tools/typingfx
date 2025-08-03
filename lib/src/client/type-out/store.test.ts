import { describe, it, expect, beforeEach } from "vitest";
import { useUpdate } from "./store";

// Helper to reset store state before each test
const resetStore = (store: ReturnType<typeof useUpdate>) => {
  store.setState({
    speed: 20,
    delSpeed: 40,
    noCursor: false,
    noCursorAfterAnimEnd: false,
    repeat: Infinity,
    force: false,
    paused: false,
    componentAnimation: undefined,
  });
};

describe("useUpdate store setters", () => {
  let store: ReturnType<typeof useUpdate>;

  beforeEach(() => {
    store = useUpdate();
    resetStore(store);
  });

  it("sets speed", () => {
    store.setState({ speed: 99 });
    expect(store.getState()?.speed).toBe(99);
  });

  it("sets delSpeed", () => {
    store.setState({ delSpeed: 77 });
    expect(store.getState()?.delSpeed).toBe(77);
  });

  it("sets noCursor", () => {
    store.setState({ noCursor: true });
    expect(store.getState()?.noCursor).toBe(true);
  });

  it("sets noCursorAfterAnimEnd", () => {
    store.setState({ noCursorAfterAnimEnd: true });
    expect(store.getState()?.noCursorAfterAnimEnd).toBe(true);
  });

  it("sets repeat", () => {
    store.setState({ repeat: 5 });
    expect(store.getState()?.repeat).toBe(5);
  });

  it("sets force", () => {
    store.setState({ force: true });
    expect(store.getState()?.force).toBe(true);
  });

  it("sets paused", () => {
    store.setState({ paused: true });
    expect(store.getState()?.paused).toBe(true);
  });

  it("sets componentAnimation", () => {
    const anim = { wrapper: "div" as keyof HTMLElementTagNameMap };
    store.setState({ componentAnimation: anim });
    expect(store.getState()?.componentAnimation).toEqual(anim);
  });

  it("returns a new store for a given storeId", () => {
    const storeA = useUpdate("A");
    const storeB = useUpdate("B");
    expect(storeA).not.toBe(storeB);
    storeA.setState({ speed: 1 });
    storeB.setState({ speed: 2 });
    expect(storeA.getState()?.speed).toBe(1);
    expect(storeB.getState()?.speed).toBe(2);
  });
});
