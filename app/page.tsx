//cspell:ignore clsx

"use client";

import AutoRecord from "@/components/AutoRecord";
import DarkMode from "@/components/DarkMode";
import FlipCamera from "@/components/FlipCamera";
import RecordVideo from "@/components/RecordVideo";
import ScreenShot from "@/components/ScreenShot";
import Volume from "@/components/Volume";
import { Separator } from "@/components/ui/separator";
import { beep } from "@/utils/audio";
import { FACE_DETECTION_MODE, OBJ_DETECTION_MODE } from "@/utils/definitions";
import { drawOnCanvas } from "@/utils/drawTool";
import "@mediapipe/tasks-vision";
import { FaceDetector, FilesetResolver } from "@mediapipe/tasks-vision";
import * as cocossd from "@tensorflow-models/coco-ssd";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
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
    const [objModel, setObjModel] = useState<cocossd.ObjectDetection>();
    const [faceModel, setFaceModel] = useState<FaceDetector>();
    const [loading, setLoading] = useState(false);
    const [mode, setMode] = useState<number>(FACE_DETECTION_MODE);

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

    const initObjModel = async () => {
        const loadedModel: cocossd.ObjectDetection = await cocossd.load({
            base: "mobilenet_v2",
        });
        setObjModel(loadedModel);
    };

    const initFaceModel = async () => {
        const vision = await FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        const faceDetector = await FaceDetector.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: "/model/blaze_face_short_range.tflite",
                delegate: "CPU",
            },
            runningMode: "VIDEO",
        });
        setFaceModel(faceDetector);
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
            objModel &&
            faceModel &&
            webcamRef.current &&
            webcamRef.current.video &&
            webcamRef.current.video.readyState === 4
        ) {
            if (mode === OBJ_DETECTION_MODE) {
                const objPredictions: cocossd.DetectedObject[] =
                    await objModel.detect(webcamRef.current.video);

                resizeCanvas(canvasRef, webcamRef);
                drawOnCanvas(
                    OBJ_DETECTION_MODE,
                    mirrored,
                    objPredictions,
                    null,
                    canvasRef.current?.getContext("2d")
                );
            } else if (mode === FACE_DETECTION_MODE) {
                performance;
                const facePrediction = faceModel.detectForVideo(
                    webcamRef.current.video,
                    performance.now()
                );

                resizeCanvas(canvasRef, webcamRef);
                drawOnCanvas(
                    FACE_DETECTION_MODE,
                    mirrored,
                    null,
                    facePrediction,
                    canvasRef.current?.getContext("2d")
                );
            }
        }
    };

    useEffect(() => {
        setLoading(true);
        initObjModel();
        initFaceModel();
    }, []);

    useEffect(() => {
        if (objModel && faceModel) {
            setLoading(false);
        }
    }, [objModel, faceModel]);

    useEffect(() => {
        interval = setInterval(() => {
            runPrediction();
        }, 100);

        return () => clearInterval(interval);
    }, [webcamRef.current, objModel, faceModel, mirrored]);

    return (
        <div className="flex flex-col h-screen">
            {/* Camera area */}
            <div className="relative h-[80%]">
                <div className="relative w-screen h-full">
                    <Webcam
                        ref={webcamRef}
                        mirrored={mirrored}
                        className="h-full w-full object-contain p-2"
                    />
                    <canvas
                        ref={canvasRef}
                        className="absolute top-0 left-0 h-full w-full object-contain"
                    ></canvas>
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
