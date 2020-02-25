var renderScreenElement;
var renderScreen;

var font = {}

function extractFont(fontData) {
	fontChars = fontData.split("\n")
	for (fontChar of fontChars) {
		f = fontChar.split(":")
		font[parseInt(f[0],16)] = f[1]
	}
	console.log(font)
}

function initRenderer(s) {
	renderScreenElement = document.getElementById("console");
	renderScreen = renderScreenElement.getContext("2d");
	renderScreen.fillStyle = "#000000";
	renderScreen.fillRect(0,0,renderScreenElement.width,renderScreenElement.height);
	$.ajax("font.hex", {success: extractFont})
}