/**
 * WIP - Pixel Editor
 * 
 * 
 */


import { initDevtools } from "@pixi/devtools";
import { AdvancedBloomFilter } from "pixi-filters";
import { Application } from "pixi.js";
import { PIXIRenderer } from "./PixelBoard/PIXIRenderer";
import { PixelBoardEditor } from "./PixelBoard/PixelEditor";

const app = new Application();

initDevtools({ app });

await app.init({ background: '#000000', resizeTo: window });
document.body.appendChild(app.canvas);

app.stage.filters = new AdvancedBloomFilter({ threshold: 0.5, bloomScale: 1, brightness: 1, blur: 3, quality: 10 });

const pixelboardEditor = new PixelBoardEditor(14, 28, new PIXIRenderer());

app.stage.addChild(pixelboardEditor.renderer as PIXIRenderer);

app.ticker.minFPS = 60;
app.ticker.add((ticker) => {
    pixelboardEditor.update(ticker.deltaTime);
});

// const objectPixels = [
//     [new Pixel(new Color(0xFF0000)), new Pixel(new Color(0x00FF00))],
//     [new Pixel(new Color(0x0000FF)), new Pixel(new Color(0xFFFF00))]
// ];

// const objectPixels2 = [
//     [new Pixel(new Color(0xFF0000)), new Pixel(new Color(0x00FF00))],
//     [new Pixel(new Color(0x0000FF)), new Pixel(new Color(0xFFFF00))],
//     [new Pixel(new Color(0x0000FF)), new Pixel(new Color(0xFFFF00))]
// ];

// const pixelObject = new PixelObject(objectPixels, 5, 5);
// const pixelObject2 = new PixelObject(objectPixels2, 10, 10);

// pixelboardEditor.addPixelObject(pixelObject);
// pixelboardEditor.addPixelObject(pixelObject2);


// pixelboardEditor.startNewObject(5, 5);

// pixelboardEditor.handleInput(5, 5);
// pixelboardEditor.handleInput(6, 5);
// pixelboardEditor.handleInput(5, 6);
// pixelboardEditor.handleInput(6, 6);
// pixelboardEditor.finishNewObject();


const editButton = document.getElementById('edit-button');
const saveButton = document.getElementById('save-button');
const editedObjectsDiv = document.getElementById('edited-objects');

let isDragging = false;

editButton?.addEventListener('click', () => {
    if (!pixelboardEditor.isCurrentlyEditing()) {
        pixelboardEditor.startNewObject(0, 0);
    }
});

saveButton?.addEventListener('click', () => {
    if (pixelboardEditor.isCurrentlyEditing()) {
        pixelboardEditor.finishNewObject();
        updateEditedObjects();
    }
});

app.canvas.addEventListener('mousedown', (event) => {
    const rect = app.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    pixelboardEditor.selectObject(x, y);
    isDragging = true;
});

app.canvas.addEventListener('mousemove', (event) => {
    if (isDragging) {
        const rect = app.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        pixelboardEditor.moveSelectedObject(x, y);
    }
});

app.canvas.addEventListener('mouseup', () => {
    isDragging = false;
    pixelboardEditor.deselectObject();
});

function updateEditedObjects() {
    if (editedObjectsDiv) {
        editedObjectsDiv.innerHTML = '';
        pixelboardEditor.pixelObjects.forEach((obj, index) => {
            const objString = `Object ${index + 1}: (${obj.x}, ${obj.y})`;
            const objElement = document.createElement('div');
            objElement.textContent = objString;
            editedObjectsDiv.appendChild(objElement);
        });
    }
}