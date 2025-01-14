import { Color } from "pixi.js";
import { PixelEffect } from "./IPixelRenderer";
import { Pixel } from "./Pixel";
import { CollectInfo } from "./CollectInfo";

export class CollectEffect extends PixelEffect {

    moneyCollected: number = 0;
    coinsPositions: { x: number, y: number, collected: boolean }[] = [];

    collectInfo: CollectInfo;

    constructor(pixels: Pixel[][], coinsAmount: number = 5, collectInfo: CollectInfo) {
        super(pixels);

        this.collectInfo = collectInfo;

        for (let i = 0; i < coinsAmount; i++) {
            const x = Math.floor(Math.random() * pixels[0].length);
            const y = Math.floor(Math.random() * pixels.length);

            const color = new Color("#ffff00");

            pixels[y][x].setColor(color, 1);

            this.coinsPositions.push({ x, y, collected: false });
        }
    }


    public update(): void {
        for (let i = 0; i < this.coinsPositions.length; i++) {
            const coin = this.coinsPositions[i];

            if (coin.collected) {
                this.pixels[coin.y][coin.x].setColor(new Color("#000000"));
            }
        }
    }

    public handleInput(x: number, y: number): void {
        console.log("Checking for coin at", x, y);

        for (let i = 0; i < this.coinsPositions.length; i++) {
            const coin = this.coinsPositions[i];

            if (coin.x === x && coin.y === y) {
                console.log("Coin collected at", x, y);
                this.moneyCollected++;
                this.coinsPositions[i].collected = true;
                this.collectInfo.updateScore(this.moneyCollected);

                if (this.coinsPositions.filter(({ collected }) => !collected).length === 0) {
                    console.log("All coins collected!");
                    this.collectInfo.showGameOver();
                }
            }
        }
    }
}
