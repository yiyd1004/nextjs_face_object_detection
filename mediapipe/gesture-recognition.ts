import Drawing3d from "@/lib/Drawing3d";
import {
    GESTURE_RECOGNITION_MODE,
    GESTURE_RECOGNITION_STR,
    ModelLoadResult,
    RUNNING_MODE_VIDEO,
    RunningMode,
} from "@/utils/definitions";
import {
    Category,
    GestureRecognizer,
    GestureRecognizerOptions,
    GestureRecognizerResult,
    NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import * as THREE from "three";

const GestureRecognition = (() => {
    const MODEL_URL =
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/latest/gesture_recognizer.task";

    const CONFIG_GESTURE_MIN_HAND: number = 2;
    const CONFIG_GESTURE_MAX_HAND: number = 2;
    const CONFIG_GESTURE_MIN_DETECTION_CONFIDENCE: number = 0;
    const CONFIG_GESTURE_MAX_DETECTION_CONFIDENCE: number = 1;
    const CONFIG_GESTURE_MIN_PRESENCE_CONFIDENCE: number = 0;
    const CONFIG_GESTURE_MAX_PRESENCE_CONFIDENCE: number = 1;
    const CONFIG_GESTURE_MIN_TRACKING_CONFIDENCE: number = 0;
    const CONFIG_GESTURE_MAX_TRACKING_CONFIDENCE: number = 1;
    const CONFIG_GESTURE_DEFAULT_CONFIDENCE_SLIDER_STEP: number = 0.1;

    const BASE_SCALE: number = 0.25;
    const SCALE_FACTOR: number = 4;

    const CIRCLE_RADIUS: number = 10;
    const CIRCLE_OUTER_RADIUS: number = CIRCLE_RADIUS + 5;
    const CIRCLE_SEGMENTS: number = 32;

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

    let isUpdating: boolean = false;

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

    const isModelUpdating = (): boolean => {
        return isUpdating;
    };

    const detectGesture = (
        video: HTMLVideoElement
    ): GestureRecognizerResult | null => {
        try {
            const detection = gestureRecognizer.recognizeForVideo(
                video,
                performance.now()
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

    const draw = (
        mirrored: boolean,
        gestures: Category[][],
        handedness: Category[][],
        landmarks: NormalizedLandmark[][],
        width: number,
        height: number
    ) => {
        if (gestures && handedness && landmarks) {
            Drawing3d.clearScene();
            const objGroup = new THREE.Object3D();

            const offsetX = width / 2;
            const offsetY = height / 2;

            handedness.forEach((hand: Category[], index: number) => {
                const landmark = landmarks[index];
                if (landmark) {
                    landmark.forEach(
                        (data: NormalizedLandmark, idx: number) => {
                            const circleObjGroup = new THREE.Object3D();

                            const dist = Drawing3d.calculateDistance(height);
                            const x =
                                (width * data.x - offsetX) *
                                (mirrored ? -1 : 1);
                            const y = -height * data.y + offsetY;
                            const scaleFactor =
                                ((dist * data.z) / dist) * -SCALE_FACTOR +
                                BASE_SCALE;

                            const circleGeo = new THREE.CircleGeometry(
                                CIRCLE_RADIUS,
                                CIRCLE_SEGMENTS
                            );
                            const circleMat = new THREE.MeshBasicMaterial({
                                depthTest: true,
                                depthWrite: true,
                                color:
                                    hand[0].categoryName === "Left"
                                        ? "#FF0F0F"
                                        : "#00B612",
                                side: THREE.DoubleSide,
                            });
                            const circle = new THREE.Mesh(circleGeo, circleMat);

                            circleObjGroup.add(circle);

                            const ringGeo = new THREE.RingGeometry(
                                CIRCLE_RADIUS,
                                CIRCLE_OUTER_RADIUS,
                                CIRCLE_SEGMENTS
                            );
                            const ringMat = new THREE.MeshBasicMaterial({
                                depthTest: true,
                                depthWrite: true,
                                color:
                                    hand[0].categoryName === "Left"
                                        ? "#00B612"
                                        : "#FF0F0F",
                                side: THREE.DoubleSide,
                            });

                            const ring = new THREE.Mesh(ringGeo, ringMat);
                            circleObjGroup.add(ring);

                            circleObjGroup.position.set(x, y, dist);
                            circleObjGroup.scale.set(
                                scaleFactor,
                                scaleFactor,
                                1
                            );
                            objGroup.add(circleObjGroup);
                        }
                    );
                }
            });

            Drawing3d.addToScene(objGroup);
            Drawing3d.render();
        }
    };

    return {
        CONFIG_GESTURE_MIN_HAND,
        CONFIG_GESTURE_MAX_HAND,
        CONFIG_GESTURE_MIN_DETECTION_CONFIDENCE,
        CONFIG_GESTURE_MAX_DETECTION_CONFIDENCE,
        CONFIG_GESTURE_MIN_PRESENCE_CONFIDENCE,
        CONFIG_GESTURE_MAX_PRESENCE_CONFIDENCE,
        CONFIG_GESTURE_MIN_TRACKING_CONFIDENCE,
        CONFIG_GESTURE_MAX_TRACKING_CONFIDENCE,
        CONFIG_GESTURE_DEFAULT_CONFIDENCE_SLIDER_STEP,
        initModel,
        detectGesture,
        isModelUpdating,
        draw,
    };
})();

export default GestureRecognition;
