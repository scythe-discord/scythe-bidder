export const BREAKPOINTS = [480, 576, 768, 992, 1200, 1600];

export const mq = BREAKPOINTS.map((bp) => `@media (min-width: ${bp}px)`);
