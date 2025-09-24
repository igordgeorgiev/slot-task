import { WinType } from "./Wins";

export class Wallet {
    private _balance: number;
    private _currentBet: number = 1;

    constructor(initialBalance: number = 0) {
        this._balance = initialBalance;
    }

    public get balance(): number {
        return this._balance;
    }

    public placeBet(): boolean {
        if (this._currentBet > this._balance) {
            throw new Error("Insufficient funds...");
        }

        this._balance -= this._currentBet;

        return true;
    }

    public payout(multiplier: WinType): number {
        this._balance += this._currentBet * multiplier;

        return this._currentBet * multiplier;
    }

}
