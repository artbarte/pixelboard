import { Pixel } from "./Pixel";

export interface IPixelRenderer {
    init(pixels: Pixel[][]): void;
    render(pixels: Pixel[][]): void;
    clear(): void;
    destroy(): void;
}


export type IInputHandler = (x: number, y: number) => void;



export abstract class PixelEffect {
    pixels: Pixel[][];

    constructor(pixels: Pixel[][],) {
        this.pixels = pixels;
    }

    public abstract handleInput(x: number, y: number): void;
    public abstract update(delta: number): void;
}