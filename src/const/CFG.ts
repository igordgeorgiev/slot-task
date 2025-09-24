import { TextStyleOptions } from "pixi.js";

export const REELSET = [
    "SYM1","SYM5","SYM1","SYM3","SYM4","SYM3","SYM2","SYM4","SYM3","SYM6",
    "SYM3","SYM1","SYM6","SYM1","SYM2","SYM1","SYM2","SYM2","SYM2","SYM1",
    "SYM2","SYM1","SYM4","SYM1","SYM3","SYM6","SYM1","SYM3","SYM2","SYM5",
    "SYM3","SYM1","SYM2","SYM2","SYM2","SYM1","SYM4","SYM1","SYM4","SYM1",
    "SYM3","SYM2","SYM4","SYM4","SYM5","SYM2","SYM3","SYM1","SYM1","SYM1",
    "SYM4","SYM5","SYM2","SYM2","SYM2","SYM1","SYM5","SYM6","SYM1","SYM3",
    "SYM4","SYM2","SYM5","SYM2","SYM1","SYM5","SYM1","SYM2","SYM1","SYM1",
    "SYM1","SYM4","SYM4","SYM3","SYM3","SYM5","SYM5","SYM4","SYM2","SYM5",
    "SYM2","SYM1","SYM3","SYM2","SYM3","SYM1","SYM4","SYM3","SYM4","SYM2",
    "SYM3","SYM4","SYM1","SYM1","SYM1","SYM2","SYM6","SYM3","SYM2","SYM3",
    "SYM1","SYM5"
];

export const startBalance = 100;

export const spinTime = 3000;

export const moneyStyle: TextStyleOptions = {
    fontFamily: "Arial",
    fontSize: 50,
    fontWeight: "bold",
    fill: 0xffa500,
    stroke: { color: 0x000000, width: 3 },
    align: "center",
}

export const winPrefix: string = "Win: $"
export const balancePrefix: string = "Balance: $"