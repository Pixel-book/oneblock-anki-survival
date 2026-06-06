export function logInfo(scope, message) {
  console.warn(`[OBA][INFO][${scope}] ${message}`);
}

export function logWarn(scope, message) {
  console.warn(`[OBA][WARN][${scope}] ${message}`);
}

export function logError(scope, message, error) {
  const detail = error?.stack ?? error?.message ?? String(error ?? "");
  console.warn(`[OBA][ERROR][${scope}] ${message}${detail ? ` ${detail}` : ""}`);
}

export function logDebug(scope, message) {
  console.warn(`[OBA][DEBUG][${scope}] ${message}`);
}

