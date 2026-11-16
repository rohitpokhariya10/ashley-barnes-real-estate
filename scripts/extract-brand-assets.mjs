// One-off asset pipeline: extracts clean transparent logos from the supplied
// logo variation sheet and copies the portrait + JPAR logo into /public/brand.
// Usage: node scripts/extract-brand-assets.mjs <sheet.png> <jpar.png> <portrait.jpg>
import sharp from "sharp";
import path from "node:path";

const [sheet, jpar, portrait] = process.argv.slice(2);
const out = (f) => path.join(process.cwd(), "public", "brand", f);

/** Remove a flat white or black matte, recovering true alpha + colour. */
async function unmatte(region, matte, file) {
  const { data, info } = await sharp(sheet)
    .extract(region)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const px = Buffer.alloc(info.width * info.height * 4);
  // sample matte level from the top-left corner so off-white/off-black is normalised
  const m = matte === "white" ? Math.min(data[0], data[1], data[2]) : Math.max(data[0], data[1], data[2]);
  for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
    let r = data[i], g = data[i + 1], b = data[i + 2], a;
    if (matte === "white") {
      const k = 255 / m;
      r = Math.min(255, r * k); g = Math.min(255, g * k); b = Math.min(255, b * k);
      a = 1 - Math.min(r, g, b) / 255;
      if (a < 0.03) a = 0;
      if (a > 0) { r = (r - (1 - a) * 255) / a; g = (g - (1 - a) * 255) / a; b = (b - (1 - a) * 255) / a; }
    } else {
      r = Math.max(0, r - m); g = Math.max(0, g - m); b = Math.max(0, b - m);
      a = Math.max(r, g, b) / (255 - m);
      if (a < 0.03) a = 0;
      if (a > 0) { r = r / a; g = g / a; b = b / a; }
    }
    px[j] = Math.max(0, Math.min(255, Math.round(r)));
    px[j + 1] = Math.max(0, Math.min(255, Math.round(g)));
    px[j + 2] = Math.max(0, Math.min(255, Math.round(b)));
    px[j + 3] = Math.round(a * 255);
  }
  const meta = await sharp(px, { raw: { width: info.width, height: info.height, channels: 4 } })
    .trim({ threshold: 1 })
    .png({ compressionLevel: 9 })
    .toFile(out(file));
  console.log(file, meta.width, "x", meta.height);
}

await unmatte({ left: 800, top: 512, width: 700, height: 165 }, "white", "ashley-barnes-logo-horizontal.png");
await unmatte({ left: 30, top: 512, width: 700, height: 165 }, "black", "ashley-barnes-logo-horizontal-light.png");
await unmatte({ left: 1000, top: 25, width: 320, height: 245 }, "white", "ab-monogram-gold.png");
await unmatte({ left: 240, top: 25, width: 320, height: 245 }, "black", "ab-monogram-gold-light.png");

if (jpar) { await sharp(jpar).png({ compressionLevel: 9 }).toFile(out("jpar-real-estate-logo.png")); }
if (portrait) { await sharp(portrait).jpeg({ quality: 92, mozjpeg: true }).toFile(out("ashley-barnes-portrait.jpg")); }
