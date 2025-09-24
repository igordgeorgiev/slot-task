import "./style.css";
import { Application, Assets, AssetsManifest, EventEmitter } from "pixi.js";
import { Slot } from "./views/Slot";

export const gameWidth = 1280;
export const gameHeight = 720;

export const dispatcher = new EventEmitter();

console.log(
    `%cPixiJS V8\nTypescript Boilerplate%c ${VERSION} %chttp://www.pixijs.com %c❤️`,
    "background: #ff66a1; color: #FFFFFF; padding: 2px 4px; border-radius: 2px; font-weight: bold;",
    "color: #D81B60; font-weight: bold;",
    "color: #C2185B; font-weight: bold; text-decoration: underline;",
    //     "color: #ff66a1;",
);

(async () => {
    const app = new Application();

    //await window load
    await new Promise((resolve) => {
        window.addEventListener("load", resolve);
    });

    await app.init({ backgroundColor: 0xd3d3d3, width: gameWidth, height: gameHeight });

    await loadGameAssets();

    async function loadGameAssets(): Promise<void> {
        const manifest = {
            bundles: [
                { name: "sheet", assets: [{ alias: "bird", src: "./assets/sheet.json" }] },
            ],
        } satisfies AssetsManifest;

        await Assets.init({ manifest });
        await Assets.loadBundle(["sheet"]);

        document.body.appendChild(app.canvas);

        window.onresize = ()=> resizeCanvas();
        resizeCanvas();

        const slot = new Slot();
        app.stage.addChild(slot);
    }

    function resizeCanvas(): void {
        const scaleFactor = Math.min(
            window.innerWidth / gameWidth,
            window.innerHeight / gameHeight
        );

        const newWidth = Math.ceil(gameWidth * scaleFactor);
        let newHeight = Math.ceil(gameHeight * scaleFactor);

        if (window.innerHeight > window.innerWidth) {
            newHeight = newWidth;
        }

        console.log("Resizing to w:" + newWidth + " h:" + newHeight);


        app.renderer.resize(newWidth, newHeight);
        app.stage.scale.set(scaleFactor);
    }
})();
