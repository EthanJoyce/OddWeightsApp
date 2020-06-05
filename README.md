# Odd Weights
## React Native app for doing gym plate-math with odd, weirdly weighted plates

With Covid-19 closing down all gyms, gym equipment has became insanely expensive, being sold out almost all over the world. Thus, I had to improvise: steel weight plates may not be available anywhere, but concrete sure is! Thus, I cast a ton of concrete plates, ranging from 60 lbs to 5 lbs.

However, gym plates are designed to make plate math easy, with clean multiples of 5 (45, 35, 25, 10, 5, 2.5). I was not fortunate enough to cast these exact values, making every training session a pain trying to figure out what to put on the bar for a certain weight. There are many plate math calculators out there, but none for improvised/homemade plates.

Alas! A calculator that can handle plates with funky weights.

### How to use:
Take your weights and pair them with their closest partners (e.g. 59.5 and 57.5 become approximately a pair of 58.5 plates). Add these values to the plate weights array, and just hand the target weight as a command line argument using node.


### To-Do:
1. Change algorith to calculate each side of the bar individually, allowing for imbalances in weight to be shown
2. Allow for in app customization of parameters (bar weight, plate weights, etc)

---
Licensed under GPLv3
