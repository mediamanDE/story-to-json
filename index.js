#! /usr/bin/env node

console.log('Extract data from story definitions...');

const fs = require('fs'),
    path = require('path'),
    argv = require('yargs').argv;

var inputDir = argv.stories;
var json = [];
var outputFile = argv.out;

function fromDir(startPath,filter,callback){

    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);

    for(var i=0;i<files.length;i++){

        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);

        if (stat.isDirectory()){
            fromDir(filename,filter,callback); //recurse
        }
        else if (filter.test(filename)) {
            callback(filename);
        }
    };
};

var getStories = function(data, filename) {

    // first get the entire code snippet for each 'storiesOf()'
    var storyChunksRe = /(storiesOf\(')[\s\S]*?(?=storiesOf|$)/g;
    var storyChunksArr = data.match(storyChunksRe);

    storyChunksArr.forEach(function(chunk) {

        // get the kind param from the snippet of code
        // it's the first param in `storiesOf()`
        // and replace spaces with '%20'
        var kindsRe = /(storiesOf\(').+(?=')/g;
        var kindsArr = chunk.match(kindsRe);
        var kind = kindsArr[0].split('\'').pop().replace(new RegExp(' ', 'g'), '%20');

        var obj = {
            "kind": kind,
            "stories": []
        };

        // get each story param from the snippet of code
        // it's the first param in `add()`
        // and replace spaces with '%20'
        var storiesRe = /(add\(').+(?=')/g;
        var storiesArr = chunk.match(storiesRe);

        storiesArr.forEach(function(story) {
            story = story.split('\'').pop().replace(new RegExp(' ', 'g'), '%20');
            obj.stories.push(story);
        });

        json.push(obj);
    });
    writeJsonToFile(filename);
};

var writeJsonToFile = function(filename) {
    fs.writeFile(outputFile, JSON.stringify(json), 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log('Stories in ' + filename + ' were written to json file successfully');
    });
};

// check if all necessary parameters are given
if(!inputDir) return console.log('ERROR: Path of stories is missing. Add directory path to look for' +
    ' files ending with `*.stories.ts` through --stories param.');
if(!outputFile) return console.log('ERROR: Where should json be saved? Add file path through --out param.');

// automatically import all files ending in *.stories.ts
fromDir(inputDir,/.stories.ts$/,function(filename){
    // console.log('file found: ',filename);

    fs.readFile(filename, 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        getStories(data, filename);
    });
});
