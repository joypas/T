const fs = require('fs');
const sheet1 = fs.readFileSync('temp_excel/xl/worksheets/sheet1.xml', 'utf-8');
const cells = sheet1.match(/<c r="[A-Z]+\d+"[^>]*>.*?<\/c>/g).slice(0, 50);

const sharedStringsXml = fs.readFileSync('temp_excel/xl/sharedStrings.xml', 'utf-8');
const strings = [];
const siRegex = /<si>(.*?)<\/si>/g;
let siMatch;
while ((siMatch = siRegex.exec(sharedStringsXml)) !== null) {
    const tMatch = siMatch[1].match(/<t[^>]*>(.*?)<\/t>/g);
    if (tMatch) {
        const text = tMatch.map(t => t.replace(/<[^>]+>/g, '')).join('');
        strings.push(text);
    } else {
        strings.push('');
    }
}

const debugInfo = cells.map(c => {
    const valMatch = c.match(/<v>(\d+)<\/v>/);
    let str = "No Value";
    if (valMatch && c.includes('t="s"')) {
        str = strings[parseInt(valMatch[1])];
    }
    return c + " => " + str;
});

fs.writeFileSync('debug.txt', debugInfo.join('\n'));
