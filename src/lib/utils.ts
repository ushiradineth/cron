import { Event, PickerType } from "@/lib/types";
import { clsx, type ClassValue } from "clsx";
import dayjs from "dayjs";
import "dayjs/plugin/duration";
import "dayjs/plugin/relativeTime";
import "dayjs/plugin/utc";
import { twMerge } from "tailwind-merge";

dayjs.extend(require("dayjs/plugin/utc"));
dayjs.extend(require("dayjs/plugin/timezone"));
dayjs.extend(require("dayjs/plugin/duration"));
dayjs.extend(require("dayjs/plugin/relativeTime"));
dayjs.extend(require("dayjs/plugin/weekOfYear"));

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getHour(hour: number) {
	if (hour >= 0 && hour <= 11) {
		return hour === 0 ? "12AM" : hour + "AM";
	} else if (hour === 12) {
		return "12PM";
	} else {
		return hour - 12 + "PM";
	}
}

export function getDateRange(date: Date): string[] {
	const currentDate = dayjs(date);
	const dateRange: string[] = [];

	// Add 60 previous days
	for (let i = 60; i > 0; i--) {
		const previousDate = currentDate.subtract(i, "day");
		dateRange.push(previousDate.format("YYYY-MM-DD"));
	}

	// Add current date
	dateRange.push(currentDate.format("YYYY-MM-DD"));

	// Add 60 next days
	for (let i = 1; i <= 60; i++) {
		const nextDate = currentDate.add(i, "day");
		dateRange.push(nextDate.format("YYYY-MM-DD"));
	}

	return dateRange;
}

export function getDayWithDate(date: Date): {
	day: string;
	date: string;
	month: string;
	year: string;
	week: string;
} {
	const formattedDate = dayjs(date);
	const day = formattedDate.format("ddd");
	const dateNumber = formattedDate.format("DD");
	const month = formattedDate.format("MMMM");
	const year = formattedDate.format("YYYY");
	// @ts-expect-error week exists
	const week = formattedDate.week().toString();

	return {
		day,
		date: dateNumber,
		month,
		year,
		week,
	};
}
export function isToday(dateToCompare: Date): boolean {
	const today = dayjs().startOf("day");
	const otherDate = dayjs(dateToCompare).startOf("day");

	return today.isSame(otherDate);
}

export interface DateTimePair {
	startDateTime: Date;
	endDateTime: Date;
}

export function getDateTimePairFromSelection(
	startSelection: number,
	endSelection: number,
	startDate: Date,
): DateTimePair {
	const startDateTime = dayjs(
		getDateAndTimeFromSelection(startSelection, startDate),
	)
		.utc()
		.toDate();
	const endDateTime = dayjs(
		getDateAndTimeFromSelection(endSelection + 1, startDate),
	)
		.utc()
		.toDate();
	return { startDateTime, endDateTime };
}

export function getDateAndTimeFromSelection(
	selection: number,
	startDate: Date,
): Date {
	const startDateTime = dayjs(startDate);
	const hoursToAdd = Math.floor(selection / 4);
	const quartersToAdd = (selection % 4) * 15;

	const selectedDateTime = startDateTime
		.add(hoursToAdd, "hour")
		.add(quartersToAdd, "minute")
		.toDate();

	return selectedDateTime;
}

export function queryParams(
	removeKeys: string[],
	addKeys: string[][],
	params: any,
	pathname: string,
) {
	const url = new URLSearchParams(params);
	removeKeys.map((key) => url.delete(key));
	addKeys.map((key) => url.set(key[0], key[1]));

	return pathname + (url.toString() ? "?" + url.toString() : "");
}

export function getCurrentHourTime(valueHour: number): {
	hour: number;
	minutes: number;
	time: string;
	isCurrentHour: boolean;
	isPreviousHour: boolean;
} {
	const hour = dayjs().hour();
	const minutes = dayjs().minute();
	const time = dayjs().format("h:mmA");
	const isCurrentHour = valueHour === hour;
	const isPreviousHour = valueHour === hour - 1;

	return { hour, minutes, time, isCurrentHour, isPreviousHour };
}

