"use client";

import FaceDetection from "@/mediapipe/face-detection";
import FaceLandmarkDetection from "@/mediapipe/face-landmark";
import GestureRecognition from "@/mediapipe/gesture-recognition";
import ObjectDetection from "@/mediapipe/object-detection";
import {
    CAMERA_LOAD_STATUS_SUCCESS,
    FACE_DETECTION_MODE,
    FACE_LANDMARK_DETECTION_MODE,
    GESTURE_RECOGNITION_MODE,
    OBJ_DETECTION_MODE,
} from "@/utils/definitions";
import { DialogClose } from "@radix-ui/react-dialog";
import { Settings } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import CameraSelect from "./CameraSelect";
import FaceLandmarkSetting from "./FaceLandmarkSetting";
import FaceModelSetting from "./FaceModelSetting";
import GestureModelSetting from "./GestureModelSetting";
import InterfaceDelegate from "./InterfaceDelegate";
import ObjectModelSetting from "./ObjectModelSetting";

type Props = {
    cameraStatus: number | undefined;
    mode: number;
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
};

const ModelSettingDialog = (props: Props) => {
    const onOpenChange = (open: boolean) => {
        props.setDialogOpen(open);
    };

    const updateModel = () => {
        switch (props.mode) {
            case OBJ_DETECTION_MODE:
                ObjectDetection.updateModelConfig();
                break;
            case FACE_DETECTION_MODE:
                FaceDetection.updateModelConfig();
                break;
            case GESTURE_RECOGNITION_MODE:
                GestureRecognition.updateModelConfig();
                break;
            case FACE_LANDMARK_DETECTION_MODE:
                FaceLandmarkDetection.updateModelConfig();
                break;
        }
    };

    return (
        <Dialog onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button
                    variant={"outline"}
                    size={"icon"}
                    disabled={props.cameraStatus !== CAMERA_LOAD_STATUS_SUCCESS}
                >
                    <Settings />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Settings</DialogTitle>
                    <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-4 py-4">
                    <div className="flex w-full items-center gap-4 pb-4">
                        <span className="text-left">Camera:</span>
                        <CameraSelect />
                    </div>
                    <div className="flex w-full items-center gap-4 pb-4">
                        <span className="text-left">Inference delegate:</span>
                        <InterfaceDelegate mode={props.mode} />
                    </div>
                    {props.mode === OBJ_DETECTION_MODE && (
                        <ObjectModelSetting />
                    )}
                    {props.mode === FACE_DETECTION_MODE && <FaceModelSetting />}
                    {props.mode === GESTURE_RECOGNITION_MODE && (
                        <GestureModelSetting />
                    )}
                    {props.mode === FACE_LANDMARK_DETECTION_MODE && (
                        <FaceLandmarkSetting />
                    )}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="submit" onClick={updateModel}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default ModelSettingDialog;
