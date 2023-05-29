
let img;
let video;
let canvasDimensions
let density ="";

let drawHacker = false;
let drawAsciiVideo = false;
let drawPixelArtVideo = false;

const minPixels = 5;
const maxPixels = 500;
const maxDrawPixels = 200;
const maxDrawPixelsHacker = 100;

const imagePixelInputDefault = 50;
const dimensionInputDefault = 1080;
const textInputSpaceDefault = 'Ñ@W$89054321!a+c;:-,.      ';

const textInputPhraseDefault = 'I#Love#You'
const textInputHackerDefault = 'Ñ@W$89054321?PSDGDFTHYJX';

const imgPreview = document.getElementById("img-preview");
const imgInput = document.getElementById('file');
const selectArtStyle = document.getElementById('artStyle');
const sendButton = document.getElementById('transformImage');
const saveImageButton = document.getElementById('saveImage');
const saveGifButton = document.getElementById('saveGifButton');
const inputDefaultButton = document.getElementById('inputDefault');
const asciiDiv = document.getElementById('asciiDiv');
const mainCanvas = document.getElementById('canvas');
const obsP = document.getElementById('obsP');
const dimensionInput = document.getElementById('dimensionInput');
const imagePixelInput = document.getElementById('imagePixelInput');
const textInput = document.getElementById("textInput");
const textInputLabel = document.getElementById("textInputLabel");

const colorCheckboxDiv = document.getElementById('colorCheckboxDiv');
const redCheckbox = document.getElementById('redCheckbox');
const greenCheckbox = document.getElementById('greenCheckbox');
const blueCheckbox = document.getElementById('blueCheckbox');
const blackWhiteCheckbox = document.getElementById('blackWhiteCheckbox');

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

redCheckbox.addEventListener("change",function(){
  if(redCheckbox.checked) blackWhiteCheckbox.checked = false;
})
greenCheckbox.addEventListener("change",function(){
  if(greenCheckbox.checked) blackWhiteCheckbox.checked = false;
})
blueCheckbox.addEventListener("change",function(){
  if(blueCheckbox.checked) blackWhiteCheckbox.checked = false;
})
blackWhiteCheckbox.addEventListener("change",function(){
  if(blackWhiteCheckbox.checked){
  redCheckbox.checked = false;
  greenCheckbox.checked = false;
  blueCheckbox.checked = false;
  }
})

imagePixelInput.addEventListener("change",function(){
  var value = clamp(imagePixelInput.value,minPixels,maxPixels);
  imagePixelInput.value = value;
})

dimensionInput.addEventListener("change",function(){
  var value = clamp(dimensionInput.value,100,3840);
  dimensionInput.value = value;
})

imgInput.addEventListener("change", function () {
  getImgData();
});
selectArtStyle.addEventListener("change", function () {
  preChangeSelect();
  var selectValue = selectArtStyle.value;
  if(selectValue == 'asciiImage'){
    obsP.style.display = "block";
    obsP.innerHTML = "Ascii art may not work with too dark images";
    textInput.style.display = "inline";
    textInputLabel.style.display = "inline";
  }
  else if(selectValue == 'asciiText'){
    obsP.style.display = "block";
    obsP.innerHTML = "Ascii art may not work with too dark images</br>Ascii text doens't support others colors";
    textInput.style.display = "inline";
    textInputLabel.style.display = "inline";
    colorCheckboxDiv.style.display = "none";
  }
  else if( selectValue == 'asciiImageHacker'){
    obsP.style.display = "block";
    obsP.innerHTML = "Ascii art may not work with too dark images</br>Update image doesn't support Pixel Ratio greater than 100";
    saveGifButton.style.display = "inline";
    textInput.style.display = "inline";
    textInputLabel.style.display = "inline";
  }
  else if(selectValue == "pixelArtVideo"){
    obsP.style.display = "block";
    obsP.innerHTML = "Update image doesn't support Pixel Ratio greater than 200</br>You need to have a camera and let we access it";
    saveGifButton.style.display = "inline";
  }
  else if( selectValue == "asciiVideo"){
    obsP.style.display = "block";
    obsP.innerHTML = "Ascii art may not work with too dark images</br>Update image doesn't support Pixel Ratio greater than 200</br>You need to have a camera and let we access it";
    saveGifButton.style.display = "inline";
    textInput.style.display = "inline";
    textInputLabel.style.display = "inline";
  }
  else if(selectValue == 'asciiPhrase'){
    obsP.style.display = "block";
    obsP.innerHTML = "Ascii art may not work with too dark images";
    textInput.style.display = "inline";
    textInputLabel.style.display = "inline";
  }
});

