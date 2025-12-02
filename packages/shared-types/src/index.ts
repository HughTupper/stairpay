/**
 * Generic response type for Server Actions
 * Use this to standardize action responses across the app
 */
export type ActionState<T = unknown> = {
  error?: string;
  success?: boolean;
  data?: T;
};
