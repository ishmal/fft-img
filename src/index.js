
import { FftImage } from './fft-image';


document.addEventListener('DOMContentLoaded', (evt) => {
    const opts = {
        inputCanvasId: '#input-canvas',
        previewCanvasId: '#preview-canvas',
        spectrumCanvasId: '#spectrum-canvas',
        textInputId: '#text-input',
        genButtonId: '#ok-button'
    };
    const tool = new FftImage(opts);
});


