import { WIDTH, WIDTH_MB, multiplierDf } from "./constants";
import { pad } from "./padding";

export interface Obstacle {
    label: string
    x: number;
    y: number;
    radius: number;
    pinsGap: number
}

export interface Sink {
    x: number;
    y: number;
    width: number;
    height: number;
    multiplier: string;
}

export const createObstacles = (lines: number, isMB: boolean, widthScreen: number): Obstacle[] => {
    const obstacles: Obstacle[] = [];
    const radius = ((!isMB ? 22 : 20) - lines) / 2
    const pinsGap = (widthScreen - radius * 4) / (lines + 1)

    for (let l = 0; l < lines; l++) {
        const linePins = 3 + l
        const lineWidth = linePins * pinsGap
        for (let i = 0; i < linePins; i++) {
            const pinX =
                widthScreen / 2 -
                lineWidth / 2 +
                i * pinsGap +
                pinsGap / 2

            const pinY =
                widthScreen / lines + l * (pinsGap - radius) + pinsGap / 2


            obstacles.push({ label: `pin_${l}_${i}`, x: pad(pinX), y: pad(pinY), radius: radius, pinsGap: pinsGap })
        }
    }
    return obstacles;
}

export const createSinks = (lines: number, isMB: boolean, widthScreen: number): Sink[] => {
    const sinks: Sink[] = [];
    const radiusObst = ((!isMB ? 22 : 20) - lines) / 2
    const pinsGap = (widthScreen - radiusObst * 4) / (lines + 1)

    // const NUM_SINKS = lines + 1
    const MULTIPLIERS = multiplierDf[lines].split(',')

    let lastMultiplierX: number =
        widthScreen / 2 - (pinsGap / 2) * (lines + 3) + radiusObst / 2

    for (let i = 0; i < MULTIPLIERS.length; i++) {
        const x = lastMultiplierX + pinsGap;
        const y = (widthScreen / lines + lines * pinsGap) - (lines + 2) * radiusObst + radiusObst
        const width = pinsGap - radiusObst;
        const height = width / 1.5;
        sinks.push({ x, y, width, height, multiplier: MULTIPLIERS[i] });

        lastMultiplierX = x
    }

    return sinks;
}
