import { Color } from "pixi.js";
import { PixelEffect } from "./IPixelRenderer";
import { Pixel } from "./Pixel";



export class RainbowWaveEffect extends PixelEffect {
    private waveCenter: { x: number, y: number } | null = null;
    private waveRadius: number = 0;
    private waveSpeed: number;
    private hueOffset: number = 0; // Random starting color

    constructor(pixels: Pixel[][], waveSpeed: number = 5) {
        super(pixels);
        this.waveSpeed = waveSpeed;
    }

    public startWave(x: number, y: number): void {
        this.waveCenter = { x, y };
        this.waveRadius = 0;
        this.hueOffset = Math.random() * 360; // Randomize the starting hue
    }

    public update(delta: number): void {
        if (this.waveCenter) {
            this.waveRadius += this.waveSpeed * delta;

            for (let y = 0; y < this.pixels.length; y++) {
                for (let x = 0; x < this.pixels[y].length; x++) {
                    const dx = x - this.waveCenter.x;
                    const dy = y - this.waveCenter.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < this.waveRadius && distance > this.waveRadius - this.waveSpeed) {
                        // Amplify the hue change for a more dramatic effect
                        const dramaticHueFactor = 10; // Increase this for more dramatic changes
                        const hue = (this.hueOffset + distance * dramaticHueFactor) % 360; // Apply random hue offset
                        const color = new Color({
                            h: hue,       // Hue in degrees (0-360)
                            s: 100,       // Saturation in percentage
                            l: 50,        // Lightness in percentage
                            a: 1          // Alpha channel (opacity)
                        });

                        this.pixels[y][x].setColor(color);
                    }
                }
            }
        }
    }

    public handleInput(x: number, y: number): void {
        console.log("Starting wave at", x, y);
        this.startWave(x, y);
    }
}
