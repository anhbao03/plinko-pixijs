import { binColorsByRowCount, RowCount } from "../constants";
import { Obstacle, Sink, createObstacles, createSinks } from "../objects";
import { pad, unpad } from "../padding";
import { Ball } from "./Ball";
import { Application, Container, Graphics, Assets, BitmapText } from 'pixi.js';

export class BallManager {
    public app: Application;
    private balls: Ball[] = [];
    public obstacles: Obstacle[]
    public sinks: Sink[]
    private isMB: boolean;
    public lines: number;
    private widthScreen: number;
    private onFinish?: (multiplier: number, id: number, revenue: number, index?: number) => void;

    public obstaclesContainer: Container;
    public sinksContainer: Container;

    constructor(
        app: Application,
        isMB: boolean,
        lines: number,
        widthScreen: number,
        onFinish: (multiplier: number, id: number, revenue: number, index?: number) => void
    ) {
        this.app = app
        this.balls = [];
        this.obstacles = createObstacles(lines, isMB, widthScreen);
        this.sinks = createSinks(lines, isMB, widthScreen);

        this.isMB = isMB;
        this.lines = lines;
        this.widthScreen = widthScreen
        this.onFinish = onFinish;
        //PIXI.settings.ROUND_PIXELS = true;
        // Create containers
        this.obstaclesContainer = new Container();
        this.sinksContainer = new Container();

        // Add containers to stage
        this.app.stage.addChild(this.obstaclesContainer);
        this.app.stage.addChild(this.sinksContainer);

        // Draw initial state
        this.drawObstacles();
        this.drawSinks();

        // Set up game loop
        this.app.ticker.add(() => this.update());

    }

    addBall(path: number[], multiplier: number, id: number, revenue: number) {
        const radiusBall = (this.obstacles[0].pinsGap - this.obstacles[0].radius * 2) / 3

        const newBall = new Ball(
            path,
            id,
            revenue,
            pad(this.widthScreen / 2),
            pad(10),
            radiusBall,
            this.app.stage,
            this.obstacles,
            this.sinks,
            (index) => {
                this.balls = this.balls.filter(ball => ball !== newBall);
                this.onFinish?.(multiplier, id, revenue, index);
            },
            this.sinksContainer,
            this.isMB
        );

        this.balls.push(newBall);
    }

    public drawObstacles() {
        this.obstaclesContainer.removeChildren();

        this.obstacles.forEach((obstacle) => {
            const graphics = new Graphics();

            graphics.fill(0xFFFFFF)
                .circle(
                    unpad(obstacle.x),
                    unpad(obstacle.y),
                    obstacle.radius
                )
                .fill();

            this.obstaclesContainer.addChild(graphics);

        });
    }

    public async drawSinks() {
        const devicePixelRatio = window.devicePixelRatio || 1
        // Clear previous sinks
        this.sinksContainer.removeChildren();
        await Assets.load('/font/arial_shadow.xml');

        this.sinks.forEach((sink, i) => {
            const sinkSingleContainer = new Container();
            const graphics = new Graphics();
            const colors = binColorsByRowCount[this.lines as RowCount];
            const cornerRadius = this.isMB ? 4 : 6;
            const shadowHeight = this.isMB && this.lines > 14 ? 2 : 4;

            // Enable anti-aliasing for sharper graphics
            graphics.setStrokeStyle(0);

            // Draw shadow and main rectangles with crisp edges
            const rectangleProps = {
                x: Math.round(sink.x),  // Round to whole pixels
                y: Math.round(sink.y),
                width: Math.round(sink.width),
                height: Math.round(sink.height),
            };

            graphics.fill(colors.shadow[i])
                .roundRect(
                    rectangleProps.x,
                    rectangleProps.y,
                    rectangleProps.width,
                    rectangleProps.height,
                    cornerRadius
                )
                .fill()
                .fill(colors.background[i])
                .roundRect(
                    rectangleProps.x,
                    rectangleProps.y,
                    rectangleProps.width,
                    rectangleProps.height - shadowHeight,
                    cornerRadius
                )
                .fill();

            const multiplier = Number(sink.multiplier);
            const text = multiplier === 1000 ? '1K' :
                `${multiplier >= 10 ? multiplier : multiplier.toFixed(1)}`;

            const multiplierText = new BitmapText({
                text,
                style: {
                    fontFamily: 'Arial_Shadow',
                    fontSize: this.lines >= 14 ? (this.isMB ? 10 : 12) : (this.lines < 14 && this.lines >= 11) ? 13 : (!this.isMB ? 17 : 15),
                    //fill: 0xFFFFFF,
                    align: 'center',
                    letterSpacing: 0.2
                },
                resolution: devicePixelRatio,
                roundPixels: true

            });

            multiplierText.anchor.set(0.5);
            multiplierText.position.set(
                Math.round(rectangleProps.x + rectangleProps.width / 2),
                Math.round(rectangleProps.y + rectangleProps.height / 3)
            );

            sinkSingleContainer.addChild(graphics, multiplierText);
            this.sinksContainer.addChild(sinkSingleContainer);
        });
    }

    update() {
        // Update balls
        this.balls.forEach(ball => {
            ball.update();
        });
    }

    stop() {
        this.app.ticker.stop();
    }
}