import { useEffect, useState } from "react";
import { getItems, selectItem, addItem } from "../api";

export default function LeftList() {
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [filter, setFilter] = useState("");
  const [newId, setNewId] = useState("");


  const load = async (reset = false) => {
    const data = await getItems({
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

  const handleSelect = async id => {
    await selectItem(id);
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddNew = async () => {
    if (!newId) return;
    await addItem(Number(newId));
    setNewId("");
    load(true);
  };

  return (
    <div style={{ flex: 1, overflow: "auto", padding: 10 }}>
      <h3>All Items</h3>
      <input
        type="text"
        placeholder="Filter by ID"
        value={filter}
        onChange={handleFilterChange}
        style={{ marginBottom: 10, width: "100%" }}
      />
      <div style={{ marginBottom: 10 }}>
        <input
          type="number"
          placeholder="Add new ID"
          value={newId}
          onChange={e => setNewId(e.target.value)}
        />
        <button onClick={handleAddNew}>Add</button>
      </div>
      {items.map(item => (
        <div
          key={item.id}
          style={{
            border: "1px solid #ccc",
            marginBottom: 5,
            padding: 5,
            cursor: "pointer"
          }}
          onClick={() => handleSelect(item.id)}
        >
          ID: {item.id}
        </div>
      ))}
      <button onClick={() => load()}>Load more</button>
    </div>
  );
}
