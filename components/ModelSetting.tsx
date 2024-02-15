import { Settings2 } from "lucide-react";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

type Props = {};

const ModelSetting = (props: Props) => {
    return (
        <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
                <Button variant={"outline"} size={"icon"} onClick={() => {}}>
                    <Settings2 />
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex flex-col justify-between space-x-4">
                    <strong>Model Settings ⚙️</strong>
                    <p>Adjust model parameters</p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default ModelSetting;
