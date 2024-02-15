import { VISION_URL } from "@/utils/definitions";
import { FilesetResolver } from "@mediapipe/tasks-vision";

const initMediaPipVision = async () => {
    return await FilesetResolver.forVisionTasks(VISION_URL);
};

export default initMediaPipVision;
