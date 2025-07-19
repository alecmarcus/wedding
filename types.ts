export type EmptyObject = Record<PropertyKey, never>;

export type DistributiveOmit<T, K extends string> = T extends unknown
  ? Omit<T, K>
  : never;

export type NonNullableMembers<
  T,
  Deep extends boolean = false,
> = T extends object
  ? {
      [k in keyof T]: Deep extends true
        ? NonNullable<T[k]>
        : Exclude<T[k], null>;
    }
  : // biome-ignore lint/suspicious/noExplicitAny: need to be open
    T extends any[]
    ? Deep extends true
      ? NonNullable<T[number]>
      : Exclude<T[number], null>
    : Exclude<T, null>;
