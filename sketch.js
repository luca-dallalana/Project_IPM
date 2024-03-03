// Bake-off #2 -- Seleção em Interfaces Densas
// IPM 2023-24, Período 3
// Entrega: até às 23h59, dois dias úteis antes do sexto lab (via Fenix)
// Bake-off: durante os laboratórios da semana de 18 de Março

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER        = 0;      // Add your group number here as an integer (e.g., 2, 3)
const RECORD_TO_FIREBASE  = false;  // Set to 'true' to record user results to Firebase

// Pixel density and setup variables (DO NOT CHANGE!)
let PPI, PPCM;
const NUM_OF_TRIALS       = 12;     // The numbers of trials (i.e., target selections) to be completed
let continue_button;
let legendas;                       // The item list from the "legendas" CSV

// Metrics (DO NOT CHANGE!)
let testStartTime, testEndTime;     // time between the start and end of one attempt (8 trials)
let hits 			      = 0;      // number of successful selections
let misses 			      = 0;      // number of missed selections (used to calculate accuracy)
let database;                       // Firebase DB  

// Study control parameters (DO NOT CHANGE!)
let draw_targets          = false;  // used to control what to show in draw()
let trials;                         // contains the order of targets that activate in the test
let current_trial         = 0;      // the current trial number (indexes into trials array above)
let attempt               = 0;      // users complete each test twice to account for practice (attemps 0 and 1)

// Target list and layout variables
let targets               = [];
const GRID_ROWS           = 8;      // We divide our 80 targets in a 8x10 grid
const GRID_COLUMNS        = 10;     // We divide our 80 targets in a 8x10 grid

// Ensures important data is loaded before the program starts
// Ensures important data is loaded before the program starts
function preload() {
  // Load the CSV file
  legendas = loadTable('legendas.csv', 'csv', 'header');
}

// Runs once at the start
function setup()
{
  createCanvas(700, 500);    // window size in px before we go into fullScreen()
  frameRate(60);             // frame rate (DO NOT CHANGE!)
  
  randomizeTrials();         // randomize the trial order at the start of execution
  drawUserIDScreen();        // draws the user start-up screen (student ID and display size)
}

// Runs every frame and redraws the screen
function draw()
{
  if (draw_targets && attempt < 2)
  {     
    // The user is interacting with the 6x3 target grid
    background(color(144, 238, 144)); // sets background to light green
    
    // Print trial count at the top left-corner of the canvas
    textFont("Arial", 16);
    fill(color(255,255,255));
    textAlign(LEFT);
    text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);
        
    // Draw all targets
	for (var i = 0; i < legendas.getRowCount(); i++) targets[i].draw();
    
    // Draws the target label to be selected in the current trial. We include 
    // a black rectangle behind the trial label for optimal contrast in case 
    // you change the background colour of the sketch (DO NOT CHANGE THESE!)
    fill(color(0,0,0));
    rect(0, height - 40, width, 40);
 
    textFont("Arial", 20); 
    fill(color(255,255,255)); 
    textAlign(CENTER); 
    text(legendas.getString(trials[current_trial],1), width/2, height - 20);
  }
}

