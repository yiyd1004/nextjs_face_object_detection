import { ModelLoadResult } from "@/utils/definitions";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

type Props = {
    modelList: ModelLoadResult[] | undefined;
    currentMode: string;
    onModeChange: ((value: string) => void) | undefined;
};

const ModelSelect = (props: Props) => {
    return (
        <Select value={props.currentMode} onValueChange={props.onModeChange}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
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

export default ModelSelect;
