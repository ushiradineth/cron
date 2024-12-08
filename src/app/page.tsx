"use client";

import Header from "@/components/atoms/Header";
import TimeBlock from "@/components/atoms/TimeBlock";
import Sidebar from "@/components/molecules/Sidebar";
import Grid from "@/components/templates/Grid";
import {
  headerHeight,
  secondaryHeaderHeight,
  sidebarWidth,
} from "@/lib/consts";
import { useSettingStore } from "@/lib/stores/settings";
import {
  calculateDaysToPreviousMonday,
  getDayObjectFromId,
  getDayObjectWithDate,
} from "@/lib/utils";
import dayjs from "dayjs";

import { useCallback, useMemo, useRef, useState } from "react";

export default function Home() {
  const [month, setMonth] = useState(dayjs(new Date()).format("MMMM"));
  const [year, setYear] = useState(dayjs(new Date()).format("YYYY"));

  const gridRef = useRef<HTMLDivElement>(null);

  const { settings } = useSettingStore();

  const timezoneString = useMemo(
    () => getTimezoneString(settings.timezone),
    [settings.timezone],
  );

  const scrollToCurrentDate = useCallback(() => {
    if (gridRef.current) {
      const children = gridRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i] as HTMLElement;
        const dayObjectWithCurrentDate = getDayObjectWithDate(
          dayjs().startOf("day").toDate(),
        );
        const dayObjectWithChildId = getDayObjectFromId(child.id);

        if (
          JSON.stringify(dayObjectWithCurrentDate) ===
          JSON.stringify(dayObjectWithChildId)
        ) {
          let reduce = 0;
          if (settings.view === 7) {
            reduce = calculateDaysToPreviousMonday(
              dayObjectWithCurrentDate.day,
            );
          }
          gridRef.current.scrollTo(
            gridRef.current.children[i].clientWidth * (i + reduce),
            0,
          );
        }
      }
    }
  }, [settings.view]);

  const setCurrentMonth = useCallback(() => {
    if (gridRef.current) {
      const children = gridRef.current.children;
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        const rect = child.getBoundingClientRect();

        if (rect.x > 0) {
          const date = getDayObjectFromId(child.id);
          setMonth(date.month);
          setYear(date.year);
          break;
        }
      }
    }
  }, []);

  return (
    <main className="flex">
      <Sidebar />
      <div style={{ width: `calc(100vw - ${sidebarWidth}px)` }}>
        <Header
          scrollToCurrentDate={scrollToCurrentDate}
          month={month}
          year={year}
        />

        {settings.view !== 30 ? (
          <div className="flex">
            <div
              style={{ marginTop: headerHeight }}
              className="flex flex-col w-[60px]">
              <p
                style={{ height: secondaryHeaderHeight }}
                className="flex items-center justify-center text-xs border-b">
                {timezoneString}
              </p>
              <span className="flex flex-col">
                {new Array(24 * 1).fill(0).map((_, index) => (
                  <TimeBlock key={index} hour={index} />
                ))}
              </span>
            </div>
            <Grid
              gridRef={gridRef}
              scrollToCurrentDate={scrollToCurrentDate}
              setCurrentMonth={setCurrentMonth}
            />
          </div>
        ) : (
          <p
            style={{ height: `calc(100vh - ${headerHeight}px)` }}
            className="flex items-center justify-center font-semibold text-2xl">
            Month view coming soon
          </p>
        )}
      </div>
    </main>
  );
}

function getTimezoneString(timezone: string) {
  let timezoneString = dayjs().tz(timezone).format("Z");
  timezoneString =
    timezoneString[1] === "0"
      ? timezoneString.slice(0, 1) + timezoneString.slice(2)
      : timezoneString;
  timezoneString =
    timezoneString.slice(3, 5) === "00"
      ? timezoneString.slice(0, 2)
      : timezoneString;

  return `GMT${timezoneString}`;
}
