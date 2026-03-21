const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const compressAndResize = async () => {
  const publicDir = path.join(__dirname, 'client', 'public');
  const productsDir = path.join(publicDir, 'products');

  const filesToProcess = [
    { file: path.join(publicDir, 'story.jpg'), width: 800, type: 'jpeg' },
    { file: path.join(publicDir, 'journal-herbs.jpg'), width: 600, type: 'jpeg' },
    { file: path.join(publicDir, 'journal-spices.jpg'), width: 600, type: 'jpeg' },
    { file: path.join(publicDir, 'journal-turmeric.jpg'), width: 600, type: 'jpeg' },
    { file: path.join(publicDir, 'organic.png'), width: 200, type: 'png' }
  ];

  // Add all PNGs in the products directory
  if (fs.existsSync(productsDir)) {
    const productFiles = fs.readdirSync(productsDir).filter(f => f.endsWith('.png'));
    productFiles.forEach(f => {
      filesToProcess.push({
        file: path.join(productsDir, f),
        width: 220, // slightly larger than lighthouse 217px display width
        type: 'png'
      });
    });
  }

  for (const { file, width, type } of filesToProcess) {
    if (fs.existsSync(file)) {
      const tempFile = file + '.tmp.' + type;
      try {
        let pipeline = sharp(file).resize(width);
        
        if (type === 'jpeg') {
          pipeline = pipeline.jpeg({ quality: 60, progressive: true, mozjpeg: true });
        } else if (type === 'png') {
          pipeline = pipeline.png({ quality: 50, compressionLevel: 9, adaptiveFiltering: true, palette: true });
        }
        
        await pipeline.toFile(tempFile);
        
        fs.renameSync(tempFile, file);
        console.log(`Successfully compressed and resized: ${file}`);
      } catch (err) {
        console.error(`Error processing ${file}:`, err);
      }
    } else {
      console.log(`File not found: ${file}`);
    }
  }
};

compressAndResize().then(() => console.log('Done'));
