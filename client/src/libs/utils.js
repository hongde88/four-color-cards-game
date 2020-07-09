const cloneArray = (a, fn) => {
  const keys = Object.keys(a);
  const a2 = new Array(keys.length);

  for (let i = 0; i < keys.length; i++) {
    const k = keys[i];
    const cur = a[k];

    if (typeof cur !== 'object' || cur === null) {
      a2[k] = cur;
    } else {
      a2[k] = fn(cur);
    }
  }

  return a2;
};

export const clone = (o) => {
  if (typeof o !== 'object' || o === null) return o;
  if (Array.isArray(o)) return cloneArray(o, clone);

  let o2 = {};
  for (let k in o) {
    const cur = o[k];
    if (typeof cur !== 'object' || cur === null) {
      o2[k] = cur;
    } else {
      o2[k] = clone(cur);
    }
  }

  return o2;
};
