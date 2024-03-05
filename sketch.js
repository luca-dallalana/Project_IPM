// Bake-off #2 -- Seleção em Interfaces Densas
// IPM 2023-24, Período 3
// Entrega: até às 23h59, dois dias úteis antes do sexto lab (via Fenix)
// Bake-off: durante os laboratórios da semana de 18 de Março

// p5.js reference: https://p5js.org/reference/

// Database (CHANGE THESE!)
const GROUP_NUMBER = 0;           // Add your group number here as an integer (e.g., 2, 3)
const RECORD_TO_FIREBASE = false; // Set to 'true' to record user results to Firebase

// Pixel density and setup variables (DO NOT CHANGE!)
let PPI, PPCM;
const NUM_OF_TRIALS = 12; // The numbers of trials (i.e., target selections) to be completed
let continue_button;
let legendas; // The item list from the "legendas" CSV

// Metrics (DO NOT CHANGE!)
let testStartTime, testEndTime; // time between the start and end of one attempt (8 trials)
let hits = 0;                   // number of successful selections
let misses = 0;                 // number of missed selections (used to calculate accuracy)
let database;                   // Firebase DB

// Study control parameters (DO NOT CHANGE!)
let draw_targets = false; // used to control what to show in draw()
let trials;               // contains the order of targets that activate in the test
let current_trial = 0;    // the current trial number (indexes into trials array above)
let attempt = 0;          // users complete each test twice to account for practice
// (attemps 0 and 1)

// Target list and layout variables
let targets = [];
let clusterBorders = [];

// Ensures important data is loaded before the program starts
// Ensures important data is loaded before the program starts
function preload() {
    // Load the CSV file
    legendas = loadTable("legendas.csv", "csv", "header");
}

// Runs once at the start
function setup() {
    createCanvas(700, 500); // window size in px before we go into fullScreen()
    frameRate(60);          // frame rate (DO NOT CHANGE!)

    randomizeTrials();  // randomize the trial order at the start of execution
    drawUserIDScreen(); // draws the user start-up screen (student ID and display
    // size)
}

// Runs every frame and redraws the screen
function draw() {
    if (draw_targets && attempt < 2) {
        // The user is interacting with the 6x3 target grid
        background(color(0, 0, 0)); // sets background to light green (garbage)

        // Print trial count at the top left-corner of the canvas
        textFont("Arial", 16);
        fill(color(255, 255, 255));
        textAlign(LEFT);
        text("Trial " + (current_trial + 1) + " of " + trials.length, 50, 20);

        // Draw all targets
        for (var i = 0; i < legendas.getRowCount(); i++)
            targets[i].draw();
        // Draw all cluster borders
        for (let clusterBorder of clusterBorders)
            clusterBorder.draw();
        
        // Draw "Grouped by two initial letters AND alphabetically ordered" in the center of the screen.
        textFont("Arial", 24);
        fill(color(255, 255, 255));
        textAlign(CENTER);
        text("Grouped by two initial letters AND alphabetically ordered", width / 2, height / 2);

        // Draws the target label to be selected in the current trial. We include
        // a black rectangle behind the trial label for optimal contrast in case
        // you change the background colour of the sketch (DO NOT CHANGE THESE!)
        fill(color(0, 0, 0));
        rect(0, height - 40, width, 40);

        textFont("Arial", 20);
        fill(color(255, 255, 255));
        textAlign(CENTER);
        text(legendas.getString(trials[current_trial], 1), width / 2, height - 20);
    }
}

