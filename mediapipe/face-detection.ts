import {
    DELEGATE_GPU,
    FACE_DETECTION_MODE,
    FACE_DETECTION_STR,
    Interface,
    ModelLoadResult,
    RUNNING_MODE_VIDEO,
    RunningMode,
} from "@/utils/definitions";
import {
    BoundingBox,
    Detection,
    FaceDetector,
    FaceDetectorOptions,
    FaceDetectorResult,
} from "@mediapipe/tasks-vision";

const FaceDetection = (() => {
    const MODEL_URL: string =
        "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite";

    const CONFIG_FACE_MIN_DETECTION_CONFIDENCE_VALUE: number = 0;
    const CONFIG_FACE_MAX_DETECTION_CONFIDENCE_VALUE: number = 1;
    const CONFIG_FACE_MIN_SUPPRESSION_THRESHOLD_VALUE: number = 0;
    const CONFIG_FACE_MAX_SUPPRESSION_THRESHOLD_VALUE: number = 1;
    const CONFIG_FACE_DEFAULT_DETECTION_CONFIDENCE_SLIDER_STEP_VALUE: number = 0.1;
    const CONFIG_FACE_DEFAULT_SUPPRESSION_THRESHOLD_SLIDER_STEP_VALUE: number = 0.1;

    let minDetectionConfidence: number = 0.5;
    let minSuppressionThreshold: number = 0.3;
    let runningMode: RunningMode = RUNNING_MODE_VIDEO;
    let delegate: Interface = DELEGATE_GPU;
    let isUpdating: boolean = false;

    let faceDetector: FaceDetector | null = null;

    const initModel = async (vision: any): Promise<ModelLoadResult> => {
        const result: ModelLoadResult = {
            modelName: FACE_DETECTION_STR,
            mode: FACE_DETECTION_MODE,
            loadResult: false,
        };

        try {
            if (vision) {
                const config: FaceDetectorOptions = {
                    baseOptions: {
                        modelAssetPath: MODEL_URL,
                        delegate: DELEGATE_GPU,
                    },
                    minDetectionConfidence: minDetectionConfidence,
                    minSuppressionThreshold: minSuppressionThreshold,
                    runningMode: runningMode,
                };

                faceDetector = await FaceDetector.createFromOptions(
                    vision,
                    config
                );

                result.loadResult = true;
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log(error);
            }
        }

        return result;
    };

    const getConfig = (): FaceDetectorOptions => {
        const config: FaceDetectorOptions = {
            baseOptions: {
                modelAssetPath: MODEL_URL,
                delegate: delegate,
            },
            minDetectionConfidence: minDetectionConfidence,
            minSuppressionThreshold: minSuppressionThreshold,
            runningMode: runningMode,
        };

        return config;
    };

    const setRunningMode = (mode: RunningMode) => {
        runningMode = mode;
    };

    const setMinDetectionConfidence = (min: number) => {
        minDetectionConfidence = min;
    };

    const setMinSuppressionThreshold = (min: number) => {
        minSuppressionThreshold = min;
    };

    const setInterfaceDelegate = (del: Interface) => {
        console.log("set interface:", del);
        delegate = del;
    };

    const updateModelConfig = async () => {
        if (faceDetector) {
            isUpdating = true;
            console.log("interface:", delegate);
            await faceDetector.setOptions(getConfig());
            isUpdating = false;
        }
    };

    const isModelUpdating = (): boolean => {
        return isUpdating;
    };

    const detectFace = (video: HTMLVideoElement): FaceDetectorResult | null => {
        if (faceDetector) {
            try {
                const detection: FaceDetectorResult =
                    faceDetector.detectForVideo(video, performance.now());

                return detection;
            } catch (error) {
                if (error instanceof Error) {
                    console.log(error.message);
                } else {
                    console.log(error);
                }
            }
        }

        return null;
    };

    const drawOnCanvas = (
        mirrored: boolean,
        detections: Detection[] | null | undefined,
        context: CanvasRenderingContext2D | null | undefined
    ) => {
        if (detections) {
            detections.forEach((detected: Detection, index: number) => {
                if (context && detected.boundingBox) {
                    const box: BoundingBox = detected.boundingBox;

                    context.beginPath();

                    // box
                    context.font = "12px Courier New";
                    context.strokeStyle = "#FF0F0F";
                    context.lineWidth = 4;
                    context.globalAlpha = 1;

                    mirrored
                        ? context.roundRect(
                              context.canvas.width - box.originX,
                              box.originY,
                              -box.width,
                              box.height
                          )
                        : context.roundRect(
                              box.originX,
                              box.originY,
                              box.width,
                              box.height
                          );

                    context.stroke();

                    // Textbox
                    context.beginPath();
                    const name = `Face ${(
                        detected.categories[0].score * 100
                    ).toFixed(0)}%`;
                    const textSize = context.measureText(name);
                    context.fillStyle = "#FF0F0F";
                    context.globalAlpha = 1;

                    mirrored
                        ? context.roundRect(
                              context.canvas.width -
                                  box.originX -
                                  box.width -
                                  2,
                              box.originY - 20,
                              textSize.width + 8,
                              textSize.fontBoundingBoxAscent +
                                  textSize.fontBoundingBoxDescent +
                                  8
                          )
                        : context.roundRect(
                              box.originX - 2,
                              box.originY - 20,
                              textSize.width + 8,
                              textSize.fontBoundingBoxAscent +
                                  textSize.fontBoundingBoxDescent +
                                  8
                          );
                    context.fill();

                    // text
                    context.beginPath();
                    context.font = "12px Courier New";
                    context.fillStyle = "white";
                    context.globalAlpha = 1;

                    mirrored
                        ? context.fillText(
                              name,
                              context.canvas.width -
                                  box.originX -
                                  box.width +
                                  2,
                              box.originY - 7
                          )
                        : context.fillText(
                              name,
                              box.originX + 2,
                              box.originY - 7
                          );
                }
            });
        }
    };

    return {
        CONFIG_FACE_MIN_DETECTION_CONFIDENCE_VALUE,
        CONFIG_FACE_MAX_DETECTION_CONFIDENCE_VALUE,
        CONFIG_FACE_MIN_SUPPRESSION_THRESHOLD_VALUE,
        CONFIG_FACE_MAX_SUPPRESSION_THRESHOLD_VALUE,
        CONFIG_FACE_DEFAULT_DETECTION_CONFIDENCE_SLIDER_STEP_VALUE,
        CONFIG_FACE_DEFAULT_SUPPRESSION_THRESHOLD_SLIDER_STEP_VALUE,
        initModel,
        getConfig,
        setInterfaceDelegate,
        setMinDetectionConfidence,
        setMinSuppressionThreshold,
        detectFace,
        drawOnCanvas,
        isModelUpdating,
        updateModelConfig,
    };
})();

export default FaceDetection;
