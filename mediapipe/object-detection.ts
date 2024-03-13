import Drawing3d from "@/lib/Drawing3d";
import {
    DELEGATE_GPU,
    InterfaceDelegate,
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
import * as THREE from "three";
import { Vector2 } from "three";
import { Line2 } from "three/addons/lines/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { RunningMode } from "../utils/definitions";

const ObjectDetection = (() => {
    const MODEL_URL: string =
        "https://storage.googleapis.com/mediapipe-models/object_detector/efficientdet_lite0/float16/latest/efficientdet_lite0.tflite";

    const CONFIG_MIN_RESULT_VALUE: number = 0;
    const CONFIG_MAX_RESULT_VALUE: number = 10;
    const CONFIG_MIN_SCORE_VALUE: number = 0;
    const CONFIG_MAX_SCORE_VALUE: number = 1;
    const CONFIG_DEFAULT_RESULT_SLIDER_STEP_VALUE: number = 1;
    const CONFIG_DEFAULT_SCORE_SLIDER_STEP_VALUE: number = 0.1;

    let displayNamesLocale: string = "en";
    let maxResults: number = 5;
    let scoreThreshold: number = 0.5;
    let runningMode: RunningMode = RUNNING_MODE_VIDEO;
    let delegate: InterfaceDelegate = DELEGATE_GPU;

    let objectDetector: ObjectDetector | null = null;
    let isUpdating: boolean = false;

    const initModel = async (vision: any): Promise<ModelLoadResult> => {
        const result: ModelLoadResult = {
            modelName: OBJECT_DETECTION_STR,
            mode: OBJ_DETECTION_MODE,
            loadResult: false,
        };

        if (objectDetector) {
            result.loadResult = true;
            return result;
        }

        try {
            if (vision) {
                const config: ObjectDetectorOptions = getConfig();

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

    const getConfig = (): ObjectDetectorOptions => {
        const config: ObjectDetectorOptions = {
            baseOptions: {
                modelAssetPath: MODEL_URL,
                delegate: delegate,
            },
            displayNamesLocale: displayNamesLocale,
            maxResults: maxResults,
            scoreThreshold: scoreThreshold,
            runningMode: runningMode,
        };

        return config;
    };

    const getRunningMode = (): RunningMode => runningMode;
    const setRunningMode = (mode: RunningMode) => (runningMode = mode);

    const getMaxResults = (): number => maxResults;
    const setMaxResults = (max: number) => (maxResults = max);

    const getScoreThreshold = (): number => scoreThreshold;
    const setScoreThreshold = (score: number) => (scoreThreshold = score);

    const getInterfaceDelegate = (): InterfaceDelegate => delegate;
    const setInterfaceDelegate = (del: InterfaceDelegate) => (delegate = del);

    const updateModelConfig = async () => {
        if (objectDetector) {
            isUpdating = true;
            console.log("interface:", delegate);
            await objectDetector.setOptions(getConfig());
            isUpdating = false;
        }
    };

    const isModelUpdating = (): boolean => isUpdating;

    const detectObject = (
        video: HTMLVideoElement
    ): ObjectDetectorResult | null => {
        if (objectDetector) {
            try {
                const detection: ObjectDetectorResult =
                    objectDetector.detectForVideo(video, performance.now());

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
            const objGroup = new THREE.Object3D();
            detections.forEach((detected: Detection) => {
                if (detected.boundingBox) {
                    const box: BoundingBox = detected.boundingBox;
                    const category: Category = detected.categories.reduce(
                        (maxScoreCat, current) => {
                            if (maxScoreCat.score < current.score) {
                                return current;
                            }

                            return maxScoreCat;
                        }
                    );

                    const points: Vector2[] = [];

                    const cameraPos = Drawing3d.getCameraPosition();
                    if (!cameraPos) {
                        return;
                    }

                    const rightPoint = cameraPos.x + width / 2;
                    const leftPoint = -rightPoint;
                    const topPoint = cameraPos.y + height / 2;

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
                        linewidth: 0.008,
                        worldUnits: false,
                        vertexColors: false,
                    });
                    material.color.set(
                        category.categoryName === "person" ? 0xff0f0f : 0x00b612
                    );

                    const line = new Line2(geo, material);
                    line.computeLineDistances();
                    line.scale.set(1, 1, 1);
                    objGroup.add(line);

                    // Add text
                    const label = Drawing3d.createLabel(
                        category.categoryName,
                        category.score,
                        category.categoryName === "person"
                            ? "#FF0F0F"
                            : "#00B612",
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
        CONFIG_OBJECT_MIN_RESULT_VALUE: CONFIG_MIN_RESULT_VALUE,
        CONFIG_OBJECT_MAX_RESULT_VALUE: CONFIG_MAX_RESULT_VALUE,
        CONFIG_OBJECT_MIN_SCORE_VALUE: CONFIG_MIN_SCORE_VALUE,
        CONFIG_OBJECT_MAX_SCORE_VALUE: CONFIG_MAX_SCORE_VALUE,
        CONFIG_OBJECT_DEFAULT_RESULT_SLIDER_STEP_VALUE:
            CONFIG_DEFAULT_RESULT_SLIDER_STEP_VALUE,
        CONFIG_OBJECT_DEFAULT_SCORE_SLIDER_STEP_VALUE:
            CONFIG_DEFAULT_SCORE_SLIDER_STEP_VALUE,
        initModel,
        detectObject,
        draw,
        getInterfaceDelegate,
        setInterfaceDelegate,
        getMaxResults,
        setMaxResults,
        getScoreThreshold,
        setScoreThreshold,
        getRunningMode,
        setRunningMode,
        updateModelConfig,
        isModelUpdating,
    };
})();

export default ObjectDetection;
