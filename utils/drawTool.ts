import { Detection, FaceDetectorResult } from "@mediapipe/tasks-vision";
import { DetectedObject } from "@tensorflow-models/coco-ssd";
import { FACE_DETECTION_MODE, OBJ_DETECTION_MODE } from "./definitions";

export const drawOnCanvas = (
    mode: number,
    mirrored: Boolean,
    objPrediction: DetectedObject[] | null | undefined,
    facePrediction: FaceDetectorResult | null | undefined,
    context: CanvasRenderingContext2D | null | undefined
) => {
    if (mode === OBJ_DETECTION_MODE && objPrediction) {
        objPrediction.forEach((detectedObject: DetectedObject) => {
            const { class: name, bbox, score } = detectedObject;
            const [x, y, width, height] = bbox;

            if (context) {
                context.beginPath();

                // box
                context.font = "12px Courier New";
                // context.fillStyle = name === "person" ? "#FF0F0F" : "#00B612";
                context.strokeStyle = name === "person" ? "#FF0F0F" : "#00B612";
                context.lineWidth = 4;
                context.globalAlpha = 1;

                mirrored
                    ? context.roundRect(
                          context.canvas.width - x,
                          y,
                          -width,
                          height
                      )
                    : context.roundRect(x, y, width, height);

                //context.fill();
                context.stroke();

                context.beginPath();
                let textSize = context.measureText(name);
                context.fillStyle = name === "person" ? "#FF0F0F" : "#00B612";
                context.globalAlpha = 1;

                mirrored
                    ? context.roundRect(
                          context.canvas.width - x - width - 2,
                          y - 20,
                          textSize.width + 8,
                          textSize.fontBoundingBoxAscent +
                              textSize.fontBoundingBoxDescent +
                              8
                      )
                    : context.roundRect(
                          x - 2,
                          y - 20,
                          textSize.width + 8,
                          textSize.fontBoundingBoxAscent +
                              textSize.fontBoundingBoxDescent +
                              8
                      );
                context.fill();

                // text
                context.beginPath();
                context.font = "12px Courier New";
                context.fillStyle = "white";
                context.globalAlpha = 1;

                mirrored
                    ? context.fillText(
                          name,
                          context.canvas.width - x - width + 2,
                          y - 7
                      )
                    : context.fillText(name, x + 2, y - 7);
            }
        });
    } else if (mode === FACE_DETECTION_MODE && facePrediction) {
        facePrediction.detections.forEach((detection: Detection) => {
            const { boundingBox } = detection;

            if (context && boundingBox) {
                context.beginPath();

                // box
                context.font = "12px Courier New";
                context.strokeStyle = "#FF0F0F";
                context.lineWidth = 4;
                context.globalAlpha = 1;

                mirrored
                    ? context.roundRect(
                          context.canvas.width - boundingBox.originX,
                          boundingBox.originY,
                          -boundingBox.width,
                          boundingBox.height
                      )
                    : context.roundRect(
                          boundingBox.originX,
                          boundingBox.originY,
                          boundingBox.width,
                          boundingBox.height
                      );

                //context.fill();
                context.stroke();
            }
        });
    }
};
