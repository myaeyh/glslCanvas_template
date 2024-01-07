const PIXEL_DENSITY = 2;
let theShader;
let canvas;
let capture;

let f;
let title;
let guide;

let intro_background;
let intro_title;
let intro_content;

let texture_base;
// let texture_A0; let texture_A1; let texture_A2; let texture_A3; let texture_A4; let texture_A5;
// let texture_B0; let texture_B1; let texture_B2; let texture_B3; let texture_B4; let texture_B5;
let texture_C0; let texture_C1; let texture_C2; let texture_C3; let texture_C4; let texture_C5;
// let texture_D0; let texture_D1; let texture_D2; let texture_D3; let texture_D4; let texture_D5;
let texture_E0; let texture_E1; let texture_E2; let texture_E3; let texture_E4; let texture_E5;
let texture_F0; let texture_F1; let texture_F2; let texture_F3; let texture_F4; let texture_F5;


let control = { //稍後會用來當作template控制元件
	density_texture: 20.0,
	density_picture: 1.0,

	speed_x: 0.0,
	speed_y: 0.05,
	still: false,

	r: false,
	g: false,
	b: false,

	color_ink:[0, 0, 0], //[99, 125, 117],
	color_backgroung: [255,255,255],//[247, 222, 212],
}

var dropDown_style = {
	selectedOption: 'No.1', //預設選項?
	options: [
		// '1. Grid',
		// '2. Cross',
		'No.1',
		// '4. Pencil',
		'No.2',
		'No.3',//新增選項要在這!
	]
};

//set GUI
window.onload = function() {
	var gui = new dat.GUI();
	gui.domElement.id = 'gui';

	// let gui_density = gui.addFolder("Density");
	// gui_density.open();
	// gui_density.add(control, 'density_texture', 1, 20).name("Texture").step(1);
	// gui_density.add(control, 'density_picture', 1, 10).name("Picture").step(1);

	let gui_speed = gui.addFolder("Speed");
	gui_speed.open();
	// gui_speed.add(control, 'speed_x', -0.2, 0.2).name("X-axis").step(0.01);
	gui_speed.add(control, 'speed_y', -0.2, 0.2).name("Y-axis").step(0.01);
	// gui_speed.add(control, 'still').name("Still");
	
	let gui_rgb = gui.addFolder("Click Here");
	gui_rgb.open();
	gui_rgb.add(control, 'r').name("Show");
	// gui_rgb.add(control, 'g').name("G");
	// gui_rgb.add(control, 'b').name("B");

	// let gui_color = gui.addFolder("Color");
	// gui_color.open();
	// gui_color.addColor(control, 'color_ink').name("Ink");
	// gui_color.addColor(control, 'color_backgroung').name("Backgroung");

	gui.add(dropDown_style, 'selectedOption', dropDown_style.options).name("Style");
};

// -只須看這邊------------------- preload -------------------- //

