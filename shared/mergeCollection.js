const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const key = (item) => typeof item === 'object' && item !== null ? item.id : item;

// Apply only the changes made relative to this device's last acknowledged snapshot.
export function mergeCollection(base, local, remote) {
  const before = new Map(base.map((item) => [key(item), item]));
  const after = new Map(local.map((item) => [key(item), item]));
  const result = new Map(remote.map((item) => [key(item), item]));
  for (const id of before.keys()) if (!after.has(id)) result.delete(id);
  for (const [id, item] of after) {
    if (!before.has(id)) {
      if (!result.has(id)) result.set(id, item);
    } else if (!equal(item, before.get(id)) && result.has(id)) {
      const previous = before.get(id);
      const merged = { ...result.get(id) };
      for (const field of new Set([...Object.keys(previous), ...Object.keys(item)])) {
        if (equal(previous[field], item[field])) continue;
        if (field === 'items' && Array.isArray(item[field]) && Array.isArray(previous[field])) {
          merged[field] = mergeCollection(previous[field], item[field], merged[field] || []);
        } else if (field in item) merged[field] = item[field];
        else delete merged[field];
      }
      result.set(id, merged);
    }
  }
  const reordered = !equal(base.filter((x) => after.has(key(x))).map(key), local.filter((x) => before.has(key(x))).map(key));
  const order = reordered ? [...local, ...remote] : [...remote];
  if (!reordered) {
    const orderedIds = new Set(order.map(key));
    local.forEach((item, index) => {
      if (orderedIds.has(key(item))) return;
      const next = local.slice(index + 1).find((entry) => orderedIds.has(key(entry)));
      const position = next === undefined ? order.length : order.findIndex((entry) => key(entry) === key(next));
      order.splice(position, 0, item);
      orderedIds.add(key(item));
    });
  }
  const seen = new Set();
  return order.filter((item) => {
    const id = key(item);
    if (!result.has(id) || seen.has(id)) return false;
    seen.add(id);
    return true;
  }).map((item) => result.get(key(item)));
}
