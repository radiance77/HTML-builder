const path = require('path');
const fs = require('fs');

let pathToFile = path.join(__dirname, 'text.txt');
const output = fs.createWriteStream(pathToFile);
const { stdin, stdout } = process;

stdout.write('Hi! Enter something...\n');

stdin.on('data', (data) => {
  let value = data.toString();

  if (value.trim() === 'exit') {
    process.exit();
  } else {
    output.write(value);
  }
});

process.on('SIGINT', () => {
  process.exit();
});

process.on('exit', () => stdout.write('Input is finished!'));
