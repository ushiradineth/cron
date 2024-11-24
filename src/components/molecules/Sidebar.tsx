import { formatTime } from "@/components/atoms/Event";
import { useContextStore } from "@/lib/stores/context";
import { useEventStore } from "@/lib/stores/event";
import { useSettingStore } from "@/lib/stores/settings";
import { EventSchema } from "@/lib/validators";
import dayjs from "dayjs";
import { ArrowRight, Clock9 } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectUnstyledTrigger,
} from "@/components/ui/select";
import { sidebarWidth } from "@/lib/consts";
import { useDataStore } from "@/lib/stores/data";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ButtonStyle = cn(
  "w-full text-sm text-primary font-medium rounded-sm p-2",
  "appearance-none forced-colors:hidden bg-background",
  "hover:outline hover:outline-offset-2 hover:outline-1",
  "aria-expanded:outline-none aria-expanded:bg-text-tertiary/20",
  "focus:outline-none focus:bg-text-tertiary/20",
);

export default function Sidebar() {
  const [startTimes, setStartTimes] = useState<string[]>([]);
  const [endTimes, setEndTimes] = useState<string[]>([]);

  const { editEvent } = useEventStore();
  const { activeEvent, setActiveEvent, previewing, setPreviewing } =
    useContextStore();
  const { settings } = useSettingStore();
  const { repeated, times } = useDataStore();

  const form = useForm<z.infer<typeof EventSchema>>({
    defaultValues: {
      title: "",
      repeat: "None",
      start: "00:00",
      end: "00:00",
      timezone: "Etc/GMT",
      date: new Date(),
    },
  });

  const timeFormat = useMemo(() => {
    return settings.clock === 12 ? "hh:mm A" : "HH:mm";
  }, [settings]);

  const onSubmit = useCallback(
    (values: z.infer<typeof EventSchema>) => {
      //if (
      //  !isStartDateBeforeEndDate(
      //    new Date(values.start.value),
      //    new Date(values.end.value),
      //  )
      //) {
      //  return;
      //}

      setPreviewing(false);
      if (!activeEvent) return;

      editEvent({
        id: activeEvent.id,
        title: values.title,
        start: dayjs(values.date)
          .hour(dayjs(values.start, "HH:mm").hour())
          .minute(dayjs(values.start, "HH:mm").minute())
          .toDate(),
        end: dayjs(values.date)
          .hour(dayjs(values.end, "HH:mm").hour())
          .minute(dayjs(values.end, "HH:mm").minute())
          .toDate(),
        timezone: values.timezone,
        repeated: values.repeat,
      });
    },
    [activeEvent, editEvent, setPreviewing],
  );

  useEffect(() => {
    if (!activeEvent || previewing) return;

    form.setValue("title", activeEvent.title);
    form.setValue("repeat", repeated[0]);
    form.setValue("timezone", settings.timezone);
    form.setValue("start", dayjs(activeEvent.start).format("HH:mm"));
    form.setValue("end", dayjs(activeEvent.end).format("HH:mm"));
    form.setValue("date", dayjs(activeEvent.start).startOf("day").toDate());

    setStartTimes(
      times.filter((time) =>
        dayjs(time, timeFormat).isBefore(
          dayjs(dayjs(activeEvent.end).format(timeFormat), timeFormat),
        ),
      ),
    );
    setEndTimes(
      times.filter((time) =>
        dayjs(time, timeFormat).isAfter(
          dayjs(dayjs(activeEvent.start).format(timeFormat), timeFormat),
        ),
      ),
    );
  }, [
    activeEvent,
    form,
    repeated,
    times,
    settings.timezone,
    previewing,
    timeFormat,
  ]);

  return (
    <div
      style={{ width: sidebarWidth }}
      className={"flex flex-col h-screen fixed right-0 bg-background border-l"}>
      {activeEvent ? (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="text-sm">
              <span className="flex flex-col w-full px-2 py-4 gap-2">
                <h2 className="font-semibold px-2">Event</h2>
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <input
                          className={ButtonStyle}
                          placeholder={activeEvent.title}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </span>
              <span className="flex flex-col border-t px-2 py-4 gap-2">
                <div className="flex gap-2 font-semibold items-center">
                  <FormField
                    control={form.control}
                    name="start"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(time) => {
                            field.onChange(time);
                            onSubmit({
                              ...form.getValues(),
                              start: time,
                            });
                          }}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectUnstyledTrigger
                              className={cn(ButtonStyle, "gap-1 p-1 text-sm")}>
                              <Clock9 className="h-4 w-4 text-text-tertiary" />
                              <p>
                                {formatTime(
                                  dayjs(form.getValues().date)
                                    .hour(dayjs(field.value, "HH:mm").hour())
                                    .minute(
                                      dayjs(field.value, "HH:mm").minute(),
                                    )
                                    .toDate(),
                                  settings.clock,
                                  true,
                                  true,
                                )}
                              </p>
                            </SelectUnstyledTrigger>
                          </FormControl>
                          <SelectContent>
                            {startTimes.map((time) => (
                              <SelectItem
                                key={time}
                                value={time}
                                onMouseOver={() => {
                                  setPreviewing(true);
                                  setActiveEvent({
                                    ...activeEvent,
                                    start: dayjs(form.getValues().date)
                                      .hour(dayjs(time, "HH:mm").hour())
                                      .minute(dayjs(time, "HH:mm").minute())
                                      .toDate(),
                                  });
                                }}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="end"
                    render={({ field }) => (
                      <FormItem>
                        <Select
                          onValueChange={(time) => {
                            field.onChange(time);
                            onSubmit({
                              ...form.getValues(),
                              end: time,
                            });
                          }}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectUnstyledTrigger
                              className={cn(ButtonStyle, "gap-1 p-1 text-sm")}>
                              <ArrowRight className="h-4 w-4 text-text-tertiary" />
                              <p>
                                {formatTime(
                                  dayjs(form.getValues().date)
                                    .hour(dayjs(field.value, "HH:mm").hour())
                                    .minute(
                                      dayjs(field.value, "HH:mm").minute(),
                                    )
                                    .toDate(),
                                  settings.clock,
                                  true,
                                  true,
                                )}
                              </p>
                              <p className="text-text-tertiary">
                                {formatDuration(
                                  dayjs(
                                    form.getValues().start,
                                    "HH:mm",
                                    false,
                                  ).toISOString(),
                                  dayjs(
                                    form.getValues().end,
                                    "HH:mm",
                                    false,
                                  ).toISOString(),
                                )}
                              </p>
                            </SelectUnstyledTrigger>
                          </FormControl>
                          <SelectContent>
                            {endTimes.map((time) => (
                              <SelectItem
                                key={time}
                                value={time}
                                onMouseOver={() => {
                                  setPreviewing(true);
                                  setActiveEvent({
                                    ...activeEvent,
                                    end: dayjs(form.getValues().date)
                                      .hour(dayjs(time, "HH:mm").hour())
                                      .minute(dayjs(time, "HH:mm").minute())
                                      .toDate(),
                                  });
                                }}>
                                {time}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <p className={ButtonStyle}>
                              {dayjs(field.value).format("ddd MMM D")}
                            </p>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date);
                              date && onSubmit({ ...form.getValues(), date });
                            }}
                            disabled={(date) => date < new Date("1900-01-01")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </span>
            </form>
          </Form>
        </>
      ) : (
        <p className="flex items-center justify-center h-full w-full text-lg font-semibold">
          No event selected
        </p>
      )}
    </div>
  );
}

function formatDuration(start: string, end: string): string {
  const durationMinutes = Math.abs(dayjs(end).diff(dayjs(start), "minute"));

  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;

  let duration = "";

  if (hours > 0) {
    duration += `${hours}hr `;
  }

  if (minutes > 0) {
    duration += `${minutes}min`;
  }

  return duration;
}
