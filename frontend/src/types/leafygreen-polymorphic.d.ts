/* eslint-disable @typescript-eslint/no-empty-object-type */
import type {
  InferredPolymorphicPropsWithRef,
  PolymorphicAs,
  PolymorphicPropsWithRef,
} from "@leafygreen-ui/polymorphic";
import type { ReactElement } from "react";

/**
 * React 19's stricter `JSX.ElementType` rejects LeafyGreen's polymorphic
 * components because their call signature requires a second `ref` argument
 * (`(props, ref) => ...`), so they aren't callable with a single argument
 * ("Target signature provides too few arguments").
 *
 * These augmentations add a single-argument call overload to the underlying
 * polymorphic interfaces, which is enough for the components (`Button`, `H3`,
 * `Body`, etc.) to satisfy `JSX.ElementType` without loosening global types.
 *
 * The module specifiers are relative paths into the (hoisted) package so they
 * resolve to the exact declaration files (the package `exports` map does not
 * expose these subpaths, so bare specifiers cannot be used here).
 */
declare module "../../../node_modules/@leafygreen-ui/polymorphic/dist/types/Polymorphic/Polymorphic.types" {
  interface PolymorphicComponentType<
    XP = {},
    DefaultAs extends PolymorphicAs = PolymorphicAs,
  > {
    <T extends PolymorphicAs = DefaultAs>(
      props: PolymorphicPropsWithRef<T, XP>
    ): ReactElement | null;
  }
}

declare module "../../../node_modules/@leafygreen-ui/polymorphic/dist/types/InferredPolymorphic/InferredPolymorphic.types" {
  interface InferredPolymorphicRenderFunction<
    TComponentProps = {},
    TDefaultAs extends PolymorphicAs = PolymorphicAs,
  > {
    <TAsProp extends PolymorphicAs = TDefaultAs>(
      props: InferredPolymorphicPropsWithRef<TAsProp, TComponentProps>
    ): ReactElement | null;
  }
}
