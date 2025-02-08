// components/LocalDateTime.tsx
"use client";

type LocalDateTimeProps = {
  dateString: string;
  showTime?: boolean; // Optional prop to toggle time display
};

export default function LocalDateTime({
  dateString,
  showTime = false,
}: LocalDateTimeProps) {
  const date = new Date(dateString);

  const formattedDate = date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <span>
      {formattedDate}
      {showTime && `, ${formattedTime}`}
    </span>
  );
}
