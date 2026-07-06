export function formatDateTime(iso) {
  if (!iso) return "";

  const d = new Date(iso);

  return isNaN(d)
    ? "" 
    : d.toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
}