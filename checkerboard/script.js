var c;
var ctx;
var img;
var w;
var h;

function onLoad() {
	console.log("test");
	c = document.getElementById("canvas");
	w = c.width;
	h = c.height;
	ctx = c.getContext("2d");
	img = ctx.createImageData(w, h);
	drawCanvas();
}

//rgb to css colour
function rgb(r,g,b) {
	return "rgb("+r.toString()+","+g.toString()+","+b.toString()+")";
}

function drawCanvas() {
	for (x = 0; x < w; x++) {
		for (y = 0; y < h; y++) {
			img.data[(x + y * w) * 4 + 0] = ((Math.floor(x/14)%2)^(Math.floor(y/16)%2))*255;
			img.data[(x + y * w) * 4 + 1] = ((Math.floor(x/15)%2)^(Math.floor(y/15)%2))*255;
			img.data[(x + y * w) * 4 + 2] = ((Math.floor(x/16)%2)^(Math.floor(y/14)%2))*255;
			img.data[(x + y * w) * 4 + 3] = 255;
		}
	}
	ctx.putImageData(img,0,0);
}