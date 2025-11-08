export function formatMessageTime(date) {
  // ✅ Return empty string if no date is provided
  if (!date) return "";

  const parsedDate = new Date(date);

  // ✅ Handle invalid date formats gracefully
  if (isNaN(parsedDate.getTime())) return "";

  // ✅ Return formatted time (HH:mm in 24-hour format)
  return parsedDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}
