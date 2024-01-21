export function debounce<A extends unknown[], R = void>(
  fn: (...args: A) => R,
  ms: number = 300
): (...args: A) => Promise<R> {
  let timer: NodeJS.Timeout;

  const debounced = (...args: A): Promise<R> =>
    new Promise((resolve, reject) => {
      if (timer) {
        clearTimeout(timer);
      }

      timer = setTimeout(async () => {
        try {
          const result = await fn(...args);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }, ms);
    });

  return debounced;
}
