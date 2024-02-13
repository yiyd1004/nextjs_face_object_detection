import { Camera } from "lucide-react";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

type Props = {
    takeScreenShot: () => void | undefined;
};

const ScreenShot = (props: Props) => {
    return (
        <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
                <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={props.takeScreenShot}
                >
                    <Camera />
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex flex-col justify-between space-x-4">
                    <strong>Take Pictures 📸</strong>
                    <p>Capture snapshots at any moment from the video feed.</p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default ScreenShot;
