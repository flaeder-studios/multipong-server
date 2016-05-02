/*global getWebGLContext,createProgramFromScripts,Float32Array*/
/*jslint plusplus: true */

var intervalId;

(function () {
    'use strict';
    // this function is strict...

    var BALL_EDGES = 32,
        D_ANGLE = 2 * Math.PI / BALL_EDGES;

    function getGlContext() {
        var canvas = document.getElementById("canvas"),
            gl = getWebGLContext(canvas);
        return gl;
    }

    function initGame() {
        var game = {},
            gl = getGlContext("canvas"),
            program = createProgramFromScripts(gl, ["2d-vertex-shader", "2d-fragment-shader"]);

        // Get A WebGL context
        game.dt = 0.05;
        if (!gl) {
            return;
        }

        // setup GLSL program
        gl.useProgram(program);

        // look up where the vertex data needs to go.
        gl.positionLocation = gl.getAttribLocation(program, "aVertexPosition");
        game.gl = gl;

        return game;

    }

    function createBoard() {
        return {
            balls: [],
            paddles: [],

            aspectRatio: 0.75,
            boardEdge: 0.05,

            createBall: function (radius) {
                var b = {};

                b.xspd = 0.0;
                b.yspd = 0.0;
                b.xpos = 0.0;
                b.ypos = 0.0;
                b.radius = radius;

                b.draw = function (gl) {
                    var angle = 0.0,
                        arr = [this.xpos, this.ypos],
                        i, buffer = gl.createBuffer();

                    for (i = 2; i < 2 * (BALL_EDGES + 1) + 2; i += 2) {
                        arr[i] = this.radius * Math.cos(angle) + this.xpos;
                        arr[i + 1] = this.radius * Math.sin(angle) + this.ypos;
                        angle += D_ANGLE;
                    }

                    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(arr), gl.STATIC_DRAW);
                    gl.enableVertexAttribArray(gl.positionLocation);
                    gl.vertexAttribPointer(gl.positionLocation, 2, gl.FLOAT, false, 0, 0);

                    // draw
                    gl.drawArrays(gl.TRIANGLE_FAN, 0, arr.length / 2);
                };

                b.move = function (x, y) {
                    this.xpos = x;
                    this.ypos = y;
                };

                b.moveBy = function (dt) {
                    this.xpos += dt * this.xspd;
                    this.ypos += dt * this.yspd;
                };

                b.setVelocity = function (dx, dy) {
                    this.xspd = dx;
                    this.yspd = dy;
                };

                b.getXPos = function () {
                    return this.xpos;
                };

                b.getYPos = function () {
                    return this.ypos;
                };

                b.handleCollision = function () {
                    if (this.xpos + this.radius > 1) {
                        this.xspd = -this.xspd;
                        this.xpos = 0.9999 - this.radius;
                    } else if (this.xpos - this.radius < -1) {
                        this.xspd = -this.xspd;
                        this.xpos = -0.9999 + this.radius;
                    } else if (this.ypos + this.radius > 1) {
                        this.yspd = -this.yspd;
                        this.ypos = 0.9999 - this.radius;
                    } else if (this.ypos - this.radius < -1) {
                        this.yspd = -this.yspd;
                        this.ypos = -0.9999 + this.radius;
                    }
                };

                this.balls.push(b);
            },

            createPaddle: function (width) {
                var p = {};

                p.width = width;
                p.length = 0.2;
                p.xpos = 0.0;
                p.ypos = 0.0;
                p.velocity = 0.0;

                p.draw = function (gl) {
                    // Create a buffer and put a single clipspace rectangle in
                    // it (2 triangles)
                    var buffer = gl.createBuffer();
                    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
                    gl.bufferData(
                        gl.ARRAY_BUFFER,
                        new Float32Array([
                            this.xpos, this.ypos,
                            this.xpos, this.ypos + this.length,
                            this.xpos - this.width, this.ypos + this.length,
                            this.xpos, this.ypos,
                            this.xpos - this.width, this.ypos,
                            this.xpos - this.width, this.ypos + this.length]),
                        gl.STATIC_DRAW
                    );
                    gl.enableVertexAttribArray(gl.positionLocation);
                    gl.vertexAttribPointer(gl.positionLocation, 2, gl.FLOAT, false, 0, 0);

                    // draw
                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                };

                p.move = function (x, y) {
                    this.xpos = x;
                    this.ypos = y;
                };

                p.moveBy = function (dt) {
                    this.ypos += dt * this.velocity;
                };

                p.setVelocity = function (dy) {
                    this.velocity = dy;
                };

                p.getPos = function () {
                    return this.ypos;
                };

                p.handleCollision = function () {
                    if (this.ypos < -0.9999) {
                        this.ypos = -0.9999;
                        this.velocity = -this.velocity;
                    } else if (this.ypos > 0.9999) {
                        this.ypos = 0.9999;
                        this.velocity = -this.velocity;
                    }
                };

                this.paddles.push(p);

            },

            draw: function (gl) {
                var i;

                for (i = 0; i < this.paddles.length; i++) {
                    this.paddles[i].draw(gl);
                }

                for (i = 0; i < this.balls.length; i++) {
                    this.balls[i].draw(gl);
                }

            },

            updatePositions: function (dt) {
                var i;

                for (i = 0; i < this.paddles.length; i++) {
                    this.paddles[i].moveBy(dt);
                    this.paddles[i].handleCollision();
                }

                for (i = 0; i < this.balls.length; i++) {
                    this.balls[i].moveBy(dt);
                    this.balls[i].handleCollision();
                }

            },

            update: function (dt, gl) {
                this.updatePositions(dt);
                this.draw(gl);
            }
        };
    }

    function main() {
        var game = initGame(),
            board = createBoard(),
            i;

        board.createBall(0.1);
        board.createBall(0.1);
        board.createBall(0.1);
        board.createPaddle(0.1);

        for (i = 0; i < board.balls.length; i++) {
            board.balls[i].setVelocity(Math.random(), Math.random());
        }

        for (i = 0; i < board.paddles.length; i++) {
            board.paddles[i].setVelocity(Math.random());
        }

        intervalId = setInterval(function () {
            board.update(game.dt, game.gl);
        }, game.dt * 1000);
    }


    window.onload = main;

}());

var quitGame = function () {
    clearInterval(intervalId);
    window.location = "/#/lobby";
};
