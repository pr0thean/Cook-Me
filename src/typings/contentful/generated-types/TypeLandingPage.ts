import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeHeroSkeleton } from "./TypeHero";

export interface TypeLandingPageFields {
    internalTitle: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    hero?: EntryFieldTypes.EntryLink<TypeHeroSkeleton>;
    sections?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<EntrySkeletonType>>;
}

export type TypeLandingPageSkeleton = EntrySkeletonType<TypeLandingPageFields, "landingPage">;
export type TypeLandingPage<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeLandingPageSkeleton, Modifiers, Locales>;
