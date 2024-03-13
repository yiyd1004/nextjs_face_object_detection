"use client";

import FaceDetection from "@/mediapipe/face-detection";
import { useState } from "react";
import { Slider } from "../ui/slider";

type Props = {};

const FaceModelSetting = (props: Props) => {
    const defaultMinDetectConf =
        FaceDetection.getMinDetectionConfidence() ?? 0.5;
    const defaultMinSuppThreshold =
        FaceDetection.getMinSuppressionThreshold() ?? 0.3;
    const [minDetectConf, setMinDetectConf] =
        useState<number>(defaultMinDetectConf);
    const [minSuppThreshold, setMinSuppThreshold] = useState<number>(
        defaultMinSuppThreshold
    );

    return (
        <>
            <div className="flex flex-col w-full">
                <span className="text-left gap-4 pb-3">
                    Minimum Confidence Score: {`${minDetectConf * 100}%`}
                </span>
                <div className="flex w-full pb-1">
                    <Slider
                        min={
                            FaceDetection.CONFIG_FACE_MIN_DETECTION_CONFIDENCE_VALUE
                        }
                        max={
                            FaceDetection.CONFIG_FACE_MAX_DETECTION_CONFIDENCE_VALUE
                        }
                        step={
                            FaceDetection.CONFIG_FACE_DEFAULT_DETECTION_CONFIDENCE_SLIDER_STEP_VALUE
                        }
                        defaultValue={[minDetectConf]}
                        onValueChange={(vals: number[]) => {
                            setMinDetectConf(vals[0]);
                            FaceDetection.setMinDetectionConfidence(vals[0]);
                        }}
                    />
                </div>
                <div className="flex w-full justify-between pt-1">
                    <span>{`${
                        FaceDetection.CONFIG_FACE_MIN_DETECTION_CONFIDENCE_VALUE *
                        100
                    }%`}</span>
                    <span>{`${
                        FaceDetection.CONFIG_FACE_MAX_DETECTION_CONFIDENCE_VALUE *
                        100
                    }%`}</span>
                </div>
            </div>

            <div className="flex flex-col w-full">
                <span className="text-left pb-3">
                    Minimum Suppression Threshold:{" "}
                    {`${minSuppThreshold * 100}%`}
                </span>
                <div className="flex w-full">
                    <Slider
                        min={
                            FaceDetection.CONFIG_FACE_MIN_SUPPRESSION_THRESHOLD_VALUE
                        }
                        max={
                            FaceDetection.CONFIG_FACE_MAX_SUPPRESSION_THRESHOLD_VALUE
                        }
                        step={
                            FaceDetection.CONFIG_FACE_DEFAULT_SUPPRESSION_THRESHOLD_SLIDER_STEP_VALUE
                        }
                        defaultValue={[minSuppThreshold]}
                        onValueChange={(vals: number[]) => {
                            setMinSuppThreshold(vals[0]);
                            FaceDetection.setMinSuppressionThreshold(vals[0]);
                        }}
                    />
                </div>
                <div className="flex w-full justify-between pt-1">
                    <span>{`${
                        FaceDetection.CONFIG_FACE_MIN_SUPPRESSION_THRESHOLD_VALUE *
                        100
                    }%`}</span>
                    <span>{`${
                        FaceDetection.CONFIG_FACE_MAX_SUPPRESSION_THRESHOLD_VALUE *
                        100
                    }%`}</span>
                </div>
            </div>
        </>
    );
};

export default FaceModelSetting;
