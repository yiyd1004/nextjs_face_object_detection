import { FlipHorizontal } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

type Props = {
    setMirrored: Dispatch<SetStateAction<boolean>>;
};

const FlipCamera = (props: Props) => {
    return (
        <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
                <Button
                    variant={"outline"}
                    size={"icon"}
                    onClick={() => {
                        props.setMirrored((prev) => !prev);
                    }}
                >
                    <FlipHorizontal />
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex flex-col justify-between space-x-4">
                    <strong>Horizontal Flip ↔️</strong>
                    <p>Adjust horizontal orientation.</p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default FlipCamera;
