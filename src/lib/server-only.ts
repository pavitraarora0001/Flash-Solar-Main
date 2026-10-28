import "server-only";

/**
 * Server boundary guard ensuring confidential operations, database adapters,
 * and secret keys are never bundled into client components.
 */
export function assertServerOnly() {
  if (typeof window !== "undefined") {
    throw new Error("SECURITY VIOLATION: Server-only module executed in client context.");
  }
}

