import * as fs from 'fs';
import * as path from 'path';

/** First command-line argument (optional) is a prefix for the folder name */
const project_prefix = process.argv[2] || '';

const projectRoot = path.resolve(__dirname, 'output', project_prefix + makeLittleRandomString());
const aspnetTemplateRoot = path.resolve(__dirname, 'aspnetproject');

/** Makes an 8-letter little string */
function makeLittleRandomString() {
    const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
        'u', 'v', 'w', 'x', 'y', 'z'];

    let s = '';
    for (let i = 0; i < 8; i++) {
        s = s.concat(chars[Math.floor(Math.random() * chars.length)]);
    }

    return s;
}

/** Makes a little function with the given name */
function makeOneFunction(name: string) {
    return `function ${name}()  {
    const x = 1;
    const z = "abc";
    return z + x;
}

`;
}

/** Makes a little function with an export keyword */
function makeExportFunction() {
    return `export function functionExport()  {
    return 'imexported';
}

`;
}

/** Makes a little function with the given name and a semantic error*/
function makeOneFunctionWithError(name: string) {
    return `function ${name}()  {
    const nope = {};
    return nope.xyz;
}

`;
}

function makeImportStatement(fileName: string) {
    return `import { functionExport as functionImport } from '${fileName}';

`;
}

/** Makes one source file with the given extension and size */
function writeOneSourceFile(projectRoot: string,
    extension: string,
    minSize: number,
    errorRate: number,
    addExport: boolean,
    addImportTo?: string) {
    let s = '';

    if (addImportTo) {
        s += makeImportStatement(addImportTo);
    }

    if (addExport) {
        s += makeExportFunction();
    }

    while (s.length < minSize) {
        const makeFunction = (Math.random() < errorRate) ? makeOneFunctionWithError : makeOneFunction;
        s += makeFunction(makeLittleRandomString());
    }

    const fileNameWithoutExtension = makeLittleRandomString();
    fs.writeFileSync(path.resolve(projectRoot, `${fileNameWithoutExtension}.${extension}`), s);

    return { fileNameWithoutExtension, length: s.length };
}

function writeSourceFiles(root: string, extension: string, minTotalSize: number, rate: number, errorRate: number, modules: boolean) {
    let addImportTo: string | undefined = undefined;
    const importEveryNthFile = 2;

    for (let total = 0, i = 0; total < minTotalSize;) {
        const result = writeOneSourceFile(root, extension, randomExponential(rate), errorRate, modules, addImportTo);

        // If we're doing modules, then save the current filename every once
        // in a while to add it as an import to the next file
        if (modules && (i % importEveryNthFile === 0)) {
            addImportTo = result.fileNameWithoutExtension;
        } else {
            addImportTo = undefined;
        }

        total += result.length;
    }
}

function randomExponential(rate: number) {
    return -Math.log(Math.random()) / rate;
}

function copyRecursiveSync(src: string, dest: string) {
    var exists = fs.existsSync(src);
    var stats = exists && fs.statSync(src);
    var isDirectory = exists && (stats as fs.Stats).isDirectory();
    if (isDirectory) {
        fs.mkdirSync(dest);
        fs.readdirSync(src).forEach(function (childItemName) {
            copyRecursiveSync(path.join(src, childItemName),
                path.join(dest, childItemName));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

copyRecursiveSync(aspnetTemplateRoot, projectRoot);
const jsRoot = path.resolve(projectRoot, 'WebApplication8', 'wwwroot', 'js');
writeSourceFiles(jsRoot, 'js', 20 * 1024 * 1024, 0.000003, 0.01, true /* modules */);
writeSourceFiles(jsRoot, 'ts', 20 * 1024 * 1024, 0.000003, 0.01, true /* modules */);

console.log(`Created folder at ${projectRoot}`)