// Print and save results at the end of 54 trials
function printAndSavePerformance()
{
  // DO NOT CHANGE THESE! 
  let accuracy			= parseFloat(hits * 100) / parseFloat(hits + misses);
  let test_time         = (testEndTime - testStartTime) / 1000;
  let time_per_target   = nf((test_time) / parseFloat(hits + misses), 0, 3);
  let penalty           = constrain((((parseFloat(95) - (parseFloat(hits * 100) / parseFloat(hits + misses))) * 0.2)), 0, 100);
  let target_w_penalty	= nf(((test_time) / parseFloat(hits + misses) + penalty), 0, 3);
  let timestamp         = day() + "/" + month() + "/" + year() + "  " + hour() + ":" + minute() + ":" + second();
  
  textFont("Arial", 18);
  background(color(0,0,0));   // clears screen
  fill(color(255,255,255));   // set text fill color to white
  textAlign(LEFT);
  text(timestamp, 10, 20);    // display time on screen (top-left corner)
  
  textAlign(CENTER);
  text("Attempt " + (attempt + 1) + " out of 2 completed!", width/2, 60); 
  text("Hits: " + hits, width/2, 100);
  text("Misses: " + misses, width/2, 120);
  text("Accuracy: " + accuracy + "%", width/2, 140);
  text("Total time taken: " + test_time + "s", width/2, 160);
  text("Average time per target: " + time_per_target + "s", width/2, 180);
  text("Average time for each target (+ penalty): " + target_w_penalty + "s", width/2, 220);

  // Saves results (DO NOT CHANGE!)
  let attempt_data = 
  {
        project_from:       GROUP_NUMBER,
        assessed_by:        student_ID,
        test_completed_by:  timestamp,
        attempt:            attempt,
        hits:               hits,
        misses:             misses,
        accuracy:           accuracy,
        attempt_duration:   test_time,
        time_per_target:    time_per_target,
        target_w_penalty:   target_w_penalty,
  }
  
  // Sends data to DB (DO NOT CHANGE!)
  if (RECORD_TO_FIREBASE)
  {
    // Access the Firebase DB
    if (attempt === 0)
    {
      firebase.initializeApp(firebaseConfig);
      database = firebase.database();
    }
    
    // Adds user performance results
    let db_ref = database.ref('G' + GROUP_NUMBER);
    db_ref.push(attempt_data);
  }
}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() 
{
  // Only look for mouse releases during the actual test
  // (i.e., during target selections)
  if (draw_targets)
  {
    for (var i = 0; i < legendas.getRowCount(); i++)
    {
      // Check if the user clicked over one of the targets
      if (targets[i].clicked(mouseX, mouseY)) 
      {
        // Checks if it was the correct target
        if (targets[i].id === trials[current_trial]+1) hits++;
        else misses++;
        
        current_trial++;              // Move on to the next trial/target
        break;
      }
    }
    
    // Check if the user has completed all trials
    if (current_trial === NUM_OF_TRIALS)
    {
      testEndTime = millis();
      draw_targets = false;          // Stop showing targets and the user performance results
      printAndSavePerformance();     // Print the user's results on-screen and send these to the DB
      attempt++;                      
      
      // If there's an attempt to go create a button to start this
      if (attempt < 2)
      {
        continue_button = createButton('START 2ND ATTEMPT');
        continue_button.mouseReleased(continueTest);
        continue_button.position(width/2 - continue_button.size().width/2, height/2 - continue_button.size().height/2);
      }
    }
    // Check if this was the first selection in an attempt
    else if (current_trial === 1) testStartTime = millis(); 
  }
}