function preload(){
	theShader = loadShader('vert.glsl', 'May.frag');//改成自己的

	// texture_base = loadImage("data/TheStarryNight.jpg");
	texture_base = loadImage("data/test_tem1.jpg");

	// texture_A0 = loadImage("data/1_grid/hatch_0.jpg");
	// texture_A1 = loadImage("data/1_grid/hatch_1.jpg");
	// texture_A2 = loadImage("data/1_grid/hatch_2.jpg");
	// texture_A3 = loadImage("data/1_grid/hatch_3.jpg");
	// texture_A4 = loadImage("data/1_grid/hatch_4.jpg");
	// texture_A5 = loadImage("data/1_grid/hatch_5.jpg");

	// texture_B0 = loadImage("data/2_cross/hatch_0.jpg");
	// texture_B1 = loadImage("data/2_cross/hatch_1.jpg");
	// texture_B2 = loadImage("data/2_cross/hatch_2.jpg");
	// texture_B3 = loadImage("data/2_cross/hatch_3.jpg");
	// texture_B4 = loadImage("data/2_cross/hatch_4.jpg");
	// texture_B5 = loadImage("data/2_cross/hatch_5.jpg");

	texture_C0 = loadImage("data/3_circle/N0.jpg");
	texture_C1 = loadImage("data/3_circle/N1.jpg");
	texture_C2 = loadImage("data/3_circle/N2.jpg");
	texture_C3 = loadImage("data/3_circle/N3.jpg");
	texture_C4 = loadImage("data/3_circle/N4.jpg");
	texture_C5 = loadImage("data/3_circle/N5.jpg");

	// texture_D0 = loadImage("data/4_pencil/hatch_0.jpg");
	// texture_D1 = loadImage("data/4_pencil/hatch_1.jpg");
	// texture_D2 = loadImage("data/4_pencil/hatch_2.jpg");
	// texture_D3 = loadImage("data/4_pencil/hatch_3.jpg");
	// texture_D4 = loadImage("data/4_pencil/hatch_4.jpg");
	// texture_D5 = loadImage("data/4_pencil/hatch_5.jpg");

	texture_E0 = loadImage("data/5_crayon/3D6-02.jpg");
	texture_E1 = loadImage("data/5_crayon/3D5-02.jpg");
	texture_E2 = loadImage("data/5_crayon/3D4-02.jpg");
	texture_E3 = loadImage("data/5_crayon/3D3-02.jpg");
	texture_E4 = loadImage("data/5_crayon/3D2-02.jpg");
	texture_E5 = loadImage("data/5_crayon/3D1-02.jpg");

	texture_F0 = loadImage("data/6_marker/C1.png");
	texture_F1 = loadImage("data/6_marker/C2.png");
	texture_F2 = loadImage("data/6_marker/C3.png");
	texture_F3 = loadImage("data/6_marker/C4.png");
	texture_F4 = loadImage("data/6_marker/C5.png");
	texture_F5 = loadImage("data/6_marker/C6.png");

	f = loadFont("https://cdnjs.cloudflare.com/ajax/libs/topcoat/0.8.0/font/SourceCodePro-Bold.otf");
	// f = loadFont("https://www.fontsaddict.com/fontface/the-fiveonetwo.otf");
	// f = loadFont("C:\Users\lym95\Downloads\the-fiveonetwo.ttf");
}
// @font-face {
// 	font-family: 'The FiveOneTwo';
// 	src: url('https://www.fontsaddict.com/fontface/the-fiveonetwo.ttf');
//   }

// -------------------- setup -------------------- //

