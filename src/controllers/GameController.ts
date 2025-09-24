import { Wallet } from "../models/Wallet";
import { Slot } from "../views/Slot";
import { Wins } from "../models/Wins";
import { dispatcher } from "../index";
import { FAST_STOP, LOCK_UI, REEL_STOPPED, START_SPIN, UNLOCK_UI } from "../const/Events";

export type SpinState = "idle" | "spinning";

export class GameController {
    private state: SpinState = "idle";
    
    constructor(
        private wallet: Wallet,
        private slot: Slot,
        private wins: Wins
    ) {
        this.makeBalanceCheck();
        dispatcher.on(START_SPIN, this.spin, this);
        dispatcher.on(FAST_STOP, this.fastStop, this);
    }

    public async spin(): Promise<void> {
        if (this.state !== "idle") return;

        this.state = "spinning";
        dispatcher.emit(LOCK_UI);

        const betSuccessFull = this.wallet.placeBet();

        if (!betSuccessFull) {
            this.state = "idle";
            dispatcher.emit(LOCK_UI, true);
            console.log("Bet failed");

            return;
        }

        this.makeBalanceCheck();

        const result = this.wins.getSpinResult();

        this.slot.startSpin(result.stopPositions);

        await this.waitForReelStop();

        if (result.multi > 0) {
            const win = this.wallet.payout(result.multi);

            this.slot.updateWins(win);
        }

        this.state = "idle";
        dispatcher.emit(UNLOCK_UI);
    }

    private async fastStop() {
        if (this.state !== "spinning") return;

        const currentResult = this.wins.getCurrentResult();

        await this.waitForReelStop();

        if(currentResult) {
            this.slot.fastStop(currentResult.stopPositions);
        }

        this.state = "idle";
        dispatcher.emit(UNLOCK_UI);
    }

    private async waitForReelStop(): Promise<void> {
        return new Promise((resolve) => {
            const handler = () => {
                dispatcher.off(REEL_STOPPED, handler);
                resolve();
            };

            dispatcher.on(REEL_STOPPED, handler);
        });
    }

    private makeBalanceCheck() {
        const balance = this.wallet.balance;
        let completeLock = false;

        if (balance <= 0) {
            //lock the stop button as well
            //it is a bit stupid, but it works
            completeLock = true;
            console.log("Insufficient funds...");
        }

        dispatcher.emit(LOCK_UI, completeLock);

        this.slot.updateBalance(balance);
        this.slot.updateWins(0);
    }
}