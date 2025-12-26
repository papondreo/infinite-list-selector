import { useEffect, useState } from "react";
import { getSelected, reorderItem } from "../api";

export default function RightList() {
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState("");

  const load = async (reset = false) => {
    const data = await getSelected({
      offset: reset ? 0 : offset,
      limit: 20,
      search: filter
    });

    if (reset) {
      setItems(data);
      setOffset(data.length);
    } else {
      setItems(prev => [...prev, ...data]);
      setOffset(prev => prev + data.length);
    }
  };

  useEffect(() => {
    load(true);
  }, [filter]);

  const handleFilterChange = e => {
    setFilter(e.target.value);
  };

  const handleMove = async (fromIndex, toIndex) => {
    const newItems = [...items];
    const [moved] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, moved);
    setItems(newItems);

    await reorderItem(fromIndex, toIndex);
  };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: 10 }}>
      <h3>Selected Items</h3>

      <input
        type="text"
        placeholder="Filter by ID"
        value={filter}
        onChange={handleFilterChange}
        style={{ marginBottom: 10, width: "100%" }}
      />

      {items.map((item, index) => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ccc",
            marginBottom: 5,
            padding: 5,
            cursor: "grab"
          }}
          draggable
          onDragStart={e =>
            e.dataTransfer.setData("text/plain", index.toString())
          }
          onDrop={e => {
            const from = Number(e.dataTransfer.getData("text/plain"));
            handleMove(from, index);
          }}
          onDragOver={e => e.preventDefault()}
        >
          ID: {item.id}
        </div>
      ))}

      <button onClick={() => load()}>Load more</button>
    </div>
  );
}
