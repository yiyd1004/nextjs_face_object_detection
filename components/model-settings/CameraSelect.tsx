"use client";

import { CameraDevicesContext } from "@/providers/CameraDevicesProvider";
import { useContext } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

type Props = {};

const CameraSelect = (props: Props) => {
    const VideoDevicesProvider = useContext(CameraDevicesContext);

    return (
        <Select
            value={VideoDevicesProvider?.webcamId}
            onValueChange={VideoDevicesProvider?.setWebcamId}
        >
            <SelectTrigger className="w-full text-left">
                <SelectValue placeholder="Webcam list" />
            </SelectTrigger>
            <SelectContent>
                {VideoDevicesProvider?.webcamList &&
                VideoDevicesProvider?.webcamList.length > 0 ? (
                    VideoDevicesProvider?.webcamList.map((webcam, index) => (
                        <SelectItem
                            key={index}
                            value={webcam.deviceId}
                            className="text-left"
                        >
                            {webcam.label.trim()}
                        </SelectItem>
                    ))
                ) : (
                    <SelectItem value={""}>Webcam not found</SelectItem>
                )}
            </SelectContent>
        </Select>
    );
};

export default CameraSelect;
