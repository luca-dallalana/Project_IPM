# HCI CityClicker

## What's used

-p5.js library 
-html
-css
-javascript

## Overview Of The Problem

This is a HCI (Human-Computer Interaction) project designed to test user speed and accuracy in clicking on specific targets within a grid of city names. The goal of the project is to assess how quickly and accurately users can identify and select city names that start with a certain letter. In our case, all of database's names beginning start with the letter "B".
The original prototype that was given to us looks like this:

  ![Screenshot from 2024-04-14 21-54-35](https://github.com/luca-dallalana/Project_IPM/assets/110358692/ca8da6ae-9491-4130-8545-02eb9f2209c2)

  source: https://editor.p5js.org/IPM23-24/full/lBtEAzXfd
  

## Our Project Description

Different groups had different solutions. Our project's solution presents users with different clusters of city names, organized by their first 2 letters, each represented as a clickable target within a designated area.The system records the user's performance in terms of speed and accuracy.
Features and the HCI laws behind them:
    Eight clusters and 3 single rectangles, ordered alphabetically. The clusters group the cities whose names start with the same 2 letters. 
    Above each cluster there's a 2 letter string to represent the initials of the cities inside each cluster.
    The city names are inside rectangles instead of circles, to maximize clicking area.
    Inside each cluster, the cities names are ordered by length.
    The first 3 letters of each name are highlighted in bright green.
    Once clicked, a bright green outline is formed outside the clicked rectangle.
    The color palette offers great constrast. The background is grey, the rectangles blue, the words white and green.


![Screenshot from 2024-04-14 22-31-26](https://github.com/luca-dallalana/Project_IPM/assets/110358692/4f32b450-1d37-4a2a-b9e8-1107f71c6a11)

    source: https://editor.p5js.org/guilhermedcampos/full/hUj5nmODo

Fitts's Law:
    Clustered Organization: Eight clusters and 3 single rectangles, ordered alphabetically, reduce cognitive load by grouping cities logically.
    Rectangular Shapes: Using rectangles instead of circles maximizes clicking area, adhering to Fitts's Law by providing larger target sizes for easier selection.

Hick's Law:
    Initials Representation: Displaying two-letter initials above clusters simplifies decision-making, helping users quickly identify desired cities.
    Green outline: if a city is chosen repeatedly, the user can more easily spot it since all previously clicked rectangles are outlined.

Weber's Law:
    High-Contrast Color Palette: Using contrasting colors enhances readability and distinguishes elements, reducing cognitive load and improving information processing.
    Ordered City Names: Ordering city names by length within clusters enhances user predictability, providing consistent patterns for users to follow.
    
Stu Card's Feedback Law:
    Feedback with Green Outline: Bright green outline feedback upon selection provides clear confirmation, offering immediate visual feedback for user actions.

Miller's Law:
    Number of clusters: We can memorize 7±2 elements at once. By using 8 clusters users can remember the position of each cluster, or have a general knowledge.

## How to Use
To test the project follow these steps:

1.Clone the repository to your local machine.

  ´´´bash
  git clone https://github.com/luca-dallalana/Project_IPM
  ´´´

2.  Open the index.html file in a web browser or run the p5 web link that contains the project (https://editor.p5js.org/guilhermedcampos/full/hUj5nmODo).

3. Follow the on-screen instructions to start the interaction. Login with an id between 1000 and 200000, and put the your screen's width.

4. Click on the rectangles that contain the given cities for each iteration as quickly and accurate as possible.

5. After completing the interaction, view the performance metrics displayed on the screen.

## How to edit and create a personal solution

1. Getting started with P5: https://p5js.org/

2. To create a solution of your own, you can duplicate the original source code with the following p5 editor link: https://editor.p5js.org/IPM23-24/sketches/lBtEAzXfd.

## Contents

  -target.js - contains de target and border class that will be drawn.
  -support.js - contains the screen that explains the project and the support variables/functions.
  -sketch.js - contains the functions used in the iterations.
  -ppi.js - calculates pixels per inch for each user's screen width
  -legendas.csv - contains the table of cities, along with additional information about them.
  


    

  
