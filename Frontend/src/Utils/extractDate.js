export function extractDate(isoString) {
  // Create a Date object from the ISO string
  const dateObj = new Date(isoString);

  // Helper function to add leading zero if needed
  const addLeadingZero = (num) => (num < 10 ? `0${num}` : num);

  // Extract day, month, and year components
  const day = addLeadingZero(dateObj.getDate());
  const month = addLeadingZero(dateObj.getMonth() + 1);
  const year = dateObj.getFullYear();

  // Format the date as DD/MM/YYYY
  const formattedDate = `${day}/${month}/${year}`;

  return formattedDate;
}
