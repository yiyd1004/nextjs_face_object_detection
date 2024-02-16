import ObjectDetection from "@/mediapipe/object-detection";
import { OBJ_DETECTION_MODE } from "@/utils/definitions";
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
import ObjectModelSetting from "./ObjectModelSetting";

type Props = {
    mode: number;
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
};

const ModelSettingDialog = (props: Props) => {
    const onOpenChange = (open: boolean) => {
        props.setDialogOpen(open);
    };

    const updateModel = () => {
        if (props.mode === OBJ_DETECTION_MODE) {
            ObjectDetection.updateModelConfig();
        }
    };

    return (
        <Dialog onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"outline"} size={"icon"}>
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
                    {props.mode === OBJ_DETECTION_MODE && (
                        <ObjectModelSetting />
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
