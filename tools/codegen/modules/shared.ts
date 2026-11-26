// Shapes of spec entries used by several modules.

export interface Valued {
  readonly value: number;
  readonly word: string;
}
export interface Worded {
  readonly word: string;
}
export interface Sourced<T> {
  readonly values: readonly T[];
}