export function convertISOToTime(isoString: string, day?: string): PickerType {
	const dateTime = dayjs(isoString);
	const value = dateTime.format("HH:mm");

	if (dayjs(dateTime).diff(day, "day") === 1) {
		return { value: "24:00", label: "24:00" };
	}
	return { label: value, value };
}

export function generateTimeArray(): PickerType[] {
	const time = [];
	for (let hours = 0; hours < 24; hours++) {
		for (let minutes = 0; minutes < 60; minutes += 15) {
			const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
			time.push({ value: formattedTime, label: formattedTime });
		}
	}

	time.push({ value: "24:00", label: "24:00" } as PickerType);
	return time;
}

const timeStringToMinutes = (timeString: string): number => {
	const [hours, minutes] = timeString.split(":").map(Number);
	return hours * 60 + minutes;
};

export const isStartBeforeEnd = (start: string, end: string): boolean => {
	const startTime = timeStringToMinutes(start);
	const endTime = timeStringToMinutes(end);
	return startTime < endTime;
};

export function generateTimezoneArray(): PickerType[] {
	const timezones: PickerType[] = [{ label: "", value: "" }];
	const allTimezones = Intl.supportedValuesOf("timeZone");

	allTimezones.map((timezone) =>
		timezones.push({ label: timezone ?? "", value: timezone ?? "" }),
	);

	return timezones;
}

export function getUserTimezone(timezones: PickerType[]): PickerType | null {
	// @ts-expect-error tz exists..
	const userTimezone = dayjs.tz.guess();

	const foundTimezone = timezones.find(
		(timezone) => timezone.value === userTimezone,
	);

	return foundTimezone || null;
}

export function calculateDaysToPreviousMonday(day: string) {
	const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
	const dayIndex = daysOfWeek.indexOf(day);

	// Calculate the number of days to go back to the previous Monday
	// If the input day is "Mon", return 0
	// If the input day is after "Mon", subtract the day index from 1
	// If the input day is before "Mon", add the difference between the index and 1 to -7
	return dayIndex === 0 ? 0 : dayIndex > 0 ? 0 - dayIndex : -7 + dayIndex;
}

export function getDayEvents(events: Event[], date: Date): Event[] {
	const filteredEvents = events.filter((event) => {
		const eventDate = new Date(event.date);

		return eventDate.toDateString() === date.toDateString();
	});

	return filteredEvents;
}

export function getDateFromEventTimer(date: Date, timeString: string): Date {
	// Split the time string into hours and minutes
	const [hours, minutes] = timeString.split(":");

	// Set the time for the given date
	const dateTime = dayjs(date)
		.set("hour", parseInt(hours, 10))
		.set("minute", parseInt(minutes, 10));

	return dateTime.toDate();
}

export function calculateTimeDifference(
	date: Date,
	startTime: string,
	endTime: string,
): number {
	const [startHours, startMinutes] = startTime.split(":");
	const [endHours, endMinutes] = endTime.split(":");

	const startDateTime = dayjs(date)
		.set("hour", parseInt(startHours, 10))
		.set("minute", parseInt(startMinutes, 10));

	const endDateTime = dayjs(date)
		.set("hour", parseInt(endHours, 10))
		.set("minute", parseInt(endMinutes, 10));

	// Calculate the difference in minutes
	const minutesDifference = endDateTime.diff(startDateTime, "minute");

	return minutesDifference;
}

export function getTimeDifferenceInQuarters(
	startTime: string,
	endTime: string,
) {
	// Parse start and end time strings
	const [startHour, startMinute] = startTime.split(":").map(Number);
	const [endHour, endMinute] = endTime.split(":").map(Number);

	// Calculate time difference
	const startTotalMinutes = startHour * 60 + startMinute;
	const endTotalMinutes = endHour * 60 + endMinute;
	const differenceInMinutes = endTotalMinutes - startTotalMinutes;

	return differenceInMinutes / 15;
}

export function getTimeFromQuarter(quarters: number, date: string): string {
	return dayjs(
		getDateAndTimeFromSelection(
			Number(quarters),
			dayjs(date).startOf("day").toDate(),
		),
	).format("HH:mm");
}
