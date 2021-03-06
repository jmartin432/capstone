

let animationId = "";

function getAverageVelocity(agentList){
    let velocitySum = new Vector (0,0);
    for (let i = 0; i < agentList.length; i++){
        velocitySum.x += agentList[i].velocity.x;
        velocitySum.y += agentList[i].velocity.y
    }
    velocitySum.scaleBy(1 / agentList.length);
    // velocitySum.normalize();
    return velocitySum;
}

// Agent Class
class Agent {
    constructor(id, type, age, pos, vel, scale_factor, speed_factor, color) {
        this.id = id;
        this.type = type;
        this.age = age;
        this.position = pos;
        this.velocity = vel;
        this.acceleration = new Vector (0,0);
        this.targetVel = new Vector (this.velocity.x, this.velocity.y);
        this.scaleFactor = scale_factor;
        this.speedFactor = speed_factor;
        this.color = color;
        this.neighbors = [];

    }

    outOfBounds(){
        if (this.position.x < 20 && this.velocity.x < 0) {
            return true;
        }

        else if (this.position.x > 380 && this.velocity.x > 0) {
            return true;
        }
        else if (this.position.y < 20 && this.velocity.y < 0) {
            return true;
        }
        else if (this.position.y > 380 && this.velocity.y > 0) {
            return true;
        }
        return false;
    }

    updateOutOfBoundsVelocity(){
        if (this.position.x < 20 && this.velocity.x < 0) {
            this.targetVel.x = -1 * this.velocity.x;
        }

        else if (this.position.x > 380 && this.velocity.x > 0) {
            this.targetVel.x = -1 * this.velocity.x;
        }
        else if (this.position.y < 20 && this.velocity.y < 0) {
            this.targetVel.y = -1 * this.velocity.y;
        }
        else if (this.position.y > 380 && this.velocity.y > 0) {
            this.targetVel.y = -1 * this.velocity.y;
        }
        this.acceleration = Vector.difference(this.targetVel, this.velocity);
        this.acceleration.scaleBy(0.1);
    }

    findPredatorNeighbors(){
        this.neighbors = [];
        for (let i = 0; i < app.predators.length; i++) {
            if (this === app.predators[i]){
                continue;
            }
            if (Vector.distanceSquared(app.predators[i].position, this.position) < (app.alignmentRadius * app.alignmentRadius)) {
                this.neighbors.push(app.predators[i]);

            }
        }
    }

    findPreyNeighbors(){
        this.neighbors = [];
        for (let i = 0; i < app.preys.length; i++) {
            if (this === app.preys[i]){
                continue;
            }
            if (Vector.distanceSquared(app.preys[i].position, this.position) < (app.alignmentRadius * app.alignmentRadius)) {
                this.neighbors.push(app.preys[i]);

            }
        }
    }

    getRandomVelocity(){
        this.targetVel.x = this.velocity.x + (Math.random() - .5);
        this.targetVel.y = this.velocity.y + (Math.random() - .5);
    }

    updateAcceleration(){
        this.acceleration = Vector.difference(this.targetVel, this.velocity);
        this.acceleration.scaleBy(0.1);
    }


    getBearing (){
        return Math.atan2(this.velocity.y, this.velocity.x) * 180 / Math.PI;
    }

    getScaleFactor (){
        let lifeSpan = 0;
        if (this.type = "prey"){
            lifeSpan = app.preyLifeSpan;
        }
        else{
            lifeSpan = app.predatorLifeSpan;
        }
        if (this.age < .25 * lifeSpan){
            return (this.scaleFactor * (this.age / (.25 * lifeSpan)));
        }
        return this.scaleFactor;
    }

    updateVelocity (){
        this.velocity.add(this.acceleration);
        this.velocity.normalize();
    }

    updatePosition (){
        this.position.add(this.velocity);
    }

    setAcceleration (v1){
        this.acceleration = v1;
    }

    resetAcceleration (){
        this.acceleration.x = 0;
        this.acceleration.y = 0;
    }

}


