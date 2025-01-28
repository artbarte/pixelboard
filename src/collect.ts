import { Application } from "pixi.js";
import { PixelBoard } from "./PixelBoard/PixelBoard";
import { PIXIRenderer } from "./PixelBoard/PIXIRenderer";
import { AdvancedBloomFilter } from "pixi-filters";
import { CollectEffect } from "./PixelBoard/CollectEffect";
import { CollectInfo } from "./PixelBoard/CollectInfo";
(async () => {
    const collectScoreElement = document.getElementById("collect-score")!;

    const collectEffectContainerElement = document.getElementById("collect-effect-container")!;
    const app = new Application();

    await app.init({ backgroundAlpha: 0, height: 900, width: 800 });
    collectEffectContainerElement.appendChild(app.canvas);

    app.stage.filters = new AdvancedBloomFilter({ threshold: 0.5, bloomScale: 1, brightness: 1, blur: 3, quality: 10 });

    const pixelboard = new PixelBoard(14, 28, new PIXIRenderer());
    pixelboard.registerEffect(new CollectEffect(pixelboard.pixels, 10, new CollectInfo(collectScoreElement)));

    app.stage.addChild(pixelboard.renderer as PIXIRenderer);

    // Center the pixelboard
    (pixelboard.renderer as PIXIRenderer).x = (app.screen.width - (pixelboard.renderer as PIXIRenderer).width) / 2;
    (pixelboard.renderer as PIXIRenderer).y = (app.screen.height - (pixelboard.renderer as PIXIRenderer).height) / 2;

    app.ticker.add((ticker) => {
        pixelboard.update(ticker.deltaTime);
    });

})()