# story-to-json
Extracts stories from [Storybook](https://storybook.js.org/) into a JSON file.

*Note:* Currently working for [Angular](https://angular.io/) projects, support for other frameworks is planned.

## Getting Started

Install story-to-json in a project that uses Storybook:

    npm install @mediaman/story2json --save-dev
    
Run with

    story2json --stories [directory] --out [file]

### --stories

Parameter `--stories` specifies which directory should be searched for files ending in `*.stories.ts`.

### --out

Parameter `--out` is the file name and path where the resulting json file shall be created.

## JSON

Generated JSON looks like this

    [{
         "kind" : "Welcome",
         "stories" : ["to%20Storybook"]
     },
     {
        "kind" : "Button",
        "stories" : ["with%20text", "with%20some%20emoji"]
    }]

## License
MIT © [mediaman GmbH](https://mediaman.com/)
