var renderScreenElement;
var renderScreen;

var font = {};
var fontLoaded = false;

var foreground = 0xFFFFFF;
var background = 0x000000;

var gpu = {};
var screenW, screenH;

var blegh

function demo() {
	gpu.setForeground(Math.floor(Math.random()*0xFFFFFF));
	gpu.setBackground(Math.floor(Math.random()*0xFFFFFF));
	gpu.set("Beep Boop",Math.floor(Math.random()*80),Math.floor(Math.random()*25));
	gpu.copy(0, 0, screenW, screenH, 0, 1);
	gpu.setBackground(0x000000);
	gpu.fill(0, 0, screenW, 1, " ");
}

function extractFont(fontData) {
	fontChars = fontData.split("\n")
	for (fontChar of fontChars) {
		try {
			f = fontChar.split(":");
			j = {};
			for (i = 0; i < 16; i++) {
				j[i] = parseInt(f[1].substring(i*2+2,i*2),16);
			}
			font[parseInt(f[0], 16)] = j;
		} catch (err) {
			console.log(err);
		}
	}
	//console.log(font["A".charCodeAt(0)]);
	fontLoaded = true;
	setInterval(demo, 50);
}

function initRenderer() {
	renderScreenElement = document.getElementById("console");
	renderScreen = renderScreenElement.getContext("2d");
	screenW = renderScreenElement.width;
	screenH = renderScreenElement.height;
	renderScreen.fillStyle = "#000000";
	renderScreen.fillRect(0,0,screenW,screenH);
	$.ajax("https://raw.githubusercontent.com/MightyPirates/OpenComputers/master-MC1.7.10/src/main/resources/assets/opencomputers/font.hex", {success: extractFont});
}

function putChar(char, xpos, ypos) {
	graphic = renderScreen.createImageData(8, 16);
	if (fontLoaded) {
		fontChar = font[char.charCodeAt(0)];
		for (fi = 0; fi < 16 * 8; fi++) {
			bit = (fontChar[Math.floor(fi / 8)] << Math.floor(fi % 8) & 128) >> 7;
			if (bit) {r = foreground >> 2*8 & 0xff} else {r = background >> 2*8 & 0xff}
			if (bit) {g = foreground >> 1*8 & 0xff} else {g = background >> 1*8 & 0xff}
			if (bit) {b = foreground >> 0*8 & 0xff} else {b = background >> 0*8 & 0xff}
			graphic.data[fi * 4 + 0] = r;
			graphic.data[fi * 4 + 1] = g;
			graphic.data[fi * 4 + 2] = b;
			graphic.data[fi * 4 + 3] = 255;
		}
		renderScreen.putImageData(graphic, xpos * 8, ypos * 16);
	}
}

gpu.set = function(chars, xpos, ypos) {
	for (char = 0; char < chars.length; char++) {
		putChar(chars.substring(char,char + 1), xpos + char, ypos);
	}
}

gpu.setForeground = function(fgcol) {
	foreground = fgcol;
}

gpu.setBackground = function(bgcol) {
	background = bgcol;
}

gpu.copy = function(xpos, ypos, w, h, tx, ty) {
	graphic = renderScreen.getImageData(xpos * 8, ypos * 16, w * 8, h * 16);
	renderScreen.putImageData(graphic, (xpos + tx) * 8, (ypos + ty) * 16);
}

gpu.fill = function(xpos, ypos, w, h, char) {
	for (x = xpos; x < w; x++) {
		for (y = ypos; y < h; y++) {
			putChar(char, x, y);
		}
	}
}