const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const publicDir = path.join(__dirname, 'client', 'public');

const tasks = [
  { src: 'sankarganesh.png', width: 300, height: 300, format: 'png',  quality: 80 },
  { src: 'ganga.jpg',        width: 300, height: 300, format: 'jpeg', quality: 82 },
  { src: 'story.jpg',        width: 1200,             format: 'jpeg', quality: 75 },
  { src: 'products/sambar.png',    width: 600, format: 'png',  quality: 80 },
  { src: 'products/coriander.png', width: 600, format: 'png',  quality: 80 },
  { src: 'products/chilli.png',    width: 600, format: 'png',  quality: 80 },
  { src: 'journal-herbs.jpg',    width: 800, format: 'jpeg', quality: 75 },
  { src: 'journal-spices.jpg',   width: 800, format: 'jpeg', quality: 75 },
  { src: 'journal-turmeric.jpg', width: 800, format: 'jpeg', quality: 75 },
  { src: 'og-image.jpg',         width: 1200, format: 'jpeg', quality: 80 },
];

(async () => {
  for (const t of tasks) {
    const input  = path.join(publicDir, t.src);
    // Write to a separate _compressed name to avoid file locks
    const ext = path.extname(t.src);
    const base = path.basename(t.src, ext);
    const dir  = path.dirname(t.src);
    const tmpName = path.join(publicDir, dir, base + '_c' + ext);

    if (!fs.existsSync(input)) { console.warn('SKIP (missing):', t.src); continue; }

    const beforeBytes = fs.statSync(input).size;

    try {
      let pipeline = sharp(input).resize({ width: t.width, height: t.height, fit: 'inside', withoutEnlargement: true });
      if (t.format === 'jpeg') pipeline = pipeline.jpeg({ quality: t.quality, mozjpeg: true });
      if (t.format === 'png')  pipeline = pipeline.png({ quality: t.quality, compressionLevel: 9 });
      await pipeline.toFile(tmpName);

      const afterBytes = fs.statSync(tmpName).size;
      if (afterBytes < beforeBytes) {
        // Replace original
        fs.copyFileSync(tmpName, input);
        fs.unlinkSync(tmpName);
        console.log(`✅ ${t.src}: ${(beforeBytes/1024).toFixed(1)}KB → ${(afterBytes/1024).toFixed(1)}KB  (saved ${((1-afterBytes/beforeBytes)*100).toFixed(0)}%)`);
      } else {
        fs.unlinkSync(tmpName);
        console.log(`⚠️  ${t.src}: already optimal, keeping (${(beforeBytes/1024).toFixed(1)}KB)`);
      }
    } catch (e) {
      // Clean up tmp if exists
      if (fs.existsSync(tmpName)) { try { fs.unlinkSync(tmpName); } catch(_){} }
      console.error(`❌ ${t.src}: ${e.message}`);
    }
  }
  console.log('\n🎉 Done!');
})();
