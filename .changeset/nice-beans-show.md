---
"typingfx": patch
---

chore: remove next.js from optional peerDependencies

Next.js isn't used internally—was previously listed only to signal support.
Better to avoid misleading consumers or triggering unnecessary warnings.