// Vector Class
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    reset () {
        this.x = 0;
        this.y = 0;
    }

    equals(v1){
        if (this.x === v1.x && this.y === v1.y){
            return true;
        }
        return false;
    }

    normalize (){
        let mag = this.magnitude();
        if (mag === 0){
            return;
        }
        return this.scaleBy(1 / mag);

    }

    magnitude (){
        return Math.sqrt(((this.x) * (this.x) + (this.y) * (this.y)));

    }

    scaleBy (val){
         this.x *= val;
         this.y *= val;

    }

    setX (val){
        this.x = val;
    }

    setY (val){
        this.y = val;
    }

    getX (){
        return this.x
    }

    getY (){
        return this.y
    }



    add (v1) {
        this.x += v1.x;
        this.y += v1.y;
    }

    static difference (v1, v2){
        return new Vector (v1.x - v2.x, v1.y - v2.y);
    }

    static distanceSquared (v1, v2){
        return ((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y));
    }

    static distance (v1, v2) {
        return Math.sqrt(((v1.x - v2.x) * (v1.x - v2.x) + (v1.y - v2.y) * (v1.y - v2.y)));
    }
}


function getAvoidanceVelocity(agent){
    let difference = new Vector (0,0);
    let velocityToNeighbor = new Vector (0,0);
    let velocitySum = new Vector (0,0);
    for (let i = 0; i < agent.neighbors.length; i++){
        if (Vector.distanceSquared(agent.position, agent.neighbors[i].position) < app.avoidanceRadius * app.avoidanceRadius) {
            velocityToNeighbor = Vector.difference(agent.neighbors[i].position, agent.position);
            velocityToNeighbor.scaleBy(-1);
            velocitySum.add(velocityToNeighbor);
        }
    }
    velocitySum.normalize();
    return velocitySum;
}

function getAlignmentVelocity(agent){
    let velocitySum = new Vector (0,0);
    for (let i = 0; i < agent.neighbors.length; i++){
        velocitySum.add(agent.neighbors[i].velocity);
    }
    velocitySum.scaleBy(1 / agent.neighbors.length);
    velocitySum.normalize();
    return velocitySum;
}

function getCohesionVelocity(agent){
    let positionSum = new Vector (0,0);

    for (let i = 0; i < agent.neighbors.length; i++){
        positionSum.add(agent.neighbors[i].position);
    }
    positionSum.scaleBy(1 / agent.neighbors.length);
    let vectorToCenter = Vector.difference(positionSum, agent.position);
    vectorToCenter.normalize();
    return vectorToCenter;
}



