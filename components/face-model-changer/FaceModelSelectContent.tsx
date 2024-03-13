"use client";

import FaceLandmarkDetection, {
    ConnectionData,
} from "@/mediapipe/face-landmark";
import { FACE_LANDMARK_DETECTION_MODE } from "@/utils/definitions";
import { Dispatch, SetStateAction, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

type Props = {
    currentMode: string;
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
};

const FaceModelSelect = (props: Props) => {
    const [drawingMode, setDrawingMode] = useState<string>(
        FaceLandmarkDetection.getDrawingMode().toString()
    );
    const modeList: ConnectionData[] = FaceLandmarkDetection.getAvailableMode();

    const onModeChange = (mode: string) => {
        const modeInt: number = parseInt(mode);
        FaceLandmarkDetection.setDrawingMode(modeInt);
        setDrawingMode(mode);
    };

    const onOpenChange = (open: boolean) => {
        props.setDialogOpen(open);
    };

    return (
        <Select
            value={drawingMode}
            onValueChange={onModeChange}
            disabled={
                props.currentMode !== FACE_LANDMARK_DETECTION_MODE.toString()
            }
            onOpenChange={onOpenChange}
        >
            <SelectTrigger className="w-[155px] text-start">
                <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent className="text-start">
                {modeList && modeList.length > 0 ? (
                    modeList.map((mode, index) => {
                        return (
                            <SelectItem
                                key={index}
                                value={mode.mode.toString()}
                            >
                                {mode.name}
                            </SelectItem>
                        );
                    })
                ) : (
                    <SelectItem value={props.currentMode}>
                        Models not loaded
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    );
};

export default FaceModelSelect;
