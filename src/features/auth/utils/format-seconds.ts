export const formatSeconds = (totalSeconds: number) => {
  if (typeof totalSeconds !== "number" || totalSeconds < 0 || !Number.isInteger(totalSeconds)) {
    return "Invalid Input";
  }
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};
