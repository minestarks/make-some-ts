import * as fs from 'fs';
import * as path from 'path';

const projectRoot = path.resolve(__dirname, 'output', makeLittleRandomString());
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

/** Makes one source file with the given path and size */
function makeOneSourceFile(path: string, minSize: number) {
    let s = '';
    while (s.length < minSize) {
        s += makeOneFunction(makeLittleRandomString());
    }

    fs.writeFileSync(path, s);

    return s.length;
}

function writeOneSourceFile(projectRoot: string, extension: string, minSize: number) {
    return makeOneSourceFile(path.resolve(projectRoot, `${makeLittleRandomString()}.${extension}`), minSize);
}

function writeSourceFiles(root: string, extension: string, minTotalSize: number, rate: number) {
    for (let total = 0; total < minTotalSize; total += writeOneSourceFile(root, extension, randomExponential(rate)));
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
      fs.readdirSync(src).forEach(function(childItemName) {
        copyRecursiveSync(path.join(src, childItemName),
                          path.join(dest, childItemName));
      });
    } else {
      fs.copyFileSync(src, dest);
    }
}

copyRecursiveSync(aspnetTemplateRoot, projectRoot);
const jsRoot = path.resolve(projectRoot, 'WebApplication8', 'wwwroot', 'js');
writeSourceFiles(jsRoot, 'js', 20 * 1024 * 1024, 0.000003);
writeSourceFiles(jsRoot, 'ts', 20 * 1024 * 1024, 0.000003);

console.log(`Created folder at ${projectRoot}`)