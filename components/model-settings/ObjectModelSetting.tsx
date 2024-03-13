"use client";

import ObjectDetection from "@/mediapipe/object-detection";
import { useState } from "react";
import { Slider } from "../ui/slider";

type Props = {};

const ObjectModelSetting = (props: Props) => {
    const defaultMaxResult = ObjectDetection.getMaxResults() ?? 5;
    const defaultScoreThreshold = ObjectDetection.getScoreThreshold() ?? 0.5;
    const [maxResults, setMaxResults] = useState<number>(defaultMaxResult);
    const [scoreThreshold, setScoreThreshold] = useState<number>(
        defaultScoreThreshold
    );

    return (
        <>
            <div className="flex flex-col w-full">
                <span className="text-left gap-4 pb-3">
                    Max results: {maxResults}
                </span>
                <div className="flex w-full pb-1">
                    <Slider
                        min={ObjectDetection.CONFIG_OBJECT_MIN_RESULT_VALUE}
                        max={ObjectDetection.CONFIG_OBJECT_MAX_RESULT_VALUE}
                        step={
                            ObjectDetection.CONFIG_OBJECT_DEFAULT_RESULT_SLIDER_STEP_VALUE
                        }
                        defaultValue={[maxResults]}
                        onValueChange={(vals: number[]) => {
                            setMaxResults(vals[0]);
                            ObjectDetection.setMaxResults(vals[0]);
                        }}
                    />
                </div>
                <div className="flex w-full justify-between pt-1">
                    <span>
                        {ObjectDetection.CONFIG_OBJECT_MIN_RESULT_VALUE}
                    </span>
                    <span>
                        {ObjectDetection.CONFIG_OBJECT_MAX_RESULT_VALUE}
                    </span>
                </div>
            </div>

            <div className="flex flex-col w-full">
                <span className="text-left pb-3">
                    Score threshold: {`${scoreThreshold * 100}%`}
                </span>
                <div className="flex w-full">
                    <Slider
                        min={ObjectDetection.CONFIG_OBJECT_MIN_SCORE_VALUE}
                        max={ObjectDetection.CONFIG_OBJECT_MAX_SCORE_VALUE}
                        step={
                            ObjectDetection.CONFIG_OBJECT_DEFAULT_SCORE_SLIDER_STEP_VALUE
                        }
                        defaultValue={[scoreThreshold]}
                        onValueChange={(vals: number[]) => {
                            setScoreThreshold(vals[0]);
                            ObjectDetection.setScoreThreshold(vals[0]);
                        }}
                    />
                </div>
                <div className="flex w-full justify-between pt-1">
                    <span>{`${
                        ObjectDetection.CONFIG_OBJECT_MIN_SCORE_VALUE * 100
                    }%`}</span>
                    <span>{`${
                        ObjectDetection.CONFIG_OBJECT_MAX_SCORE_VALUE * 100
                    }%`}</span>
                </div>
            </div>
        </>
    );
};

export default ObjectModelSetting;