var app = new Vue({
    el: '#app',
    data: {
        loadId: null,
        states: [],
        title: "",
        view: 'play',
        predators: [],
        predatorIdCount: 0,
        predatorAvoidanceRadius: 50,
        predatorAvoidanceWeight: 1,
        preys: [],
        preyIdCount: 0,
        preyLifeSpan: 1000,
        preyReproduction: 20,
        predatorLifeSpan: 1000,
        predatorReproduction: 100,
        predatorSpeed: 1,
        preySpeed: 1,
        animating: false,
        agentSpeed: 1,
        animationRate: 1,
        initialPreyPop: 50,
        initialPredPop: 4,
        population: 0,
        attackRadius: 50,
        runRadius: 40,
        killRadius: 5,
        alignmentRadius: 50,
        alignmentWeight: 1,
        avoidanceWeight: 1,
        avoidanceRadius: 20,
        cohesionWeight: 1,
        cohesionRadius: 50,
        tick: 0,
        updateRate: 10,
    },

    delimiters: ["<%","%>"],

    methods: {

        importStates: function(){
            let url = "{% url 'game:importstates' %}";
            $.ajax({method: "GET", url: url})
            .done(function (data) {
                console.log(data);
                app.states = data.states;
            })
            .fail(function () {
                alert('Fail!');
            })
        },

        saveState: function(){
            let url = "{% url 'game:savestate' %}";
            let csrf_token = Cookies.get('csrftoken');
            let data = JSON.stringify({title: app.title,
                    alignmentRadius: app.alignmentRadius,
                    alignmentWeight: app.alignmentWeight,
                    avoidanceRadius: app.avoidanceRadius,
                    avoidanceWeight: app.avoidanceWeight,
                    cohesionRadius: app.cohesionRadius,
                    cohesionWeight: app.cohesionWeight});
            console.log(data);
            $.ajax({
                method: "POST",
                url: url,
                headers: {'X-CSRFToken': csrf_token},
                contentType: "application/json; charset=utf-8",
                data: data,
                dataType: 'json'
            }).done(function () {
                app.importStates();
                app.title = '';
            }).fail(function () {
                alert('Fail!');
            });
            this.view = 'play';
        },

        cancelSave: function(){
            this.view = 'play';
        },

        cancelLoad: function(){
            this.view = 'play';
        },

        loadState: function() {

            console.log("id:", app.loadId);
            for (let i = 0; i < app.states.length; i++) {
                console.log(app.states[i].id);
                if (app.states[i].id === app.loadId) {
                    console.log(i, "found");
                    app.alignmentRadius = app.states[i].alignmentRadius;
                    app.alignmentWeight = app.states[i].alignmentWeight;
                    app.avoidanceRadius = app.states[i].avoidanceRadius;
                    app.avoidanceWeight = app.states[i].avoidanceWeight;
                    app.cohesionRadius = app.states[i].cohesionRadius;
                    app.cohesionWeight = app.states[i].cohesionWeight;
                }
            }
            app.view = 'play';
        },

        showSave: function(){
            this.view = 'save';
        },

        showLoad: function(){
            this.animating = false;
            this.view = 'load';
        },

        showPlay: function(){
            this.view = 'play';
        },

        transformString: function (agent) {
            return "translate(" + agent.position.getX() + "," + agent.position.getY() + ")rotate(" + agent.getBearing() + ")scale(" + agent.getScaleFactor() + ")";
        },

        pathString: function (agent) {
            return "m20,0l-20,10l-10,-10l10,-10l20,10";
        },

        colorString: function (agent) {
            return agent.color;
        },

        opacityString: function (agent){
            let lifeSpan = 0;
            if (agent.type = "prey"){
                lifeSpan = app.preyLifeSpan;
            }
            else{
                lifeSpan = app.predatorLifeSpan;
            }
            if (agent.age > .75 * lifeSpan){
                return (lifeSpan - agent.age) / (.25 * lifeSpan);
            }
            return 1;
        },

        removeDead: function(group, dead) {
            let alive = [];
            for ( let i = 0; i < group.length; i++){
                if (dead.indexOf(i) === -1){
                    alive.push(group[i])
                }
            }
            return alive;
        },

        createPredator: function () {
            let id = this.predatorIdCount;
            let age = 0;
            if (this.predatorIdCount < this.initialPredPop){
                age = Math.floor(Math.random() * 10 + 1);
            }
            let position = new Vector(Math.floor(Math.random() * 350 + 25), Math.floor(Math.random() * 350 + 25));
            let velocity = new Vector((Math.random() * 2 - 1), (Math.random() * 2 - 1));
            velocity.normalize();
            let predator = new Agent(id, "predator", age, position, velocity, .7, 2.2, "blue");
            this.predators.push(predator);
            this.predatorIdCount++;
        },

        createPrey: function () {
            let id = this.preyIdCount;
            let age = 0;
            if (this.preyIdCount < this.initialPreyPop){
                age = Math.floor(Math.random() * 10 + 1);
            }
            let position = new Vector(Math.floor(Math.random() * 350 + 25), Math.floor(Math.random() * 350 + 25));
            let velocity = new Vector((Math.random() * 2 - 1), (Math.random() * 2 - 1));
            velocity.normalize();
            let prey = new Agent(id, "prey", age, position, velocity, .4, 2.2, "plum");
            this.preys.push(prey);
            this.preyIdCount++;
        },

        createAgents: function () {
            for (let i = 0; i < this.initialPredPop; i++) {
                this.createPredator();
            }
            for (let i = 0; i < this.initialPreyPop; i++) {
                this.createPrey();
            }
        },

        updateAgents: function () {
            let predator = {};
            let prey = {};
            let avoidanceVelocity = new Vector (0, 0);
            let alignmentVelocity = new Vector (0, 0);
            let cohesionVelocity = new Vector (0, 0);
            let deadPredators = [];
            let deadPrey = [];



            if (this.animating) {
                window.requestAnimationFrame(this.updateAgents);
                this.tick++;
            }

            //Update Predators
            if (this.tick % this.predatorReproduction === 0 && this.predators.length >= 2){
                this.createPredator();
            }
            for (let i = 0; i < this.predators.length; i ++){
                predator = this.predators[i];
                predator.age++;
                if(predator.age > app.predatorLifeSpan){
                    deadPredators.push(i);
                }

                if (predator.id % 10 === this.tick % 10) {
                    let attacking = false;
                    predator.targetVel.reset();
                    predator.acceleration.reset();
                    if (predator.outOfBounds()) {
                        predator.updateOutOfBoundsVelocity();
                        predator.velocity.scaleBy(this.predatorSpeed);
                        predator.updateAcceleration();
                    }
                    else {
                        predator.findPredatorNeighbors();
                        if (predator.neighbors.length > 0) {
                            avoidanceVelocity = getAvoidanceVelocity(predator);
                            avoidanceVelocity.scaleBy(this.avoidanceWeight);
                            predator.targetVel.add(avoidanceVelocity);
                            predator.targetVel.normalize();
                            predator.targetVel.scaleBy(this.predatorSpeed);
                            predator.updateAcceleration();
                        }
                        else{
                            for (let j = 0; j < app.preys.length; j++) {
                                if (Vector.distanceSquared(predator.position, app.preys[j].position) < app.killRadius * app.killRadius){
                                    deadPrey.push(i);
                                    console.log('kill');
                                }
                                if (Vector.distanceSquared(predator.position, app.preys[j].position) < app.attackRadius * app.attackRadius) {
                                    predator.targetVel = Vector.difference(app.preys[j].position, predator.position);
                                    predator.targetVel.normalize();
                                    predator.targetVel.scaleBy(this.predatorSpeed);
                                    predator.updateAcceleration();
                                    attacking = true;
                                    break;
                                }
                            }
                        }

                        if (!attacking){
                            predator.getRandomVelocity();
                            predator.velocity.scaleBy(this.predatorSpeed);
                            predator.updateAcceleration();
                        }

                    }
                }
                predator.updateVelocity();
                predator.velocity.scaleBy(this.predatorSpeed);
                predator.updatePosition();
            }
            if (deadPredators.length > 0){
                this.predators = this.removeDead(this.predators, deadPredators);
            }

            deadPredators = [];
            //Update Prey

            if (this.tick % this.preyReproduction === 0 && this.preys.length >= 2){
                this.createPrey();
            }

            for (let i = 0; i < this.preys.length; i++) {
                prey = this.preys[i];
                prey.age++;
                if(prey.age > app.preyLifeSpan){
                    deadPrey.push(i);
                }


                if (prey.id % 10 === this.tick % 10){
                    let running = false;
                    prey.neighbors = [];
                    prey.targetVel.reset();
                    prey.acceleration.reset();
                    if (prey.outOfBounds()){
                        prey.updateOutOfBoundsVelocity();
                        prey.velocity.scaleBy(this.preySpeed);
                        prey.updateAcceleration();
                    }
                    else {
                        for (let j = 0; j < app.predators.length; j++){
                            if (Vector.distanceSquared(prey.position, app.predators[j].position) < app.runRadius * app.runRadius){
                                prey.targetVel = Vector.difference(prey.position, app.predators[j].position);
                                prey.targetVel.normalize();
                                prey.targetVel.scaleBy(this.preySpeed);
                                prey.updateAcceleration();
                                running = true;
                                break;
                            }
                        }
                        if (!running) {
                            prey.findPreyNeighbors();
                            if (prey.neighbors.length > 0) {
                                avoidanceVelocity = getAvoidanceVelocity(prey);
                                avoidanceVelocity.scaleBy(this.avoidanceWeight);
                                alignmentVelocity = getAlignmentVelocity(prey);
                                alignmentVelocity.scaleBy(this.alignmentWeight);
                                cohesionVelocity = getCohesionVelocity(prey);
                                cohesionVelocity.scaleBy(this.cohesionWeight);
                                prey.targetVel.add(avoidanceVelocity);
                                prey.targetVel.add(alignmentVelocity);
                                prey.targetVel.add(cohesionVelocity);
                                prey.targetVel.normalize();
                                prey.targetVel.scaleBy(this.preySpeed);
                                prey.updateAcceleration();
                            }
                            else {
                                prey.getRandomVelocity();
                                prey.velocity.scaleBy(this.preySpeed);
                                prey.updateAcceleration();
                            }
                        }
                    }
                }

                prey.updateVelocity();
                prey.velocity.scaleBy(this.preySpeed);
                prey.updatePosition();

            }

            if (deadPrey.length > 0) {
                this.preys = this.removeDead(this.preys, deadPrey);
            }
            deadPrey = [];
        },

        play: function(){
            this.animating = true;
            animationId = window.requestAnimationFrame(this.updateAgents);
        },

        pause: function(){
            this.animating = false;
        },

        reset: function(){
            this.animating = false;

            window.cancelAnimationFrame(animationId);
            this.preys = [];
            this.predators = [];
            this.tick = 0;
            app.createAgents();
        },

    },

    computed: {
        disablePlay: function(){
            return (this.animating || this.view === 'save' || this.view === 'load');
        },

        disablePause: function() {
            return !this.animating;
        },

        disableSave: function(){
            return this.title.length === 0;
        },

        disableLoad: function() {
            return false;
        }
    },
});

app.importStates();
app.createAgents();

