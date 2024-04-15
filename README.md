# HCI CityClicker

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

    source:

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
    Number of clusters: We can memorize 7+2 elements at once. By using 8 clusters users can remember the position of each cluster, or have a general knowledge.

  
