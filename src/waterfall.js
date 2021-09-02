const SAMPLE_RATE = 22050;

function trace(msg) {
    if (typeof console !== 'undefined') {
        console.log('Waterfall: ' + msg);
    }
}

function error(msg) {
    if (typeof console !== 'undefined') {
        console.log('Waterfall error : ' + msg);
    }
}
 

/**
 * Provides a Waterfall display
 * @canvas the canvas to use for drawing
 */
export class Waterfall {


    constructor(ctx) {
        window.requestAnimationFrame = window.requestAnimationFrame
            || window.msRequestAnimationFrame;
        this.ctx = ctx;
        this.palette = this.makePalette();
        this.width = ctx.canvas.width;
        this.height = ctx.canvas.height;
        this.indices = this.makeIndices(this.width, 2048); // half analyzer size
        this.imgData = ctx.createImageData(this.width, this.height);
    }

    // ####################################################################
    // #  R E N D E R I N G
    // ####################################################################

    makeIndices(targetsize, sourcesize) {
        const xs = new Array(targetsize);
        const ratio = sourcesize / targetsize;
        for (let i = 0; i < targetsize; i++) {
            xs[i] = Math.floor(i * ratio);
        }
        return xs;
    }

    /**
     * Make a palette. tweak this often
     * TODO:  consider using an HSV heat map
     */
    makePalette() {
        const xs = new Array(256);
        for (let i = 0; i < 256; i++) {
            const r = (i < 170) ? 0 : (i - 170) * 3;
            const g = (i < 85) ? 0 : (i < 170) ? (i - 85) * 3 : 255;
            const b = (i < 85) ? i * 3 : 255;
            const col = [r, g, b, 255];
            xs[i] = col;
        }
        return xs;
    }



    drawSpectrum(data) {
        const ctx = this.ctx;
        const width = this.width;
        const height = this.height;

        const indices = this.indices;

        ctx.fillStyle = 'rgba(255, 255, 255, 0.50)';
        ctx.beginPath();
        const base = height >> 1; // move this around
        ctx.moveTo(0, base);
        const log = Math.log;
        for (let x = 0; x < width; x++) {
            const v = log(1.0 + data[indices[x]]) * 12.0;
            const y = base - v;
            // trace('x:' + x + ' y:' + y);
            ctx.lineTo(x, y);
        }
        ctx.lineTo(width - 1, base);
        for (let x = width - 1; x >= 0; x--) {
            const v = log(1.0 + data[indices[x]]) * 12.0;
            const y = base + v;
            // trace('x:' + x + ' y:' + y);
            ctx.lineTo(x, y);
        }
        ctx.lineTo(0, base);
        ctx.closePath();
        // const bbox = ctx.getBBox();
        ctx.fill();
    }


    drawWaterfall(data) {
        const ctx = this.ctx;
        const width = this.width;
        const imgData = this.imgData;
        const buf8 = imgData.data;
        const imglen = buf8.length;
        const palette = this.palette;
        const rowsize = imglen / this.height;
        const lastRow = imglen - rowsize;
        const indices = this.indices;

        buf8.set(buf8.subarray(rowsize, imglen)); // <-cool, if this works
        let idx = lastRow;
        const abs = Math.abs;
        const log = Math.log;
        for (let x = 0; x < width; x++) {
            const v = abs(data[indices[x]]);
            // if (x==50) trace('v:' + v);
            const p = log(1.0 + v) * 30;
            // if (x==50)trace('x:' + x + ' p:' + p);
            const pix = palette[p & 255];
            // if (x==50)trace('p:' + p + '  pix:' + pix.toString(16));
            buf8[idx++] = pix[0];
            buf8[idx++] = pix[1];
            buf8[idx++] = pix[2];
            buf8[idx++] = pix[3];
        }
        imgData.data.set(buf8);
        ctx.putImageData(imgData, 0, 0);
    }


    update(data) {
        this.drawWaterfall(data);
        this.drawSpectrum(data);
    }

}