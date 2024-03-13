import { BoundingBox } from "@mediapipe/tasks-vision";
import * as THREE from "three";
import {
    CanvasTexture,
    Object3D,
    PerspectiveCamera,
    Scene,
    WebGLRenderer,
} from "three";

const Drawing3d = (() => {
    const CAMERA_MAX_DEPTH: number = 1000;

    let scene: Scene;
    let camera: PerspectiveCamera;
    let renderer: WebGLRenderer;
    let isSceneInit: boolean = false;
    let isRendererInit: boolean = false;

    const initScene = (width: number, height: number) => {
        if (isSceneInit) {
            return;
        }

        scene = new THREE.Scene();

        const diag = Math.sqrt(height * height + width * width);
        const fov =
            2 * Math.atan(diag / (2 * CAMERA_MAX_DEPTH)) * (180 / Math.PI);

        camera = new THREE.PerspectiveCamera(
            fov,
            width / height,
            0.1,
            CAMERA_MAX_DEPTH
        );

        camera.position.set(0, 0, CAMERA_MAX_DEPTH);
        isSceneInit = true;
    };

    const isSceneInitialized = (): boolean => {
        return isSceneInit;
    };

    const isRendererInitialized = (): boolean => {
        return isRendererInit;
    };

    const getCameraPosition = (): THREE.Vector3 | null => {
        if (isSceneInit && isRendererInit) {
            return camera.position;
        }

        return null;
    };

    const resizeCamera = (width: number, height: number) => {
        if (isSceneInit && isRendererInit) {
            const diag = Math.sqrt(height * height + width * width);
            const fov =
                2 * Math.atan(diag / (2 * CAMERA_MAX_DEPTH)) * (180 / Math.PI);

            camera.aspect = width / height;
            camera.fov = fov;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        }
    };

    const getVisibleSize = () => {
        var vFOV = THREE.MathUtils.degToRad(camera.fov); // convert vertical fov to radians

        var height = 2 * Math.tan(vFOV / 2) * CAMERA_MAX_DEPTH; // visible height

        var width = height * camera.aspect;

        return [width, height];
    };

    const calculateDistance = (height: number): number => {
        const vFOV = THREE.MathUtils.degToRad(camera.fov); // convert vertical fov to radians

        const dist = height / (2 * Math.tan(vFOV / 2));

        return CAMERA_MAX_DEPTH - dist;
    };

    const initRenderer = (cv: HTMLCanvasElement) => {
        if (isRendererInit) {
            return;
        }

        renderer = new THREE.WebGLRenderer({
            canvas: cv,
            alpha: true,
            antialias: true,
            logarithmicDepthBuffer: true,
        });
        renderer.setPixelRatio(window.devicePixelRatio);

        isRendererInit = true;
    };

    const clearScene = () => {
        if (isSceneInit) {
            scene.clear();
        }
    };

    const addToScene = (object: Object3D) => {
        if (isSceneInit && isRendererInit) {
            scene.add(object);
        }
    };

    const render = () => {
        if (isSceneInit && isRendererInit) {
            renderer.render(scene, camera);
        }
    };

    const createLabel = (
        category: string,
        score: number,
        color: string,
        canvasWidth: number,
        canvasHeight: number,
        mirrored: boolean,
        box: BoundingBox
    ): Object3D | null => {
        const name = `${category} ${(score * 100).toFixed(0)}%`;

        const canvas = document.createElement("canvas");
        canvas.className = "absolute top-0 left-0 h-full w-full object-contain";
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const ctx: CanvasRenderingContext2D | null | undefined =
            canvas.getContext("2d");
        if (ctx) {
            ctx.font = "12px Courier New";

            // Textbox
            ctx.beginPath();
            const name = `${category} ${(score * 100).toFixed(0)}%`;
            const textSize = ctx.measureText(name);
            ctx.fillStyle = color;
            ctx.globalAlpha = 1;

            mirrored
                ? ctx.roundRect(
                      canvasWidth - box.originX - box.width - 2,
                      box.originY - 2,
                      textSize.width + 8,
                      textSize.fontBoundingBoxAscent +
                          textSize.fontBoundingBoxDescent +
                          8
                  )
                : ctx.roundRect(
                      box.originX - 2,
                      box.originY - 2,
                      textSize.width + 8,
                      textSize.fontBoundingBoxAscent +
                          textSize.fontBoundingBoxDescent +
                          8
                  );
            ctx.fill();

            // text
            ctx.beginPath();

            ctx.fillStyle = "white";
            ctx.globalAlpha = 1;

            mirrored
                ? ctx.fillText(
                      name,
                      canvasWidth - box.originX - box.width + 2,
                      box.originY +
                          textSize.fontBoundingBoxAscent +
                          textSize.fontBoundingBoxDescent
                  )
                : ctx.fillText(
                      name,
                      box.originX + 2,
                      box.originY +
                          textSize.fontBoundingBoxAscent +
                          textSize.fontBoundingBoxDescent
                  );

            const texture: CanvasTexture = new THREE.CanvasTexture(canvas);
            texture.colorSpace = THREE.SRGBColorSpace;
            const labelMaterial = new THREE.MeshBasicMaterial({
                map: texture,
                side: THREE.DoubleSide,
                transparent: true,
            });
            const plane = new THREE.PlaneGeometry(canvasWidth, canvasHeight);
            const label = new THREE.Mesh(plane, labelMaterial);

            return label;
        }

        return null;
    };

    const test = () => {
        //console.log("test");
        //scene.clear();

        const shape = new THREE.Shape();
        shape.moveTo(-320, -10);
        shape.lineTo(-320, -10);
        shape.lineTo(10, -10);
        shape.lineTo(10, 10);
        shape.lineTo(-320, 10);

        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.LineBasicMaterial({ color: "#ff0000" });
        const cube = new THREE.Line(geometry, material);
        scene.add(cube);
    };

    const test2 = () => {
        //
    };

    return {
        CAMERA_MAX_DEPTH,
        initScene,
        isSceneInitialized,
        initRenderer,
        isRendererInitialized,
        resizeCamera,
        getVisibleSize,
        calculateDistance,
        getCameraPosition,
        createLabel,
        addToScene,
        clearScene,
        render,
        test,
        test2,
    };
})();

export default Drawing3d;
