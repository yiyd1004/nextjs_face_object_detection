import Drawing3d from "@/lib/Drawing3d";
import {
    DELEGATE_GPU,
    InterfaceDelegate,
    RUNNING_MODE_VIDEO,
    RunningMode,
} from "@/utils/definitions";
import {
    FaceLandmarker,
    FaceLandmarkerOptions,
    FaceLandmarkerResult,
    NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import {
    BufferGeometry,
    CircleGeometry,
    DoubleSide,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    Object3DEventMap,
    Vector3,
} from "three";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import {
    FACE_LANDMARK_DETECTION_MODE,
    FACE_LANDMARK_DETECTION_STR,
    ModelLoadResult,
} from "./../utils/definitions";

type Connection = {
    start: number;
    end: number;
};

export type ConnectionData = {
    name: string;
    mode: number;
    connection: Connection[];
    connectionIndex: number[];
    color: string;
    isLoaded: boolean;
    isEnabled: boolean;
};

const FaceLandmarkDetection = (() => {
    const MODEL_URL: string =
        "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/latest/face_landmarker.task";

    const CONFIG_MIN_DETECTION_CONFIDENCE: number = 0;
    const CONFIG_MAX_DETECTION_CONFIDENCE: number = 1;
    const CONFIG_MIN_PRESENCE_CONFIDENCE: number = 0;
    const CONFIG_MAX_PRESENCE_CONFIDENCE: number = 1;
    const CONFIG_MIN_TRACKING_CONFIDENCE: number = 0;
    const CONFIG_MAX_TRACKING_CONFIDENCE: number = 1;
    const CONFIG_MIN_FACE_NUMBER: number = 1;
    const CONFIG_MAX_FACE_NUMBER: number = 2;

    const CONFIG_DEFAULT_FACE_SLIDER_STEP: number = 1;
    const CONFIG_DEFAULT_CONFIDENCE_SLIDER_STEP: number = 0.1;

    const BASE_SCALE: number = 0.25;
    const SCALE_FACTOR: number = 4;

    const CIRCLE_RADIUS: number = 3;
    const CIRCLE_SEGMENTS: number = 32;

    const CONNECTION_FACE_LANDMARKS_TESSELATION: number = 0;
    const CONNECTION_FACE_LANDMARKS_CONTOURS: number = 1;
    const CONNECTION_FACE_LANDMARKS_RIGHT_EYE: number = 2;
    const CONNECTION_FACE_LANDMARKS_RIGHT_EYEBROW: number = 3;
    const CONNECTION_FACE_LANDMARKS_LEFT_EYE: number = 4;
    const CONNECTION_FACE_LANDMARKS_LEFT_EYEBROW: number = 5;
    const CONNECTION_FACE_LANDMARKS_FACE_OVAL: number = 6;
    const CONNECTION_FACE_LANDMARKS_LIPS: number = 7;
    const CONNECTION_FACE_LANDMARKS_RIGHT_IRIS: number = 8;
    const CONNECTION_FACE_LANDMARKS_LEFT_IRIS: number = 9;
    const CONNECTION_FACE_LANDMARKS_POINTS: number = 10;

    const FACE_LANDMARKS_TESSELATION_STR: string = "Face Mesh";
    const FACE_LANDMARKS_CONTOURS_STR: string = "Face Contours";
    const FACE_LANDMARKS_RIGHT_EYE_STR: string = "Right Eye";
    const FACE_LANDMARKS_RIGHT_EYEBROW_STR: string = "Right Eyebrow";
    const FACE_LANDMARKS_LEFT_EYE_STR: string = "Left Eye";
    const FACE_LANDMARKS_LEFT_EYEBROW_STR: string = "Left Eyebrow";
    const FACE_LANDMARKS_FACE_OVAL_STR: string = "Face Oval";
    const FACE_LANDMARKS_LIPS_STR: string = "Lips";
    const FACE_LANDMARKS_RIGHT_IRIS_STR: string = "Right Iris";
    const FACE_LANDMARKS_LEFT_IRIS_STR: string = "Left Iris";
    const FACE_LANDMARKS_POINTS_STR: string = "Face Landmarks";

    const ConnectionIndexes: ConnectionData[] = [
        {
            name: FACE_LANDMARKS_TESSELATION_STR,
            mode: CONNECTION_FACE_LANDMARKS_TESSELATION,
            connection: FaceLandmarker.FACE_LANDMARKS_TESSELATION,
            connectionIndex: [],
            color: "#C0C0C0",
            isLoaded: false,
            isEnabled: true,
        },
        {
            name: FACE_LANDMARKS_CONTOURS_STR,
            mode: CONNECTION_FACE_LANDMARKS_CONTOURS,
            connection: FaceLandmarker.FACE_LANDMARKS_CONTOURS,
            connectionIndex: [],
            color: "#C0C0C0",
            isLoaded: false,
            isEnabled: true,
        },
        {
            name: FACE_LANDMARKS_RIGHT_EYE_STR,
            mode: CONNECTION_FACE_LANDMARKS_RIGHT_EYE,
            connection: FaceLandmarker.FACE_LANDMARKS_RIGHT_EYE,
            connectionIndex: [],
            color: "#FF3030",
            isLoaded: false,
            isEnabled: false,
        },
        {
            name: FACE_LANDMARKS_RIGHT_EYEBROW_STR,
            mode: CONNECTION_FACE_LANDMARKS_RIGHT_EYEBROW,
            connection: FaceLandmarker.FACE_LANDMARKS_RIGHT_EYEBROW,
            connectionIndex: [],
            color: "#FF3030",
            isLoaded: false,
            isEnabled: false,
        },
        {
            name: FACE_LANDMARKS_LEFT_EYE_STR,
            mode: CONNECTION_FACE_LANDMARKS_LEFT_EYE,
            connection: FaceLandmarker.FACE_LANDMARKS_LEFT_EYE,
            connectionIndex: [],
            color: "#30FF30",
            isLoaded: false,
            isEnabled: false,
        },
        {
            name: FACE_LANDMARKS_LEFT_EYEBROW_STR,
            mode: CONNECTION_FACE_LANDMARKS_LEFT_EYEBROW,
            connection: FaceLandmarker.FACE_LANDMARKS_LEFT_EYEBROW,
            connectionIndex: [],
            color: "#30FF30",
            isLoaded: false,
            isEnabled: false,
        },
        {
            name: FACE_LANDMARKS_FACE_OVAL_STR,
            mode: CONNECTION_FACE_LANDMARKS_FACE_OVAL,
            connection: FaceLandmarker.FACE_LANDMARKS_FACE_OVAL,
            connectionIndex: [],
            color: "#E0E0E0",
            isLoaded: false,
            isEnabled: false,
        },
        {
            name: FACE_LANDMARKS_LIPS_STR,
            mode: CONNECTION_FACE_LANDMARKS_LIPS,
            connection: FaceLandmarker.FACE_LANDMARKS_LIPS,
            connectionIndex: [],
            color: "#E0E0E0",
            isLoaded: false,
            isEnabled: false,
        },
        {
            name: FACE_LANDMARKS_RIGHT_IRIS_STR,
            mode: CONNECTION_FACE_LANDMARKS_RIGHT_IRIS,
            connection: FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
            connectionIndex: [],
            color: "#FF3030",
            isLoaded: false,
            isEnabled: false,
        },
        {
            name: FACE_LANDMARKS_LEFT_IRIS_STR,
            mode: CONNECTION_FACE_LANDMARKS_LEFT_IRIS,
            connection: FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
            connectionIndex: [],
            color: "#30FF30",
            isLoaded: false,
            isEnabled: false,
        },
    ];

    let numFaces: number = 1;
    let minFaceDetectionConfidence: number = 0.5;
    let minFacePresenceConfidence: number = 0.5;
    let minTrackingConfidence: number = 0.5;
    let outputFaceBlendShapes: boolean = false;
    let outputFacialTransformationMatrixes: boolean = false;
    let delegate: InterfaceDelegate = DELEGATE_GPU;
    let runningMode: RunningMode = RUNNING_MODE_VIDEO;

    let isUpdating: boolean = false;
    let drawingMode: number = CONNECTION_FACE_LANDMARKS_TESSELATION;

    let faceLandmark: FaceLandmarker | null = null;

    const generateMeshIndexes = async () => {
        ConnectionIndexes.forEach((data: ConnectionData) => {
            if (data.isLoaded) {
                return;
            }

            data.connection.forEach((conn: Connection) => {
                data.connectionIndex.push(conn.start, conn.end);
            });

            data.isLoaded = true;
        });
    };

    const getAvailableMode = (): ConnectionData[] => {
        const result: ConnectionData[] = ConnectionIndexes.filter(
            (data: ConnectionData) => data.isEnabled && data.isLoaded
        );

        result.push({
            name: FACE_LANDMARKS_POINTS_STR,
            mode: CONNECTION_FACE_LANDMARKS_POINTS,
            connection: [],
            connectionIndex: [],
            color: "#C0C0C0",
            isLoaded: true,
            isEnabled: true,
        });

        return result;
    };

    const initModel = async (vision: any): Promise<ModelLoadResult> => {
        const result: ModelLoadResult = {
            modelName: FACE_LANDMARK_DETECTION_STR,
            mode: FACE_LANDMARK_DETECTION_MODE,
            loadResult: false,
        };

        generateMeshIndexes();

        if (faceLandmark) {
            result.loadResult = true;
            return result;
        }

        try {
            if (vision) {
                const config: FaceLandmarkerOptions = getConfig();

                faceLandmark = await FaceLandmarker.createFromOptions(
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

    const getConfig = (): FaceLandmarkerOptions => {
        const config: FaceLandmarkerOptions = {
            baseOptions: {
                modelAssetPath: MODEL_URL,
                delegate: delegate,
            },
            numFaces: numFaces,
            minFaceDetectionConfidence: minFaceDetectionConfidence,
            minFacePresenceConfidence: minFacePresenceConfidence,
            minTrackingConfidence: minTrackingConfidence,
            outputFaceBlendshapes: outputFaceBlendShapes,
            outputFacialTransformationMatrixes:
                outputFacialTransformationMatrixes,
            runningMode: runningMode,
        };

        return config;
    };

    const getRunningMode = (): RunningMode => runningMode;
    const setRunningMode = (mode: RunningMode) => (runningMode = mode);

    const getNumOfFaces = (): number => numFaces;
    const setNumOfFaces = (num: number) => (numFaces = num);

    const getMinFaceDetectionConfidence = (): number =>
        minFaceDetectionConfidence;
    const setMinFaceDetectionConfidence = (num: number) =>
        (minFaceDetectionConfidence = num);

    const getMinFacePresenceConfidence = (): number =>
        minFacePresenceConfidence;
    const setMinFacePresenceConfidence = (num: number) =>
        (minFacePresenceConfidence = num);

    const getMinTrackingConfidence = (): number => minTrackingConfidence;
    const setMinTrackingConfidence = (num: number) =>
        (minTrackingConfidence = num);

    const getOutputFaceBlendShapes = (): boolean => outputFaceBlendShapes;
    const setOutputFaceBlendShapes = (val: boolean) =>
        (outputFaceBlendShapes = val);

    const getOutputFacialTransformationMatrixes = (): boolean =>
        outputFacialTransformationMatrixes;
    const setOutputFacialTransformationMatrixes = (val: boolean) =>
        (outputFacialTransformationMatrixes = val);

    const getInterfaceDelegate = (): InterfaceDelegate => delegate;
    const setInterfaceDelegate = (del: InterfaceDelegate) => (delegate = del);

    const getDrawingMode = (): number => drawingMode;
    const setDrawingMode = (mode: number) => (drawingMode = mode);

    const updateModelConfig = async () => {
        if (faceLandmark) {
            isUpdating = true;
            console.log("interface:", delegate);
            await faceLandmark.setOptions(getConfig());
            isUpdating = false;
        }
    };

    const isModelUpdating = (): boolean => {
        return isUpdating;
    };

    const detectFace = (
        video: HTMLVideoElement
    ): FaceLandmarkerResult | null => {
        if (faceLandmark) {
            try {
                const detection: FaceLandmarkerResult =
                    faceLandmark.detectForVideo(video, performance.now());

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
        results: FaceLandmarkerResult | null | undefined,
        width: number,
        height: number
    ) => {
        if (results) {
            Drawing3d.clearScene();

            const objGroup: Object3D<Object3DEventMap> = new Object3D();
            let model: Object3D<Object3DEventMap> | null = null;

            if (drawingMode === CONNECTION_FACE_LANDMARKS_TESSELATION) {
                model = drawFaceConnection(
                    mirrored,
                    results.faceLandmarks,
                    ConnectionIndexes[CONNECTION_FACE_LANDMARKS_TESSELATION],
                    width,
                    height
                );
            } else if (drawingMode === CONNECTION_FACE_LANDMARKS_CONTOURS) {
                model = drawFaceConnection(
                    mirrored,
                    results.faceLandmarks,
                    ConnectionIndexes[CONNECTION_FACE_LANDMARKS_CONTOURS],
                    width,
                    height
                );
            } else if (drawingMode === CONNECTION_FACE_LANDMARKS_POINTS) {
                model = drawLandmarkPoints(
                    mirrored,
                    results.faceLandmarks,
                    width,
                    height
                );
            }

            if (model) {
                objGroup.add(model);
            }

            Drawing3d.addToScene(objGroup);
            Drawing3d.render();
        }
    };

    const drawLandmarkPoints = (
        mirrored: boolean,
        landmarks: NormalizedLandmark[][],
        width: number,
        height: number
    ): Object3D<Object3DEventMap> | null => {
        if (landmarks) {
            const pointGroups: Object3D<Object3DEventMap> = new Object3D();

            const offsetX: number = width / 2;
            const offsetY: number = height / 2;
            const dist = Drawing3d.calculateDistance(height);

            landmarks.forEach((landmark: NormalizedLandmark[]) => {
                landmark.forEach((data: NormalizedLandmark) => {
                    const circleObjGroup = new Object3D();

                    const x = (width * data.x - offsetX) * (mirrored ? -1 : 1);
                    const y = -height * data.y + offsetY;
                    const scaleFactor =
                        ((dist * data.z) / dist) * -SCALE_FACTOR + BASE_SCALE;

                    const circleGeo = new CircleGeometry(
                        CIRCLE_RADIUS,
                        CIRCLE_SEGMENTS
                    );
                    const circleMat = new MeshBasicMaterial({
                        depthTest: true,
                        depthWrite: true,
                        color: "white",
                        side: DoubleSide,
                    });

                    const circle = new Mesh(circleGeo, circleMat);

                    circleObjGroup.add(circle);
                    circleObjGroup.position.set(x, y, dist);
                    circleObjGroup.scale.set(scaleFactor, scaleFactor, 1);

                    pointGroups.add(circleObjGroup);
                });
            });

            return pointGroups;
        }

        return null;
    };

    const drawFaceConnection = (
        mirrored: boolean,
        landmarks: NormalizedLandmark[][],
        connectionData: ConnectionData,
        width: number,
        height: number
    ): Object3D<Object3DEventMap> | null => {
        if (landmarks) {
            const groups: Object3D<Object3DEventMap> = new Object3D();

            const offsetX: number = width / 2;
            const offsetY: number = height / 2;
            const dist = Drawing3d.calculateDistance(height);

            landmarks.forEach((landmark: NormalizedLandmark[]) => {
                let avgScaleFactor: number = 0;
                const points: Vector3[] = [];

                landmark.forEach((point: NormalizedLandmark) => {
                    const x = (width * point.x - offsetX) * (mirrored ? -1 : 1);
                    const y = -height * point.y + offsetY;
                    const scaleFactor =
                        ((dist * point.z) / dist) * -SCALE_FACTOR + BASE_SCALE;
                    avgScaleFactor += scaleFactor;

                    const vector = new Vector3(x, y, dist);
                    points.push(vector);
                });

                avgScaleFactor /= landmark.length;
                const bufferGeo = new BufferGeometry().setFromPoints(points);
                bufferGeo.setIndex(connectionData.connectionIndex);

                const geo = new LineSegmentsGeometry();
                geo.setPositions(
                    bufferGeo.toNonIndexed().getAttribute("position")
                        .array as Float32Array
                );

                const lineWidth = 0.0075 * avgScaleFactor;

                const material = new LineMaterial({
                    color: connectionData.color,
                    linewidth: lineWidth < 0 ? 0.001 : lineWidth,
                    alphaToCoverage: true,
                    worldUnits: false,
                });

                const lines = new LineSegments2(geo, material);
                groups.add(lines);
            });

            return groups;
        }

        return null;
    };

    return {
        CONNECTION_FACE_LANDMARKS_TESSELATION,
        CONNECTION_FACE_LANDMARKS_CONTOURS,
        CONNECTION_FACE_LANDMARKS_POINTS,
        CONFIG_MIN_DETECTION_CONFIDENCE,
        CONFIG_MAX_DETECTION_CONFIDENCE,
        CONFIG_MIN_PRESENCE_CONFIDENCE,
        CONFIG_MAX_PRESENCE_CONFIDENCE,
        CONFIG_MIN_TRACKING_CONFIDENCE,
        CONFIG_MAX_TRACKING_CONFIDENCE,
        CONFIG_MIN_FACE_NUMBER,
        CONFIG_MAX_FACE_NUMBER,
        CONFIG_DEFAULT_FACE_SLIDER_STEP,
        CONFIG_DEFAULT_CONFIDENCE_SLIDER_STEP,
        initModel,
        getAvailableMode,
        getRunningMode,
        setRunningMode,
        getNumOfFaces,
        setNumOfFaces,
        getMinFaceDetectionConfidence,
        setMinFaceDetectionConfidence,
        getMinFacePresenceConfidence,
        setMinFacePresenceConfidence,
        getMinTrackingConfidence,
        setMinTrackingConfidence,
        getOutputFaceBlendShapes,
        setOutputFaceBlendShapes,
        getOutputFacialTransformationMatrixes,
        setOutputFacialTransformationMatrixes,
        getInterfaceDelegate,
        setInterfaceDelegate,
        getDrawingMode,
        setDrawingMode,
        updateModelConfig,
        isModelUpdating,
        detectFace,
        draw,
    };
})();

export default FaceLandmarkDetection;
