// sketch.js
let btnRefresh, btnExport, btnExportBatch;
let padding; // Global padding variable

function setup() {
  createCanvas(800, 800);
  noLoop(); // Generates the inkblot only once
  background(255); // Light beige background

  // Create the refresh button
  btnRefresh = createButton("Refresh Inkblot");
  btnRefresh.position(10, height + 10);
  btnRefresh.mousePressed(refreshInkblot);

  // Create the export button
  btnExport = createButton("Export Image");
  btnExport.position(150, height + 10);
  btnExport.mousePressed(exportImage);

  // Create the export batch button
  btnExportBatch = createButton("Export 100 Variants (ZIP)");
  btnExportBatch.position(290, height + 10);
  btnExportBatch.mousePressed(exportBatch);

  drawInkblot(); // Initial inkblot drawing
}

function draw() {
  // This is left empty because the drawing happens only once on setup
}

// Function to draw the inkblot
function drawInkblot() {
  background(255); // Reset the background
  padding = random(100, 150); // Random padding for this inkblot

  // Create an off-screen graphics buffer for the left side
  let leftSide = createGraphics(width / 2, height);
  leftSide.clear(); // Ensure transparency

  // Generate the left side of the inkblot
  for (let i = 0; i < random(100, 200); i++) {
    let x = random(padding, leftSide.width); // Apply padding to x
    let y = random(padding, leftSide.height - padding); // Apply padding to y
    let size = random(2, 50);
    let rotation = random(TWO_PI);
    let fillColor = color(50, random(50, 255));

    leftSide.push();
    leftSide.translate(x, y);
    leftSide.rotate(rotation);
    leftSide.fill(fillColor);
    leftSide.noStroke();
    drawCurvyShape(leftSide, size);
    leftSide.pop();
  }

  // Draw the left side onto the main canvas
  image(leftSide, 0, 0);

  // Flip and draw the left side as the mirrored right side
  push();
  scale(-1, 1); // Flip horizontally
  image(leftSide, -width, 0); // Draw flipped image on the right
  pop();

  // Apply blur to the entire canvas
  filter(BLUR, 8); // Adjust blur intensity (e.g., 5)
}

// Function to draw a curvy shape on a graphics buffer
function drawCurvyShape(gfx, size) {
  gfx.beginShape();
  for (let i = 0; i < TWO_PI; i += random(PI / 6, PI / 4)) {
    let radius = size * random(0.2, 1);
    let x = cos(i) * radius;
    let y = sin(i) * radius;
    gfx.curveVertex(x, y);
  }
  gfx.endShape(CLOSE);
}

// Function to refresh (regenerate) the inkblot
function refreshInkblot() {
  drawInkblot(); // Redraw the inkblot design
}

// Function to export the image as a PNG
function exportImage() {
  saveCanvas("inkblot_image", "png"); // Save the current canvas as PNG
}

// Function to export 100 unique variants as a ZIP
async function exportBatch() {
  let zip = new JSZip();

  for (let i = 1; i <= 100; i++) {
    background(255); // Reset background for each variant
    drawInkblot(); // Draw a new inkblot

    // Convert the canvas to a data URL (base64 PNG)
    let canvasData = canvas.toDataURL("image/png");

    // Remove the base64 prefix to get only the data
    let data = canvasData.replace(/^data:image\/png;base64,/, "");

    // Add the image to the ZIP file
    zip.file(`inkblot_image_${nf(i, 3)}.png`, data, { base64: true });

    // Allow the UI to remain responsive
    await new Promise((resolve) => setTimeout(resolve, 10));
  }

  // Generate the ZIP file and save it
  zip.generateAsync({ type: "blob" }).then(function (content) {
    saveAs(content, "inkblot_images.zip");
  });
}
