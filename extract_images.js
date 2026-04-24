const fs = require('fs');
const path = require('path');

const targetProducts = [
    { id: 'DKS-009', keyword: '이토준지' },
    { id: 'DKS-008', keyword: 'Honda' },
    { id: 'DKS-013', keyword: '하이큐' },
    { id: 'DKS-020', keyword: '블루록' },
    { id: 'DKS-001', keyword: '헬로키티 피규어 컬렉션' },
    { id: 'DKS-036', keyword: '단다단' }
];

const extract = () => {
    try {
        const drawing = fs.readFileSync('temp_excel/xl/drawings/drawing1.xml', 'utf-8');
        const rels = fs.readFileSync('temp_excel/xl/drawings/_rels/drawing1.xml.rels', 'utf-8');
        
        const anchors = drawing.split('<xdr:twoCellAnchor>');
        const rowToRId = {};
        for (const anchor of anchors) {
            const rowMatch = anchor.match(/<xdr:row>(\d+)<\/xdr:row>/);
            const rIdMatch = anchor.match(/<a:blip[^>]*r:embed="([^"]+)"/);
            if (rowMatch && rIdMatch) {
                rowToRId[parseInt(rowMatch[1]) + 1] = rIdMatch[1]; // row is 0-indexed in XML, row=1 means Row 2. stored as 1-based.
            }
        }
        
        const relsEntries = rels.split('<Relationship ');
        const rIdToTarget = {};
        for (const entry of relsEntries) {
            const idMatch = entry.match(/Id="([^"]+)"/);
            const targetMatch = entry.match(/Target="([^"]+)"/);
            if (idMatch && targetMatch) {
                rIdToTarget[idMatch[1]] = targetMatch[1].replace('../', ''); 
            }
        }

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

        // Find string indexes for our targets
        const targetStringIndexes = {};
        strings.forEach((str, idx) => {
            for (const target of targetProducts) {
                if (str.includes(target.keyword)) {
                    targetStringIndexes[idx] = target;
                }
            }
        });

        const sheet1 = fs.readFileSync('temp_excel/xl/worksheets/sheet1.xml', 'utf-8');
        const cells = sheet1.match(/<c r="[A-Z]+\d+"[^>]*>.*?<\/c>/g);

        const rowToProduct = {};
        if (cells) {
            for (const cell of cells) {
                const match = cell.match(/<c r="([A-Z]+)(\d+)"[^>]*t="s"[^>]*><v>(\d+)<\/v><\/c>/);
                if (match) {
                    const row = parseInt(match[2]);
                    const valIdx = parseInt(match[3]);
                    if (targetStringIndexes[valIdx]) {
                        rowToProduct[row] = targetStringIndexes[valIdx];
                    }
                }
            }
        }
        
        // Final mapping and copy
        fs.mkdirSync('public/images/products', { recursive: true });
        const productToImage = {};
        for (const [row, product] of Object.entries(rowToProduct)) {
            // Because image anchor might be slightly off (e.g. image placed in row 8 but slightly overlapping 7),
            // We can check row, row-1, row+1
            let imagePath = null;
            for(let r = parseInt(row)-1; r <= parseInt(row)+1; r++) {
                if (rowToRId[r]) {
                    imagePath = 'temp_excel/xl/' + rIdToTarget[rowToRId[r]];
                    break;
                }
            }

            if (imagePath && fs.existsSync(imagePath)) {
                const ext = path.extname(imagePath);
                const dest = `public/images/products/${product.id}${ext}`;
                fs.copyFileSync(imagePath, dest);
                productToImage[product.id] = `/images/products/${product.id}${ext}`;
            } else {
                console.log(`Image not found for row ${row}`);
            }
        }

        fs.writeFileSync('productToImage.json', JSON.stringify(productToImage, null, 2));
        console.log("Extraction complete.");
    } catch (e) {
        console.error(e);
    }
}

extract();
