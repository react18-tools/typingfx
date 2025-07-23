---
"typingfx": patch
---

fix(typeout): memoize input props internally to prevent unnecessary re-renders

Improves performance by memoizing internal state updates.
Also improves DX—consumers no longer need to wrap inputs in useMemo to avoid loops.
