import fs from 'node:fs/promises';
import sharp from 'sharp';
import convert from 'heic-convert';
for (const file of await fs.readdir('../images')) {
 const name=file.replace(/\.[^.]+$/, '');
 let input=await fs.readFile('../images/'+file);
 if(file.endsWith('.heic') && input[0] !== 0xff) input=Buffer.from(await convert({buffer:input,format:'JPEG',quality:1}));
 await sharp(input).rotate().webp({quality:90}).toFile('public/images/'+name+'.webp');
 console.log(name, await sharp('public/images/'+name+'.webp').metadata().then(m=>[m.width,m.height]));
}

