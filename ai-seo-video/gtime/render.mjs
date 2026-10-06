// Usage: node render.mjs            -> out.mp4 (video + voice)
//        node render.mjs 3.2 10 ... -> preview PNGs of those timestamps in build/
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const FPS = 30, dir = path.dirname(new URL(import.meta.url).pathname), ffmpeg = process.env.FFMPEG || 'ffmpeg';
const browser = await chromium.launch({ args: ['--allow-file-access-from-files'] });
const page = await browser.newPage();
await page.goto('file://' + path.join(dir, 'gtime.html') + '#render');
await page.evaluate(() => window.ready);
const grab = t => page.evaluate(t => { render(t); return document.getElementById('c').toDataURL('image/jpeg', 0.93); }, t);
const stills = process.argv.slice(2).map(Number);
if (stills.length) {
  for (const t of stills) fs.writeFileSync(path.join(dir, `build/p${t}.jpg`), Buffer.from((await grab(t)).split(',')[1], 'base64'));
} else {
  const total = await page.evaluate(() => window.TOTAL);
  const ff = spawn(ffmpeg, ['-y', '-v', 'error', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
    '-i', path.join(dir, 'build/voice.m4a'), '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', 'slow', '-pix_fmt', 'yuv420p',
    '-crf', '18', '-c:a', 'copy', '-shortest', '-movflags', '+faststart', path.join(dir, 'out.mp4')], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < Math.ceil(total * FPS); i++) {
    if (!ff.stdin.write(Buffer.from((await grab(i / FPS)).split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
}
await browser.close();
