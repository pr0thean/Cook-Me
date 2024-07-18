import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
import type { TypeCategorySkeleton } from "./TypeCategory";

export interface TypeRecipeFields {
    internalTitle: EntryFieldTypes.Symbol;
    name: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    image?: EntryFieldTypes.AssetLink;
    ingredients: EntryFieldTypes.RichText;
    instruction: EntryFieldTypes.RichText;
    time?: EntryFieldTypes.Integer;
    level?: EntryFieldTypes.Symbol<"Average" | "Easy" | "Hard">;
    category?: EntryFieldTypes.EntryLink<TypeCategorySkeleton>;
}

export type TypeRecipeSkeleton = EntrySkeletonType<TypeRecipeFields, "recipe">;
export type TypeRecipe<Modifiers extends ChainModifiers, Locales extends LocaleCode = LocaleCode> = Entry<TypeRecipeSkeleton, Modifiers, Locales>;
