/*
    Simple class to display the score and game over message
    In fully fledged game, this would be a UI component 
*/


export class CollectInfo {
    displayElement: HTMLElement;

    constructor(element: HTMLElement) {
        this.displayElement = element;
    }

    updateScore(score: number): void {
        this.displayElement.innerText = `Score: ${score}`;
    }

    showGameOver(): void {
        this.displayElement.innerText = "Game Over! You collected all the coins!";
    }
}