function getImgData() {
  const files = imgInput.files[0];
  if (files) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(files);
    fileReader.addEventListener("load", function () {
    imgPreview.src = this.result;
    imgPreview.style.height = "400px";
    imgPreview.style.width = "400px";
    }); 
  }
}

function preload(){
  loadDefault();
}
sendButton.onclick = (event) =>{
  preTransformImage();
  switch (selectArtStyle.value){
  case 'asciiVideo':
    var value = clamp(imagePixelInput.value,minPixels,maxDrawPixels);
    imagePixelInput.value = value;
    startVideo()
    drawAsciiVideo = true;
    break;

  case 'pixelArtVideo':
    var value = clamp(imagePixelInput.value,minPixels,maxDrawPixels);
    imagePixelInput.value = value;
    startVideo()
    drawPixelArtVideo = true;
    break;
  default:
    const files = imgInput.files[0];
    if (files) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(files);
      fileReader.addEventListener("load", function () {

      loadImage(this.result, function(loadedImage) {
        img = loadedImage;
        img.resize(imagePixelInput.value,imagePixelInput.value);
        switch (selectArtStyle.value){
          case 'pixelArt':
            drawPixelArt(img);
            break;

          case 'asciiImage':
            drawWithAscii(img,density);
            break;

          case 'asciiText':
            imageToTextAscii(img,density,asciiDiv);
            mainCanvas.style.display = "none";
            asciiDiv.style.display = "block";
            break;
          case 'asciiImageHacker':
            var value = clamp(imagePixelInput.value,minPixels,maxDrawPixelsHacker);
            imagePixelInput.value = value;
            img.resize(value,value);
            drawHacker = true;
            break;

          case 'asciiPhrase':
            drawWithAsciiPhrase(img,density);
            break;
        }
      });
    });
  }
  }
}

saveImageButton.onclick = (event) =>{
  if(!isCanvasBlank(canvas)) saveCanvas(selectArtStyle.value);
}
saveGifButton.onclick = (event) =>{
  if(!isCanvasBlank(canvas)) saveGif(selectArtStyle.value,2);
}
inputDefaultButton.onclick = (event) =>{
  loadDefault();
}

function loadDefault(){
  imagePixelInput.value = imagePixelInputDefault;
  dimensionInput.value = dimensionInputDefault;
  redCheckbox.checked = true;
  greenCheckbox.checked = true;
  blueCheckbox.checked = true;
  blackWhiteCheckbox.checked = false;
  loadTextDefault();
}

function loadTextDefault(){
  var selectValue = selectArtStyle.value;
  if(selectValue == 'asciiImage' || selectValue == 'asciiText' || selectValue == "asciiVideo"){
    textInput.value = textInputSpaceDefault;
    textInputLabel.innerHTML = "Density: ";
  }
  else if( selectValue == 'asciiImageHacker'){
    textInput.value = textInputHackerDefault;
    textInputLabel.innerHTML = "Random Letters: ";
  }
  else if(selectValue == 'asciiPhrase'){
    textInput.value = textInputPhraseDefault;
    textInputLabel.innerHTML = "Phrase: ";
  }
}

function isCanvasBlank(canvas) {
  const context = canvas.getContext('2d');

  const pixelBuffer = new Uint32Array(
    context.getImageData(0, 0, canvas.width, canvas.height).data.buffer
  );

  return !pixelBuffer.some(color => color !== 0);
}

function preTransformImage()
{
  let canvas = document.createElement("canvas");
  let ctx = canvas.getContext("2d", {willReadFrequently: true});
  createCanvas(dimensionInput.value, dimensionInput.value,canvas);
  mainCanvas.style.display = "block";
  asciiDiv.innerHTML = "";
  asciiDiv.style.display = "none";
  drawHacker = false;
  drawAsciiVideo = false;
  drawPixelArtVideo = false;
  density = textInput.value;
}

function preChangeSelect(){
  obsP.style.display = "none";
  saveGifButton.style.display = "none"
  obsP.innerHTML = "";
  textInput.style.display = "none";
  textInputLabel.style.display = "none";
  colorCheckboxDiv.style.display = "inline";
  loadTextDefault();
}

function startVideo(){
  video = createCapture(VIDEO);
  video.size(imagePixelInput.value,imagePixelInput.value);
  video.hide();
}

function draw() {
  if(drawHacker){
    drawAsciiHarckerMode(img,density);}
  if(drawAsciiVideo){
    drawWithAscii(video,density);}
  if(drawPixelArtVideo){
    drawPixelArt(video);
  }
}

