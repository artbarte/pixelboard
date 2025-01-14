import * as PIXI from 'pixi.js';
import { IPixelRenderer } from './IPixelRenderer';
import { Pixel } from './Pixel';

export class PIXIRenderer extends PIXI.Container implements IPixelRenderer {
    private app!: PIXI.Application;

    private PIXEL_SIZE = 25
    private PIXEL_PADDING = 5

    public init(pixels: Pixel[][]): void {
        pixels.forEach((row, y) => {
            row.forEach((pixel, x) => {
                const graphics = new PIXI.Graphics()
                    .rect(x * (this.PIXEL_PADDING + this.PIXEL_SIZE), y * (this.PIXEL_PADDING + this.PIXEL_SIZE), this.PIXEL_SIZE, this.PIXEL_SIZE)
                    .fill(pixel.color.toNumber())

                graphics.alpha = pixel.brightness;
                graphics.cursor = 'pointer';
                graphics.interactive = true;
                graphics.on('pointerdown', () => {
                    pixel.pressed = true;
                });
                graphics.on('pointerup', () => {
                    pixel.pressed = false;
                });
                graphics.on('pointerout', () => {
                    pixel.pressed = false;
                });

                this.addChild(graphics);
            });
        });

    }

    public render(pixels: Pixel[][]): void {
        this.children.forEach((child, index) => {
            const x = index % pixels[0].length;
            const y = Math.floor(index / pixels[0].length);
            const pixel = pixels[y][x];

            (child as PIXI.Graphics).clear()
                .rect(x * (this.PIXEL_PADDING + this.PIXEL_SIZE), y * (this.PIXEL_PADDING + this.PIXEL_SIZE), this.PIXEL_SIZE, this.PIXEL_SIZE)
                .fill(pixel.color.toNumber());

            (child as PIXI.Graphics).alpha = pixel.brightness;
        });
    }

    public clear(): void {
    }

    public destroy(): void {
        this.app.destroy(true, { children: true });
    }
}
