import { customItemsSet, customItemsList } from "./store.js";

const queue = new Map();
const newItemsBatch = new Set();

export function enqueue(key, action) {
  if (!queue.has(key)) {
    queue.set(key, action);
  }
}


setInterval(() => {
  for (const action of queue.values()) {
    action();
  }
  queue.clear();
}, 1000);


export function enqueueNewItem(id) {
  if (!customItemsSet.has(id)) {
    newItemsBatch.add(id);
  }
}

setInterval(() => {
  newItemsBatch.forEach(id => {
    customItemsSet.add(id);
    customItemsList.push({ id });
  });
  newItemsBatch.clear();
}, 10000);
