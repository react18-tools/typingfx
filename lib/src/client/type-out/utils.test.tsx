import { updateAfterTypeAnim, updateAfterDelAnim, listElements, compareSteps, addAnimationListeners } from "./utils";
import styles from "./type-out.module.scss";
import { describe, test, expect, vi } from "vitest";

// Mock styles object for className checks
vi.mock("./type-out.module.scss", () => ({
  default: {
    word: "word",
    hk: "hk",
    type: "type",
    del: "del",
    wait: "wait",
    component: "component",
    cursor: "cursor",
  },
}));



describe("utils", () => {
  describe("updateAfterTypeAnim", () => {
    test("sets width from --w and removes type/hk classes", () => {
      const el = document.createElement("span");
      el.classList.add(styles.type, styles.hk);
      el.style.setProperty("--w", "123px");
      updateAfterTypeAnim(el);
      expect(el.style.width).toBe("123px");
      expect(el.classList.contains(styles.type)).toBe(false);
      expect(el.classList.contains(styles.hk)).toBe(false);
    });
  });

  describe("updateAfterDelAnim", () => {
    test("sets width to 0, removes del, adds hk if not word", () => {
      const el = document.createElement("span");
      el.classList.add(styles.del);
      updateAfterDelAnim(el);
      expect(el.style.width).toBe("0px");
      expect(el.classList.contains(styles.del)).toBe(false);
      expect(el.classList.contains(styles.hk)).toBe(true);
    });
    test("does not add hk if word", () => {
      const el = document.createElement("span");
      el.classList.add(styles.del, styles.word);
      updateAfterDelAnim(el);
      expect(el.classList.contains(styles.hk)).toBe(false);
    });
  });

  describe("listElements", () => {
    test("returns nested elements arrays", () => {
      const root = document.createElement("div");
      const child1 = document.createElement("span");
      const child2 = document.createElement("span");
      root.appendChild(child1);
      root.appendChild(child2);
      const result = listElements(root);
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(2);
    });
  });

  describe("compareSteps", () => {
    test("returns correct start indices for different steps", () => {
      // Simulate two steps with different word elements
      const el1 = document.createElement("span");
      el1.classList.add(styles.word);
      el1.textContent = "hello";
      const el2 = document.createElement("span");
      el2.classList.add(styles.word);
      el2.textContent = "world";
      const elements = [[el1], [el2]];
      const indices = compareSteps(elements);
      expect(Array.isArray(indices)).toBe(true);
      expect(indices.length).toBe(2);
    });
  });

  describe("addAnimationListeners", () => {
    test("returns early if all steps are same", () => {
      const el = document.createElement("span");
      el.classList.add(styles.word);
      el.textContent = "a";
      const elements = [[el], [el]];
      // Should not throw
      expect(() => addAnimationListeners(elements, 1, false)).not.toThrow();
    });
    test("sets onanimationend handlers", () => {
      const el1 = document.createElement("span");
      el1.classList.add(styles.type, styles.word);
      el1.textContent = "a";
      const el2 = document.createElement("span");
      el2.classList.add(styles.word);
      el2.textContent = "b";
      const elements = [[el2, el1], [el1, el2]];
      addAnimationListeners(elements, 1, false);
      expect(typeof el1.onanimationend).toBe("function");
      expect(typeof el2.onanimationend).toBe("function");
    });
  });
});
