// utils/dateUtils.ts

export const formatTimeFromDate = (dateInput: string | Date) => {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return date
    .toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();
};

export const formatTimeForSlot = (startString: string, endString: string) => {
  const start = new Date(startString);
  const end = new Date(endString);

  const startTime = start
    .toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase()
    .replace(/\s/g, "");
  const endTime = end
    .toLocaleTimeString(undefined, {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase()
    .replace(/\s/g, "");

  const isSamePeriod = startTime.slice(-2) === endTime.slice(-2);
  const formattedStartTime = isSamePeriod ? startTime.slice(0, -2) : startTime;

  return `${formattedStartTime} - ${endTime}`;
};

export const formatDate = (dateInput: string | Date) => {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
