const { rm, mkdir, readdir, copyFile } = require('fs/promises');
const path = require('path');

const pathToCurrentFolder = path.join(__dirname, 'files');
const pathToCopyFolder = path.join(__dirname, 'files-copy');

let pathToCurrentFile = null;
let pathToCopyFile = null;
let currentFiles = null;

async function copyFilesFromFolder() {
  try {
    await rm(pathToCopyFolder, { recursive: true, force: true });
    await mkdir(pathToCopyFolder, { recursive: true });

    currentFiles = await readdir(pathToCurrentFolder, { withFileTypes: true });

    for (let file of currentFiles) {
      pathToCurrentFile = path.join(pathToCurrentFolder, file.name);
      pathToCopyFile = path.join(pathToCopyFolder, file.name);

      if (!file.isDirectory()) {
        await copyFile(pathToCurrentFile, pathToCopyFile);
      } else {
        copyFilesFromFolder(pathToCurrentFile, pathToCopyFile);
      }
    }
  } catch (error) {
    console.log(error.message);
  }
}

copyFilesFromFolder();