// Print and save results at the end of 54 trials
function printAndSavePerformance() {
    // DO NOT CHANGE THESE!
    let accuracy = parseFloat(hits * 100) / parseFloat(hits + misses);
    let test_time = (testEndTime - testStartTime) / 1000;
    let time_per_target = nf(test_time / parseFloat(hits + misses), 0, 3);
    let penalty = constrain((parseFloat(95) - parseFloat(hits * 100) / parseFloat(hits + misses)) * 0.2, 0, 100);
    let target_w_penalty = nf(test_time / parseFloat(hits + misses) + penalty, 0, 3);
    let timestamp = day() + "/" + month() + "/" + year() + "  " + hour() + ":" + minute() + ":" + second();

    textFont("Arial", 18);
    background(color(0, 0, 0)); // clears screen
    fill(color(255, 255, 255)); // set text fill color to white
    textAlign(LEFT);
    text(timestamp, 10, 20); // display time on screen (top-left corner)

    textAlign(CENTER);
    text("Attempt " + (attempt + 1) + " out of 2 completed!", width / 2, 60);
    text("Hits: " + hits, width / 2, 100);
    text("Misses: " + misses, width / 2, 120);
    text("Accuracy: " + accuracy + "%", width / 2, 140);
    text("Total time taken: " + test_time + "s", width / 2, 160);
    text("Average time per target: " + time_per_target + "s", width / 2, 180);
    text("Average time for each target (+ penalty): " + target_w_penalty + "s", width / 2, 220);

    // Saves results (DO NOT CHANGE!)
    let attempt_data = {
        project_from : GROUP_NUMBER,
        assessed_by : student_ID,
        test_completed_by : timestamp,
        attempt : attempt,
        hits : hits,
        misses : misses,
        accuracy : accuracy,
        attempt_duration : test_time,
        time_per_target : time_per_target,
        target_w_penalty : target_w_penalty,
    };

    // Sends data to DB (DO NOT CHANGE!)
    if (RECORD_TO_FIREBASE) {
        // Access the Firebase DB
        if (attempt === 0) {
            firebase.initializeApp(firebaseConfig);
            database = firebase.database();
        }

        // Adds user performance results
        let db_ref = database.ref("G" + GROUP_NUMBER);
        db_ref.push(attempt_data);
    }
}

// Mouse button was pressed - lets test to see if hit was in the correct target
function mousePressed() {
    // Only look for mouse releases during the actual test
    // (i.e., during target selections)
    if (draw_targets) {
        for (var i = 0; i < legendas.getRowCount(); i++) {
            // Check if the user clicked over one of the targets
            if (targets[i].clicked(mouseX, mouseY)) {
                // Checks if it was the correct target
                if (targets[i].id === trials[current_trial] + 1)
                    hits++;
                else
                    misses++;

                current_trial++; // Move on to the next trial/target
                break;
            }
        }

        // Check if the user has completed all trials
        if (current_trial === NUM_OF_TRIALS) {
            testEndTime = millis();
            draw_targets = false;      // Stop showing targets and the user performance results
            printAndSavePerformance(); // Print the user's results on-screen and send
            // these to the DB
            attempt++;

            // If there's an attempt to go create a button to start this
            if (attempt < 2) {
                continue_button = createButton("START 2ND ATTEMPT");
                continue_button.mouseReleased(continueTest);
                continue_button.position(width / 2 - continue_button.size().width / 2,
                                         height / 2 - continue_button.size().height / 2);
            }
        }
        // Check if this was the first selection in an attempt
        else if (current_trial === 1)
            testStartTime = millis();
    }
}

