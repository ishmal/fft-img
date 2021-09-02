
import FFT from 'fft.js';

import { AudioOutput } from './audio-output';

const WIDTH = 256;
const HEIGHT = 128;

const SAMPLE_RATE = 22050;

export class FftImage {

    constructor(opts) {
        this.message = 'KS5D';
        this.audioOutput = new AudioOutput(opts);
        this.inputCanvas = document.querySelector(opts.inputCanvasId);
        this.previewCanvas = document.querySelector(opts.previewCanvasId);
        this.inputField = document.querySelector(opts.textInputId);
        this.inputField.addEventListener('change', () => {
            this.message = this.inputField.value;
            this.drawImage();
        });
        this.okButton = document.querySelector(opts.genButtonId);
        this.okButton.addEventListener('click', async() => {
            await this.generate();
        });
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

    debugArray(arr) {
        let cnt = 0;
        for (let i = 0, len = arr.length; i < len; i++) {
            if (arr[i]) {
                cnt++;
            }
        }
        console.log(`arr: ${arr.length}, vals: ${cnt}`);
    }
 
    doFft(data) {
        const fft = new FFT(4096);
        let samples = [];
        const nrRows = data.length;
        const inStorage = new Array(8192)
        const outData = fft.createComplexArray(inStorage);
        const outStorage = new Array(4096);
        const ovlpLength = 4096 / 3;
        const padding = new Array(4096 - WIDTH).fill(0);
        for (let row = 0; row < nrRows; row++) {
            const rowData = data[row];
            const fftRow = rowData.concat(padding);
            const inData = fft.toComplexArray(fftRow, inStorage);
            fft.inverseTransform(outData, inData);
            const out = fft.fromComplexArray(outData, outStorage);
            const len = samples.length;
            if (len === 0) {
                samples = out;
            } else {
                const startPos = len - ovlpLength;
                for (let i = 0, outLen = out.length; i < outLen; i++) {
                    const samp = out[i];
                    if (i < ovlpLength) {
                        samples[startPos + i] = (samples[startPos + i] + samp) / 2;
                    } else {
                        samples.push(samp)
                    }
                }
            }
            samples = samples.concat(out.reverse());
            //this.debugArray(out);
        }
        return samples;
    }


    async generate() {
		const ctx = this.inputCanvas.getContext('2d');
        this.drawImage(ctx);
        const data = this.getPixels(ctx);
		this.drawPreview(data);
        const samples = this.doFft(data);
        this.audioOutput.setBuffer(samples);
        this.audioOutput.play();
    }



}


