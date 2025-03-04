//  Formats a duration given in seconds into a string with the format "HH:MM:SS" or "MM:SS".
//  If the duration is more than an hour, it includes the hours part.

export function formatDuration(duration) {
  // Calculate hours, minutes, and seconds from the duration
  const hours = Math.floor(duration / 60 / 60);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor(duration % 60);

  // Helper function to add leading zero if needed
  const addLeadingZero = (num) => (num < 10 ? `0${num}` : num);

  // If the duration includes hours, format as "HH:MM:SS"
  if (hours > 0) {
    return `${hours}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
  }

  // Otherwise, format as "MM:SS"
  return `${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
}
