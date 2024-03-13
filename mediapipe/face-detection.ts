import Drawing3d from "@/lib/Drawing3d";
import {
    DELEGATE_GPU,
    FACE_DETECTION_MODE,
    FACE_DETECTION_STR,
    InterfaceDelegate,
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
import * as THREE from "three";
import { Vector2 } from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";

const FaceDetection = (() => {
    const MODEL_URL: string =
        "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/latest/blaze_face_short_range.tflite";

    const CONFIG_MIN_DETECTION_CONFIDENCE_VALUE: number = 0;
    const CONFIG_MAX_DETECTION_CONFIDENCE_VALUE: number = 1;
    const CONFIG_MIN_SUPPRESSION_THRESHOLD_VALUE: number = 0;
    const CONFIG_MAX_SUPPRESSION_THRESHOLD_VALUE: number = 1;
    const CONFIG_DEFAULT_DETECTION_CONFIDENCE_SLIDER_STEP_VALUE: number = 0.1;
    const CONFIG_DEFAULT_SUPPRESSION_THRESHOLD_SLIDER_STEP_VALUE: number = 0.1;

    let minDetectionConfidence: number = 0.5;
    let minSuppressionThreshold: number = 0.3;
    let runningMode: RunningMode = RUNNING_MODE_VIDEO;
    let delegate: InterfaceDelegate = DELEGATE_GPU;
    let isUpdating: boolean = false;

    let faceDetector: FaceDetector | null = null;

    const initModel = async (vision: any): Promise<ModelLoadResult> => {
        const result: ModelLoadResult = {
            modelName: FACE_DETECTION_STR,
            mode: FACE_DETECTION_MODE,
            loadResult: false,
        };

        if (faceDetector) {
            result.loadResult = true;
            return result;
        }

        try {
            if (vision) {
                const config: FaceDetectorOptions = getConfig();

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

    const getRunningMode = (): RunningMode => runningMode;
    const setRunningMode = (mode: RunningMode) => (runningMode = mode);

    const getMinDetectionConfidence = (): number => minDetectionConfidence;
    const setMinDetectionConfidence = (min: number) =>
        (minDetectionConfidence = min);

    const getMinSuppressionThreshold = (): number => minSuppressionThreshold;
    const setMinSuppressionThreshold = (min: number) =>
        (minSuppressionThreshold = min);

    const getInterfaceDelegate = (): InterfaceDelegate => delegate;
    const setInterfaceDelegate = (del: InterfaceDelegate) => (delegate = del);

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

    const draw = (
        mirrored: boolean,
        detections: Detection[] | null | undefined,
        width: number,
        height: number
    ) => {
        if (detections) {
            Drawing3d.clearScene();
            const objGroup: THREE.Object3D<THREE.Object3DEventMap> =
                new THREE.Object3D();
            detections.forEach((detected: Detection) => {
                if (detected.boundingBox) {
                    const box: BoundingBox = detected.boundingBox;

                    const points: Vector2[] = [];

                    const cameraPos = Drawing3d.getCameraPosition();
                    if (!cameraPos) {
                        return;
                    }

                    const rightPoint: number = cameraPos.x + width / 2;
                    const leftPoint: number = -rightPoint;
                    const topPoint: number = cameraPos.y + height / 2;

                    if (mirrored) {
                        points.push(
                            new THREE.Vector2(
                                rightPoint - box.originX,
                                topPoint - box.originY
                            )
                        );
                        points.push(
                            new THREE.Vector2(
                                rightPoint - box.originX - box.width,
                                topPoint - box.originY
                            )
                        );
                        points.push(
                            new THREE.Vector2(
                                rightPoint - box.originX - box.width,
                                topPoint - box.originY - box.height
                            )
                        );
                        points.push(
                            new THREE.Vector2(
                                rightPoint - box.originX,
                                topPoint - box.originY - box.height
                            )
                        );
                    } else {
                        points.push(
                            new THREE.Vector2(
                                leftPoint + box.originX,
                                topPoint - box.originY
                            )
                        );
                        points.push(
                            new THREE.Vector2(
                                leftPoint + box.originX + box.width,
                                topPoint - box.originY
                            )
                        );
                        points.push(
                            new THREE.Vector2(
                                leftPoint + box.originX + box.width,
                                topPoint - box.originY - box.height
                            )
                        );
                        points.push(
                            new THREE.Vector2(
                                leftPoint + box.originX,
                                topPoint - box.originY - box.height
                            )
                        );
                    }
                    const bufferGeo = new THREE.BufferGeometry().setFromPoints(
                        points
                    );
                    bufferGeo.setIndex([0, 1, 2, 3, 0]);

                    const unindexd = bufferGeo.toNonIndexed();
                    const geo = new LineGeometry().setPositions(
                        unindexd.getAttribute("position").array as Float32Array
                    );
                    const material = new LineMaterial({
                        color: "#FF0F0F",
                        linewidth: 0.008,
                        vertexColors: false,
                        worldUnits: false,
                    });

                    const line = new Line2(geo, material);
                    objGroup.add(line);

                    // Add text
                    const label = Drawing3d.createLabel(
                        "Face",
                        detected.categories[0].score,
                        "#FF0F0F",
                        width,
                        height,
                        mirrored,
                        box
                    );

                    if (label) {
                        objGroup.add(label);
                    }
                }
            });

            const dist = Drawing3d.calculateDistance(height);
            objGroup.position.z = dist;

            Drawing3d.addToScene(objGroup);
            Drawing3d.render();
        }
    };

    return {
        CONFIG_FACE_MIN_DETECTION_CONFIDENCE_VALUE:
            CONFIG_MIN_DETECTION_CONFIDENCE_VALUE,
        CONFIG_FACE_MAX_DETECTION_CONFIDENCE_VALUE:
            CONFIG_MAX_DETECTION_CONFIDENCE_VALUE,
        CONFIG_FACE_MIN_SUPPRESSION_THRESHOLD_VALUE:
            CONFIG_MIN_SUPPRESSION_THRESHOLD_VALUE,
        CONFIG_FACE_MAX_SUPPRESSION_THRESHOLD_VALUE:
            CONFIG_MAX_SUPPRESSION_THRESHOLD_VALUE,
        CONFIG_FACE_DEFAULT_DETECTION_CONFIDENCE_SLIDER_STEP_VALUE:
            CONFIG_DEFAULT_DETECTION_CONFIDENCE_SLIDER_STEP_VALUE,
        CONFIG_FACE_DEFAULT_SUPPRESSION_THRESHOLD_SLIDER_STEP_VALUE:
            CONFIG_DEFAULT_SUPPRESSION_THRESHOLD_SLIDER_STEP_VALUE,
        initModel,
        getInterfaceDelegate,
        setInterfaceDelegate,
        getMinDetectionConfidence,
        setMinDetectionConfidence,
        getMinSuppressionThreshold,
        setMinSuppressionThreshold,
        getRunningMode,
        setRunningMode,
        draw,
        detectFace,
        isModelUpdating,
        updateModelConfig,
    };
})();

export default FaceDetection;
