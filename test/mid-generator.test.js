const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const script = fs.readFileSync('script.js', 'utf8') + '\nglobalThis.MIDGenerator = MIDGenerator;';
const context = {
  console,
  document: {
    addEventListener() {}
  }
};

vm.createContext(context);
vm.runInContext(script, context);

function createGenerator() {
  return Object.create(context.MIDGenerator.prototype);
}

const generator = createGenerator();

const companyCases = [
  ['Bergstrom', 'BER'],
  ['Amalgamated Plastics Corp.', 'AMAPLA'],
  ['ABC Company', 'ABCCOM'],
  ['A.B.C. Company', 'ABCCOM'],
  ['A B C Company', 'ABCCOM'],
  ['Thomas S. Delvaux Company', 'THODEL'],
  ['E.K. Rodgers Companies', 'EKROD'],
  ['N. Minami & Co.,LTD.', 'MINCO'],
  ['Shenzhen Timely Watch Co.,Ltd', 'SHETIM']
];

for (const [input, expected] of companyCases) {
  assert.equal(generator.generateCompanyCode(input), expected, `company code for ${input}`);
}

const addressCases = [
  ['Room#1342-49, Block C Qinghu Industrial park,Qinghu Road, Longhua ,Shenzhen China', '1342'],
  ['Room#1342-49，Block C Qinghu Industrial park,Qinghu Road, Longhua ,Shenzhen China', '1342'],
  ['No. 589 Zhongchun Road, Minhang District', '589'],
  ['No. 135 Zhongnan Road, Changning District', '135'],
  ['2-6, 8-Chome Isogami-Dori', '268'],
  ['11455 Main Street Suite 9999', '1145'],
  ['92, Alice Springs Road', '92'],
  ['One World Trade Center', ''],
  ['7 12th street', '7']
];

for (const [input, expected] of addressCases) {
  assert.equal(generator.extractAddressNumbers(input), expected, `address number for ${input}`);
}

const timelyData = {
  country: { name: 'CN', code: 'CN' },
  company: 'Shenzhen Timely Watch Co.,Ltd',
  address: generator.extractAddressNumbers(addressCases[0][0]),
  city: 'Shenzhen'
};

assert.equal(generator.generateMidCode(timelyData), 'CNSHETIM1342SHE');

const csv = [
  'company,address,city,country',
  '"Shenzhen Timely Watch Co.,Ltd","Room#1342-49, Block C Qinghu Industrial park,Qinghu Road","Shenzhen","China"'
].join('\n');

assert.equal(JSON.stringify(generator.parseBatchFile(csv, 'text/csv')), JSON.stringify([{
  company: 'Shenzhen Timely Watch Co.,Ltd',
  address: 'Room#1342-49, Block C Qinghu Industrial park,Qinghu Road',
  city: 'Shenzhen',
  country: 'China'
}]));

let capturedResults = null;
generator.displayBatchResults = results => {
  capturedResults = results;
};

generator.processBatchData([{
  company: 'Known Country Ltd.',
  address: '1 Main Street',
  city: 'Paris',
  country: 'Atlantis'
}]);

assert.equal(capturedResults[0].status, 'error');
assert.equal(capturedResults[0].midCode, '');
assert.match(capturedResults[0].errors[0], /Unknown country/);

assert.equal(generator.escapeHtml('<img src=x onerror=alert(1)>'), '&lt;img src=x onerror=alert(1)&gt;');

console.log('MID generator tests passed');
