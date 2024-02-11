import { Button } from "@/components/ui/button";

interface Props {
	scrollToCurrentDate: () => void;
}

export default function Header({ scrollToCurrentDate }: Props) {
	return (
		<nav className="sticky left-0 top-0 flex h-14 w-screen items-center border-b bg-background px-2 z-50">
			<p className="flex text-2xl font-bold font-mono">
				<span className="text-orange-500">C</span>RON
			</p>
			<Button
				className="ml-auto font-semibold"
				onClick={() => scrollToCurrentDate()}>
				Today
			</Button>
		</nav>
	);
}