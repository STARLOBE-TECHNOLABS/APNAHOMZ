import fs from "fs";
import response from "./response_1771680706016.json" assert { type: "json" };

const base64 = response.image;
const buffer = Buffer.from(base64, "base64");
fs.writeFileSync("output3.png", buffer);
