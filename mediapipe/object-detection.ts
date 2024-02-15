import {
    DELEGATE_GPU,
    ModelLoadResult,
    OBJECT_DETECTION_STR,
    OBJ_DETECTION_MODE,
    RUNNING_MODE_VIDEO,
} from "@/utils/definitions";
import {
    BoundingBox,
    Category,
    Detection,
    ObjectDetector,
    ObjectDetectorOptions,
    ObjectDetectorResult,
} from "@mediapipe/tasks-vision";
import { RunningMode } from "../utils/definitions";

const ObjectDetection = (() => {
    const MODEL_URL: string =
        "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/latest/efficientdet_lite0.tflite";

    let displayNamesLocale: string = "en";
    let maxResults: number = -1;
    let scoreThreshold: number = 0.5;
    let runningMode: RunningMode = RUNNING_MODE_VIDEO;

    let objectDetector: ObjectDetector | null = null;

    const initModel = async (vision: any): Promise<ModelLoadResult> => {
        const result: ModelLoadResult = {
            modelName: OBJECT_DETECTION_STR,
            mode: OBJ_DETECTION_MODE,
            loadResult: false,
        };

        try {
            if (vision) {
                const config: ObjectDetectorOptions = {
                    baseOptions: {
                        modelAssetPath: MODEL_URL,
                        delegate: DELEGATE_GPU,
                    },
                    displayNamesLocale: displayNamesLocale,
                    maxResults: maxResults,
                    scoreThreshold: scoreThreshold,
                    runningMode: runningMode,
                };

                objectDetector = await ObjectDetector.createFromOptions(
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

    const detectObject = (
        video: HTMLVideoElement
    ): ObjectDetectorResult | null => {
        if (objectDetector) {
            try {
                const detection: ObjectDetectorResult =
                    objectDetector.detectForVideo(video, video.currentTime);

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
            detections.forEach((detected: Detection) => {
                if (context && detected.boundingBox) {
                    const box: BoundingBox = detected.boundingBox;
                    const category: Category = detected.categories.reduce(
                        (maxScoreCat, current) => {
                            if (maxScoreCat.score < current.score) {
                                return current;
                            }

                            return maxScoreCat;
                        }
                    );

                    context.beginPath();

                    // box
                    context.font = "12px Courier New";
                    context.strokeStyle =
                        category.categoryName === "person"
                            ? "#FF0F0F"
                            : "#00B612";
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
                    const name = `${category.categoryName}`;
                    const textSize = context.measureText(name);
                    context.fillStyle =
                        category.categoryName === "person"
                            ? "#FF0F0F"
                            : "#00B612";
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
        initModel: initModel,
        detectObject: detectObject,
        drawOnCanvas: drawOnCanvas,
    };
})();

export default ObjectDetection;
