import { cn } from "@/lib/utils";

interface Props {
	quarter: number;
	border: boolean;
	selecting: boolean;
	setSelecting: (value: boolean) => void;
	highlight: boolean;
	setDone: (value: boolean) => void;
	setStart: (value: number) => void;
	setEnd: (value: number) => void;
}

export default function Quarter({
	quarter,
	border,
	selecting,
	setSelecting,
	highlight,
	setDone,
	setStart,
	setEnd,
}: Props) {
	return (
		<span
			className={cn(
				"flex items-center justify-center",
				border && "border-t border-white",
				"h-[10px] w-full",
				highlight && "border-opacity-50 bg-red-300 bg-opacity-75",
			)}
			onMouseDown={() => {
				if (!highlight) {
					// Reset previous selection
					setEnd(-1);
				}

				setSelecting(true);
				setDone(false);

				// Start selecting from the current quarter
				setStart(quarter - 1);
			}}
			onMouseUp={() => {
				setSelecting(false);
				setEnd(quarter);
			}}
			onMouseOver={() => selecting && setEnd(quarter)}
			onDoubleClick={() => {
				// Select one quarter
				setStart(quarter - 1);
				setEnd(quarter + 1);
			}}
		/>
	);
}