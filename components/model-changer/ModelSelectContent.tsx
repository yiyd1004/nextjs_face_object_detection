import {
    CAMERA_LOAD_STATUS_SUCCESS,
    ModelLoadResult,
} from "@/utils/definitions";
import { Dispatch, SetStateAction } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

type Props = {
    cameraStatus: number | undefined;
    modelList: ModelLoadResult[] | undefined;
    currentMode: string;
    onModeChange: ((value: string) => void) | undefined;
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
};

const ModelSelectContent = (props: Props) => {
    const onOpenChange = (open: boolean) => {
        props.setDialogOpen(open);
    };

    return (
        <Select
            value={props.currentMode}
            onValueChange={props.onModeChange}
            onOpenChange={onOpenChange}
            disabled={props.cameraStatus !== CAMERA_LOAD_STATUS_SUCCESS}
        >
            <SelectTrigger className="w-[180px] text-start">
                <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent className="text-start">
                {props.modelList && props.modelList.length > 0 ? (
                    props.modelList.map((model, index) => {
                        if (model.loadResult) {
                            return (
                                <SelectItem
                                    key={index}
                                    value={model.mode.toString()}
                                >
                                    {model.modelName}
                                </SelectItem>
                            );
                        }
                    })
                ) : (
                    <SelectItem value={props.currentMode}>
                        Models not loaded
                    </SelectItem>
                )}
            </SelectContent>
        </Select>
    );
};

export default ModelSelectContent;
