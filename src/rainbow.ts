import { Application } from "pixi.js";
import { PixelBoard } from "./PixelBoard/PixelBoard";
import { PIXIRenderer } from "./PixelBoard/PIXIRenderer";
import { AdvancedBloomFilter } from "pixi-filters";
import { RainbowWaveEffect } from "./PixelBoard/WaveEffect";

const rainbowEffectContainerElement = document.getElementById("rainbow-effect-container")!;
const app = new Application();
await app.init({ backgroundAlpha: 0, height: 900, width: 800 });
rainbowEffectContainerElement.appendChild(app.canvas);

app.stage.filters = new AdvancedBloomFilter({ threshold: 0.5, bloomScale: 1, brightness: 1, blur: 3, quality: 10 });

const pixelboard = new PixelBoard(14, 28, new PIXIRenderer());

pixelboard.registerEffect(new RainbowWaveEffect(pixelboard.pixels, 0.5));

app.stage.addChild(pixelboard.renderer as PIXIRenderer);

(pixelboard.renderer as PIXIRenderer).x = (app.screen.width - (pixelboard.renderer as PIXIRenderer).width) / 2;
(pixelboard.renderer as PIXIRenderer).y = (app.screen.height - (pixelboard.renderer as PIXIRenderer).height) / 2;

app.ticker.minFPS = 60;
app.ticker.add((ticker) => {
    pixelboard.update(ticker.deltaTime);
});