
import { FFT } from 'fft.js';

const WIDTH = 256;
const HEIGHT = 128;

class FftImage {

    constructor(inputCanvasId, previewCanvasId, inputId, buttonId) {
        this.message = 'KS5D';
        this.inputCanvas = document.querySelector(inputCanvasId);
        this.previewCanvas = document.querySelector(previewCanvasId);
        this.inputField = document.querySelector(inputId);
        this.inputField.addEventListener('change', () => {
            this.message = this.inputField.value;
            this.drawImage();
        });
        this.okButton = document.querySelector(buttonId);
        this.okButton.addEventListener('click', () => this.generate());
        this.drawImage();
    }

    drawImage(ctx) {
        if (!ctx) {
            ctx = this.inputCanvas.getContext("2d");
        }
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
        ctx.font = "bold 60px Arial";
        ctx.textAlign = 'center';
        ctx.fillText(this.message, WIDTH/2, 90);
    }

    getPixels(ctx) {
        const imgData = ctx.getImageData(0, 0, WIDTH, HEIGHT);
        const data = imgData.data;
        const outData = [];
        for (let row = 0, idx = 0; row < HEIGHT; row++) {
            const rowData = [];
            for (let col = 0; col < WIDTH; col++) {
                const r = data[idx++];
                const g = data[idx++];
                const b = data[idx++];
                const a = data[idx++];
                const pix = a ? (255-r + 255-g + 255-b) / 3 : 0;
                rowData[col] = pix;
            }
            outData[row] = rowData;
        }
		return outData;
    }

	drawPreview(data) {
		const ctx = this.previewCanvas.getContext('2d');
		ctx.clearRect(0, 0, WIDTH, HEIGHT);
        for (let row = 0; row < HEIGHT; row++) {
			const rowPixels = data[row];
            for (let col = 0; col < WIDTH; col++) {
				const px = rowPixels[col];
				ctx.fillStyle = `rgb(${px}, ${px}, ${px})`
				ctx.fillRect(col, row, 1, 1);
			}
		}
	}


    generate() {
		const ctx = this.inputCanvas.getContext('2d');
        this.drawImage(ctx);
        const data = this.getPixels(ctx);
		this.drawPreview(data);
    }



}

document.addEventListener('DOMContentLoaded', (evt) => {
    const tool = new FftImage('#input-canvas', '#preview-canvas', '#text-input', '#ok-button');
});