function setup() {
	pixelDensity(PIXEL_DENSITY);
	// canvas = createCanvas(1000,1000, WEBGL);
	canvas = createCanvas(windowWidth, windowHeight, WEBGL);

	// capture = createCapture(VIDEO);
  	// capture.hide();

	flipImage(texture_base);
	// flipImage(texture_A0); flipImage(texture_A1); flipImage(texture_A2); flipImage(texture_A3); flipImage(texture_A4); flipImage(texture_A5);
	// flipImage(texture_B0); flipImage(texture_B1); flipImage(texture_B2); flipImage(texture_B3); flipImage(texture_B4); flipImage(texture_B5);
	flipImage(texture_C0); flipImage(texture_C1); flipImage(texture_C2); flipImage(texture_C3); flipImage(texture_C4); flipImage(texture_C5);
	// flipImage(texture_D0); flipImage(texture_D1); flipImage(texture_D2); flipImage(texture_D3); flipImage(texture_D4); flipImage(texture_D5);
	flipImage(texture_E0); flipImage(texture_E1); flipImage(texture_E2); flipImage(texture_E3); flipImage(texture_E4); flipImage(texture_E5);
	flipImage(texture_F0); flipImage(texture_F1); flipImage(texture_F2); flipImage(texture_F3); flipImage(texture_F4); flipImage(texture_F5); 
//!!!!這裡有褲東西
	noCursor();
	background(0);
	noStroke();
	shader(theShader);
//作品介紹區，create graphic都是p5.js的渲染引擎，全部都去找p5的reference
	let width_fixed = 1024;//why數字越大框框越窄?

	title = createGraphics(2048, windowHeight, WEBGL);
	title.pixelDensity(PIXEL_DENSITY);
	title.textFont(f);
	title.textSize(120);
	title.textAlign(LEFT, BASELINE);
	title.fill(color(255, 255, 255));
	title.text("Experiment", 0, 0);//後面兩個是移動位子!!!但單位不知道是誰麼好像是跟著textalign一起的

	guide = createGraphics(width_fixed, windowHeight, WEBGL);
	guide.pixelDensity(PIXEL_DENSITY);
	guide.textFont(f);
	guide.textSize(20);
	guide.textAlign(LEFT, BASELINE);
	guide.fill(color(255, 255, 255));
	guide.text("why these textures?? ", 0, 0);

	intro_background = createGraphics(width_fixed, windowHeight, WEBGL);
	intro_background.pixelDensity(PIXEL_DENSITY);
	intro_background.fill(color(255, 255, 255));
	intro_background.rect(width_fixed * -0.5, height * -0.5, 500, height);//相對於圖形物件中心的偏移。矩形的寬度是 500，高度是 height。
	// intro_background.circle(50,50,10);
	// intro_background.circle(100,50,10);


	intro_title = createGraphics(width_fixed, windowHeight, WEBGL);
	intro_title.pixelDensity(PIXEL_DENSITY);//默认像素密度为显示器的像素密度，可调用 pixelDensity(1) 以关闭此功能。调用 pixelDensity() 并不给予任何参数将返回该绘图的像素密度。
	intro_title.textFont(f);
	intro_title.textSize(80);
	intro_title.textAlign(LEFT, BASELINE);
	intro_title.fill(color(255, 255, 255));//先設白色才不會被影響
	intro_title.text("Intro", 0, 0);

	intro_content = createGraphics(width_fixed, windowHeight, WEBGL);
	intro_content.pixelDensity(PIXEL_DENSITY);
	intro_content.textFont(f);
	intro_content.textSize(15);
	intro_content.textAlign(LEFT, BASELINE);
	intro_content.fill(color(255, 255, 255));
	intro_content.textWrap(WORD);
	intro_content.text("Computational Aesthetics template by Leo Kao]\nNo.1:I use concentric circle and do some change at the quarter ,create seamless texture with adobe illustrator,looks like some ivy climbing the wall.\n\nNo.2 I try to achive negative effect by using #20384c,35556a,c6d9e6,3e7187,1f323e,which is drawn from actual negative-effect photos.\n\nNo.3: I want to experiment the relationship between the 3D and 2D worlds, so i use the optical illusion method to create 3D effects in Illustrator, then use it as a material, adjust the brightness of the material part, and create a difference in depth for the 2D pattern.\n\n You can click the button SHOW to watch the hatching effect on picture.", 0, 0, 450);
}

// PASS variable!-------------------- draw -------------------- //

