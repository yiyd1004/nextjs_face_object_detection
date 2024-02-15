export const NO_MODE: number = -1;
export const OBJ_DETECTION_MODE: number = 0;
export const FACE_DETECTION_MODE: number = 1;
export const GESTURE_RECOGNITION_MODE: number = 2;

export const VISION_URL: string =
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm";

export const DELEGATE_GPU: "CPU" | "GPU" | undefined = "GPU";
export const DELEGATE_CPU: "CPU" | "GPU" | undefined = "CPU";

export type RunningMode = "IMAGE" | "VIDEO";
export const RUNNING_MODE_IMAGE: RunningMode = "IMAGE";
export const RUNNING_MODE_VIDEO: RunningMode = "VIDEO";

export const OBJECT_DETECTION_STR: string = "Object Detection";
export const FACE_DETECTION_STR: string = "Face Detection";
export const GESTURE_RECOGNITION_STR: string = "Gesture Recognition";

export type ModelLoadResult = {
    modelName: string;
    mode: number;
    loadResult: boolean;
};
