"use strict";

var inputFile = document.querySelector('input.file-input');
var inputFormat = document.querySelectorAll('div.file-format input');
var inputEncoding = document.querySelectorAll('div.file-textformat input');
document.querySelector('a.file-submit').addEventListener('mousedown', function (e) {
  console.log(e);
  console.log(inputFile);
  console.log(inputFormat);
  console.log(inputFile.files);
  var files = inputFile.files;

  if (files.length <= 0) {
    alert('please select a file');
    return;
  }

  file = files[0];

  if (file.type != 'text/plain') {
    alert('the file uploaded is not in plain text');
    return;
  }

  var fileReader = new FileReader();

  fileReader.onload = function (event) {
    var result = event.target.result;
    document.querySelector('.content .file-preview.source .body').innerText = result;

    switch (getCheckedRadioValue('file_format')) {
      case 'section_one':
        parser.parseSectiony(result).then(function (poggers) {
          document.querySelector('.content .file-preview.result .body').innerText = poggers;
        });
        break;

      case 'space_one':
        parser.parseSpacer(result).then(function (poggers) {
          document.querySelector('.content .file-preview.result .body').innerText = poggers;
        });
        break;

      default:
        break;
    }
  };

  fileReader.onerror = function (error) {
    console.error(error);
    alert('An error occured, check console');
    return;
  };

  fileReader.readAsText(file, getCheckedRadioValue('file_encoding'));
});
var parser = {};

parser.extractLines = function (text) {
  return new Promise(function (resolve) {
    var lines = text.split(/\r?\n/);
    resolve(lines);
  });
};

parser.parseSpacer = function (text) {
  return new Promise(function (resolve) {
    parser.extractLines(text).then(function (lines) {
      lines.forEach(function (line, index) {
        var lineArgs = line.split(/\t/);
        var fuck = true;
        var tries = 0;

        while (fuck && tries < 10) {
          var indexOfRemoval = lineArgs.indexOf('');

          if (indexOfRemoval == -1) {
            fuck = false;
          } else {
            lineArgs.splice(indexOfRemoval, 1);
            fuck = true;
            tries++;
          }
        }

        var resultFormat = [lineArgs[1], lineArgs[3], lineArgs[2], lineArgs[0], lineArgs[4]];
        lines[index] = resultFormat.join('§');

        if (index >= lines.length - 1) {
          resolve(lines.join('\n'));
        }
      });
    });
  });
};

parser.parseSectiony = function (text) {
  return new Promise(function (resolve) {
    parser.extractLines(text).then(function (lines) {
      lines.forEach(function (line, index) {
        var lineArgs = line.split('§');
        var fuck = true;
        var tries = 0;

        while (fuck && tries < 10) {
          var indexOfRemoval = lineArgs.indexOf('');

          if (indexOfRemoval == -1) {
            fuck = false;
          } else {
            lineArgs.splice(indexOfRemoval, 1);
            fuck = true;
            tries++;
          }
        }

        var resultFormat = [lineArgs[3], lineArgs[0], lineArgs[2], lineArgs[1], lineArgs[4]];
        console.log(line);
        lines[index] = resultFormat.join('\t\t\t');

        if (index >= lines.length - 1) {
          resolve(lines.join('\n'));
        }
      });
    });
  });
};

var getCheckedRadioValue = function getCheckedRadioValue(name) {
  var elements = document.getElementsByName(name);

  for (var i = 0, len = elements.length; i < len; ++i) {
    if (elements[i].checked) return elements[i].value;
  }
};