// Evoked after the user starts its second (and last) attempt
function continueTest()
{
  // Re-randomize the trial order
  randomizeTrials();
  
  // Resets performance variables
  hits = 0;
  misses = 0;
  
  current_trial = 0;
  continue_button.remove();
  
  // Shows the targets again
  draw_targets = true; 
}

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function createTargets(target_size, horizontal_gap, vertical_gap) {
  // Define the margins between targets by dividing the white space 
  // for the number of targets minus one
  h_margin = horizontal_gap / (GRID_COLUMNS -1);
  v_margin = vertical_gap / (GRID_ROWS - 1);

  // Create an array to hold sorted city data
  let sortedCities = [];

  // Populate the sortedCities array with city data from legendas.csv
  for (let i = 0; i < legendas.getRowCount(); i++) {
    let cityData = {
      id: legendas.getNum(i, 0), // Assuming IDs are in the first column
      name: legendas.getString(i, 1), // Assuming city names are in the second column
      x: 0, // Placeholder for x-coordinate
      y: 0 // Placeholder for y-coordinate
    };
    sortedCities.push(cityData);
  }

  // Sort the sortedCities array by city names alphabetically
  sortedCities.sort((a, b) => {
    return removeAccents(a.name).localeCompare(removeAccents(b.name), 'en', { sensitivity: 'base' });
  });

  // Set targets in a 5 x 5 grid
  let targetIndex = 0;
  for (var r = 0; r < GRID_ROWS; r++) {
    let target_y = 40 + (v_margin + target_size) * r + target_size / 2;
    for (var c = 0; c < GRID_COLUMNS; c++) {
      let target_x = 40 + (h_margin + target_size) * c + target_size / 2;        // give it some margin from the left border

      // Assign coordinates to the sorted city data
      sortedCities[targetIndex].x = target_x;
      sortedCities[targetIndex].y = target_y;

      targetIndex++;
    }
  }

  // Form a cluster for cities starting with "Ba" in the top-left corner
  let baClusterX = 60; // X-coordinate for the Ba cluster
  let baClusterY = 40; // Y-coordinate for the Ba cluster
  let baClusterSize = 0; // Counter for Ba cluster size
  for (let cityData of sortedCities) {
    if (removeAccents(cityData.name.toLowerCase()).startsWith("ba")) {
      cityData.x = baClusterX;
      cityData.y = baClusterY;
      baClusterSize++;
      if (baClusterSize >= 5) { // If Ba cluster size reaches 5, move to next row
        baClusterY += target_size + v_margin-10;
        baClusterX = 60; // Reset X-coordinate for the next row
        baClusterSize = 0;
      } else {
        baClusterX += target_size + h_margin-80;
      }
    }
  }

  // Form a cluster for cities starting with "Be" in the top middle
  let beClusterX = 350*2; // X-coordinate for the Be cluster
  let beClusterY = 40; // Y-coordinate for the Be cluster
  let beClusterSize = 0; // Counter for Be cluster size
  for (let cityData of sortedCities) {
    if (removeAccents(cityData.name.toLowerCase()).startsWith("be")) {
      cityData.x = beClusterX;
      cityData.y = beClusterY;
      beClusterSize++;
      if (beClusterSize >= 3) { // If Be cluster size reaches 3, move to next row
        beClusterY += target_size + v_margin - 10;
        beClusterX = 350*2; // Reset X-coordinate for the next row
        beClusterSize = 0;
      } else {
        beClusterX += target_size + h_margin -80;
      }
    }
  }
  
    // Form a cluster for cities starting with "Be" in the top middle
  let bhClusterX = 1110; // X-coordinate for the Bh cluster
  let bhClusterY = 40; // Y-coordinate for the Bh cluster
  let bhClusterSize = 0; // Counter for Bh cluster size
  for (let cityData of sortedCities) {
    if (removeAccents(cityData.name.toLowerCase()).startsWith("bh")) {
      cityData.x = bhClusterX;
      cityData.y = bhClusterY;
      bhClusterSize++;
      if (bhClusterSize >= 1) { // If Bh cluster size reaches 3, move to next row
        bhClusterY += target_size + v_margin - 10;
        bhClusterX = 1110; // Reset X-coordinate for the next row
        bhClusterSize = 0;
      } else {
        bhClusterX += target_size + h_margin -80;
      }
    }
  }
  
  
  // Form a cluster for cities starting with "Bi" in the top-left corner
  let biClusterX = 1300; // X-coordinate for the Bi cluster
  let biClusterY = 40; // Y-coordinate for the Bi cluster
  let biClusterSize = 0; // Counter for Bi cluster size
  for (let cityData of sortedCities) {
    if (removeAccents(cityData.name.toLowerCase()).startsWith("bi")) {
      cityData.x = biClusterX;
      cityData.y = biClusterY;
      biClusterSize++;
      if (biClusterSize >= 5) { // If Ba cluster size reaches 5, move to next row
        biClusterY += target_size + v_margin-10;
        biClusterX = 1300; // Reset X-coordinate for the next row
        biClusterSize = 0;
      } else {
        biClusterX += target_size + h_margin-80;
      }
    }
  }
  
   // Form a cluster for cities starting with "Bl" in the top right
  let blClusterX = 1300; // X-coordinate for the Bl cluster
  let blClusterY = 400; // Y-coordinate for the Bl cluster
  let blClusterSize = 0; // Counter for Bl cluster size
  for (let cityData of sortedCities) {
    if (removeAccents(cityData.name.toLowerCase()).startsWith("bl")) {
      cityData.x = blClusterX;
      cityData.y = blClusterY;
      blClusterSize++;
      if (blClusterSize >= 2) { // If Bl cluster size reaches 2, move to next row
        blClusterY += target_size + v_margin + 10;
        blClusterX = 1110; // Reset X-coordinate for the next row
        blClusterSize = 0;
      } else {
        blClusterX += target_size + h_margin -80;
      }
    }
  }
  
  // Form a cluster for cities starting with "Bn" in the middle right
  let bnClusterX = 1400+40; // X-coordinate for the Bn cluster
  let bnClusterY = 400; // Y-coordinate for the Bn cluster
  let bnClusterSize = 0; // Counter for Bn cluster size
  for (let cityData of sortedCities) {
    if (removeAccents(cityData.name.toLowerCase()).startsWith("bn")) {
      cityData.x = bnClusterX;
      cityData.y = bnClusterY;
      bnClusterSize++;
      if (bnClusterSize >= 1) { // If Bn cluster size reaches 1, move to next row
        bnClusterY += target_size + v_margin + 10;
        bnClusterX = 1300; // Reset X-coordinate for the next row
        bnClusterSize = 0;
      } else {
        bnClusterX += target_size + h_margin -80;
      }
    }
  }
  
// Form a cluster for cities starting with "Bo" in the middle right
let boClusterX = 60; // X-coordinate for the Bo cluster
let boClusterY = 790; // Y-coordinate for the Bo cluster
let boClusterSize = 0; // Counter for Bo cluster size
for (let cityData of sortedCities) {
  if (removeAccents(cityData.name.toLowerCase()).startsWith("bo")) {
    cityData.x = boClusterX;
    cityData.y = boClusterY;
    boClusterSize++;
    if (boClusterSize >= 2) { // If Bo cluster size reaches 4, move to next row
      boClusterY += target_size + v_margin-10;
      boClusterX = 60; // Reset X-coordinate for the next row
      boClusterSize = 0;
    } else {
      boClusterX += target_size + h_margin - 80;
    }
  }
}
  
  
  // Form a cluster for cities starting with "Br"in the middle right
let brClusterX = 350*2; // X-coordinate for the Br cluster
let brClusterY = 590;// Y-coordinate for the Br cluster
let brClusterSize = 0; // Counter for Br cluster size
for (let cityData of sortedCities) {
  if (removeAccents(cityData.name.toLowerCase()).startsWith("br")) {
    cityData.x = brClusterX;
    cityData.y = brClusterY;
    brClusterSize++;
    if (brClusterSize >= 4) { // If Bo cluster size reaches 4, move to next row
      brClusterY += target_size + v_margin-10;
      brClusterX = 350*2; // Reset X-coordinate for the next row
      brClusterSize = 0;
    } else {
      brClusterX += target_size + h_margin - 80;
    }
  }
}
  
  
    // Form a cluster for cities starting with "Br"in the middle right
let buClusterX = 1500; // X-coordinate for the Br cluster
let buClusterY = 590;// Y-coordinate for the Br cluster
let buClusterSize = 0; // Counter for Br cluster size
for (let cityData of sortedCities) {
  if (removeAccents(cityData.name.toLowerCase()).startsWith("bu")) {
    cityData.x = buClusterX;
    cityData.y = buClusterY;
    buClusterSize++;
    if (buClusterSize >= 4) { // If Bo cluster size reaches 4, move to next row
      buClusterY += target_size + v_margin-10;
      buClusterX = 1500; // Reset X-coordinate for the next row
      buClusterSize = 0;
    } else {
      buClusterX += target_size + h_margin - 80;
    }
  }
}
  
      // Form a cluster for cities starting with "Br"in the middle right
let byClusterX = 1860; // X-coordinate for the Br cluster
let byClusterY = 940;// Y-coordinate for the Br cluster
let byClusterSize = 0; // Counter for Br cluster size
for (let cityData of sortedCities) {
  if (removeAccents(cityData.name.toLowerCase()).startsWith("by")) {
    cityData.x = byClusterX;
    cityData.y = byClusterY;
    byClusterSize++;
    if (byClusterSize >= 4) { // If Bo cluster size reaches 4, move to next row
      byClusterY += target_size + v_margin-10;
      byClusterX = 1500; // Reset X-coordinate for the next row
      byClusterSize = 0;
    } else {
      byClusterX += target_size + h_margin - 80;
    }
  }
}
  


  // Now create targets based on sorted city data
  for (let cityData of sortedCities) {
    let target = new Target(cityData.x, cityData.y + 40, target_size, cityData.name, cityData.id);
    targets.push(target);
  }
}

