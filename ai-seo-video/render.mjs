// Renders video.html frame-by-frame into out.mp4 (needs playwright + ffmpeg).
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import path from 'node:path';
const FPS = 30, DUR = 60, dir = path.dirname(new URL(import.meta.url).pathname);
const ffmpeg = process.env.FFMPEG || 'ffmpeg';
const ff = spawn(ffmpeg, ['-y', '-f', 'image2pipe', '-c:v', 'mjpeg', '-framerate', String(FPS), '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-movflags', '+faststart', path.join(dir, 'out.mp4')],
  { stdio: ['pipe', 'inherit', 'inherit'] });
const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto('file://' + path.join(dir, 'video.html') + '#render');
for (let i = 0; i < FPS * DUR; i++) {
  const url = await page.evaluate(t => { render(t); return document.getElementById('c').toDataURL('image/jpeg', 0.92); }, i / FPS);
  if (!ff.stdin.write(Buffer.from(url.split(',')[1], 'base64'))) await new Promise(r => ff.stdin.once('drain', r));
}
ff.stdin.end();
await browser.close();
await new Promise(r => ff.on('close', r));
