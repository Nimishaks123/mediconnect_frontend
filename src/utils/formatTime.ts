export const formatTime = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);

  return new Date(
    0,
    0,
    0,
    hours,
    minutes
  ).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};