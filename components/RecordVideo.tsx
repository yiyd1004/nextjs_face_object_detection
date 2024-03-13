import { Video } from "lucide-react";
import { Button } from "./ui/button";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";

type Props = {
    isRecording: boolean;
    recordVideo: () => void | undefined;
};

const RecordVideo = (props: Props) => {
    return (
        <HoverCard openDelay={0} closeDelay={0}>
            <HoverCardTrigger>
                <Button
                    variant={props.isRecording ? "destructive" : "outline"}
                    size={"icon"}
                    onClick={props.recordVideo}
                    disabled={true}
                >
                    <Video />
                </Button>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
                <div className="flex flex-col justify-between space-x-4">
                    <strong>Manual Video Recording 📽️</strong>
                    <p>Manually record video clips as needed.</p>
                </div>
            </HoverCardContent>
        </HoverCard>
    );
};

export default RecordVideo;
