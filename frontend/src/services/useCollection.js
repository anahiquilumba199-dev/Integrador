import { useEffect, useState } from "react";
import api from "./api";

export function useCollection(path) {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    api.get(path).then(
      (data) => { if (active) setItems(data); },
      (failure) => { if (active) setError(failure.message); }
    );
    return () => { active = false; };
  }, [path]);

  async function create(data) {
    setError("");
    try {
      const item = await api.post(path, data);
      setItems((current) => [...current, item]);
      return item;
    } catch (failure) {
      setError(failure.message);
      return null;
    }
  }

  return { items, setItems, error, setError, create };
}
