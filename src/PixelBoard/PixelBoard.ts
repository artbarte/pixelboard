import { PixelBoardBase } from './PixelBoardBase';
import { IInputHandler, IPixelRenderer, PixelEffect } from './IPixelRenderer';

export function randint(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


export class PixelBoard extends PixelBoardBase {
    public renderer: IPixelRenderer;
    private inputHandlers: IInputHandler[] = [];
    private effects: PixelEffect[] = [];
    private previousPresses: boolean[][] = [];

    constructor(width: number, height: number, renderer: IPixelRenderer) {
        super(width, height);
        this.renderer = renderer;
        this.renderer.init(this.pixels);
        this.previousPresses = Array.from({ length: height }, () => Array.from({ length: width }, () => false));
    }

    public update(delta: number): void {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.pixels[y][x].pressed && !this.previousPresses[y][x]) {
                    this.previousPresses[y][x] = true;
                    this.inputHandlers.forEach(handler => handler(x, y));
                    console.log("Pressed", x, y);
                } else if (!this.pixels[y][x].pressed && this.previousPresses[y][x]) {
                    this.previousPresses[y][x] = false;
                }
            }
        }
        this.effects.forEach(effect => effect.update(delta));

        this.renderer.render(this.pixels);
    }

    public destroy(): void {
        this.renderer.destroy();
    }

    public registerinputHandler(handler: IInputHandler): void {
        this.inputHandlers.push(handler);
    }

    public unregisterInputHandler(handler: IInputHandler): void {
        const index = this.inputHandlers.indexOf(handler);
        if (index > -1) {
            this.inputHandlers.splice(index, 1);
        }
    }

    public registerEffect(effect: PixelEffect): void {
        this.effects.push(effect);
        this.registerinputHandler(effect.handleInput.bind(effect));
    }

    public unregisterEffect(effect: PixelEffect): void {
        const index = this.effects.indexOf(effect);
        if (index > -1) {
            this.effects.splice(index, 1);
        }
    }


}