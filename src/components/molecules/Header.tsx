import { Button } from "@/components/atoms/Button";
import Logo from "@/components/atoms/Logo";
import ViewPicker from "@/components/templates/ViewPicker";

interface Props {
  scrollToCurrentDate: () => void;
  month: string;
  year: string;
}

export default function Header({ scrollToCurrentDate, month, year }: Props) {
  return (
    <nav className="sticky left-0 top-0 flex h-20 xs:h-14 w-screen items-center border-b bg-background px-2 z-50 gap-4">
      <div className="flex flex-col xs:flex-row items-center justify-center xs:gap-4">
        <Logo />
        <p className="flex font-semibold h-full items-center justify-center mt-1">
          {month} {year}
        </p>
      </div>
      <span className="flex gap-2 items-center justify-center ml-auto">
        <ViewPicker />
        <Button className="font-semibold" onClick={() => scrollToCurrentDate()}>
          <p>Today</p>
        </Button>
      </span>
    </nav>
  );
}
