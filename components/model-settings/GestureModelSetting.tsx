"use client";

import GestureRecognition from "@/mediapipe/gesture-recognition";
import { useState } from "react";
import { Slider } from "../ui/slider";

type Props = {};

const GestureModelSetting = (props: Props) => {
    const [numOfHands, setNumOfHands] = useState<number>(
        GestureRecognition.getNumberOfHands()
    );
    const [minHandDetectionConfidence, setMinHandDetectionConfidence] =
        useState<number>(GestureRecognition.getMinHandDetectionConfidence());
    const [minHandPresenceConfidence, setMinHandPresenceConfidence] =
        useState<number>(GestureRecognition.getMinHandPresenceConfidence());
    const [minTrackingConfidence, setMinTrackingConfidence] = useState<number>(
        GestureRecognition.getMinTrackingConfidence()
    );

    return (
        <>
            <div className="flex flex-col w-full">
                <span className="text-left gap-4 pb-3">
                    Number of hands: {numOfHands}
                </span>
                <div className="flex w-full pb-1">
                    <Slider
                        min={GestureRecognition.CONFIG_GESTURE_MIN_HAND}
                        max={GestureRecognition.CONFIG_GESTURE_MAX_HAND}
                        step={
                            GestureRecognition.CONFIG_GESTURE_DEFAULT_HAND_SLIDER_STEP
                        }
                        defaultValue={[numOfHands]}
                        onValueChange={(vals: number[]) => {
                            setNumOfHands(vals[0]);
                            GestureRecognition.setNumberOfHands(vals[0]);
                        }}
                        orientation="horizontal"
                    />
                </div>
                <div className="flex w-full justify-between pt-1">
                    <span>{GestureRecognition.CONFIG_GESTURE_MIN_HAND}</span>
                    <span>{GestureRecognition.CONFIG_GESTURE_MAX_HAND}</span>
                </div>
            </div>
            <div className="flex flex-col w-full">
                <span className="text-left pb-3">
                    Minimum hand detection confidence:
                    {` ${minHandDetectionConfidence * 100}%`}
                </span>
                <div className="flex w-full">
                    <Slider
                        min={
                            GestureRecognition.CONFIG_GESTURE_MIN_DETECTION_CONFIDENCE
                        }
                        max={
                            GestureRecognition.CONFIG_GESTURE_MAX_DETECTION_CONFIDENCE
                        }
                        step={
                            GestureRecognition.CONFIG_GESTURE_DEFAULT_CONFIDENCE_SLIDER_STEP
                        }
                        defaultValue={[minHandDetectionConfidence]}
                        onValueChange={(vals: number[]) => {
                            setMinHandDetectionConfidence(vals[0]);
                            GestureRecognition.setMinHandDetectionConfidence(
                                vals[0]
                            );
                        }}
                    />
                </div>
                <div className="flex w-full justify-between pt-1">
                    <span>{`${
                        GestureRecognition.CONFIG_GESTURE_MIN_DETECTION_CONFIDENCE *
                        100
                    }%`}</span>
                    <span>{`${
                        GestureRecognition.CONFIG_GESTURE_MAX_DETECTION_CONFIDENCE *
                        100
                    }%`}</span>
                </div>
            </div>
            <div className="flex flex-col w-full">
                <span className="text-left pb-3">
                    Minimum hand presence confidence:
                    {` ${minHandPresenceConfidence * 100}%`}
                </span>
                <div className="flex w-full">
                    <Slider
                        min={
                            GestureRecognition.CONFIG_GESTURE_MIN_PRESENCE_CONFIDENCE
                        }
                        max={
                            GestureRecognition.CONFIG_GESTURE_MAX_PRESENCE_CONFIDENCE
                        }
                        step={
                            GestureRecognition.CONFIG_GESTURE_DEFAULT_CONFIDENCE_SLIDER_STEP
                        }
                        defaultValue={[minHandPresenceConfidence]}
                        onValueChange={(vals: number[]) => {
                            setMinHandPresenceConfidence(vals[0]);
                            GestureRecognition.setMinHandPresenceConfidence(
                                vals[0]
                            );
                        }}
                    />
                </div>
                <div className="flex w-full justify-between pt-1">
                    <span>{`${
                        GestureRecognition.CONFIG_GESTURE_MIN_PRESENCE_CONFIDENCE *
                        100
                    }%`}</span>
                    <span>{`${
                        GestureRecognition.CONFIG_GESTURE_MAX_PRESENCE_CONFIDENCE *
                        100
                    }%`}</span>
                </div>
            </div>
            <div className="flex flex-col w-full">
                <span className="text-left pb-3">
                    Minimum tracking confidence:
                    {` ${minHandDetectionConfidence * 100}%`}
                </span>
                <div className="flex w-full">
                    <Slider
                        min={
                            GestureRecognition.CONFIG_GESTURE_MIN_TRACKING_CONFIDENCE
                        }
                        max={
                            GestureRecognition.CONFIG_GESTURE_MAX_TRACKING_CONFIDENCE
                        }
                        step={
                            GestureRecognition.CONFIG_GESTURE_DEFAULT_CONFIDENCE_SLIDER_STEP
                        }
                        defaultValue={[minTrackingConfidence]}
                        onValueChange={(vals: number[]) => {
                            setMinTrackingConfidence(vals[0]);
                            GestureRecognition.setMinTrackingConfidence(
                                vals[0]
                            );
                        }}
                    />
                </div>
                <div className="flex w-full justify-between pt-1">
                    <span>{`${
                        GestureRecognition.CONFIG_GESTURE_MIN_TRACKING_CONFIDENCE *
                        100
                    }%`}</span>
                    <span>{`${
                        GestureRecognition.CONFIG_GESTURE_MAX_TRACKING_CONFIDENCE *
                        100
                    }%`}</span>
                </div>
            </div>
        </>
    );
};

export default GestureModelSetting;
