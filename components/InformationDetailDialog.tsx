import { Info } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

type Props = {
    setDialogOpen: Dispatch<SetStateAction<boolean>>;
};

const InformationDetailDialog = (props: Props) => {
    const onOpenChange = (open: boolean) => {
        props.setDialogOpen(open);
    };

    return (
        <Dialog onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button variant={"outline"} size={"icon"}>
                    <Info />
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>
                        Real-time Webcam Object Detection with MediaPipe
                    </DialogTitle>
                    <DialogDescription>
                        <div className="mt-4">
                            AI powered object detection web application built
                            with Next.js and MediaPipe ML solutions.
                        </div>
                        <div className="grid grid-cols-2 grid-flow-row-dense gap-4 mt-4">
                            <div className="col-span-1">
                                Web Framework/Library:{" "}
                            </div>
                            <div>
                                Next.js Ver. 14.1
                                <br />
                                Three.js Ver. 0.161.0
                            </div>
                            <div>MediaPipe Vision Tasks: </div>
                            <div>Ver. 0.10.10</div>
                            <div>MediaPipe Vision Models: </div>
                            <div>
                                Object Detection
                                <br />
                                Face Detection
                                <br />
                                Gesture Recognition
                                <br />
                                Face Landmark Detection
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter></DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InformationDetailDialog;
