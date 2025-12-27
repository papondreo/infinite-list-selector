import express from "express";
import path from "path";
import { fileURLToPath } from "url";

import {
  TOTAL_ITEMS,
  selectedOrder,
  selectedSet,
  customItemsSet,
  customItemsList
} from "./store.js";


import { enqueue, enqueueNewItem } from "./queue.js";

const app = express();
app.use(express.json());

const __dirname = path.dirname(fileURLToPath(import.meta.url));



function generateItems({ offset, limit, search, excludeSelected }) {
  let result = [];


  for (let item of customItemsList) {
    if (excludeSelected && selectedSet.has(item.id)) continue;
    if (!search || String(item.id).includes(search)) result.push(item);
  }


  let id = 1;
  while (result.length < offset + limit && id <= TOTAL_ITEMS) {
    if (excludeSelected && selectedSet.has(id)) {
      id++;
      continue;
    }
    if (!customItemsSet.has(id) && (!search || String(id).includes(search))) {
      result.push({ id });
    }
    id++;
  }

  return result.slice(offset, offset + limit);
}





app.get("/api/items", (req, res) => {
  const { offset = 0, limit = 20, search } = req.query;

  const data = generateItems({
    offset: Number(offset),
    limit: Number(limit),
    search,
    excludeSelected: true
  });

  res.json(data);
});

app.get("/api/selected", (req, res) => {
  const { offset = 0, limit = 20, search } = req.query;

  let data = selectedOrder.map(id => ({ id }));

  if (search) {
    data = data.filter(i => String(i.id).includes(search));
  }

  res.json(data.slice(offset, offset + limit));
});

app.post("/api/select", (req, res) => {
  const { id } = req.body;

  enqueue(`select:${id}`, () => {
    if (!selectedSet.has(id)) {
      selectedSet.add(id);
      selectedOrder.push(id);
    }
  });

  res.sendStatus(200);
});


app.post("/api/reorder", (req, res) => {
  const { from, to } = req.body;

  enqueue(`reorder:${from}:${to}`, () => {
    const [item] = selectedOrder.splice(from, 1);
    selectedOrder.splice(to, 0, item);
  });

  res.sendStatus(200);
});


app.post("/api/add", (req, res) => {
  const { id } = req.body;

  if (!customItemsSet.has(id)) {
    customItemsSet.add(id);
    customItemsList.push({ id });
  }

  enqueueNewItem(id);
  res.sendStatus(200);
});





app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
