import { Color } from "pixi.js";

export class Pixel {
    color: Color;
    brightness: number;
    pressed: boolean;

    constructor(color: Color = new Color(0xffffff), brightness: number = 0.2) {
        this.color = color;
        this.brightness = brightness;
        this.pressed = false;
    }

    public setColor(color: Color, brightness: number = 1): void {
        this.color = color;
        this.brightness = brightness;
    }
}
