import { Wallet } from "../models/Wallet";
import { Slot } from "../views/Slot";
import { Wins } from "../models/Wins";
import { dispatcher } from "../index";
import { LOCK_UI, REEL_STOPPED, START_SPIN, UNLOCK_UI } from "../const/Events";

export type SpinState = "idle" | "spinning";

export class GameController {
    private state: SpinState = "idle";

    constructor(
        private wallet: Wallet,
        private slot: Slot,
        private wins: Wins
    ) {
        this.slot.updateBalance(this.wallet.balance);
        this.slot.updateWins(0);

        dispatcher.on(START_SPIN, this.spin, this);
    }

    public async spin(): Promise<void> {
        if (this.state !== "idle") return;

        this.state = "spinning";

        const betSuccessFull = this.wallet.placeBet();

        if (!betSuccessFull) {
            this.state = "idle";
            dispatcher.emit(LOCK_UI);

            return;
        }

        this.slot.updateBalance(this.wallet.balance);
        this.slot.updateWins(0);

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

    private async waitForReelStop(): Promise<void> {
        return new Promise((resolve) => {
            const handler = () => {
                dispatcher.off(REEL_STOPPED, handler);
                resolve();
            };

            dispatcher.on(REEL_STOPPED, handler);
        });
    }
}