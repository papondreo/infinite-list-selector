
export const getItems = async ({ offset = 0, limit = 20, search = "" }) => {
  const params = new URLSearchParams({ offset, limit, search });
  const res = await fetch(`/api/items?${params}`);
  return res.json();
};


export const getSelected = async ({ offset = 0, limit = 20, search = "" }) => {
  const params = new URLSearchParams({ offset, limit, search });
  const res = await fetch(`/api/selected?${params}`);
  return res.json();
};

export const selectItem = async id => {
  await fetch("/api/select", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
};


export const addItem = async id => {
  await fetch("/api/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id })
  });
};


export const reorderItem = async (fromIndex, toIndex) => {
  
  await fetch("/api/reorder", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from: fromIndex, to: toIndex })
  });

};
