#UnicornWarp!

PDX Code Guild Capstone Project

##Project Overview
This project is an expansion of the flocking algorithms developed by Craig 
Reynolds. Basic Flocking algorithms use three simple rules to move objects: an 
avoidance rule, cohesion rule, and alignment rule. Applying these simple rules
to moving objects creates patterns that simulate flocking of birds or schools 
of fish. This project expands on these three rules by adding a predator
object that tracks and scatters the prey and allows for user control of 
the flocking parameters changing the behavior markedly.

##Explanation of the Flocking Rules
Each object alters its velocity based on the position and velocities of neighbors
within a certain radius. For this project made the avoidance radius and alignment 
radius independent.

1. Cohesion Rule: Objects will move toward the center of mass of those objects 
within the alignment radius. Every object has the same mass here so really this is 
just the average of the position vectors of every neighbor.

2. Avoidance Rule. Each object will try to avoid those neighbors within the 
avoidance radius. The vector differences of the object and each neighbor are summed
and normalized so that the object does it's best to avoid every nearby object

3. Alignment Rule. The velocities of the neighbors are averaged and the 
object will change its velocity to align with this average. 

Each of these rules gives a separate vector which can be weighted and added 
to give a target velocity. The object will then accelerate from its current 
velocity to the target velocity.

A new target velocity is only calculated every tenth frame and for the ten frames 
in between the velocity changes incrementally to the target velocity.

The objects in this model are born grow in size and then at a certain begin to fade out 
eventually die, if they are not eaten by a predator first. 

Predator objects do not flock but they do track prey, kill prey, and 
avoid each other.

## Things to Try
1. To just watch the flocking behavior drop the predator population to zero 
and reset the simulation.

2. Increase the speed of the predators so that they can actually catch the prey.

3. Lower the alignment weight and cohesion weight and watch the objects just 
avoid each other.

4.Lower the alignment weight and avoidance weight and watch the objects clump 
together.

5. Lower the avoidance weight to get very tight flocks.

6. Play around with all of different parameters and see what happens.

7. For the most interesting results, the avoidance radius should be lower 
than the alignment radius.

##Technologies
This project is built with the Django Framework, with a Python backend and the 
frontend is Javascript with a Vue.js framework. 

##Code Highlights
1. The vector class I wrote to handle the linear algebra

2. The simulation logic. Moving back within bounds and scattering to avoid predators
override the flocking.

3. The smooth turning of the objects. Each object moves adjusts its velocity 
incrementally over ten frames toward the target velocity.

##Functionality
The user is able to play, pause and reset the simulation. Slider controls allow
the user to control the initial population, control the speed of the objects, and 
adjust the weights and radii of the different flocking rules. Parameter values
can also be saved and loaded. At this time only the parameter for the prey
objects are saved.
 
##Next Steps
I am really intrigued by the possibilities for machine learning here. 
It would be great to let the objects learn their own ideal rules for survivability
and stable population dynamics.

The logic for this simulation can really grow. A third object can be introduced, 
maybe a stationary "algae" type object that is food for the prey and can also over 
overwhelm the predators if it grows unchecked. 

I would like to create a tooltip that when display more data about each individual 
object. When hovered over, a tooltip will display how the flocking rules are being applied
to give the current velocity. 

Rather than give each object the same lifespan and speed these values can 
be assigned individually following a normal distribution.

