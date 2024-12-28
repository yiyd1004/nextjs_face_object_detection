export const NO_MODE: number = -1;
export const OBJ_DETECTION_MODE: number = 0;
export const FACE_DETECTION_MODE: number = 1;
export const GESTURE_RECOGNITION_MODE: number = 2;
export const FACE_LANDMARK_DETECTION_MODE: number = 3;

export const CONFIG_SLIDER_STEP: number = 0.2;

export const VISION_URL: string =
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.12/wasm";

export type DelegateMode = "CPU" | "GPU";
export const DELEGATE_GPU: DelegateMode = "GPU";
export const DELEGATE_CPU: DelegateMode = "CPU";

export type RunningMode = "IMAGE" | "VIDEO";
export const RUNNING_MODE_IMAGE: RunningMode = "IMAGE";
export const RUNNING_MODE_VIDEO: RunningMode = "VIDEO";

export const OBJECT_DETECTION_STR: string = "Object Detection";
export const FACE_DETECTION_STR: string = "Face Detection";
export const GESTURE_RECOGNITION_STR: string = "Gesture Recognition";
export const FACE_LANDMARK_DETECTION_STR: string = "Face Landmark Detection";

export const VIDEO_INPUT: string = "videoinput";

export type ModelLoadResult = {
    modelName: string;
    mode: number;
    loadResult: boolean;
};

export const CAMERA_LOAD_STATUS_SUCCESS = 1;
export const CAMERA_LOAD_STATUS_ERROR = 2;
export const CAMERA_LOAD_STATUS_NO_DEVICES = 3;
export type CameraDeviceStatus = {
    status: number | undefined;
    errorMsg: string | undefined;
    errorName: string | undefined;
};

export type CameraDeviceContext = {
    status: CameraDeviceStatus;
    webcamList: MediaDeviceInfo[];
    webcamId: string | undefined;
    setWebcamId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const ERROR_ENABLE_CAMERA_PERMISSION_MSG =
    "Please Enable Camera Permission";
export const ERROR_NO_CAMERA_DEVICE_AVAILABLE_MSG =
    "No Camera Device Available";
