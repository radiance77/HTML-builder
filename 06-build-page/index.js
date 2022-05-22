const path = require('path');
const {
  mkdir,
  rm,
  copyFile,
  readdir,
  readFile,
  writeFile,
} = require('fs/promises');
const fs = require('fs');

const pathToTemplateHtml = path.join(__dirname, 'template.html');
const pathToCssFiles = path.join(__dirname, 'styles');
const pathToProjectDist = path.join(__dirname, 'project-dist');
const pathToComponents = path.join(__dirname, 'components');
const pathAssetsFolder = path.join(__dirname, 'assets');

fs.access(pathToProjectDist, async (error) => {
  if (error) {
    await mkdir(pathToProjectDist);
    createPage();
  } else {
    await rm(pathToProjectDist, { recursive: true, force: true });
    await mkdir(pathToProjectDist, { recursive: true });
    createPage();
  }
});

async function createPageHtml() {
  try {
    let templateMarkup = await readFile(pathToTemplateHtml);
    templateMarkup = templateMarkup.toString();

    const pageHtmlComponents = await readdir(pathToComponents, {
      withFileTypes: true,
    });

    for (let component of pageHtmlComponents) {
      let componentMarkup = await readFile(
        path.join(pathToComponents, component.name)
      );
      let componentName = path.basename(
        path.join(pathToComponents, component.name),
        '.html'
      );
      templateMarkup = templateMarkup.replace(
        `    {{${componentName}}}`,
        componentMarkup.toString()
      );
    }

    writeFile(path.join(pathToProjectDist, 'index.html'), templateMarkup);
  } catch (error) {
    console.log(error.message);
  }
}

async function copyFilesFromFolder(pathToCurrentFolder, pathToCopyFolder) {
  try {
    await rm(pathToCopyFolder, { recursive: true, force: true });
    await mkdir(pathToCopyFolder, { recursive: true });

    currentFiles = await readdir(pathToCurrentFolder, { withFileTypes: true });

    for (let file of currentFiles) {
      let pathToCurrentFile = path.join(pathToCurrentFolder, file.name);
      let pathToCopyFile = path.join(pathToCopyFolder, file.name);

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

async function buildBundleFile(pathToCurrentFolder, pathToDistFile) {
  try {
    const distFiles = await readdir(pathToCurrentFolder, {
      withFileTypes: true,
    });

    const arrFileStyles = [];

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

function createPage() {
  createPageHtml();
  buildBundleFile(pathToCssFiles, path.join(pathToProjectDist, 'style.css'));
  copyFilesFromFolder(pathAssetsFolder, path.join(pathToProjectDist, 'assets'));
}
