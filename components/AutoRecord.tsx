import { PersonStanding } from "lucide-react";
import { MouseEventHandler } from "react";
import { Rings } from "react-loader-spinner";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

type Props = {
    isAutoRecordEnabled: boolean;
    toggleAutoRecord: MouseEventHandler<HTMLButtonElement> | undefined;
};

const AutoRecord = (props: Props) => {
    return (
        <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
                <Button
                    variant={
                        props.isAutoRecordEnabled ? "destructive" : "outline"
                    }
                    size={"icon"}
                    onClick={props.toggleAutoRecord}
                    disabled={true}
                >
                    {props.isAutoRecordEnabled ? (
                        <Rings color="white" height={45} />
                    ) : (
                        <PersonStanding />
                    )}
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex flex-col justify-between space-x-4">
                    <strong>Enable/Disable Auto Record 🚫</strong>
                    <p>
                        Option to enable/disable automatic video recording
                        whenever required.
                    </p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default AutoRecord;
