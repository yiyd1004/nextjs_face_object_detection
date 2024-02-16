"use client";

import { VIDEO_INPUT, VideoDeviceContext } from "@/utils/definitions";
import React, { createContext, useEffect, useState } from "react";

type Props = {
    children: React.ReactNode;
};

export const VideoDevicesContext = createContext<VideoDeviceContext | null>(
    null
);

let webcamList: MediaDeviceInfo[] = [];

const VideoDevicesProvider = (props: Props) => {
    const [webcamId, setWebcamId] = useState<string | undefined>();

    const loadVideoDeviceList = async () => {
        const deviceList: MediaDeviceInfo[] =
            await navigator.mediaDevices.enumerateDevices();
        webcamList = deviceList.filter((device) => device.kind === VIDEO_INPUT);

        if (webcamList.length > 0) {
            setWebcamId(webcamList[0].deviceId);
        }
    };

    useEffect(() => {
        loadVideoDeviceList();
    }, []);

    return (
        <VideoDevicesContext.Provider
            value={{ webcamId, setWebcamId, webcamList }}
        >
            {props.children}
        </VideoDevicesContext.Provider>
    );
};

export default VideoDevicesProvider;
