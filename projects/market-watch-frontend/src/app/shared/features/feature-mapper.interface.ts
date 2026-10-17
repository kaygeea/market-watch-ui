/** The generic TypeScript signature for all feature mappers to implement */
export type FeatureMapperFn<T_UI, T_API> = (uiData: T_UI) => T_API;