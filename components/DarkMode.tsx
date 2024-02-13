import { ModeToggle } from "./theme-toggle";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

type Props = {};

const DarkMode = (props: Props) => {
    return (
        <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
                <ModeToggle />
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex flex-col justify-between space-x-4">
                    <strong>Dark Mode/Sys Theme 🌗</strong>
                    <p>Toggle between dark mode and system theme.</p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default DarkMode;
