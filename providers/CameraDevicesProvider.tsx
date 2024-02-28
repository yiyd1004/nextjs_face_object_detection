"use client";

import {
    CAMERA_LOAD_STATUS_ERROR,
    CAMERA_LOAD_STATUS_NO_DEVICES,
    CAMERA_LOAD_STATUS_SUCCESS,
    CameraDeviceContext,
    CameraDeviceStatus,
    VIDEO_INPUT,
} from "@/utils/definitions";
import React, { createContext, useEffect, useState } from "react";

type Props = {
    children: React.ReactNode;
};

export const CameraDevicesContext = createContext<CameraDeviceContext | null>(
    null
);

const CameraDevicesProvider = (props: Props) => {
    const [webcamId, setWebcamId] = useState<string | undefined>();
    const [webcamList, setWebcamList] = useState<MediaDeviceInfo[]>([]);
    const [status, setStatus] = useState<CameraDeviceStatus>({
        status: undefined,
        errorMsg: undefined,
        errorName: undefined,
    });

    const contextData: CameraDeviceContext = {
        status,
        webcamId,
        setWebcamId,
        webcamList,
    };

    const loadCameraDeviceList = async () => {
        try {
            await navigator.mediaDevices.getUserMedia({
                video: true,
            });

            setStatus((prev) => ({
                ...prev,
                status: CAMERA_LOAD_STATUS_SUCCESS,
            }));

            const deviceList: MediaDeviceInfo[] =
                await navigator.mediaDevices.enumerateDevices();

            const webcamList: MediaDeviceInfo[] = deviceList.filter(
                (device) => device.kind === VIDEO_INPUT
            );

            if (webcamList.length > 0) {
                setWebcamId(webcamList[0].deviceId);
                setWebcamList(webcamList);
            } else {
                setStatus((prev) => ({
                    ...prev,
                    status: CAMERA_LOAD_STATUS_NO_DEVICES,
                }));
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(
                    "webcam error: ",
                    error.cause,
                    error.message,
                    error.name
                );
                setStatus({
                    status: CAMERA_LOAD_STATUS_ERROR,
                    errorMsg: error.message,
                    errorName: error.name,
                });
            } else {
                console.log("webcam error: ", error);
                setStatus((prev) => ({
                    ...prev,
                    status: CAMERA_LOAD_STATUS_ERROR,
                }));
            }
        }
    };

    useEffect(() => {
        loadCameraDeviceList();
        if (navigator) {
            navigator.mediaDevices.ondevicechange = (event: Event) => {
                loadCameraDeviceList();
            };
        }
    }, []);

    return (
        <CameraDevicesContext.Provider value={contextData}>
            {props.children}
        </CameraDevicesContext.Provider>
    );
};

export default CameraDevicesProvider;
