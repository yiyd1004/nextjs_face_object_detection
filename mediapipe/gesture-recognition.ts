import {
    GESTURE_RECOGNITION_MODE,
    GESTURE_RECOGNITION_STR,
    ModelLoadResult,
    RUNNING_MODE_VIDEO,
    RunningMode,
} from "@/utils/definitions";
import {
    GestureRecognizer,
    GestureRecognizerOptions,
    GestureRecognizerResult,
} from "@mediapipe/tasks-vision";

const GestureRecognition = (() => {
    const MODEL_URL =
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/latest/gesture_recognizer.task";

    const MAX_CONFIG_VALUE: number = 1;
    const MIN_CONFIG_VALUE: number = 0;

    let numHands: number = 2;
    let minHandDetectionConfidence: number = 0.5;
    let minHandPresenceConfidence: number = 0.5;
    let minTrackingConfidence: number = 0.5;
    let runningMode: RunningMode = RUNNING_MODE_VIDEO;

    // canned_gesture_classifier_options
    let cannedGestureDisplayNamesLocale: string = "en";
    let cannedGestureMaxResults: number = -1;
    let cannedGestureScoreThreshold: number = 0;

    // custom_gesture_classifier_options
    let customGestureDisplayNamesLocale: string = "en";
    let customGestureMaxResults: number = -1;
    let customGestureScoreThreshold: number = 0;

    let gestureRecognizer: GestureRecognizer;

    const initModel = async (vision: any): Promise<ModelLoadResult> => {
        const result: ModelLoadResult = {
            modelName: GESTURE_RECOGNITION_STR,
            mode: GESTURE_RECOGNITION_MODE,
            loadResult: false,
        };

        try {
            if (vision) {
                const config: GestureRecognizerOptions = {
                    baseOptions: {
                        modelAssetPath: MODEL_URL,
                    },
                    numHands: numHands,
                    minHandDetectionConfidence: minHandDetectionConfidence,
                    minHandPresenceConfidence: minHandPresenceConfidence,
                    minTrackingConfidence: minTrackingConfidence,
                    cannedGesturesClassifierOptions: {
                        displayNamesLocale: cannedGestureDisplayNamesLocale,
                        maxResults: cannedGestureMaxResults,
                        scoreThreshold: cannedGestureScoreThreshold,
                    },
                    customGesturesClassifierOptions: {
                        displayNamesLocale: customGestureDisplayNamesLocale,
                        maxResults: customGestureMaxResults,
                        scoreThreshold: customGestureScoreThreshold,
                    },
                    runningMode: RUNNING_MODE_VIDEO,
                };

                gestureRecognizer = await GestureRecognizer.createFromOptions(
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

    const detectGesture = (
        video: HTMLVideoElement
    ): GestureRecognizerResult | null => {
        try {
            const detection = gestureRecognizer.recognizeForVideo(
                video,
                video.currentTime
            );

            return detection;
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log(error);
            }
        }

        return null;
    };

    return {
        initModel: initModel,
        detectGesture: detectGesture,
    };
})();

export default GestureRecognition;
