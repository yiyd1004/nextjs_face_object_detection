import { BoundingBox } from "@mediapipe/tasks-vision";
import * as THREE from "three";
import {
    CanvasTexture,
    Object3D,
    OrthographicCamera,
    Scene,
    WebGLRenderer,
} from "three";

const Drawing3d = (() => {
    let scene: Scene;
    let camera: OrthographicCamera;
    let renderer: WebGLRenderer;
    let isSceneInit: boolean = false;
    let isRendererInit: boolean = false;

    const initScene = (width: number, height: number) => {
        if (isSceneInit) {
            return;
        }

        scene = new THREE.Scene();
        camera = new THREE.OrthographicCamera(
            width / -2,
            width / 2,
            height / 2,
            height / -2,
            0,
            10
        );
        camera.position.set(0, 0, 0);
        isSceneInit = true;
    };

    const isSceneInitialized = (): boolean => {
        return isSceneInit;
    };

    const isRendererInitialized = (): boolean => {
        return isRendererInit;
    };

    const resizeCamera = (width: number, height: number) => {
        if (isSceneInit && isRendererInit) {
            camera.left = width / -2;
            camera.right = width / 2;
            camera.top = height / 2;
            camera.bottom = height / -2;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height, false);
        }
    };

    const getCameraLeft = (): number => {
        if (isSceneInit && isRendererInit) {
            return camera.left;
        }

        return -1;
    };

    const getCameraRight = (): number => {
        if (isSceneInit && isRendererInit) {
            return camera.right;
        }

        return -1;
    };

    const getCameraTop = (): number => {
        if (isSceneInit && isRendererInit) {
            return camera.top;
        }

        return -1;
    };

    const getCameraBottom = (): number => {
        if (isSceneInit && isRendererInit) {
            return camera.bottom;
        }

        return -1;
    };

    const initRenderer = (cv: HTMLCanvasElement) => {
        if (isRendererInit) {
            console.log("return");
            return;
        }
        console.log("initRenderer");
        renderer = new THREE.WebGLRenderer({
            canvas: cv,
            alpha: true,
            antialias: true,
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
            ctx.fillStyle = category === "person" ? "#FF0F0F" : "#00B612";
            ctx.globalAlpha = 1;

            mirrored
                ? ctx.roundRect(
                      canvasWidth - box.originX - box.width - 2,
                      box.originY - 20,
                      textSize.width + 8,
                      textSize.fontBoundingBoxAscent +
                          textSize.fontBoundingBoxDescent +
                          8
                  )
                : ctx.roundRect(
                      box.originX - 2,
                      box.originY - 20,
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
                      box.originY - 7
                  )
                : ctx.fillText(name, box.originX + 2, box.originY - 7);

            const texture: CanvasTexture = new THREE.CanvasTexture(canvas);
            texture.minFilter = THREE.LinearFilter;
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
        initScene,
        isSceneInitialized,
        initRenderer,
        isRendererInitialized,
        resizeCamera,
        getCameraLeft,
        getCameraRight,
        getCameraTop,
        getCameraBottom,
        createLabel,
        addToScene,
        clearScene,
        render,
        test,
        test2,
    };
})();

export default Drawing3d;
