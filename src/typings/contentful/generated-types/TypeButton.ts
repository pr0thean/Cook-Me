import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeButtonFields {
    internalTitle: EntryFieldTypes.Symbol;
    label: EntryFieldTypes.Symbol;
    link?: EntryFieldTypes.Symbol;
}

export type TypeButtonSkeleton = EntrySkeletonType<TypeButtonFields, "button">;
export type TypeButton<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeButtonSkeleton, Modifiers, Locales>;
