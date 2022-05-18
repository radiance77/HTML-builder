const fs = require('fs');
const path = require('path');
const { readdir } = require('fs/promises');

const pathToFolder = path.join(__dirname, 'secret-folder');

async function getInfoAboutFiles(folderPath) {
  try {
    const files = await readdir(folderPath, { withFileTypes: true });
    for (const file of files) {
      if (file.isFile()) {
        let pathToFile = path.join(folderPath, file.name);
        fs.stat(pathToFile, (error, stat) => {
          if (error) {
            console.log(error.message);
          } else {
            let infoAboutFile = path.parse(pathToFile);
            let resultFileInfo = `${
              infoAboutFile.name
            } - ${infoAboutFile.ext.slice(1)} - ${stat.size / 1024}kb`;
            console.log(resultFileInfo);
          }
        });
      }
    }
  } catch (err) {
    console.error(err);
  }
}

getInfoAboutFiles(pathToFolder);
