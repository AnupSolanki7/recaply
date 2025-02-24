export function secondsToHours(seconds: number) {
  if (isNaN(seconds) || seconds < 0) {
    return "Invalid input";
  }
  return Number(seconds / 3600).toFixed(2);
}
