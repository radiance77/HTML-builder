const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const pathToCurrentFolder = path.join(__dirname, 'styles');
const pathToDistFolder = path.join(__dirname, 'project-dist');
const pathToDistFile = path.join(pathToDistFolder, 'bundle.css');

async function buildBundleFile() {
  try {
    const output = fs.createWriteStream(pathToDistFile);
    const distFiles = await readdir(pathToCurrentFolder, {
      withFileTypes: true,
    });

    for (const file of distFiles) {
      let { name } = file;
      let fileExt = path.extname(`${name}`).slice(1);

      if (file.isFile() && fileExt === 'css') {
        const input = fs.createReadStream(
          path.join(pathToCurrentFolder, name),
          'utf-8'
        );
        input.pipe(output);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

buildBundleFile();
