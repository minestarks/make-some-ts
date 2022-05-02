# make-some-ts
Makes some .ts/.js source files to generate a project of desired size. Used to quickly test large project perf

## Usage:

```
npm install
npm start
```

An asp.net project containing lots and lots of TypeScript/JavaScript code is created in the `output` folder.

## Generated project characteristics

* The project contains one very large "js" folder containing lots of JavaScript, and a few TypeScript projects of varying sizes in separate folders and with separate `tsconfig.json`s
* Code is module-based. All source files contain exports. Some files import from others.
* Files intentionally include some semantic errors.
* The `tsconfig.json` settings are based on a real customer project
* File size follows an exponential distribution, there should be a mix of very small files as well as very large files.
* The containing ASP.NET project is the Web Application project template, with an added reference to the TypeScript NuGet package.
