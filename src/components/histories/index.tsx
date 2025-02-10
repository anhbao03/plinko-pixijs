import React from 'react'

type Props = {
    data: string[]
}

const Histories = ({ data }: Props) => {
    return (
        <div
            className="flex w-[clamp(1.5rem,0.893rem+2.857vw,2rem)] flex-col overflow-hidden rounded-sm text-[clamp(8px,5.568px+0.714vw,10px)] md:rounded-md lg:w-12 lg:text-sm"
        //style={{ aspectRatio: `1 / ${winCount}` }}
        >
            {data.map((item, idx) => (
                <div key={idx}
                    className={`flex aspect-square items-center justify-center font-bold text-gray-950
                    ${idx % 2 === 0 ? 'bg-[#FF9010]' : 'bg-[#FF6020]'}`}

                >
                    {item}
                    {+item < 100 ? '×' : ''}
                </div>
            ))}
        </div>
    )
}
export default Histories