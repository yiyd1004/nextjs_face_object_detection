"use client";

import { useState } from "react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "../ui/hover-card";
import FaceModelSelectContent from "./FaceModelSelectContent";

type Props = {
    currentMode: string;
};

const FaceModelSelect = (props: Props) => {
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

    return (
        <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
                <FaceModelSelectContent
                    currentMode={props.currentMode}
                    setDialogOpen={setDialogOpen}
                />
            </HoverCardTrigger>
            <HoverCardContent className="w-80" hidden={isDialogOpen}>
                <div className="flex flex-col justify-between space-x-4">
                    <strong>Change Face Landmark Mode ⚙️</strong>
                    <p>Change to different landmark mode</p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default FaceModelSelect;
