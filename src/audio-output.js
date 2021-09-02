
import { Waterfall } from './waterfall';

const AudioContext = window.AudioContext || window.webkitAudioContext;

const SAMPLE_RATE = 22050

export class AudioOutput {

    constructor(opts) {
        opts = opts || {};
		this.audioCtx = null;
        const canvas = document.querySelector(opts.spectrumCanvasId);
        this.canvasCtx = canvas.getContext("2d");
		this.waterfall = new Waterfall(this.canvasCtx);
    }

    setBuffer(data) {
		if (!this.audioCtx) {
			this.audioCtx = new AudioContext();
		}
        const length = data.length;
        const buffer = this.audioCtx.createBuffer(1, length, SAMPLE_RATE);
        const internalBuffer = buffer.getChannelData(0);
        for (let i = 0; i < length; i++) {
            internalBuffer[i] = data[i];
        }
        this.source = this.audioCtx.createBufferSource();
        this.source.buffer = buffer;
        this.analyser = this.audioCtx.createAnalyser();
        this.analyser.fftSize = 4096;
        this.source.connect(this.analyser);
        this.analyser.connect(this.audioCtx.destination)
    }

    play() {
        this.source.start();
		this.startSpectrum();
    }

    updateWaterfall() {

        if (this.runWaterfall) {
        	requestAnimationFrame(() => this.updateWaterfall());
        }
      
		const dataArray = new Uint8Array(2048);
        this.analyser.getByteFrequencyData(dataArray);

		this.waterfall.update(dataArray);
    }

    startSpectrum() {
        this.runWaterfall = true;
        this.updateWaterfall();
    }

    stopSpectrum() {
        this.runWaterfall = false;
    }


}