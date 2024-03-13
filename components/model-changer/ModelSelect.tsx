"use client";

import { ModelLoadResult } from "@/utils/definitions";
import { useState } from "react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "../ui/hover-card";
import ModelSelectContent from "./ModelSelectContent";

type Props = {
    cameraStatus: number | undefined;
    modelList: ModelLoadResult[] | undefined;
    currentMode: string;
    onModeChange: ((value: string) => void) | undefined;
};

const ModelSelect = (props: Props) => {
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

    return (
        <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
                <ModelSelectContent
                    cameraStatus={props.cameraStatus}
                    modelList={props.modelList}
                    currentMode={props.currentMode}
                    onModeChange={props.onModeChange}
                    setDialogOpen={setDialogOpen}
                />
            </HoverCardTrigger>
            <HoverCardContent className="w-80" hidden={isDialogOpen}>
                <div className="flex flex-col justify-between space-x-4">
                    <strong>Change Model ⚙️</strong>
                    <p>Change to different detection model</p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default ModelSelect;
