import { Pixel } from './Pixel';

export abstract class PixelBoardBase {
    protected width: number;
    protected height: number;
    public pixels: Pixel[][];

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.pixels = Array.from({ length: height }, () => Array.from({ length: width }, () => new Pixel()));
    }

    public setPixel(x: number, y: number, pixel: Pixel): void {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            this.pixels[y][x] = pixel;
        }
    }

    public getPixel(x: number, y: number): Pixel {
        return this.pixels[y][x];
    }

    public clear(): void {
        this.pixels = Array.from({ length: this.height }, () => Array.from({ length: this.width }, () => new Pixel()));
    }

    public abstract update(delta: number): void;
}
