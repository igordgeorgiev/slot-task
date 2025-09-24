import { Assets, Container, Sprite } from "pixi.js";

export class Symbol extends Container {
	private img: Sprite;

	constructor(symId: string) {
		super();

		this.img = new Sprite(Assets.get(symId + ".png"))
        this.img.anchor.set(0, 0);
		this.addChild(this.img);
	}


	public setId(symId: string): void {
		this.img.texture = Assets.get(symId + ".png");
    }
}
