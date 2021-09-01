
const WIDTH = 256;
const HEIGHT = 128;

class FftImage {

    constructor(canvasId, inputId, buttonId) {
        this.message = 'KS5D';
        this.canvas = document.querySelector(canvasId);
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
            ctx = this.canvas.getContext("2d");
        }
        ctx.font = "60px Arial";
        ctx.textAlign = 'center';
        ctx.fillText(this.message, WIDTH/2, 100);
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

    }

    generate() {
        const canvas = document.createElement('canvas');
        canvas.width = WIDTH;
        canvas.height = HEIGHT;
        const ctx = canvas.getContext('2d');
        this.drawImage(ctx);
        this.getPixels(ctx);
    }



}

document.addEventListener('DOMContentLoaded', (evt) => {
    const tool = new FftImage('#main-canvas', '#text-input', '#ok-button');
});


