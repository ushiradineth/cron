"use client";

import Day from "@/components/molecules/Day";
import { useEventContext } from "@/components/utils/Context";
import { getDateRange } from "@/lib/utils";
import dayjs from "dayjs";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDebounceCallback, useWindowSize } from "usehooks-ts";

interface Props {
	gridRef: React.RefObject<HTMLDivElement>;
	scrollToCurrentDate: () => void;
	setCurrentMonth: () => void;
}

export default function Grid({
	gridRef,
	scrollToCurrentDate,
	setCurrentMonth,
}: Props) {
	const [reset, setReset] = useState(true);
	const [days, setDays] = useState(
		getDateRange(dayjs().startOf("day").toDate()),
	);
	const eventContext = useEventContext();
	const { width: windowWidth } = useWindowSize({ debounceDelay: 100 });
	const [width, setWidth] = useState(windowWidth);
	const pathname = usePathname();

	useEffect(() => {
		console.log(eventContext.events);
	}, [eventContext.events]);

	useEffect(() => {
		scrollToCurrentDate();
	}, [scrollToCurrentDate]);

	useEffect(() => {
		setReset(true);
	}, [pathname]);

	useEffect(() => {
		if (gridRef.current) {
			setWidth(gridRef.current.offsetWidth);
		}
	}, [gridRef, windowWidth]);

	return (
		<div
			className="grid-col-3 grid w-full snap-x snap-mandatory grid-flow-col overflow-scroll"
			ref={gridRef}
			onScroll={useDebounceCallback(setCurrentMonth, 100)}
			onMouseDown={() => setReset(!reset)}>
			{days.map((day, index) => (
				<Day
					key={index}
					day={dayjs(day).startOf("day").toDate()}
					reset={reset}
					width={width}
				/>
			))}
		</div>
	);
}