function drawWithAscii(img, density)
{
  background(0);
  let w = width / img.width;
  let h = height / img.height;

  img.loadPixels();
  
  for(let i = 0; i < img.width; i++){
      for(let j =0; j < img.height; j++)
        {
          const pixelIndex = (i + j * img.width) * 4;
          const r = img.pixels[pixelIndex + 0];
          const g = img.pixels[pixelIndex + 1];
          const b = img.pixels[pixelIndex + 2];
          const a = img.pixels[pixelIndex + 3];
          const avg = (r + g + b) / 3;
          let myColor = color(r,g,b);

          noStroke();
          fill(setColor(myColor,avg));

          const len = density.length;
          charIndex = Math.floor(map(avg,0,255,len,0));

          textSize(w);
          textAlign(CENTER, CENTER);
          text(density.charAt(charIndex), i * w + w * 0.5, j * h + h * 0.5);
        }
    }
}

function drawWithAsciiPhrase(img, phrase)
{
  background(0);
  let w = width / img.width;
  let h = height / img.height;
  let index = -1;
  img.loadPixels();
  
  for(let j = 0; j < img.height; j++){
      for(let i =0; i < img.width; i++)
        {
          const pixelIndex = (i + j * img.width) * 4;
          const r = img.pixels[pixelIndex + 0];
          const g = img.pixels[pixelIndex + 1];
          const b = img.pixels[pixelIndex + 2];
          const a = img.pixels[pixelIndex + 3];
          const avg = (r + g + b) / 3;
          let myColor = color(r,g,b);

          noStroke();
          fill(setColor(myColor,avg));


          if(avg < 60){
            textSize(w);
            textAlign(CENTER, CENTER);
          text(" ", i * w + w * 0.5, j * h + h * 0.5);
          }
          else{
          index++;
          index %= phrase.length;
          textSize(w);
          textAlign(CENTER, CENTER);
          text(phrase.charAt(index), i * w + w * 0.5, j * h + h * 0.5);
          }
        }
    }
}

function drawAsciiHarckerMode(img,letters)
{
  background(0);
  let w = width / img.width;
  let h = height / img.height;
  
  img.loadPixels();
  
  for(let i = 0; i < img.width; i++){
      for(let j =0; j < img.height; j++)
        {
          const pixelIndex = (i + j * img.width) * 4;
          const r = img.pixels[pixelIndex + 0];
          const g = img.pixels[pixelIndex + 1];
          const b = img.pixels[pixelIndex + 2];
          const a = img.pixels[pixelIndex + 3];
          const avg = (r + g + b) / 3;

          const letterIndex = Math.floor(Math.random() * letters.length);
          let myColor = color(r,g,b);

          noStroke();
          fill(setColor(myColor,avg));


          textSize(w);
          textAlign(CENTER, CENTER)
          text(letters.charAt(letterIndex), i * w + w * 0.5, j * h + h * 0.5);
        }
    }
}

function drawPixelArt(img)
{
  background(220);
  
  let w = width / img.width;
  let h = height / img.height;
  
  img.loadPixels();
  
  for(let i = 0; i < img.width; i++){
      for(let j =0; j < img.height; j++)
        {
          const pixelIndex = (i + j * img.width) * 4;
          const r = img.pixels[pixelIndex + 0];
          const g = img.pixels[pixelIndex + 1];
          const b = img.pixels[pixelIndex + 2];
          const a = img.pixels[pixelIndex + 3];
          const avg = (r + g + b) / 3;
          let myColor = color(r,g,b);

          noStroke();
          fill(setColor(myColor,avg));

          square(i * w, j * h, w + 1);//+1 just to make sure that there aren't any space between the squares
        }
    }
}

function imageToTextAscii(img,density,div)
{
  background(0);
  img.loadPixels();
  let asciiImage ='';
  for(let j = 0; j < img.height; j++){
      for(let i = 0; i < img.width; i++)
        {
        const pixelIndex = (i + j * img.width) * 4;
        const r = img.pixels[pixelIndex + 0];
        const g = img.pixels[pixelIndex + 1];
        const b = img.pixels[pixelIndex + 2];
        const a = img.pixels[pixelIndex + 3];
        const avg = (r + g + b) / 3;

        const len = density.length;
        charIndex = Math.floor(map(avg,0,255,len,0));
        
        const c = density.charAt(charIndex);
        if(c==' ') asciiImage += '&nbsp';
        else asciiImage += c;
      }
    asciiImage += '<br/>';
  }
  div.innerHTML = asciiImage;
}

function setColor(myColor, avg){

  if(!blackWhiteCheckbox.checked){
    if(!redCheckbox.checked) myColor.setRed(0);
    if(!greenCheckbox.checked) myColor.setGreen(0);
    if(!blueCheckbox.checked) myColor.setBlue(0);
  }
  else{
    myColor.setRed(avg);
    myColor.setGreen(avg);
    myColor.setBlue(avg);
  }
  return myColor;
}
