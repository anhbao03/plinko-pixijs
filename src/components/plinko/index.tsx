import React, { useEffect, useRef, useState } from 'react'
import { BallManager } from './classes/BallManager';
import useScreenSize from '../../hooks/useScreenSize';
import { multiplierDf, WIDTH } from './constants';
import { Application } from 'pixi.js';
import { createObstacles, createSinks } from './objects'
import BetBox from '../bet-box';
import { generatePlinkoPath } from '../../utils/helper';
import Histories from '../histories';
import useGameStore from '../../store/gameStore';

type Props = {}

const PlinkoGame = ({ }: Props) => {
    const screenSize = useScreenSize()
    const [revenue, setRevenue] = useState<number>(1);
    const [lines, setLines] = useState(8)
    const [ballManager, setBallManager] = useState<BallManager>();
    const gameContainerRef = useRef<HTMLDivElement>(null);

    const {
        ballCount,
        multipliers,
        increaseBallCount,
        decreaseBallCount,
        pushMultiplier,
    } = useGameStore();

    const typeRevenue = (revenueType: number) => {
        if (!isNaN(revenueType)) {
            setRevenue(revenueType ?? 0)
        }
    }

    const dropBall = async () => {
        const multiList = multiplierDf[lines]
        const rdIndex = Math.floor(Math.random() * multiList.split(',').length)
        const multiplier = +multiList.split(',')[rdIndex]

        const path = generatePlinkoPath(lines, rdIndex) //-1: move left , 1: move right

        if (ballManager) {
            ballManager.addBall(path, multiplier, new Date().getTime(), revenue);
            increaseBallCount()
        }
    }

    const updateBallDone = (mutiplier: number, id: number, revenue: number, index?: number) => {
        decreaseBallCount()
        pushMultiplier(mutiplier.toString())
    }


    const initApp = async () => {
        if (gameContainerRef.current) {
            const devicePixelRatio = window.devicePixelRatio || 1
            const width = screenSize.width > 768 ? WIDTH : gameContainerRef.current.clientWidth;

            if (!ballManager) {
                const app = new Application();

                await app.init({
                    //canvas: document.createElement('canvas'),
                    width: width,
                    height: width - (screenSize.width > 768 ? 30 : 10),
                    backgroundAlpha: 0,
                    clearBeforeRender: true,
                    antialias: true,
                    powerPreference: 'high-performance',
                    resolution: devicePixelRatio,
                    autoDensity: true,
                    preference: 'webgpu'
                })
                // @ts-ignore
                gameContainerRef?.current?.appendChild(app.canvas as unknown as HTMLCanvasElement);

                // Create ball manager with PIXI app
                const ballClassManager = new BallManager(
                    app,
                    screenSize.width <= 768,
                    lines,
                    width,
                    updateBallDone
                );
                setBallManager(ballClassManager);

            } else {

                ballManager.app.stage.removeChildren();

                ballManager.obstacles = createObstacles(lines, screenSize.width <= 768, width);
                ballManager.sinks = createSinks(lines, screenSize.width < 768, width);
                ballManager.lines = lines;

                ballManager.drawObstacles();
                ballManager.drawSinks();

                ballManager.app.stage.addChild(ballManager.obstaclesContainer);
                ballManager.app.stage.addChild(ballManager.sinksContainer);
            }


            // return () => {
            //     if (app) {
            //         app.destroy(true);
            //     }
            // };
        }
    }

    useEffect(() => {
        initApp()
    }, [gameContainerRef, lines]);

    const size = screenSize.width > 768 ? WIDTH : gameContainerRef?.current?.clientWidth;
    return (
        <div className='w-full flex flex-col items-center'>
            <div className="sm:w-[50vw] w-full flex sm:flex-row flex-col-reverse h-fit items-center justify-center  max-sm:px-2">
                <BetBox
                    revenue={revenue}
                    typeRevenue={ballCount === 0 ? typeRevenue : () => { }}
                    lines={lines}
                    setLines={ballCount === 0 ? setLines : () => { }}
                    dropBall={dropBall}
                />

                <div
                    style={{ width: size, height: size && size - (screenSize.width > 768 ? 30 : 20) }}
                    ref={gameContainerRef}
                    className={`w-fit flex flex-1 items-center justify-center dark:bg-[#111418] rounded-lg`}>

                </div>

                {
                    multipliers && multipliers.length > 0 &&
                    <Histories
                        data={multipliers}
                    />
                }
            </div>
        </div>


    )
}

export default PlinkoGame