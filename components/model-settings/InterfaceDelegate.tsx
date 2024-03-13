"use client";

import FaceDetection from "@/mediapipe/face-detection";
import ObjectDetection from "@/mediapipe/object-detection";
import {
    DELEGATE_CPU,
    DELEGATE_GPU,
    FACE_DETECTION_MODE,
    GESTURE_RECOGNITION_MODE,
    InterfaceDelegate,
    OBJ_DETECTION_MODE,
} from "@/utils/definitions";
import { useEffect, useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

type Props = {
    mode: number;
};

const InterfaceDelegate = (props: Props) => {
    const [delegate, setDelegate] = useState<InterfaceDelegate>(DELEGATE_GPU);

    const onValueChange = (value: string) => {
        let newDelegate: InterfaceDelegate =
            value === DELEGATE_GPU ? DELEGATE_GPU : DELEGATE_CPU;

        setDelegate(newDelegate);
        switch (props.mode) {
            case OBJ_DETECTION_MODE:
                ObjectDetection.setInterfaceDelegate(newDelegate);
                break;
            case FACE_DETECTION_MODE:
                FaceDetection.setInterfaceDelegate(newDelegate);
                break;
            case GESTURE_RECOGNITION_MODE:
                break;
        }
    };

    useEffect(() => {
        switch (props.mode) {
            case OBJ_DETECTION_MODE:
                setDelegate(ObjectDetection.getInterfaceDelegate());
                break;
            case FACE_DETECTION_MODE:
                setDelegate(FaceDetection.getInterfaceDelegate());
                break;
            case GESTURE_RECOGNITION_MODE:
                break;
        }
    }, []);

    return (
        <Select value={delegate} onValueChange={onValueChange}>
            <SelectTrigger className="w-full text-left">
                <SelectValue placeholder="Mode list" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value={DELEGATE_GPU} className="text-left">
                    {DELEGATE_GPU}
                </SelectItem>
                <SelectItem value={DELEGATE_CPU} className="text-left">
                    {DELEGATE_CPU}
                </SelectItem>
            </SelectContent>
        </Select>
    );
};

export default InterfaceDelegate;
