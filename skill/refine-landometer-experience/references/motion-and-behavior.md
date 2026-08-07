# Motion and behavior

Use motion only when it clarifies state, sequence, progress, spatial relationship, or cause and effect. It must not carry evidence, contrast, or comprehension by itself.

## Allowed purposes

- acknowledge a user-triggered state change;
- connect an origin to its destination;
- reveal the order of a short process;
- keep orientation during an expanding disclosure or view change;
- show bounded progress without implying completion.

Use the smallest movement that makes the relationship clearer. A 160–240 ms transition is a useful implementation range for direct state changes when the active specification does not define another value.

## Reduced motion

Under `prefers-reduced-motion: reduce`:

- show the final state immediately;
- remove nonessential travel, parallax, looping, and staged reveal;
- preserve focus, reading order, status announcements, and task completion;
- do not replace motion with flashing or abrupt contrast changes.

## Parallax and scrolling

Keep parallax and scroll-linked movement disabled unless a named, normative recipe defines purpose, bounds, input behavior, reduced-motion behavior, performance limits, and content accessibility. Never hijack scrolling, delay essential content, or make the primary action move away from the pointer or focus.

## QA

Test pointer, keyboard, touch, reduced motion, slow devices, interrupted transitions, browser back/forward restoration, and deep links. Verify that the interface remains understandable and complete with animation disabled.
