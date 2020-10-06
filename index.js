const fs = require('fs');
const program = require('commander');
const { OUTPUT_FILE_NAME, ERROR_MESSAGE } = require('./constants');
const Transformer = require('./transformer');  
const { pipeline } = require('stream');

const parseIntDecimal = n => parseInt(n, 10);

program
  .storeOptionsAsProperties(true)
  .option('-a, --action <type>', 'action encoder or decoder')
  .option(
    '-s, --shift <number>',
    'caesar shift value',
    parseIntDecimal,
    0
  )
  .option('-i, --input [inputPath]', 'input file path/file name')
  .option('-o, --output [outputPath]', 'output file path/file name')
  .parse(process.argv);

const programLog = program;

const getСipher = async args => {
  const { input, output, shift, action } = args;

  let source;
  if (input) {
    source = fs.createReadStream(input);
    let destination;
    if (output) {
      destination = fs.createWriteStream(output);
    } else {
      destination = fs.createReadStream(OUTPUT_FILE_NAME);
    }

    pipeline(
      source,
      new Transformer({
        shift,
        action
      }),
      destination,
        err => {
        if (err) {
          console.error(ERROR_MESSAGE);
        } 
     }
    );   
  } 
};

getСipher(programLog);