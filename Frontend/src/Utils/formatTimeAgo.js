const formatter = new Intl.RelativeTimeFormat(undefined, {
    numeric: "auto",
  });

  const TIME_UNITS = [
    { unit: "year", seconds: 31536000 },
    { unit: "month", seconds: 2592000 },
    { unit: "week", seconds: 604800 },
    { unit: "day", seconds: 86400 },
    { unit: "hour", seconds: 3600 },
    { unit: "minute", seconds: 60 },
    { unit: "second", seconds: 1 },
  ];

  export function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const elapsed = (date.getTime() - now.getTime()) / 1000;

    for (const { unit, seconds } of TIME_UNITS) {
      if (Math.abs(elapsed) >= seconds || unit === "second") {
        const value = Math.round(elapsed / seconds);
        return formatter.format(value, unit);
      }
    }
  }