import { Container } from "pixi.js";
import gsap from "gsap";
import { REELSET } from "../const/CFG";
import { Symbol } from "./Symbol";
import { dispatcher } from "../index";
import { REEL_STOPPED } from "../const/Events";

type Mode = "idle" | "spinning";

export class Reel extends Container {
    private rows = 3;
    private reelSize = this.rows + 2;
    private symHeight: number;
    private yOffset: number = 0;
    private speed = 3000;

    private startNudge = 0.4;
    private stopDipRatio = 0.4;
    private stopDuration = 0.1;

    private symbols: Symbol[] = [];
    private ids: string[] = [];

    private ticker: (() => void) | null = null;
    private stopTween: gsap.core.Tween | null = null;
    private insertionQueue: string[] | null = null;
    private mode: Mode = "idle";

    constructor() {
        super();

        for (let i = 0; i < this.reelSize; i++) {
            this.ids.push(REELSET[i]);
            const sym = new Symbol(this.ids[i]);

            sym.y = sym.height * i
            this.addChild(sym);
            this.symbols.push(sym);
        }
        this.symHeight = this.symbols[0].height;
    }

    public async spin() {
        if (this.mode === "spinning") return;
        
        await gsap.to(this, { y: this.symHeight * this.startNudge * -1, duration: 0.12, ease: "power2.out" })
        await gsap.to(this, { y: 0,  duration: 0.12, ease: "power2.in" });
        this.mode = "spinning";
        if (!this.ticker) {
            this.ticker = () => {
                if (this.mode !== "spinning") return;

                const dtSec = gsap.ticker.deltaRatio() / 60;

                this.advanceWithQueue(this.speed * dtSec);
            };
            gsap.ticker.add(this.ticker);
        }
    }

    public async stop(finalSyms: number[]) {
        if (this.mode !== "spinning") return;

        const reelLength = REELSET.length;
        const idx0 = finalSyms[0] % reelLength;
        const idx1 = finalSyms[1] % reelLength;
        const idx2 = finalSyms[2] % reelLength;

        const topHidden = REELSET[(idx2 + 1) % reelLength];
        const v0 = REELSET[idx0];
        const v1 = REELSET[idx1];
        const v2 = REELSET[idx2];
        const bottomHidden = REELSET[(idx0 - 1 + reelLength) % reelLength];

        const wrapsDesired = Math.max(5, Math.round((this.stopDuration * this.speed) / this.symHeight));
        const distanceToBottom = this.symHeight - (this.yOffset % this.symHeight);
        const totalOffset = distanceToBottom + (wrapsDesired - 1) * this.symHeight;

        const filler = Math.max(0, wrapsDesired - 5);

        this.insertionQueue = [];

        for (let i = 0; i < filler; i++) {
            this.insertionQueue.push(this.randomId());
        }

        this.insertionQueue.push(bottomHidden, v2, v1, v0, topHidden);

        this.mode = "idle";
        const state = { t: 0, prev: 0 };

        if (this.stopTween) {
            this.stopTween.kill();
        }

        this.stopTween = gsap.to(state, {
            t: totalOffset,
            duration: this.stopDuration,
            ease: "power2.out",
            onUpdate: () => {
                const delta = state.t - state.prev;

                state.prev = state.t;
                this.advanceWithQueue(delta);
            },
        });

        await this.stopTween;

        const snap = this.symHeight - this.yOffset;

        if (snap > 0 && snap < this.symHeight * 0.5) {
            this.advanceWithQueue(snap);
        }

        this.insertionQueue = null;
        this.yOffset = 0;
        this.positionSprites();

        const dip = this.symHeight * this.stopDipRatio;
        const startY = this.y;
        const dipY = startY + dip;

        await gsap.to(this, { y: dipY, duration: 0.12, ease: "power1.out" });
        await gsap.to(this, { y: startY, duration: 0.22, ease: "power2.out" });
        console.log("Reel stopped");
        dispatcher.emit(REEL_STOPPED);
    }

    private randomId(): string {
        return REELSET[(Math.random() * REELSET.length) | 0];
    }

    private rowBaseY(i: number): number {
        return (i - 1) * this.symHeight;
    }

    private positionSprites() {
        for (let i = 0; i < this.reelSize; i++) {
            this.symbols[i].y = this.rowBaseY(i) + this.yOffset;
        }
    }

    private applyIds() {
        for (let i = 0; i < this.reelSize; i++) {
            this.symbols[i].setId(this.ids[i]);
        }
    }

    private advanceWithQueue(px: number) {
        if (px <= 0) return;

        this.yOffset += px;
        while (this.yOffset >= this.symHeight) {
            this.yOffset -= this.symHeight;

            //shift down 1: [top, v1, v2, v3, bottom] -> [newTop, top, v1, v2, v3]
            for (let i = this.reelSize - 1; i >= 1; i--) this.ids[i] = this.ids[i - 1];

            const nextId =
                this.insertionQueue && this.insertionQueue.length > 0
                    ? this.insertionQueue.shift()!
                    : this.randomId();

            this.ids[0] = nextId;
            this.applyIds();
        }

        this.positionSprites();
    }
}
