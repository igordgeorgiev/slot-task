import { Assets, Container, Sprite } from "pixi.js";
import { dispatcher } from "../index";
import { REELSET, SHOW_WIN, START_SPIN, STOP_SPIN } from "../const/Constants";
import { Reel } from "./Reel";

export class Slot extends Container {
	private reelsSpinning: number = 0;
    private reel: Reel;
    private spinBtn: Sprite;

	constructor() {
		super();

		// const numReels = 3;

		this.createReelBg();

        this.reel = new Reel();
        this.addChild(this.reel);

        // this.reel.spin();
        // setTimeout(() => this.reel.stopOn(6), 4000);
        this.spinBtn = new Sprite(Assets.get("PLAY.png"));
        this.spinBtn.position.set(500, 500);
        this.spinBtn.eventMode = "static";
        this.spinBtn.on("pointerdown", ()=> {
            this.reel.spin()
            setTimeout(() => this.reel.stop([5, 6, 7]), 3000);
        });
        this.addChild(this.spinBtn);
		// this.reels = [];
		// for (let reelIdx = 0; reelIdx < numReels; reelIdx++) {
		// 	const reel = new Reel();
		// 	reel.x = this.width * 0.205 + reel.width * 1.06 * reelIdx;
		// 	reel.y = this.height * 0.35;
		// 	this.addChild(reel);
		// 	this.reels.push(reel);
		// }


		dispatcher.on(START_SPIN, this.startSpin, this);
		dispatcher.on(STOP_SPIN, this.stopOnSymbols, this);
		dispatcher.on(SHOW_WIN, () => {
			// this.toggleSirenAnim(true);
		});
	}

	private stopOnSymbols(stopSyms: number[]): void {
		// for (let reelIdx = 0; reelIdx < this.reels.length; reelIdx++) {
		// 	const reel = this.reels[reelIdx];
		// 	dispatcher.once(REEL_STOPPED, this.onReelStopped, this);
		// 	const stopSymId = stopSyms[reelIdx];
		// 	gsap.delayedCall(0.75 * reelIdx, () => {
		// 		reel.stopOn(stopSymId);
		// 	});
		// }
	}

	private onReelStopped(): void {
		this.reelsSpinning--;
		if (this.reelsSpinning == 0) {
			// dispatcher.emit(Constants.ALL_REELS_STOPPED);
			this.setInputEnabled(true);
		}
	}

	private startSpin(): void {
		// for (let reelIdx = 0; reelIdx < this.reels.length; reelIdx++) {
		// 	gsap.delayedCall(0.2 * reelIdx, this.reels[reelIdx].spin.bind(this.reels[reelIdx]), []);
		// }
        //
		// this.reelsSpinning = this.reels.length;
	}

	private setInputEnabled(enabled: boolean): void {
		// this.leverAnim.interactive = enabled;1
	}

	private createReelBg() {
		const bg = new Sprite(Assets.get("REEL.png"));

		// bg.scale.x = 0.5;
		// bg.scale.y = 0.5;
		this.addChild(bg);
	}
}
