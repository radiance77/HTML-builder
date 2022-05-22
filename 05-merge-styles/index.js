const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const pathToCurrentFolder = path.join(__dirname, 'styles');
const pathToDistFolder = path.join(__dirname, 'project-dist');
const pathToDistFile = path.join(pathToDistFolder, 'bundle.css');

async function buildBundleFile() {
  try {
    const distFiles = await readdir(pathToCurrentFolder, {
      withFileTypes: true,
    });

    let arrFileStyles = [];

    for (const file of distFiles) {
      let { name } = file;
      let fileExt = path.extname(`${name}`).slice(1);

      if (file.isFile() && fileExt === 'css') {
        const input = fs.createReadStream(
          path.join(pathToCurrentFolder, name),
          'utf-8'
        );

        input.on('data', (chunk) => arrFileStyles.push(chunk));
        const output = fs.createWriteStream(pathToDistFile);
        input.on('end', () => output.write(arrFileStyles.join('\n\n')));
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

buildBundleFile();
