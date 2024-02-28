import { useState } from "react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "../ui/hover-card";
import ModelSettingDialog from "./ModelSettingDialog";

type Props = {
    cameraStatus: number | undefined;
    mode: number;
};

const ModelSetting = (props: Props) => {
    const [isDialogOpen, setDialogOpen] = useState<boolean>(false);

    return (
        <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
                <ModelSettingDialog
                    mode={props.mode}
                    setDialogOpen={setDialogOpen}
                    cameraStatus={props.cameraStatus}
                />
            </HoverCardTrigger>
            <HoverCardContent className="w-80" hidden={isDialogOpen}>
                <div className="flex flex-col justify-between space-x-4">
                    <strong>Model Settings ⚙️</strong>
                    <p>Adjust model parameters</p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default ModelSetting;