// Is invoked when the canvas is resized (e.g., when we go fullscreen)
function windowResized() 
{
  if (fullscreen())
  {
    resizeCanvas(windowWidth, windowHeight);
    
    // DO NOT CHANGE THE NEXT THREE LINES!
    let display        = new Display({ diagonal: display_size }, window.screen);
    PPI                = display.ppi;                      // calculates pixels per inch
    PPCM               = PPI / 2.54;                       // calculates pixels per cm
  
    // Make your decisions in 'cm', so that targets have the same size for all participants
    // Below we find out out white space we can have between 2 cm targets
    let screen_width   = display.width * 2.54;             // screen width
    let screen_height  = display.height * 2.54;            // screen height
    let target_size    = 2;                                // sets the target size (will be converted to cm when passed to createTargets)
    let horizontal_gap = screen_width - target_size * GRID_COLUMNS;// empty space in cm across the x-axis (based on 10 targets per row)
    let vertical_gap   = screen_height - target_size * GRID_ROWS;  // empty space in cm across the y-axis (based on 8 targets per column)

    // Creates and positions the UI targets according to the white space defined above (in cm!)
    // 80 represent some margins around the display (e.g., for text)
    createTargets(target_size * PPCM, horizontal_gap * PPCM - 80, vertical_gap * PPCM - 80);

    // Starts drawing targets immediately after we go fullscreen
    draw_targets = true;
  }
}