import { REELSET } from "../const/CFG";

export type WinType = 0 | 2 | 3;

export class Wins {
    private currentResult: { stopPositions: number[]; multi: WinType } | undefined = undefined;
    
    constructor() {
    }

    public getSpinResult(): { stopPositions: number[]; multi: WinType } {
        const startIndex = Math.floor(Math.random() * REELSET.length);
        const symbols = this.getSymbols(startIndex);
        const stopPositions = this.windowIndexes(startIndex);
        const multi = this.evaluateWin(symbols);
        
        this.currentResult = { stopPositions, multi };
        
        return { stopPositions, multi };
    }
    
    public getCurrentResult(): { stopPositions: number[]; multi: WinType } | undefined {
        if (!this.currentResult) {
            return;
        }
        
        return this.currentResult;
    }

    private getSymbols(startIndex: number): string[] {
        const n = REELSET.length;
        const i0 = startIndex;
        const i1 = (i0 + 1) % n;
        const i2 = (i0 + 2) % n;

        return [REELSET[i0], REELSET[i1], REELSET[i2]];
    }

    private windowIndexes(startIndex: number): number[] {
        const n = REELSET.length;
        const i0 = startIndex;
        const i1 = (i0 + 1) % n;
        const i2 = (i0 + 2) % n;

        return [i0, i1, i2];
    }

    private evaluateWin(symbols: string[]): WinType {
        const [a, b, c] = symbols;

        //full win
        if (a === b && b === c) return 3;

        //pair
        if (a === b || a === c || b === c) return 2;

        return 0;
    }

}
