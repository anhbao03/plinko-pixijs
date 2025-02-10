import { pad } from "./padding";

export const WIDTH = 600;

export const WIDTH_MB = 360;

export const gravity = pad(1.5);
export const horizontalFriction = 0.4;
export const verticalFriction = 0.8;

export const MAX_BALL = 15

type RgbColor = { r: number; g: number; b: number };

export function interpolateRgbColors(from: RgbColor, to: RgbColor, length: number): RgbColor[] {
    return Array.from({ length }, (_, i) => ({
        r: Math.round(from.r + ((to.r - from.r) / (length - 1)) * i),
        g: Math.round(from.g + ((to.g - from.g) / (length - 1)) * i),
        b: Math.round(from.b + ((to.b - from.b) / (length - 1)) * i),
    }));
}

export function getBinColors(rowCount: RowCount) {
    {
        const binCount = rowCount + 1;
        const isBinsEven = binCount % 2 === 0;
        const redToYellowLength = Math.ceil(binCount / 2);

        const redToYellowBg = interpolateRgbColors(
            { r: 255, g: 0, b: 63 },
            { r: 255, g: 192, b: 88 },
            redToYellowLength,
        ).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);

        const redToYellowShadow = interpolateRgbColors(
            { r: 166, g: 0, b: 4 },
            { r: 171, g: 121, b: 0 },
            redToYellowLength,
        ).map(({ r, g, b }) => `rgb(${r}, ${g}, ${b})`);

        return {
            background: [...redToYellowBg, ...redToYellowBg.reverse().slice(isBinsEven ? 0 : 1)],
            shadow: [...redToYellowShadow, ...redToYellowShadow.reverse().slice(isBinsEven ? 0 : 1)],
        };
    }
}

export type RowCount = (typeof rowCountOptions)[number];
export const rowCountOptions = [8, 9, 10, 11, 12, 13, 14, 15, 16] as const;

export const binColorsByRowCount = rowCountOptions.reduce(
    (acc, rowCount) => {
        acc[rowCount] = getBinColors(rowCount);
        return acc;
    },
    {} as Record<RowCount, ReturnType<typeof getBinColors>>,
);

export type Multiplier_Type = Record<number, string>

export const multiplierDf: Multiplier_Type = {
    8: '13,3,1.3,0.7,0.4,0.7,1.3,3,13',
    9: '18,4,1.7,0.9,0.5,0.5,0.9,1.7,4,18',
    10: '22,5,2,1.4,0.6,0.4,0.6,1.4,2,5,22',
    11: '24,6,3,1.8,0.7,0.5,0.5,0.7,1.8,3,6,24',
    12: '33,11,4,2,1.1,0.6,0.3,0.6,1.1,2,4,11,33',
    13: '43,13,6,3,1.3,0.7,0.4,0.4,0.7,1.3,3,6,13,43',
    14: '58,15,7,4,1.9,1,0.5,0.2,0.5,1,1.9,4,7,15,58',
    15: '88,18,11,5,3,1.3,0.5,0.3,0.3,0.5,1.3,3,5,11,18,88',
    16: '110,41,10,5,3,1.5,1,0.5,0.3,0.5,1,1.5,3,5,10,41,110',
}
