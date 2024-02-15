//cspell:ignore clsx

"use client";

import AutoRecord from "@/components/AutoRecord";
import DarkMode from "@/components/DarkMode";
import FlipCamera from "@/components/FlipCamera";
import ModelSelect from "@/components/ModelSelect";
import ModelSetting from "@/components/ModelSetting";
import RecordVideo from "@/components/RecordVideo";
import ScreenShot from "@/components/ScreenShot";
import Volume from "@/components/Volume";
import { Separator } from "@/components/ui/separator";
import FaceDetection from "@/mediapipe/face-detection";
import GestureRecognition from "@/mediapipe/gesture-recognition";
import initMediaPipVision from "@/mediapipe/mediapipe-vision";
import ObjectDetection from "@/mediapipe/object-detection";
import { beep } from "@/utils/audio";
import {
    FACE_DETECTION_MODE,
    GESTURE_RECOGNITION_MODE,
    ModelLoadResult,
    NO_MODE,
    OBJ_DETECTION_MODE,
} from "@/utils/definitions";
import "@mediapipe/tasks-vision";
import clsx from "clsx";
import { RefObject, useEffect, useRef, useState } from "react";
import { Rings } from "react-loader-spinner";
import Webcam from "react-webcam";
import { toast } from "sonner";

type Props = {};

let interval: any = null;
let stopTimeout: any = null;

const Home = (props: Props) => {
    const webcamRef = useRef<Webcam>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [mirrored, setMirrored] = useState<boolean>(false);
    const [isRecording, setRecording] = useState<boolean>(false);
    const [isAutoRecordEnabled, setAutoRecordEnabled] =
        useState<boolean>(false);
    const [volume, setVolume] = useState<number>(0.8);
    const [modelLoadResult, setModelLoadResult] = useState<ModelLoadResult[]>();
    const [loading, setLoading] = useState(false);
    const [currentMode, setCurrentMode] = useState<number>(NO_MODE);
    const [enableWebcam, setEnableWebcam] = useState<boolean>(false);

    const takeScreenShot = () => {};
    const recordVideo = () => {
        if (isRecording) {
            setRecording(false);
        } else {
            setRecording(true);
        }
    };
    const toggleAutoRecord = () => {
        if (isAutoRecordEnabled) {
            setAutoRecordEnabled(false);
            toast("Autorecord disenabled");
        } else {
            setAutoRecordEnabled(true);
            toast("Autorecord enabled");
        }
    };

    const initModels = async () => {
        const vision = await initMediaPipVision();

        if (vision) {
            const models = [
                ObjectDetection.initModel(vision),
                FaceDetection.initModel(vision),
                GestureRecognition.initModel(vision),
            ];

            const results = await Promise.all(models);

            const enabledModels = results.filter((result) => result.loadResult);

            if (enabledModels.length > 0) {
                setCurrentMode(enabledModels[0].mode);
            }
            setModelLoadResult(enabledModels);
        }
    };

    const resizeCanvas = (
        canvasRef: RefObject<HTMLCanvasElement>,
        webcamRef: RefObject<Webcam>
    ) => {
        const canvas = canvasRef.current;
        const video = webcamRef.current?.video;

        if (canvas && video) {
            const { videoWidth, videoHeight } = video;
            canvas.width = videoWidth;
            canvas.height = videoHeight;
        }
    };

    const runPrediction = async () => {
        if (
            webcamRef.current &&
            webcamRef.current.video &&
            webcamRef.current.video.readyState === 4
        ) {
            if (currentMode === OBJ_DETECTION_MODE) {
                const objPredictions = ObjectDetection.detectObject(
                    webcamRef.current.video
                );

                if (objPredictions?.detections) {
                    resizeCanvas(canvasRef, webcamRef);
                    ObjectDetection.drawOnCanvas(
                        mirrored,
                        objPredictions.detections,
                        canvasRef.current?.getContext("2d")
                    );
                }
            } else if (currentMode === FACE_DETECTION_MODE) {
                const facePredictions = FaceDetection.detectFace(
                    webcamRef.current.video
                );

                if (facePredictions?.detections) {
                    resizeCanvas(canvasRef, webcamRef);
                    FaceDetection.drawOnCanvas(
                        mirrored,
                        facePredictions.detections,
                        canvasRef.current?.getContext("2d")
                    );
                }
            } else if (currentMode === GESTURE_RECOGNITION_MODE) {
                const gesturePrediction = GestureRecognition.detectGesture(
                    webcamRef.current.video
                );
                console.log(gesturePrediction);
            }
        }
    };

    const onModeChange = (mode: string) => {
        setCurrentMode(parseInt(mode));
    };

    useEffect(() => {
        setLoading(true);
        initModels();
    }, []);

    useEffect(() => {
        if (modelLoadResult) {
            setLoading(false);
        }
    }, [modelLoadResult]);

    useEffect(() => {
        interval = setInterval(() => {
            runPrediction();
        }, 100);

        return () => clearInterval(interval);
    }, [webcamRef.current, modelLoadResult, mirrored, currentMode]);

    return (
        <div className="flex flex-col h-screen">
            {/* Camera area */}
            <div className="relative h-[80%]">
                <div className="relative w-screen h-full">
                    {enableWebcam ? (
                        <>
                            <Webcam
                                ref={webcamRef}
                                mirrored={mirrored}
                                className="h-full w-full object-contain p-2"
                            />
                            <canvas
                                ref={canvasRef}
                                className="absolute top-0 left-0 h-full w-full object-contain"
                            ></canvas>
                        </>
                    ) : null}
                </div>
            </div>
            {/* Right area */}
            <div className="flex flex-col flex-1">
                <div
                    className={clsx(
                        "border-primary/5 border-2 max-h-xs",
                        "flex flex-row gap-2 justify-between",
                        "shadow-md rounded-md p-4"
                    )}
                >
                    <div className="flex flex-row gap-2">
                        <DarkMode />
                        <FlipCamera setMirrored={setMirrored} />
                        <Separator orientation="vertical" className="mx-2" />
                    </div>
                    <div className="flex flex-row gap-2">
                        <Separator orientation="vertical" className="mx-2" />
                        <ScreenShot takeScreenShot={takeScreenShot} />
                        <RecordVideo
                            isRecording={isRecording}
                            recordVideo={recordVideo}
                        />
                        <Separator orientation="vertical" className="mx-2" />
                        <AutoRecord
                            isAutoRecordEnabled={isAutoRecordEnabled}
                            toggleAutoRecord={toggleAutoRecord}
                        />
                    </div>
                    <div className="flex flex-row gap-2">
                        <ModelSelect
                            modelList={modelLoadResult}
                            currentMode={currentMode.toString()}
                            onModeChange={onModeChange}
                        />
                        <ModelSetting />
                        <Separator orientation="vertical" className="mx-2" />
                        <Volume
                            volume={volume}
                            setVolume={setVolume}
                            beep={beep}
                        />
                    </div>
                </div>
            </div>
            {loading && (
                <div
                    className={clsx(
                        "absolute z-50 w-full h-full flex flex-col items-center justify-center bg-primary-foreground"
                    )}
                >
                    Loading module...
                    <Rings height={50} color="red" />
                </div>
            )}
        </div>
    );
};

export default Home;
