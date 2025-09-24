import { Assets, Container, Graphics, Sprite, Text } from "pixi.js";
import { dispatcher, gameHeight, gameWidth } from "../index";
import { SHOW_WIN } from "../const/Events";
import { Reel } from "./Reel";
import { balancePrefix, moneyStyle, spinTime, winPrefix } from "../const/CFG";

export class Slot extends Container {
    private reel: Reel = new Reel();
    private reelContainer: Container = new Container();
    private balanceText: Text = new Text({ text: balancePrefix + 0, style: moneyStyle });
    private winsText: Text = new Text({ text: winPrefix + 0, style: moneyStyle });
    private spinTimeOut: ReturnType<typeof setTimeout> | null = null;

    constructor() {
        super();
        this.addChild(this.reelContainer);

        this.createReelBg();
        this.createReel();
        this.resizeTxt();
        this.addChild(this.balanceText);
        this.addChild(this.winsText);

        dispatcher.on(SHOW_WIN, () => {});
    }

    private createReel() {
        this.reelContainer.addChild(this.reel);
        this.reel.x = (this.reelContainer.width - this.reel.width) * 0.5;
        this.reelContainer.position.set(
            (gameWidth - this.reelContainer.width) * 0.5,
            (gameHeight - this.reelContainer.height) * 0.25,
        );
    }

    private createReelBg(): void {
        const bg = new Sprite(Assets.get("REEL.png"));

        this.reelContainer.addChild(bg);

        const mask = new Graphics()
            .rect(bg.x, bg.y + bg.height * 0.015, bg.width, bg.height * 0.97)
            .fill(0xff0000, 0.4);

        this.reelContainer.addChild(mask);
        this.reelContainer.mask = mask;
    }

    public startSpin(stopPositions: number[]): void {
        this.reel.spin();
        console.log("start spin");
        this.spinTimeOut = setTimeout(() => {
            this.reel.stop(stopPositions);
            this.spinTimeOut = null;
        }, spinTime);
    }

    public fastStop(stopPositions: number[]): void {
        if (this.spinTimeOut !== null) {
            clearTimeout(this.spinTimeOut);
            this.spinTimeOut = null;
        }

        this.reel.stop(stopPositions);
        console.log("fast stop");
    }

    public updateBalance(amount: number): void {
        this.balanceText.text = balancePrefix + amount.toFixed(2);
        this.resizeTxt();
    }

    public updateWins(amount: number): void {
        this.winsText.text = winPrefix + amount.toFixed(2);
        this.resizeTxt();
    }

    private resizeTxt() {
        this.winsText.position.set(gameWidth * 0.05, gameHeight * 0.1);
        this.balanceText.position.set(gameWidth - this.balanceText.width * 1.1, gameHeight * 0.1);
    }
}
