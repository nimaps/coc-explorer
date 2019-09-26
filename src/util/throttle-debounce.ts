export function throttle<A extends Array<any>, R>(
  delay: number,
  fn: (...args: A) => Promise<R> | R,
  { tail = false }: { tail?: boolean } = {},
): (...args: A) => Promise<R | undefined> {
  const debounceFn = debounce(delay, fn);
  let lastTime = 0;
  return async (...args: A) => {
    const now = Date.now();
    if (now - lastTime < delay) {
      if (tail) {
        return await debounceFn(...args);
      } else {
        return undefined;
      }
    } else {
      lastTime = now;
      try {
        const ret = await fn(...args);
        return ret;
      } catch (error) {
        throw error;
      }
    }
  };
}

export function debounce<A extends Array<any>, R>(
  delay: number,
  fn: (...args: A) => Promise<R> | R,
): (...args: A) => Promise<R | undefined> {
  let timer: NodeJS.Timeout | null = null;
  let lastResolve: null | ((value: R | undefined) => void) = null;
  return async (...args: A) => {
    if (timer) {
      clearTimeout(timer);
      lastResolve!(undefined);
    }
    return await new Promise<R | undefined>((resolve, reject) => {
      lastResolve = resolve;
      timer = setTimeout(async () => {
        try {
          resolve(await fn(...args));
        } catch (error) {
          reject(error);
        }
      }, delay);
    });
  };
}