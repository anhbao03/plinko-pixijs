export const getItemLocalStorage = (item: string) => {
    return typeof window !== 'undefined' && localStorage.getItem(item)
        ? JSON.parse(localStorage.getItem(item) || '')
        : ''
}

export const playAudio = (audio: string) => {
    const ballSound = new Audio(audio)
    ballSound.volume = 1
    ballSound.currentTime = 0
    ballSound.play()
}

const findSymmetricIndex = (length: number, index: number): number => {

    const symmetricIndex = length - 1 - index;

    if (index < 0 || index >= length || symmetricIndex < 0 || symmetricIndex >= length) {
        return -1;
    }

    if (index === symmetricIndex) {
        return index;
    }

    return symmetricIndex;
}

export const generatePlinkoPath = (lines: number, targetSlot: number): number[] => {
    targetSlot = Math.random() <= 0.5 ? targetSlot : findSymmetricIndex(lines + 1, targetSlot)
    //random đảo hướng đường đi
    const path: number[] = [];
    const maxL: number = lines - targetSlot;
    const maxR: number = targetSlot;
    let countL: number = 0;
    let countR: number = 0;
    let random: boolean = true;

    for (let i = 0; i < lines; i++) {
        if (countL >= maxL || countR >= maxR) {
            random = false;
        }

        let move: number;
        if (random) {
            move = Math.random() < 0.5 ? -1 : 1; // Random move if directly above target
            if (move === -1) {
                countL += 1;
            } else {
                countR += 1;
            }
        } else {
            if (countL >= maxL) {
                move = 1;
            } else {
                move = -1;
            }
        }

        path.push(move);
    }

    return path;
}