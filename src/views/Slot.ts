import { Application, Assets, Container, Graphics, Sprite } from "pixi.js";
import { dispatcher, gameHeight, gameWidth } from "../index";
import { SHOW_WIN, START_SPIN, STOP_SPIN } from "../const/Constants";
import { Reel } from "./Reel";

export class Slot extends Container {
	private reelsSpinning: number = 0;
    private reel: Reel;
    private spinBtn: Sprite;
    private reelContainer: Container = new Container();

	constructor() {
		super();
        this.addChild(this.reelContainer);

		this.createReelBg();

        this.reel = new Reel();
        this.reelContainer.addChild(this.reel);
        this.reel.x = (this.reelContainer.width - this.reel.width) * 0.5;
        this.reelContainer.position.set((gameWidth - this.reelContainer.width) * 0.5, (gameHeight - this.reelContainer.height) * 0.25);

        this.spinBtn = new Sprite(Assets.get("PLAY.png"));
        this.spinBtn.position.set((gameWidth - this.spinBtn.width) * 0.5, gameHeight * 0.7);
        this.spinBtn.eventMode = "static";
        this.spinBtn.on("pointerdown", ()=> {
            this.reel.spin()
            setTimeout(() => this.reel.stop([5, 6, 7]), 3000);
        });
        this.addChild(this.spinBtn);




		dispatcher.on(START_SPIN, this.startSpin, this);
		dispatcher.on(STOP_SPIN, this.stopOnSymbols, this);
		dispatcher.on(SHOW_WIN, () => {});
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

	private createReelBg(): void {
		const bg = new Sprite(Assets.get("REEL.png"));

        this.reelContainer.addChild(bg);

        const mask = new Graphics().rect(bg.x, bg.y + bg.height * 0.015, bg.width, bg.height * 0.97).fill(0xff0000, 0.4);

        this.reelContainer.addChild(mask);
        this.reelContainer.mask = mask;
	}
}
