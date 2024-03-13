import Drawing3d from "@/lib/Drawing3d";
import {
    DELEGATE_GPU,
    GESTURE_RECOGNITION_MODE,
    GESTURE_RECOGNITION_STR,
    InterfaceDelegate,
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
import { Object3D, Object3DEventMap, Vector3 } from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

const GestureRecognition = (() => {
    const MODEL_URL =
        "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/latest/gesture_recognizer.task";

    const CONFIG_MIN_HAND: number = 1;
    const CONFIG_MAX_HAND: number = 2;
    const CONFIG_MIN_DETECTION_CONFIDENCE: number = 0;
    const CONFIG_MAX_DETECTION_CONFIDENCE: number = 1;
    const CONFIG_MIN_PRESENCE_CONFIDENCE: number = 0;
    const CONFIG_MAX_PRESENCE_CONFIDENCE: number = 1;
    const CONFIG_MIN_TRACKING_CONFIDENCE: number = 0;
    const CONFIG_MAX_TRACKING_CONFIDENCE: number = 1;
    const CONFIG_DEFAULT_HAND_SLIDER_STEP: number = 1;
    const CONFIG_DEFAULT_CONFIDENCE_SLIDER_STEP: number = 0.1;

    const BASE_SCALE: number = 0.25;
    const SCALE_FACTOR: number = 4;

    const CIRCLE_RADIUS: number = 10;
    const CIRCLE_OUTER_RADIUS: number = CIRCLE_RADIUS + 5;
    const CIRCLE_SEGMENTS: number = 32;

    type FingerJointsType = {
        thumb: number[];
        indexFinger: number[];
        middleFinder: number[];
        ringFinger: number[];
        pinky: number[];
        palm: number[];
    };
    const fingerJoints: FingerJointsType = {
        thumb: [0, 1, 2, 3, 4],
        indexFinger: [0, 5, 6, 7, 8],
        middleFinder: [9, 10, 11, 12],
        ringFinger: [13, 14, 15, 16],
        pinky: [0, 17, 18, 19, 20],
        palm: [5, 9, 13, 17],
    };

    let numHands: number = 2;
    let minHandDetectionConfidence: number = 0.5;
    let minHandPresenceConfidence: number = 0.5;
    let minTrackingConfidence: number = 0.5;
    let delegate: InterfaceDelegate = DELEGATE_GPU;
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

        if (gestureRecognizer) {
            result.loadResult = true;
            return result;
        }

        try {
            if (vision) {
                const config: GestureRecognizerOptions = getConfig();

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

    const getConfig = (): GestureRecognizerOptions => {
        const config: GestureRecognizerOptions = {
            baseOptions: {
                modelAssetPath: MODEL_URL,
                delegate: delegate,
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
            runningMode: runningMode,
        };

        return config;
    };

    const isModelUpdating = (): boolean => isUpdating;
    const updateModelConfig = async () => {
        if (gestureRecognizer) {
            isUpdating = true;
            await gestureRecognizer.setOptions(getConfig());
            isUpdating = false;
        }
    };

    const getNumberOfHands = (): number => numHands;
    const setNumberOfHands = (num: number) => (numHands = num);

    const getMinHandDetectionConfidence = (): number =>
        minHandDetectionConfidence;
    const setMinHandDetectionConfidence = (num: number) =>
        (minHandDetectionConfidence = num);

    const getMinHandPresenceConfidence = (): number =>
        minHandPresenceConfidence;
    const setMinHandPresenceConfidence = (num: number) =>
        (minHandPresenceConfidence = num);

    const getMinTrackingConfidence = (): number => minTrackingConfidence;
    const setMinTrackingConfidence = (num: number) =>
        (minTrackingConfidence = num);

    const getRunningMode = (): RunningMode => runningMode;
    const setRunningMode = (mode: RunningMode) => (runningMode = mode);

    const getInterfaceDelegate = (): InterfaceDelegate => delegate;
    const setInterfaceDelegate = (del: InterfaceDelegate) => (delegate = del);

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
        results: GestureRecognizerResult | null | undefined,
        width: number,
        height: number
    ) => {
        if (results) {
            Drawing3d.clearScene();

            const objGroup: Object3D<Object3DEventMap> = new Object3D();
            const jointGroup: Object3D<Object3DEventMap> = new Object3D();

            const offsetX: number = width / 2;
            const offsetY: number = height / 2;
            const dist = Drawing3d.calculateDistance(height);

            results.handedness.forEach((hand: Category[], index: number) => {
                const landmark: NormalizedLandmark[] = results.landmarks[index];
                if (landmark) {
                    Object.entries(fingerJoints).forEach(
                        (entry: [string, number[]]) => {
                            const joints: number[] = entry[1];
                            const points: Vector3[] = [];
                            let avgScaleFactor: number = 0;

                            joints.forEach((idx: number) => {
                                const point: NormalizedLandmark = landmark[idx];
                                const x =
                                    (width * point.x - offsetX) *
                                    (mirrored ? -1 : 1);
                                const y = -height * point.y + offsetY;
                                const scaleFactor =
                                    ((dist * point.z) / dist) * -SCALE_FACTOR +
                                    BASE_SCALE;
                                avgScaleFactor += scaleFactor;

                                const v3 = new THREE.Vector3(x, y, dist);
                                points.push(v3);
                            });
                            avgScaleFactor /= joints.length;

                            const bufferGeo =
                                new THREE.BufferGeometry().setFromPoints(
                                    points
                                );

                            const geo = new LineGeometry().setPositions(
                                bufferGeo.getAttribute("position")
                                    .array as Float32Array
                            );

                            const lineWidth = 0.015 * avgScaleFactor;

                            const material = new LineMaterial({
                                color:
                                    hand[0].categoryName === "Left"
                                        ? "#FF0F0F"
                                        : "#00B612",
                                linewidth: lineWidth < 0 ? 0.001 : lineWidth,
                                alphaToCoverage: true,
                                worldUnits: false,
                            });

                            const line = new Line2(geo, material);
                            jointGroup.add(line);
                        }
                    );

                    landmark.forEach(
                        (data: NormalizedLandmark, idx: number) => {
                            const circleObjGroup = new THREE.Object3D();

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

            Drawing3d.addToScene(jointGroup);
            Drawing3d.addToScene(objGroup);

            Drawing3d.render();
        }
    };

    return {
        CONFIG_GESTURE_MIN_HAND: CONFIG_MIN_HAND,
        CONFIG_GESTURE_MAX_HAND: CONFIG_MAX_HAND,
        CONFIG_GESTURE_MIN_DETECTION_CONFIDENCE:
            CONFIG_MIN_DETECTION_CONFIDENCE,
        CONFIG_GESTURE_MAX_DETECTION_CONFIDENCE:
            CONFIG_MAX_DETECTION_CONFIDENCE,
        CONFIG_GESTURE_MIN_PRESENCE_CONFIDENCE: CONFIG_MIN_PRESENCE_CONFIDENCE,
        CONFIG_GESTURE_MAX_PRESENCE_CONFIDENCE: CONFIG_MAX_PRESENCE_CONFIDENCE,
        CONFIG_GESTURE_MIN_TRACKING_CONFIDENCE: CONFIG_MIN_TRACKING_CONFIDENCE,
        CONFIG_GESTURE_MAX_TRACKING_CONFIDENCE: CONFIG_MAX_TRACKING_CONFIDENCE,
        CONFIG_GESTURE_DEFAULT_HAND_SLIDER_STEP:
            CONFIG_DEFAULT_HAND_SLIDER_STEP,
        CONFIG_GESTURE_DEFAULT_CONFIDENCE_SLIDER_STEP:
            CONFIG_DEFAULT_CONFIDENCE_SLIDER_STEP,
        initModel,
        detectGesture,
        isModelUpdating,
        updateModelConfig,
        getNumberOfHands,
        setNumberOfHands,
        getMinHandDetectionConfidence,
        setMinHandDetectionConfidence,
        getMinHandPresenceConfidence,
        setMinHandPresenceConfidence,
        getMinTrackingConfidence,
        setMinTrackingConfidence,
        getRunningMode,
        setRunningMode,
        getInterfaceDelegate,
        setInterfaceDelegate,
        draw,
    };
})();

export default GestureRecognition;
