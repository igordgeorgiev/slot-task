import { Assets, Container, Sprite } from "pixi.js";

export class Symbol extends Container {
	private img: Sprite;
	constructor(symId: string) {
		super();

		this.img = new Sprite(Assets.get(symId + ".png"))
		this.addChild(this.img);
	}

	public setRandomSymbol(): void {
		// this.setId(this.getRndSymId());
	}

	public setId(symId: string): void {
		this.img.texture = Assets.get(symId + ".png");
	}

	private getRndSymId(): number {
		return 1 + Math.floor(Math.random() * 5);
	}
}
