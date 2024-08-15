// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Function<Res = any> = () => Res;

export function once<F extends Function>(func: F) {
  let called = false;
  let result: ReturnType<F>;

  return () => {
    if (!called) {
      called = true;
      result = func();
    }

    return result;
  };
}
