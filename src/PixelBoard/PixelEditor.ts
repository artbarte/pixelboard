import { Pixel } from "./Pixel";
import { Color } from "pixi.js";
import { IPixelRenderer } from "./IPixelRenderer";
import { PixelBoard } from "./PixelBoard";
import { normalizeSparseArray } from "../util/normalizeSparseArray";

export class PixelObject {
    x: number;
    y: number;
    objectPixels: Pixel[][];

    constructor(objectPixels: Pixel[][], x: number = 0, y: number = 0) {
        this.objectPixels = objectPixels;
        this.x = x;
        this.y = y;
    }
}

export class PixelBoardEditor extends PixelBoard {
    private selectedColor: Color = new Color(0xFF0000); // Default color for new pixels
    private currentObjectPixels: Pixel[][] | null = null;
    private currentObjectX: number = 0;
    private currentObjectY: number = 0;
    private isEditing: boolean = false;
    private selectedObject: PixelObject | null = null;
    private offsetX: number = 0;
    private offsetY: number = 0;
    private PIXEL_SIZE = 25;
    private PIXEL_PADDING = 5;

    // temporary public for testing
    public pixelObjects: PixelObject[] = [];

    constructor(width: number, height: number, renderer: IPixelRenderer) {
        super(width, height, renderer);
        this.registerinputHandler(this.handleInput.bind(this));
    }

    public setSelectedColor(color: Color): void {
        this.selectedColor = color;
    }

    public addPixelObject(pixelObject: PixelObject): void {
        this.pixelObjects.push(pixelObject);
    }

    public startNewObject(x: number, y: number): void {
        if (!this.isEditing) {
            const { boardX, boardY } = this.canvasToBoardCoordinates(x, y);
            this.currentObjectPixels = [];
            this.currentObjectX = boardX;
            this.currentObjectY = boardY;
            this.isEditing = true;
        }
    }

    public finishNewObject(): void {
        if (this.isEditing && this.currentObjectPixels) {
            // Normalize the coordinates
            const normalizedPixels = normalizeSparseArray(this.currentObjectPixels);

            const pixelObject = new PixelObject(normalizedPixels, this.currentObjectX, this.currentObjectY);
            this.addPixelObject(pixelObject);
            this.currentObjectPixels = null;
            this.isEditing = false;

            // Clear the board
            this.clear();

            // Render the existing objects
        }
    }

    private handleInput(x: number, y: number): void {
        if (!this.isEditing) {
            return;
        }

        console.log("Placing pixel at", x, y);
        const pixel = new Pixel(this.selectedColor);
        this.setPixel(x, y, pixel);

        if (this.currentObjectPixels) {
            const relativeX = x - this.currentObjectX;
            const relativeY = y - this.currentObjectY;

            if (!this.currentObjectPixels[relativeY]) {
                this.currentObjectPixels[relativeY] = [];
            }

            this.currentObjectPixels[relativeY][relativeX] = pixel;
        }
    }



    public update(delta: number): void {
        super.update(delta);
        this.renderPixelObjects();
    }

    private renderPixelObjects(): void {
        for (const pixelObject of this.pixelObjects) {
            for (let y = 0; y < pixelObject.objectPixels.length; y++) {
                for (let x = 0; x < pixelObject.objectPixels[y].length; x++) {
                    const pixel = pixelObject.objectPixels[y][x];
                    if (pixel) {
                        this.setPixel(pixelObject.x + x, pixelObject.y + y, pixel);
                    }
                }
            }
        }
    }


    public isCurrentlyEditing(): boolean {
        return this.isEditing;
    }

    public selectObject(x: number, y: number): void {
        const { boardX, boardY } = this.canvasToBoardCoordinates(x, y);
        for (const obj of this.pixelObjects) {
            if (boardX >= obj.x && boardX < obj.x + obj.objectPixels[0].length &&
                boardY >= obj.y && boardY < obj.y + obj.objectPixels.length) {
                this.selectedObject = obj;
                this.offsetX = boardX - obj.x;
                this.offsetY = boardY - obj.y;
                break;
            }
        }
    }

    public moveSelectedObject(x: number, y: number): void {
        const { boardX, boardY } = this.canvasToBoardCoordinates(x, y);
        if (this.selectedObject) {
            this.selectedObject.x = boardX - this.offsetX;
            this.selectedObject.y = boardY - this.offsetY;
        }
    }

    public deselectObject(): void {
        this.selectedObject = null;
    }

    private canvasToBoardCoordinates(x: number, y: number): { boardX: number, boardY: number } {
        const boardX = Math.floor(x / (this.PIXEL_SIZE + this.PIXEL_PADDING));
        const boardY = Math.floor(y / (this.PIXEL_SIZE + this.PIXEL_PADDING));
        return { boardX, boardY };
    }
}