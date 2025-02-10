import { create } from 'zustand';
import { persist, devtools, createJSONStorage } from "zustand/middleware";

interface GameStore {
    ballCount: number;
    multipliers: string[];
    increaseBallCount: () => void;
    decreaseBallCount: () => void;
    pushMultiplier: (multiplier: string) => void;
}

const initState = {
    ballCount: 0,
    multipliers: [],
}

const useGameStore = create<GameStore>()(
    devtools(
        persist(
            (set, get) => ({
                ...initState,

                increaseBallCount: () => set((state) => ({ ballCount: state.ballCount + 1 })),

                decreaseBallCount: () =>
                    set((state) => ({ ballCount: state.ballCount - 1 })),

                pushMultiplier: (multiplier: string) =>
                    set((state) => ({
                        multipliers: [multiplier, ...state.multipliers].slice(0, 4),
                    })),
            })
            ,
            { name: "gameStore", storage: createJSONStorage(() => localStorage) }
        )));

export default useGameStore;