import { Container, Graphics, Sprite, Assets } from 'pixi.js';
import { Obstacle, Sink } from "../objects";
import { pad, unpad } from "../padding";
import { audioPlinko } from '../../../contants/audioLinks';
import { playAudio } from '../../../utils/helper';

export class Ball {
    private path: number[];
    private id: number;
    private revenue: number;
    private x: number;
    private y: number;
    private radius: number;
    private vx: number;
    private vy: number;
    private container: Container;
    private obstacles: Obstacle[];
    private sinks: Sink[];
    private onFinish: (multiplier: number, id: number, revenue: number, index: number) => void;
    private ballContainer: Container;
    private sinksContainer: Container;
    lines: number
    private isMB: boolean;
    private arrAudio: number[]

    constructor(
        path: number[],
        id: number,
        revenue: number,
        x: number,
        y: number,
        radius: number,
        container: Container,
        obstacles: Obstacle[],
        sinks: Sink[],
        onFinish: (multiplier: number, id: number, revenue: number, index: number) => void,
        sinksContainer: Container,
        isMB: boolean
    ) {
        this.isMB = isMB;
        this.path = path;
        this.id = id;
        this.revenue = revenue;
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.vx = 0;
        this.vy = !this.isMB ? 0 : -1000;
        this.container = container;
        this.obstacles = obstacles;
        this.sinks = sinks;
        this.onFinish = onFinish;
        this.sinksContainer = sinksContainer
        this.lines = sinks.length - 1
        this.arrAudio = Array(this.lines).fill(0);

        // Create ball container
        this.ballContainer = new Container();
        this.container.addChild(this.ballContainer);

        this.createBall();
    }

    private createBall() {
        // Create main ball circle
        this.ballContainer.removeChildren();
        const ball = new Graphics();

        // Draw ball outline
        ball.fill(0x8E1600)
            .circle(0, 0, this.radius)
            .fill();

        // Create highlight
        const highlight = new Graphics();
        highlight.fill(0xFF0000)
            .circle(0, 0, this.radius * 0.5
            )
            .fill();

        // Add all elements to sprite container
        this.ballContainer.addChild(ball);
        this.ballContainer.addChild(highlight);

    }

    private playObstacleSound(obstacle: Obstacle) {
        const indexLine = +obstacle.label.split('_')[1];

        if (this.arrAudio[indexLine] === 0) {
            playAudio(audioPlinko?.obstacle)
            this.arrAudio[+indexLine] = 1
        }
    }


    update() {
        const frictionX = this.obstacles[0].pinsGap / 300
        this.vy += (this.obstacles[0].pinsGap / 3) * 1000
        this.x += this.vx;
        this.y += this.vy;

        // Collision with obstacles
        this.obstacles.forEach((obstacle: Obstacle) => {
            const dist = Math.hypot(this.x - obstacle.x, this.y - obstacle.y);


            if (dist <= pad(this.radius + obstacle.radius)) {
                this.playObstacleSound(obstacle)
                this.collisionObstacle(obstacle, dist, frictionX);
            }
        });

        // Collision with sinks
        for (let i = 0; i < this.sinks.length; i++) {

            const sink = this.sinks[i];
            if (
                unpad(this.x) > sink.x &&
                unpad(this.x) < sink.x + sink.width &&
                unpad(this.y) >= sink.y
            ) {
                playAudio(audioPlinko?.sink)
                this.collisionSink(sink, i);
                break;
            } else {
                // Update sprite position
                this.ballContainer.x = unpad(this.x);
                this.ballContainer.y = unpad(this.y);
            }
        }
    }

    private collisionObstacle(obstacle: Obstacle, dist: number, frictionX: number) {
        const indexLine = obstacle.label.split('_')[1];
        const path = this.path[+indexLine];

        const angle = Math.atan2(this.y - obstacle.y, this.x - obstacle.x);
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);

        this.vx = (Math.cos(angle) * speed * (path === -1 ? -frictionX : frictionX));
        this.vy = Math.cos(this.vx);

        const overlap = this.radius + obstacle.radius - unpad(dist);
        this.x += pad(Math.cos(Math.PI / 4) * (path === -1 ? -overlap : overlap));
        this.y += pad(Math.cos(this.x));

        // Create collision effect
        this.createCollisionEffect(obstacle);
    }

    private collisionSink(sink: Sink, i: number) {
        // this.displayGif(sink); //ex: star blinggg
        this.vx = 0;
        this.vy = 0;

        //const originalY = this.sinks[0].y;
        const sinkColiison = this.sinksContainer.children[i]
        sinkColiison.position.y = sink.height / 4;

        this.onFinish(+sink?.multiplier, this.id, this.revenue, i);
        this.destroy()

        setTimeout(() => {
            sinkColiison.position.y = 0;
        }, 150);
    }

    private createCollisionEffect(obstacle: Obstacle) {
        const effect = new Graphics();
        effect.fill({
            color: 0xFFFFFF,
            alpha: 0.1
        })
            .stroke(
                {
                    color: 0xFFFFFF,
                    width: 0.9,
                    alpha: 0.1
                }
            )
            .circle(unpad(obstacle.x), unpad(obstacle.y), this.radius)
            .fill();

        this.container.addChild(effect);

        // Fade out and remove effect
        let alpha = 0.5;
        const fadeOut = () => {
            alpha -= 0.1;
            effect.alpha = alpha;

            if (alpha <= 0) {
                this.container.removeChild(effect);
                effect.destroy();
            } else {
                requestAnimationFrame(fadeOut);
            }
        };

        requestAnimationFrame(fadeOut);
    }

    // async displayGif(sink: Sink) {
    //     // Load texture using Assets.load
    //     const texture = await Assets.load('/images/plinko/star.png');
    //     const winSprite = new Sprite(texture);

    //     winSprite.anchor.set(0.5);
    //     winSprite.width = sink.width
    //     winSprite.height = sink.height
    //     winSprite.x = sink.x + sink.width / 2;
    //     winSprite.y = sink.y + sink.height / 2;

    //     this.container.addChild(winSprite);

    //     // Remove sprite after animation
    //     setTimeout(() => {
    //         this.container.removeChild(winSprite);
    //         winSprite.destroy();
    //     }, 300);
    // }

    destroy() {
        this.ballContainer.destroy();
    }
}