// Evoked after the user starts its second (and last) attempt
function continueTest() {
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

function createTargets(target_size, target_gap, screen_width, screen_height) {
    // Create an array to hold sorted city data
    let sortedCities = [];
    // Populate the sortedCities array with city data from legendas.csv
    for (let i = 0; i < legendas.getRowCount(); i++) {
        let cityData = {
            id : legendas.getNum(i, 0),      // Assuming IDs are in the first column
            name : legendas.getString(i, 1), // Assuming city names are in the second column
            x : 0,                           // Placeholder for x-coordinate
            y : 0,                           // Placeholder for y-coordinate
        };
        sortedCities.push(cityData);
    }

    // Sort the sortedCities array by city names alphabetically
    sortedCities.sort(
        (a, b) => { return removeAccents(a.name).localeCompare(removeAccents(b.name), "en", {sensitivity : "base"}); });

    function formCluster(clusterX, clusterY, clusterPrefix, clusterSizeLimit) {
        let initialX = clusterX;
        let initialY = clusterY;
        let clusterSize = 0;
        let clusterCities =
            sortedCities.filter((cityData) => removeAccents(cityData.name.toLowerCase()).startsWith(clusterPrefix));
        for (let cityData of clusterCities) {
            if (clusterSize < clusterSizeLimit) {
                cityData.x = clusterX;
                cityData.y = clusterY;
                clusterX += target_size + target_gap;
                clusterSize++;
            } else {
                clusterX = initialX;
                clusterY += target_size + target_gap;
                cityData.x = clusterX;
                cityData.y = clusterY;
                clusterX += target_size + target_gap;
                clusterSize = 1;
            }
        }

        let clusterBorderX = initialX - 0.5 * target_size - target_gap;
        let clusterBorderY = initialY - 0.5 * target_size - target_gap;
        let width = clusterSizeLimit * (target_size + target_gap) + target_gap;
        let height = clusterY - initialY + target_size + 2 * target_gap;
        let textX = initialX - 0.5 * target_size - target_gap + 0.5 * width;
        let textY = initialY - target_size + target_gap;

        let clusterBorder =
            new ClusterBorder(clusterBorderX, clusterBorderY, width, height, clusterPrefix, textX, textY);
        clusterBorders.push(clusterBorder);
    }

    formCluster(target_size, 1.5 * target_size + target_gap, "ba", 5);
    formCluster(0.5 * screen_width - 2.5 * target_size - 1.5 * target_gap, 1.5 * target_size + target_gap, "be", 4);
    formCluster(0.75 * screen_width - 2.25 * target_size - 1.25 * target_gap, 1.5 * target_size + target_gap, "bh", 1);
    formCluster(screen_width - 5 * target_size - 4 * target_gap, 1.5 * target_size + target_gap, "bi", 4);
    formCluster(screen_width - 5 * target_size - 4 * target_gap, 6 * target_size + 5 * target_gap, "bl", 1);
    formCluster(screen_width - 3 * target_size - 2 * target_gap, 6 * target_size + 5 * target_gap, "bn", 1);
    formCluster(target_size, screen_height - 2.5 * target_size - target_gap, "bo", 2);
    formCluster(screen_width / 2 - 1.5 * target_gap - 2.5 * target_size,
                screen_height - 4.5 * target_size - 3 * target_gap, "br", 4);
    formCluster(screen_width - 5 * target_size - 4 * target_gap, screen_height - 4.5 * target_size - 3 * target_gap,
                "bu", 4);
    formCluster(screen_width - target_size, screen_height - 1.5 * target_size, "by", 1);

    // Now create targets based on sorted city data
    for (let cityData of sortedCities) {
        let target = new Target(cityData.x, cityData.y, target_size, cityData.name, cityData.id);
        targets.push(target);
    }
}

// Is invoked when the canvas is resized (e.g., when we go fullscreen)
function windowResized() {
    if (fullscreen()) {
        resizeCanvas(windowWidth, windowHeight);

        // DO NOT CHANGE THE NEXT THREE LINES!
        let display = new Display({diagonal : display_size}, window.screen);
        PPI = display.ppi; // calculates pixels per inch
        PPCM = PPI / 2.54; // calculates pixels per cm

        // Make your decisions in 'cm', so that targets have the same size for all
        // participants Below we find out out white space we can have between 2 cm
        // targets
        let screen_width = display.width * 2.54;   // screen width
        let screen_height = display.height * 2.54; // screen height
        let target_size = 1.5; // sets the target size (will be converted to cm when passed to createTargets)
        let target_gap = 0.2;  // sets the gap between targets (will be converted to cm when passed to createTargets)

        // Creates and positions the UI targets according to the white space defined above (in cm!) 80 represent some
        // margins around the display (e.g., for text)
        createTargets(target_size * PPCM, target_gap * PPCM, screen_width * PPCM, screen_height * PPCM);

        // Starts drawing targets immediately after we go fullscreen
        draw_targets = true;
    }
}
