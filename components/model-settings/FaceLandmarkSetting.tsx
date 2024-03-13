"use client";

import FaceLandmarkDetection from "@/mediapipe/face-landmark";
import { useState } from "react";
import { Slider } from "../ui/slider";

type Props = {};

const FaceLandmarkSetting = (props: Props) => {
    const [numOfFaces, setNumOfFaces] = useState<number>(
        FaceLandmarkDetection.getNumOfFaces()
    );
    const [minFaceDetectionConfidence, setMinFaceDetectionConfidence] =
        useState<number>(FaceLandmarkDetection.getMinFaceDetectionConfidence());
    const [minFacePresenceConfidence, setMinFacePresenceConfidence] =
        useState<number>(FaceLandmarkDetection.getMinFacePresenceConfidence());
    const [minTrackingConfidence, setMinTrackingConfidence] = useState<number>(
        FaceLandmarkDetection.getMinTrackingConfidence()
    );

    return (
        <>
            <div className="flex flex-col w-full">
                <span className="text-left gap-4 pb-3">
                    Number of Faces: {numOfFaces}
                </span>
                <div className="flex w-full pb-1">
                    <Slider
                        min={FaceLandmarkDetection.CONFIG_MIN_FACE_NUMBER}
                        max={FaceLandmarkDetection.CONFIG_MAX_FACE_NUMBER}
                        step={
                            FaceLandmarkDetection.CONFIG_DEFAULT_FACE_SLIDER_STEP
                        }
                        defaultValue={[numOfFaces]}
                        onValueChange={(vals: number[]) => {
                            setNumOfFaces(vals[0]);
                            FaceLandmarkDetection.setNumOfFaces(vals[0]);
                        }}
                        orientation="horizontal"
                    />
                </div>
                <div className="flex w-full justify-between pt-1">
                    <span>{FaceLandmarkDetection.CONFIG_MIN_FACE_NUMBER}</span>
                    <span>{FaceLandmarkDetection.CONFIG_MAX_FACE_NUMBER}</span>
                </div>
            </div>
            <div className="flex flex-col w-full">
                <span className="text-left pb-3">
                    Minimum face detection confidence:
                    {` ${minFaceDetectionConfidence * 100}%`}
                </span>
                <div className="flex w-full">
                    <Slider
                        min={
                            FaceLandmarkDetection.CONFIG_MIN_DETECTION_CONFIDENCE
                        }
                        max={
                            FaceLandmarkDetection.CONFIG_MAX_DETECTION_CONFIDENCE
                        }
                        step={
                            FaceLandmarkDetection.CONFIG_DEFAULT_CONFIDENCE_SLIDER_STEP
                        }
                        defaultValue={[minFaceDetectionConfidence]}
                        onValueChange={(vals: number[]) => {
                            setMinFaceDetectionConfidence(vals[0]);
                            FaceLandmarkDetection.setMinFaceDetectionConfidence(
                                vals[0]
                            );
                        }}
                    />
                </div>
                <div className="flex w-full justify-between pt-1">
                    <span>{`${
                        FaceLandmarkDetection.CONFIG_MIN_DETECTION_CONFIDENCE *
                        100
                    }%`}</span>
                    <span>{`${
                        FaceLandmarkDetection.CONFIG_MAX_DETECTION_CONFIDENCE *
                        100
                    }%`}</span>
                </div>
            </div>
            <div className="flex flex-col w-full">
                <span className="text-left pb-3">
                    Minimum face presence confidence:
                    {` ${minFacePresenceConfidence * 100}%`}
                </span>
                <div className="flex w-full">
                    <Slider
                        min={
                            FaceLandmarkDetection.CONFIG_MIN_PRESENCE_CONFIDENCE
                        }
                        max={
                            FaceLandmarkDetection.CONFIG_MAX_PRESENCE_CONFIDENCE
                        }
                        step={
                            FaceLandmarkDetection.CONFIG_DEFAULT_CONFIDENCE_SLIDER_STEP
                        }
                        defaultValue={[minFacePresenceConfidence]}
                        onValueChange={(vals: number[]) => {
                            setMinFacePresenceConfidence(vals[0]);
                            FaceLandmarkDetection.setMinFacePresenceConfidence(
                                vals[0]
                            );
                        }}
                    />
                </div>
                <div className="flex w-full justify-between pt-1">
                    <span>{`${
                        FaceLandmarkDetection.CONFIG_MIN_PRESENCE_CONFIDENCE *
                        100
                    }%`}</span>
                    <span>{`${
                        FaceLandmarkDetection.CONFIG_MAX_PRESENCE_CONFIDENCE *
                        100
                    }%`}</span>
                </div>
            </div>
            <div className="flex flex-col w-full">
                <span className="text-left pb-3">
                    Minimum tracking confidence:
                    {` ${minTrackingConfidence * 100}%`}
                </span>
                <div className="flex w-full">
                    <Slider
                        min={
                            FaceLandmarkDetection.CONFIG_MIN_TRACKING_CONFIDENCE
                        }
                        max={
                            FaceLandmarkDetection.CONFIG_MAX_TRACKING_CONFIDENCE
                        }
                        step={
                            FaceLandmarkDetection.CONFIG_DEFAULT_CONFIDENCE_SLIDER_STEP
                        }
                        defaultValue={[minTrackingConfidence]}
                        onValueChange={(vals: number[]) => {
                            setMinTrackingConfidence(vals[0]);
                            FaceLandmarkDetection.setMinTrackingConfidence(
                                vals[0]
                            );
                        }}
                    />
                </div>
                <div className="flex w-full justify-between pt-1">
                    <span>{`${
                        FaceLandmarkDetection.CONFIG_MIN_TRACKING_CONFIDENCE *
                        100
                    }%`}</span>
                    <span>{`${
                        FaceLandmarkDetection.CONFIG_MAX_TRACKING_CONFIDENCE *
                        100
                    }%`}</span>
                </div>
            </div>
        </>
    );
};

export default FaceLandmarkSetting;
