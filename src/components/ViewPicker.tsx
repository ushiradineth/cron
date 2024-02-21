import { View } from "@/lib/types";
import { SelectValue } from "@radix-ui/react-select";
import { useDataContext } from "./Context";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
export default function ViewPicker() {
	const dataContext = useDataContext();

	return (
		<Select
			onValueChange={(value) => dataContext.setView(Number(value) as View)}
			defaultValue={String(dataContext.view)}>
			<SelectTrigger className="w-[80px] xs:w-[120px]" defaultValue={"Day"}>
				<SelectValue />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="1">Day</SelectItem>
				<SelectItem value="3">3 Days</SelectItem>
				<SelectItem value="7">Week</SelectItem>
				<SelectItem value="30">Month</SelectItem>
			</SelectContent>
		</Select>
	);
}