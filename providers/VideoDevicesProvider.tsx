"use client";

import { VIDEO_INPUT, VideoDeviceContext } from "@/utils/definitions";
import React, { createContext, useEffect, useState } from "react";

type Props = {
    children: React.ReactNode;
};

export const VideoDevicesContext = createContext<VideoDeviceContext | null>(
    null
);

const VideoDevicesProvider = (props: Props) => {
    const [webcamId, setWebcamId] = useState<string | undefined>();
    const [webcamList, setWebcamList] = useState<MediaDeviceInfo[]>([]);

    const loadVideoDeviceList = async () => {
        const deviceList: MediaDeviceInfo[] =
            await navigator.mediaDevices.enumerateDevices();
        const webcamList: MediaDeviceInfo[] = deviceList.filter(
            (device) => device.kind === VIDEO_INPUT
        );

        if (webcamList.length > 0) {
            setWebcamId(webcamList[0].deviceId);
            setWebcamList(webcamList);
        }
    };

    useEffect(() => {
        loadVideoDeviceList();
        if (navigator) {
            navigator.mediaDevices.ondevicechange = (event: Event) => {
                loadVideoDeviceList();
            };
        }
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