function draw() {
	// flipVideo(capture);
	// flipImage(capture);

	var y = (mouseY - 500) / min(1, windowWidth / windowHeight) + 1500;
	
	theShader.setUniform("u_resolution", [width * PIXEL_DENSITY, height * PIXEL_DENSITY]);
	theShader.setUniform("u_mouse", [mouseX * PIXEL_DENSITY, (height-y) * PIXEL_DENSITY]);
  	theShader.setUniform("u_time", millis() / 1000.0);

	theShader.setUniform("u_density_texture", control.density_texture);
	theShader.setUniform("u_density_picture", control.density_picture);

	theShader.setUniform("u_speed_x", control.speed_x);
	theShader.setUniform("u_speed_y", control.speed_y);
	theShader.setUniform("u_still", control.still);
	theShader.setUniform("u_mouse_pressed", mouseIsPressed);

	theShader.setUniform("u_rgb", [control.r, control.g, control.b]);

	theShader.setUniform("u_color_ink", control.color_ink);
	theShader.setUniform("u_color_background", control.color_backgroung);
	
	theShader.setUniform("u_texture_base", texture_base);
	// theShader.setUniform("u_texture_base", capture);

	// if (dropDown_style.selectedOption == '1. Grid') {
	// 	theShader.setUniform("u_texture_0", texture_A0);
	// 	theShader.setUniform("u_texture_1", texture_A1);
	// 	theShader.setUniform("u_texture_2", texture_A2);
	// 	theShader.setUniform("u_texture_3", texture_A3);
	// 	theShader.setUniform("u_texture_4", texture_A4);
	// 	theShader.setUniform("u_texture_5", texture_A5);
	// }
	// else if (dropDown_style.selectedOption == '2. Cross') {
	// 	theShader.setUniform("u_texture_0", texture_B0);
	// 	theShader.setUniform("u_texture_1", texture_B1);
	// 	theShader.setUniform("u_texture_2", texture_B2);
	// 	theShader.setUniform("u_texture_3", texture_B3);
	// 	theShader.setUniform("u_texture_4", texture_B4);
	// 	theShader.setUniform("u_texture_5", texture_B5);
	// }
	if (dropDown_style.selectedOption == 'No.2') {
		theShader.setUniform("u_texture_5", texture_C0);
		theShader.setUniform("u_texture_4", texture_C1);
		theShader.setUniform("u_texture_3", texture_C2);
		theShader.setUniform("u_texture_2", texture_C3);
		theShader.setUniform("u_texture_1", texture_C4);
		theShader.setUniform("u_texture_0", texture_C5);
	}
	// else if (dropDown_style.selectedOption == '4. Pencil') {
	// 	theShader.setUniform("u_texture_0", texture_D0);
	// 	theShader.setUniform("u_texture_1", texture_D1);
	// 	theShader.setUniform("u_texture_2", texture_D2);
	// 	theShader.setUniform("u_texture_3", texture_D3);
	// 	theShader.setUniform("u_texture_4", texture_D4);
	// 	theShader.setUniform("u_texture_5", texture_D5);
	// }
	else if(dropDown_style.selectedOption == 'No.3') {
		theShader.setUniform("u_texture_0", texture_E0);
		theShader.setUniform("u_texture_1", texture_E1);
		theShader.setUniform("u_texture_2", texture_E2);
		theShader.setUniform("u_texture_3", texture_E3);
		theShader.setUniform("u_texture_4", texture_E4);
		theShader.setUniform("u_texture_5", texture_E5);
	}
	else if(dropDown_style.selectedOption == 'No.1') {
		theShader.setUniform("u_texture_0", texture_F0);
		theShader.setUniform("u_texture_1", texture_F1);
		theShader.setUniform("u_texture_2", texture_F2);
		theShader.setUniform("u_texture_3", texture_F3);
		theShader.setUniform("u_texture_4", texture_F4);
		theShader.setUniform("u_texture_5", texture_F5);
	}

	theShader.setUniform("u_title", title);
	theShader.setUniform("u_guide", guide);

	theShader.setUniform("u_intro_background", intro_background);
	theShader.setUniform("u_intro_title", intro_title);
	theShader.setUniform("u_intro_content", intro_content);
	
	rect(width * -0.5, height * -0.5, width, height);
}

// -------------------- windowResized -------------------- //

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

// -------------------- keyPressed -------------------- //

function keyPressed() {
	if (keyCode == ESCAPE) { dat.GUI.toggleHide(); }
}

// -------------------- flipImage -------------------- //

function flipImage(img) {
	img.loadPixels();

	let w = img.width;
	let h = img.height;

	let flippedPixels = new Uint8Array(4 * w * h);
  
	for (let y = 0; y < h; y++) {
	  for (let x = 0; x < w; x++) {
		let index = (y * w + x) * 4;
		let flippedIndex = ((h - y - 1) * w + x) * 4;

		flippedPixels[flippedIndex] = img.pixels[index]; // Red
		flippedPixels[flippedIndex + 1] = img.pixels[index + 1]; // Green
		flippedPixels[flippedIndex + 2] = img.pixels[index + 2]; // Blue
		flippedPixels[flippedIndex + 3] = img.pixels[index + 3]; // Alpha
	  }
	}
  
	img.pixels.set(flippedPixels);
	img.updatePixels();
}

// -------------------- flipVideo -------------------- //

function flipVideo(video) {
	video.loadPixels();
  
	let flippedPixels = new Uint8Array(video.pixels);
  
	for (let y = 0; y < video.height; y++) {
	  for (let x = 0; x < video.width; x++) {
		let index = (x + y * video.width) * 4;
  
		let flippedIndex = ((video.width - 1 - x) + y * video.width) * 4;
  
		flippedPixels[flippedIndex] = video.pixels[index];
		flippedPixels[flippedIndex + 1] = video.pixels[index + 1];
		flippedPixels[flippedIndex + 2] = video.pixels[index + 2];
		flippedPixels[flippedIndex + 3] = video.pixels[index + 3];
	  }
	}
  
	video.pixels.set(flippedPixels);
	video.updatePixels();
}