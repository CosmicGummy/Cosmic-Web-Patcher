export function sample<Item>(arr: Item[] extends [] ? never : Item[]): Item {
  return arr[Math.floor(Math.random() * arr.length)];
}
