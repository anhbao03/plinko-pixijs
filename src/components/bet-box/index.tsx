import React from 'react'
import useGameStore from '../../store/gameStore'

type Props = {
    revenue: number
    typeRevenue: (value: number) => void
    lines: number
    setLines: (value: number) => void
    dropBall: () => void
}

const BetBox = ({ revenue, typeRevenue, lines, setLines, dropBall }: Props) => {

    const { ballCount } = useGameStore();

    return (
        <div className="flex flex-col gap-2 bg-slate-700 rounded-lg p-3 lg:max-w-80">
            <div className="relative text-white">
                <label className="text-sm font-medium ">Bet Amount</label>
                <div className="flex flex-row justify-start items-centers">
                    <input placeholder='' value={revenue}
                        inputMode='numeric'
                        pattern='[0-9]*'
                        onFocus={(e) => (e.target.placeholder = '')}
                        onBlur={(e) => (e.target.placeholder = '')}
                        onChange={e => { e.preventDefault(); typeRevenue(Number(e.target.value)) }}
                        disabled={ballCount > 0}
                        className='bg-gray-900 rounded-md p-2 outline-none w-full'
                    />
                    <span className='text-center flex justify-center items-center ml-2'>VND</span>
                </div>
            </div>
            {/* LINES */}
            <div className="w-full mx-auto mt-2 text-white">
                <label htmlFor="line-select" className="block text-sm font-medium mb-2">
                    Select lines
                </label>
                <select
                    value={lines}
                    onChange={(e) => setLines(+e.target.value)}
                    disabled={ballCount > 0}
                    id="line-select"
                    className="block w-full bg-gray-900 cursor-pointer px-4 py-2 rounded-md shadow-sm  transition-all duration-200"
                >
                    {[...Array(9)].map((_, i) => (
                        <option key={i + 8} value={i + 8}>{i + 8}</option>
                    ))}
                </select>
            </div>

            <button
                onClick={dropBall}
                disabled={revenue <= 0}
                className='touch-manipulation rounded-md bg-green-500 py-3 font-semibold text-slate-900 transition-colors hover:bg-green-400 active:bg-green-600 disabled:bg-neutral-600 disabled:text-neutral-400'
            >
                Drop Ball

            </button>
        </div>
    )
}

export default BetBox