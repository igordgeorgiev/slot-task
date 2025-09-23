import { Container } from "pixi.js";
import { Symbol } from "./Symbol";
import gsap from "gsap";
import {dispatcher} from "../index";
import { REELSET, REEL_STOPPED } from "../const/Constants";

export class Reel extends Container {
    private maxSpeed: number;
    private symbols: Symbol[];
    private reelBottom: number;
    private symHeight: number;
    private reelHeight: number;
    private speed: number = 100;
    private currTime: number = 0;
    private counter: number = 0;
    private yPos: number = 0;
    private stopPhase: boolean = false;
    private errors: [] = [];
    private spinUpdateTween: gsap.core.Tween | undefined;
    private yStop: number = 0;
    private stopSymId: number = 10;

    constructor() {
        super();
        this.maxSpeed = 1000;

        const numSymsPerReel = 5;

        this.symbols = [];

        for (let symIdx = 0; symIdx < numSymsPerReel; symIdx++) {
            const symbol = new Symbol(REELSET[symIdx]);

            symbol.y = symbol.height * symIdx;
            this.symbols.push(symbol);
            this.addChild(symbol);
        }

        const symbol = this.symbols[this.symbols.length - 1];

        this.reelBottom = symbol.y;
        this.symHeight = symbol.height;
        this.reelHeight = this.symHeight * numSymsPerReel;
    }

    public spin(): void {
        this.speed = 0;
        this.currTime = 0;
        this.counter = 0;
        this.yPos = 0;
        this.stopPhase = false;
        this.errors = [];

        gsap.to(this, 0.3, { speed: -0.025 * this.maxSpeed, ease: "Cubic.easeInOut" });
        gsap.to(this, 0.75, { delay: 0.3, speed: this.maxSpeed, ease: "Cubic.easeIn" });
        this.spinUpdateTween = gsap.to(this, 1000000, { counter: 1, onUpdate: this.spinUpdate.bind(this) });
    }

    public spinUpdate(): void {
        if(!this.spinUpdateTween) return;

        const newTime = this.spinUpdateTween.time();
        const deltaSec = newTime - this.currTime;

        this.currTime = newTime;

        let yStep = deltaSec * this.speed;

        if (this.stopPhase) {
            const diff = this.yStop - this.yPos;

            const decel = 1200; // tweak as needed

            if (Math.abs(this.speed) > 0) {
                const dir = Math.sign(diff);

                this.speed -= dir * decel * deltaSec;

                if (dir !== Math.sign(this.speed) || Math.abs(diff) < 2) {
                    this.speed = 0;
                }
            }

            const reelSettled = Math.abs(this.speed) < 0.01 && Math.abs(diff) < 0.01;

            if (reelSettled) {
                this.spinUpdateTween.kill();
                yStep = diff;
                dispatcher.emit(REEL_STOPPED);
            }
        }

        this.yPos += yStep;

        for (let symIdx = 0; symIdx < this.symbols.length; symIdx++) {
            const symbol = this.symbols[symIdx];

            symbol.y += yStep;

            if (symbol.y > this.reelBottom) {
                symbol.y -= this.reelHeight;

                if (this.stopSymId != -1 && this.yStop - this.yPos < 2 * this.symHeight) {
                    symbol.setId(REELSET[this.stopSymId]);
                    this.stopSymId = -1;
                } else {
                    symbol.setRandomSymbol();
                }
            }
        }
    }

    public stopOn(stopSymId: number): void {
        this.stopSymId = stopSymId;
        this.stopPhase = true;

        this.yStop = this.yPos + this.symHeight * 21 - this.symbols[1].y;
    }

    private onTick(delta: number) {
    }
}
