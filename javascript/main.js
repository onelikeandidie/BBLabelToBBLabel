let inputFile = document.querySelector('input.file-input');
let inputFormat = document.querySelectorAll('div.file-format input');
let inputEncoding = document.querySelectorAll('div.file-textformat input');

document.querySelector('a.file-submit').addEventListener('mousedown', (e) => {
  console.log(e);
  console.log(inputFile);
  console.log(inputFormat);

  console.log(inputFile.files);

  let files = inputFile.files;

  if (files.length <= 0) {
    alert('please select a file');
    return;
  }

  file = files[0];

  if (file.type != 'text/plain') {
    alert('the file uploaded is not in plain text');
    return;
  }

  let fileReader = new FileReader();
  fileReader.onload = (event) => {
    let result = event.target.result;

    document.querySelector(
      '.content .file-preview.source .body'
    ).innerText = result;

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

  fileReader.readAsText(file, getCheckedRadioValue('file_encoding'));
});

let parser = {};

parser.extractLines = (text) => {
  return new Promise((resolve) => {
    let lines = text.split(/\r?\n/);

    resolve(lines);
  });
};

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
