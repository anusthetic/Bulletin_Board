import { useEffect, useState } from "react";

export default function useItemLookup(id, stateItem, fetchFn) {
  const [item, setItem] = useState(stateItem || null);
  const [loading, setLoading] = useState(!stateItem);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (item) return;

    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);

      try {
        let offset = 0;
        const limit = 50;
        let found = null;
        let total = Infinity;

        while (offset < total && !found) {
          const res = await fetchFn({ limit, offset });
          total = res.total;
          found = res.data.find((x) => x.id === id);
          offset += limit;
        }

        if (cancelled) return;

        found
          ? setItem(found)
          : setError("This could not be found.");
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();

    return () => {
      cancelled = true;
    };
  }, [id]);

  return { item, loading, error };
}