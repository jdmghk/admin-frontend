import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { addMinutes, format, parse } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
};

export const formatEventDate = (dateString: string) => {
  const cleanedDateString = dateString.replace(/(\d+)(th|st|nd|rd)/, "$1");

  const parsedDate = parse(cleanedDateString, "d MMMM, yyyy", new Date());

  const day_string = format(parsedDate, "EEEE");
  const day_int = format(parsedDate, "d");
  const month = format(parsedDate, "MMMM");
  const year = format(parsedDate, "yyyy");

  return `${day_string}, ${month} ${getOrdinalSuffix(+day_int)}, ${year}`;
};

export const getEventTimeRange = (startTime: string, duration: number) => {
  const parsedStartTime = parse(startTime, "h:mm a", new Date());
  const endTime = addMinutes(parsedStartTime, duration);

  const formattedStartTime = format(parsedStartTime, "h:mm a");
  const formattedEndTime = format(endTime, "h:mm a");

  return `${formattedStartTime} - ${formattedEndTime} WAT`;
};
