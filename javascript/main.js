// Get all the elements required for the rest of the code to work.
// They are here just so that we don't have
let inputFile = document.querySelector('input.file-input');
let inputFormat = document.querySelectorAll('div.file-format input');
let inputEncoding = document.querySelectorAll('div.file-textformat input');

// Listen to the click on the file submit
document.querySelector('a.file-submit').addEventListener('mousedown', (e) => {
  // Get the currently selected files
  let files = inputFile.files;
  // If there is no files, remind the user who runs the shop
  if (files.length <= 0) {
    alert('please select a file');
    return;
  }
  // "Select" the first file
  file = files[0];
  // If the file isn't just plain text then run away
  if (file.type != 'text/plain') {
    alert('the file uploaded is not in plain text');
    return;
  }
  // Read the file data
  let fileReader = new FileReader();
  // Wait for the file to be ready to load
  fileReader.onload = (event) => {
    let result = event.target.result;
    // Put the text into the original box
    document.querySelector('.content .file-preview.source .body').innerText =
      result;
    // Check which format the files are comming in as
    switch (getCheckedRadioValue('file_format')) {
      case 'section_one':
        parser.parseSectiony(result).then((poggers) => {
          document.querySelector(
            '.content .file-preview.result .body'
          ).innerText = poggers;
        });
        break;
      case 'space_one':
        parser.parseSpacer(result).then((poggers) => {
          document.querySelector(
            '.content .file-preview.result .body'
          ).innerText = poggers;
        });
        break;

      default:
        break;
    }
  };

  fileReader.onerror = (error) => {
    console.error(error);
    alert('An error occured, check console');
    return;
  };

  // Check which file formatting the user selected, sometimes software that
  // produces BB_Labels is old and makes Windows formatted text instead of
  // the universal UTF-8 type.
  fileReader.readAsText(file, getCheckedRadioValue('file_encoding'));
});

let parser = {};

/**
 * Extracts the lines into an array with all the lines
 * @param {string} text
 * @returns {Promise<string[]>}
 */
parser.extractLines = (text) => {
  return new Promise((resolve) => {
    let lines = text.split(/\r?\n/);

    resolve(lines);
  });
};

// There's two types I know of BB_Label:
// - Each line starts with "§"
// - Each line starts with "\t"
// I don't exactly remeber what order each comes first but I know each line
// contains something like this:
// - Author, Title, ISBN, Editor?, Genre?
// Basically different formats just move those around.

/**
 * Parses the Spacer format into Sectiony format.
 * Returns a string in the new string
 * @param {string} text
 * @returns {Promise<string[]>}
 */
parser.parseSpacer = (text) => {
  return new Promise((resolve) => {
    parser.extractLines(text).then((lines) => {
      lines.forEach((line, index) => {
        let lineArgs = line.split(/\t/);

        let fuck = true;
        let tries = 0;

        while (fuck && tries < 10) {
          let indexOfRemoval = lineArgs.indexOf('');
          if (indexOfRemoval == -1) {
            fuck = false;
          } else {
            lineArgs.splice(indexOfRemoval, 1);
            fuck = true;
            tries++;
          }
        }

        let resultFormat = [
          lineArgs[1],
          lineArgs[3],
          lineArgs[2],
          lineArgs[0],
          lineArgs[4],
        ];

        lines[index] = resultFormat.join('§');

        if (index >= lines.length - 1) {
          resolve(lines.join('\n'));
        }
      });
    });
  });
};

/**
 * Parses the Sectiony format into Spacer format.
 * Returns a string in the new string
 * @param {string} text
 * @returns {Promise<string[]>}
 */
parser.parseSectiony = (text) => {
  return new Promise((resolve) => {
    parser.extractLines(text).then((lines) => {
      lines.forEach((line, index) => {
        let lineArgs = line.split('§');

        let fuck = true;
        let tries = 0;

        while (fuck && tries < 10) {
          let indexOfRemoval = lineArgs.indexOf('');
          if (indexOfRemoval == -1) {
            fuck = false;
          } else {
            lineArgs.splice(indexOfRemoval, 1);
            fuck = true;
            tries++;
          }
        }

        let resultFormat = [
          lineArgs[3],
          lineArgs[0],
          lineArgs[2],
          lineArgs[1],
          lineArgs[4],
        ];

        console.log(line);

        lines[index] = resultFormat.join('\t\t\t');

        if (index >= lines.length - 1) {
          resolve(lines.join('\n'));
        }
      });
    });
  });
};

let getCheckedRadioValue = function (name) {
  var elements = document.getElementsByName(name);

  for (var i = 0, len = elements.length; i < len; ++i)
    if (elements[i].checked) return elements[i].value;
};
