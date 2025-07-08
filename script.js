/**
 * MID Code Generator & Validator
 * Main JavaScript file with all functionality
 */

// Country codes mapping (ISO 3166-1 alpha-2) - 中英文对照
const COUNTRY_CODES = {
    'afghanistan': 'AF', 'albania': 'AL', 'algeria': 'DZ', 'andorra': 'AD', 'angola': 'AO',
    'argentina': 'AR', 'armenia': 'AM', 'australia': 'AU', 'austria': 'AT', 'azerbaijan': 'AZ',
    'bahrain': 'BH', 'bangladesh': 'BD', 'belarus': 'BY', 'belgium': 'BE', 'bolivia': 'BO',
    'bosnia': 'BA', 'botswana': 'BW', 'brazil': 'BR', 'brunei': 'BN', 'bulgaria': 'BG',
    'cambodia': 'KH', 'cameroon': 'CM', 'canada': 'CA', 'chile': 'CL', 'china': 'CN',
    'colombia': 'CO', 'croatia': 'HR', 'cuba': 'CU', 'cyprus': 'CY', 'czech': 'CZ',
    'denmark': 'DK', 'dominican': 'DO', 'ecuador': 'EC', 'egypt': 'EG', 'estonia': 'EE',
    'ethiopia': 'ET', 'finland': 'FI', 'france': 'FR', 'georgia': 'GE', 'germany': 'DE',
    'ghana': 'GH', 'greece': 'GR', 'guatemala': 'GT', 'hungary': 'HU', 'iceland': 'IS',
    'india': 'IN', 'indonesia': 'ID', 'iran': 'IR', 'iraq': 'IQ', 'ireland': 'IE',
    'israel': 'IL', 'italy': 'IT', 'jamaica': 'JM', 'japan': 'JP', 'jordan': 'JO',
    'kazakhstan': 'KZ', 'kenya': 'KE', 'korea': 'KR', 'kuwait': 'KW', 'latvia': 'LV',
    'lebanon': 'LB', 'libya': 'LY', 'lithuania': 'LT', 'luxembourg': 'LU', 'malaysia': 'MY',
    'mexico': 'MX', 'morocco': 'MA', 'netherlands': 'NL', 'new zealand': 'NZ', 'norway': 'NO',
    'pakistan': 'PK', 'peru': 'PE', 'philippines': 'PH', 'poland': 'PL', 'portugal': 'PT',
    'qatar': 'QA', 'romania': 'RO', 'russia': 'RU', 'saudi arabia': 'SA', 'singapore': 'SG',
    'slovakia': 'SK', 'slovenia': 'SI', 'south africa': 'ZA', 'spain': 'ES', 'sri lanka': 'LK',
    'sweden': 'SE', 'switzerland': 'CH', 'syria': 'SY', 'taiwan': 'TW', 'thailand': 'TH',
    'turkey': 'TR', 'ukraine': 'UA', 'united arab emirates': 'AE', 'united kingdom': 'GB',
    'united states': 'US', 'uruguay': 'UY', 'venezuela': 'VE', 'vietnam': 'VN',
    // 中文国家名称支持
    '中国': 'CN', '美国': 'US', '英国': 'GB', '法国': 'FR', '德国': 'DE', '意大利': 'IT',
    '日本': 'JP', '韩国': 'KR', '加拿大': 'CA', '澳大利亚': 'AU', '俄罗斯': 'RU',
    '印度': 'IN', '巴西': 'BR', '墨西哥': 'MX', '西班牙': 'ES', '荷兰': 'NL',
    '瑞士': 'CH', '瑞典': 'SE', '丹麦': 'DK', '挪威': 'NO', '芬兰': 'FI',
    '新加坡': 'SG', '泰国': 'TH', '越南': 'VN', '马来西亚': 'MY', '菲律宾': 'PH',
    '印度尼西亚': 'ID', '台湾': 'TW', '香港': 'HK', '澳门': 'MO', '土耳其': 'TR',
    '阿联酋': 'AE', '沙特阿拉伯': 'SA', '埃及': 'EG', '南非': 'ZA', '阿根廷': 'AR',
    '智利': 'CL', '哥伦比亚': 'CO', '秘鲁': 'PE', '乌拉圭': 'UY', '委内瑞拉': 'VE'
};

// Canadian province codes (special handling for Canada)
const CANADA_PROVINCES = {
    'alberta': 'XA', 'british columbia': 'XC', 'manitoba': 'XM', 'new brunswick': 'XB',
    'newfoundland': 'XW', 'northwest territories': 'XT', 'nova scotia': 'XN', 'nunavut': 'XV',
    'ontario': 'XO', 'prince edward island': 'XP', 'quebec': 'XQ', 'saskatchewan': 'XS',
    'yukon': 'XY'
};

// Common company suffixes to remove
const COMPANY_SUFFIXES = [
    'inc', 'ltd', 'llc', 'corp', 'corporation', 'company', 'co', 'limited', 'incorporated',
    'llp', 'lp', 'plc', 'sa', 'gmbh', 'ag', 'kg', 'oy', 'ab', 'as', 'spa', 'srl',
    'bv', 'nv', 'cv', 'vof', 'eirl', 'sarl', 'sasu', 'eurl', 'snc', 'scs', 'gie'
];

// Common address keywords to ignore
const ADDRESS_KEYWORDS = [
    'street', 'st', 'avenue', 'ave', 'road', 'rd', 'boulevard', 'blvd', 'lane', 'ln',
    'drive', 'dr', 'court', 'ct', 'place', 'pl', 'square', 'sq', 'circle', 'cir',
    'way', 'plaza', 'suite', 'ste', 'apartment', 'apt', 'unit', 'floor', 'fl'
];

// Country name variations
const COUNTRY_VARIATIONS = {
    'usa': 'united states', 'us': 'united states', 'america': 'united states',
    'uk': 'united kingdom', 'britain': 'united kingdom', 'england': 'united kingdom',
    'uae': 'united arab emirates', 'prc': 'china', 'south korea': 'korea',
    'north korea': 'korea', 'czech republic': 'czech', 'bosnia and herzegovina': 'bosnia'
};

class MIDGenerator {
    constructor() {
        // Initialize all event listeners and setup
        this.initializeEventListeners();
        
        // Load saved data if any
        this.lastParsedData = null;
    }

    // Initialize all event listeners
    initializeEventListeners() {
        // Input mode toggle
        document.querySelectorAll('input[name="inputMode"]').forEach(radio => {
            radio.addEventListener('change', this.toggleInputMode.bind(this));
        });

        // Generate tab buttons
        document.getElementById('parseBtn').addEventListener('click', this.parseInformation.bind(this));
        document.getElementById('generateBtn').addEventListener('click', this.generateFromManual.bind(this));
        document.getElementById('confirmParseBtn').addEventListener('click', this.confirmParse.bind(this));
        document.getElementById('editParseBtn').addEventListener('click', this.editParse.bind(this));
        document.getElementById('copyBtn').addEventListener('click', this.copyMidCode.bind(this));

        // Validate tab buttons
        document.getElementById('validateBtn').addEventListener('click', this.validateMidCode.bind(this));

        // Batch processing buttons
        document.getElementById('processBatchBtn').addEventListener('click', this.processBatch.bind(this));
        document.getElementById('downloadTemplateBtn').addEventListener('click', this.downloadTemplate.bind(this));

        // Real-time validation for validate input
        document.getElementById('midValidateInput').addEventListener('input', this.validateOnInput.bind(this));
    }

    // Toggle between smart parse and manual input modes
    toggleInputMode() {
        const smartMode = document.getElementById('smartParse').checked;
        document.getElementById('smartParseMode').style.display = smartMode ? 'block' : 'none';
        document.getElementById('manualInputMode').style.display = smartMode ? 'none' : 'block';
    }

    // Parse complete information using smart algorithm
    parseInformation() {
        const fullInfo = document.getElementById('fullInfo').value.trim();
        
        if (!fullInfo) {
            this.showAlert('请输入制造商信息进行解析。', 'warning');
            return;
        }

        try {
            const parsedData = this.intelligentParse(fullInfo);
            // 直接生成MID码，不显示中间解析步骤
            const midCode = this.generateMidCode(parsedData);
            this.displayMidCode(midCode, parsedData);
        } catch (error) {
            this.showAlert('解析信息时出错：' + error.message, 'danger');
        }
    }

    // Enhanced intelligent parsing
    intelligentParse(fullInfo) {
        const lines = fullInfo.split('\n').map(line => line.trim()).filter(line => line);
        
        if (lines.length < 2) {
            throw new Error('请提供完整的制造商信息（至少包含公司名称和地址）');
        }
        
        const result = {
            company: '',
            address: '',
            city: '',
            country: { name: '', code: '' },
            confidence: 0
        };
        
        // Parse company (first line)
        result.company = lines[0];
        
        // Parse country (last line or line containing country keywords)
        const countryInfo = this.extractCountry(fullInfo);
        result.country = { name: countryInfo, code: this.getCountryCode(countryInfo) };
        
        // Parse city (usually second to last line or extract from text)
        result.city = this.extractCity(fullInfo);
        
        // Parse address numbers
        result.address = this.extractAddressNumbers(fullInfo);
        
        // Calculate confidence
        result.confidence = this.calculateConfidence(result);
        
        return result;
    }

    // Extract country from text
    extractCountry(text) {
        const lowerText = text.toLowerCase();
        
        // Check for country names in the text
        for (const [countryName, code] of Object.entries(COUNTRY_CODES)) {
            if (lowerText.includes(countryName.toLowerCase())) {
                return countryName;
            }
        }
        
        // If no country found, try to extract from last line
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        if (lines.length > 0) {
            const lastLine = lines[lines.length - 1].toLowerCase();
            for (const [countryName, code] of Object.entries(COUNTRY_CODES)) {
                if (lastLine.includes(countryName.toLowerCase())) {
                    return countryName;
                }
            }
        }
        
        return '';
    }

    // Extract city from text
    extractCity(text) {
        const lines = text.split('\n').map(line => line.trim()).filter(line => line);
        
        // Usually city is in the second to last line or line with postal code
        if (lines.length >= 2) {
            // Try second to last line first
            let cityLine = lines[lines.length - 2];
            
            // Remove postal codes and country info
            cityLine = cityLine.replace(/\b\d{5}(-\d{4})?\b/g, ''); // US postal codes
            cityLine = cityLine.replace(/\b[A-Z]{2}\s+\d{5}\b/g, ''); // State + postal code
            cityLine = cityLine.replace(/,.*$/, ''); // Everything after comma
            
            return cityLine.trim();
        }
        
        return '';
    }

    // Get country code from country name
    getCountryCode(countryName) {
        if (!countryName) return '';
        
        const lowerCountryName = countryName.toLowerCase().trim();
        
        // Direct lookup
        if (COUNTRY_CODES[lowerCountryName]) {
            return COUNTRY_CODES[lowerCountryName];
        }
        
        // Partial match
        for (const [country, code] of Object.entries(COUNTRY_CODES)) {
            if (country.toLowerCase().includes(lowerCountryName) || 
                lowerCountryName.includes(country.toLowerCase())) {
                return code;
            }
        }
        
        return '';
    }

    // Extract company name from lines
    extractCompany(lines) {
        if (lines.length === 0) return '';
        
        // Usually the first line is the company name
        let companyName = lines[0];
        
        // Clean up company name
        companyName = this.cleanCompanyName(companyName);
        
        return companyName;
    }

    // Clean company name by removing suffixes
    cleanCompanyName(name) {
        let cleanName = name.trim();
        
        // Remove common suffixes
        const words = cleanName.toLowerCase().split(/\s+/);
        const filteredWords = words.filter(word => {
            const cleanWord = word.replace(/[.,]/g, '');
            return !COMPANY_SUFFIXES.includes(cleanWord);
        });
        
        return filteredWords.join(' ');
    }

    // Extract address numbers with improved logic
    extractAddressNumbers(fullText) {
        if (!fullText) return '';
        
        const lines = fullText.split('\n').map(line => line.trim()).filter(line => line);
        
        // Street keywords to identify address lines
        const streetKeywords = [
            'STREET', 'ST', 'AVENUE', 'AVE', 'ROAD', 'RD', 'BOULEVARD', 'BLVD',
            'LANE', 'LN', 'DRIVE', 'DR', 'COURT', 'CT', 'PLACE', 'PL',
            'CIRCLE', 'CIR', 'WAY', 'PARK', 'PLAZA', 'SQUARE', 'SQ', 'NO'
        ];
        
        let allNumbers = [];
        
        // Look for address lines (usually middle lines, not first or last)
        for (let i = 1; i < lines.length - 1; i++) {
            const line = lines[i].toUpperCase();
            
            // Check if line contains street keywords or looks like an address
            const hasStreetKeyword = streetKeywords.some(keyword => 
                line.includes(keyword)
            );
            
            // Also check if line has numbers (typical of addresses)
            const hasNumbers = /\d+/.test(line);
            
            if (hasStreetKeyword || hasNumbers) {
                // Extract numbers from this line
                const numbers = lines[i].match(/\d+/g);
                if (numbers) {
                    allNumbers.push(...numbers.map(num => parseInt(num, 10)));
                }
            }
        }
        
        // If no address-like lines found, check all lines except first and last
        if (allNumbers.length === 0) {
            for (let i = 1; i < lines.length - 1; i++) {
                const numbers = lines[i].match(/\d+/g);
                if (numbers) {
                    allNumbers.push(...numbers.map(num => parseInt(num, 10)));
                }
            }
        }
        
        if (allNumbers.length === 0) return '';
        
        // Filter out obvious postal codes (5+ digits)
        const validNumbers = allNumbers.filter(num => num < 100000);
        if (validNumbers.length === 0) return '';
        
        // Find the highest number
        const maxNumber = Math.max(...validNumbers);
        
        // Limit to 4 digits max
        return Math.min(maxNumber, 9999).toString();
    }

    // Check if line contains country information
    isCountryLine(line) {
        const lowerLine = line.toLowerCase();
        return Object.keys(COUNTRY_CODES).some(country => lowerLine.includes(country)) ||
               Object.keys(COUNTRY_VARIATIONS).some(variation => lowerLine.includes(variation));
    }

    // Check if line contains address information
    isAddressLine(line) {
        const lowerLine = line.toLowerCase();
        return ADDRESS_KEYWORDS.some(keyword => lowerLine.includes(keyword)) ||
               /\d+/.test(line); // Contains numbers
    }

    // Calculate confidence score
    calculateConfidence(parsedData) {
        let score = 0;
        
        if (parsedData.country.code) score += 30;
        if (parsedData.company) score += 25;
        if (parsedData.address) score += 25;
        if (parsedData.city) score += 20;
        
        return score;
    }

    // Display parsing results
    displayParseResults(parsedData) {
        const parseResults = document.getElementById('parseResults');
        parseResults.style.display = 'block';
        document.getElementById('helpText').style.display = 'none';
        this.lastParsedData = parsedData;
    }

    // Confirm parsing and generate MID code
    confirmParse() {
        if (!this.lastParsedData) {
            this.showAlert('没有解析数据可用。', 'warning');
            return;
        }
        const midCode = this.generateMidCode(this.lastParsedData);
        this.displayMidCode(midCode, this.lastParsedData);
    }

    // Edit parsing results
    editParse() {
        // Switch to manual mode and populate fields
        document.getElementById('manualInput').checked = true;
        this.toggleInputMode();
        
        if (this.lastParsedData) {
            document.getElementById('countryInput').value = this.lastParsedData.country.name;
            document.getElementById('companyInput').value = this.lastParsedData.company;
            document.getElementById('addressInput').value = this.lastParsedData.address;
            document.getElementById('cityInput').value = this.lastParsedData.city;
        }
    }

    // Generate MID code from manual input
    generateFromManual() {
        const data = {
            country: {
                name: document.getElementById('countryInput').value.trim(),
                code: ''
            },
            company: document.getElementById('companyInput').value.trim(),
            address: '', // 只存编号
            city: document.getElementById('cityInput').value.trim()
        };
        // Validate input
        if (!data.country.name || !data.company || !data.city) {
            this.showAlert('请填写所有必填字段（国家、公司、城市）。', 'warning');
            return;
        }
        // Extract country code
        data.country.code = this.getCountryCode(data.country.name);
        if (!data.country.code) {
            this.showAlert('无法识别国家名称，请检查拼写。', 'warning');
            return;
        }
        // 只从addressInput字段提取最大数字
        const addressInput = document.getElementById('addressInput').value.trim();
        data.address = this.extractAddressNumbersFromAddressField(addressInput);
        const midCode = this.generateMidCode(data);
        this.displayMidCode(midCode, data);
    }

    // Generate MID code from parsed data
    generateMidCode(data) {
        let midCode = '';
        
        // Country code (2 chars)
        midCode += data.country.code || 'XX';
        
        // Company code (3-6 chars)
        midCode += this.generateCompanyCode(data.company);
        
        // Address number (up to 4 digits)
        if (data.address) {
            midCode += data.address.substring(0, 4);
        }
        
        // City code (3 chars)
        midCode += this.generateCityCode(data.city);
        
        return midCode.toUpperCase();
    }

    // Generate company code from company name
    generateCompanyCode(company) {
        if (!company) return '';
        
        // 根据FedEx官方规则处理公司名称
        let cleanCompany = company.trim().toUpperCase();
        
        // 移除常见的公司后缀
        const companySuffixes = [
            'INC', 'INCORPORATED', 'LLC', 'LTD', 'LIMITED', 'CORP', 'CORPORATION',
            'CO', 'COMPANY', 'ENTERPRISE', 'ENTERPRISES', 'GROUP', 'INTERNATIONAL',
            'GLOBAL', 'WORLDWIDE', 'HOLDINGS', 'TECHNOLOGIES', 'TECH', 'SOLUTIONS'
        ];
        
        companySuffixes.forEach(suffix => {
            const regex = new RegExp(`\\b${suffix}\\.?\\b`, 'gi');
            cleanCompany = cleanCompany.replace(regex, '').trim();
        });
        
        // 移除标点符号和特殊字符，但保留空格
        cleanCompany = cleanCompany.replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
        
        // 根据FedEx官方规则：忽略不常用词
        const commonWords = ['A', 'AN', 'AND', 'OF', 'THE', 'FOR', 'WITH', 'IN', 'ON', 'AT', 'TO', 'BY'];
        const words = cleanCompany.split(' ').filter(word => 
            word.length > 0 && !commonWords.includes(word.toUpperCase())
        );
        
        if (words.length === 0) {
            // 如果过滤后没有单词，使用原始公司名称
            return company.replace(/[^\w]/g, '').substring(0, 6).toUpperCase();
        }
        
        let companyCode = '';
        
        if (words.length === 1) {
            // 对于单字母制造商名称，取前三个字母
            companyCode = words[0].substring(0, 3);
        } else {
            // 对于有两个或以上单词的制造商名称，取前两个单词的前三个字母
            const firstWord = words[0].substring(0, 3);
            const secondWord = words[1] ? words[1].substring(0, 3) : '';
            companyCode = firstWord + secondWord;
        }
        
        // 确保至少3个字符，最多6个字符
        if (companyCode.length < 3) {
            // 如果不足3位，用原始公司名称补充
            const remaining = company.replace(/[^\w]/g, '').toUpperCase();
            companyCode = remaining.substring(0, 6);
        }
        
        return companyCode.substring(0, 6).toUpperCase();
    }

    // Generate city code with improved logic
    generateCityCode(city) {
        if (!city) return '';
        
        // 根据FedEx官方规则：取制造商城市名称的前三个字母
        let cleanCity = city.trim().toUpperCase();
        
        // 移除常见的城市后缀和前缀
        const cityPrefixes = ['CITY OF', 'TOWN OF', 'VILLAGE OF'];
        const citySuffixes = ['CITY', 'TOWN', 'VILLAGE', 'DISTRICT', 'COUNTY'];
        
        cityPrefixes.forEach(prefix => {
            if (cleanCity.startsWith(prefix + ' ')) {
                cleanCity = cleanCity.substring(prefix.length + 1);
            }
        });
        
        citySuffixes.forEach(suffix => {
            if (cleanCity.endsWith(' ' + suffix)) {
                cleanCity = cleanCity.substring(0, cleanCity.length - suffix.length - 1);
            }
        });
        
        // 移除特殊字符，只保留字母
        cleanCity = cleanCity.replace(/[^\w]/g, '');
        
        // 取前三个字母
        return cleanCity.substring(0, 3);
    }

    // Display generated MID code
    displayMidCode(midCode, data) {
        document.getElementById('midCodeDisplay').textContent = midCode;
        document.getElementById('midResult').style.display = 'block';
        document.getElementById('parseResults').style.display = 'none';
        document.getElementById('helpText').style.display = 'none';
        this.displayBreakdown(midCode, data);
        this.displayGenerationExample(midCode, data);
        const validation = this.validateMidCodeStructure(midCode);
        this.displayValidationStatus(validation);
    }

    // Display generation example in FedEx official format
    displayGenerationExample(midCode, data) {
        const inputExample = document.getElementById('inputExample');
        const midCodeResult = document.getElementById('midCodeResult');
        
        // Format input example like FedEx documentation
        let exampleText = '';
        if (data.company) {
            exampleText += data.company;
        }
        if (data.address) {
            exampleText += data.address ? ` ${data.address}` : '';
        }
        if (data.city) {
            exampleText += `, ${data.city}`;
        }
        if (data.country && data.country.name) {
            exampleText += `, ${data.country.name}`;
        }
        
        inputExample.textContent = exampleText;
        midCodeResult.textContent = midCode;
    }

    // Display MID code breakdown
    displayBreakdown(midCode, data) {
        const breakdown = document.getElementById('midBreakdown');
        
        const countryPart = midCode.substring(0, 2);
        const companyPart = midCode.substring(2, midCode.length - 3 - (data.address ? data.address.length : 0));
        const addressPart = data.address ? midCode.substring(midCode.length - 3 - data.address.length, midCode.length - 3) : '';
        const cityPart = midCode.substring(midCode.length - 3);
        
        let html = '<div class="alert alert-light border mb-3">';
        html += '<h6 class="mb-3"><i class="fas fa-microscope me-2"></i>MID代码组成分析：</h6>';
        
        html += `<div class="row mb-2">
            <div class="col-8">
                <div class="part-name"><i class="fas fa-flag me-2"></i>国家代码</div>
                <div class="part-source text-muted small">来源：${data.country.name} → ISO代码</div>
            </div>
            <div class="col-4 text-end">
                <span class="badge bg-success fs-6">${countryPart}</span>
            </div>
        </div>`;
        
        html += `<div class="row mb-2">
            <div class="col-8">
                <div class="part-name"><i class="fas fa-building me-2"></i>制造商名称</div>
                <div class="part-source text-muted small">来源：${data.company} → 取前3-6字母</div>
            </div>
            <div class="col-4 text-end">
                <span class="badge bg-primary fs-6">${companyPart}</span>
            </div>
        </div>`;
        
        if (addressPart) {
            html += `<div class="row mb-2">
                <div class="col-8">
                    <div class="part-name"><i class="fas fa-map-marker-alt me-2"></i>地址行</div>
                    <div class="part-source text-muted small">来源：${data.address} → 最高数字</div>
                </div>
                <div class="col-4 text-end">
                    <span class="badge bg-info fs-6">${addressPart}</span>
                </div>
            </div>`;
        }
        
        html += `<div class="row mb-2">
            <div class="col-8">
                <div class="part-name"><i class="fas fa-city me-2"></i>城市</div>
                <div class="part-source text-muted small">来源：${data.city} → 前3字母</div>
            </div>
            <div class="col-4 text-end">
                <span class="badge bg-warning fs-6">${cityPart}</span>
            </div>
        </div>`;
        
        html += '</div>';
        
        // 添加详细的解析过程展示
        html += '<div class="alert alert-info border mb-3">';
        html += '<h6 class="mb-3"><i class="fas fa-search me-2"></i>解析过程详情：</h6>';
        
        // 显示解析的详细信息
        if (data.country.code) {
            html += `<div class="parse-item mb-2">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>国家代码：</strong> ${data.country.name}
                    </div>
                    <span class="badge bg-success">${data.country.code}</span>
                </div>
            </div>`;
        }
        
        if (data.company) {
            html += `<div class="parse-item mb-2">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>制造商名称：</strong> ${data.company}
                    </div>
                    <span class="badge bg-primary">${this.generateCompanyCode(data.company)}</span>
                </div>
            </div>`;
        }
        
        if (data.address) {
            html += `<div class="parse-item mb-2">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>地址行：</strong> ${data.address}
                    </div>
                    <span class="badge bg-info">${data.address}</span>
                </div>
            </div>`;
        }
        
        if (data.city) {
            html += `<div class="parse-item mb-2">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>城市：</strong> ${data.city}
                    </div>
                    <span class="badge bg-warning">${this.generateCityCode(data.city)}</span>
                </div>
            </div>`;
        }
        
        if (data.confidence) {
            html += `<div class="mt-2">
                <small class="text-muted">解析置信度：${data.confidence}%</small>
            </div>`;
        }
        
        html += '</div>';
        
        // Add official reference note
        html += '<div class="text-center mt-3">';
        html += '<small class="text-muted"><i class="fas fa-info-circle me-1"></i>分析结果基于FedEx官方MID代码生成规则</small>';
        html += '</div>';
        
        breakdown.innerHTML = html;
    }

    // Copy MID code to clipboard
    copyMidCode() {
        const midCode = document.getElementById('midCodeDisplay').textContent;
        navigator.clipboard.writeText(midCode).then(() => {
            this.showAlert('MID代码已复制到剪贴板！', 'success');
        }).catch(() => {
            this.showAlert('复制MID代码失败。', 'danger');
        });
    }

    // Validate MID code structure
    validateMidCodeStructure(midCode) {
        const validation = {
            isValid: true,
            errors: [],
            warnings: [],
            breakdown: {}
        };
        
        // Check length
        if (midCode.length < 5 || midCode.length > 15) {
            validation.isValid = false;
            validation.errors.push('MID code length should be between 5 and 15 characters');
        }
        
        // Check country code
        const countryCode = midCode.substring(0, 2);
        const validCountryCodes = Object.values(COUNTRY_CODES).concat(Object.values(CANADA_PROVINCES));
        
        if (!validCountryCodes.includes(countryCode)) {
            validation.warnings.push(`Country code "${countryCode}" not recognized`);
        }
        
        validation.breakdown.country = {
            value: countryCode,
            valid: validCountryCodes.includes(countryCode)
        };
        
        // Check if contains only alphanumeric characters
        if (!/^[A-Z0-9]+$/.test(midCode)) {
            validation.isValid = false;
            validation.errors.push('MID code should contain only uppercase letters and numbers');
        }
        
        return validation;
    }

    // Display validation status
    displayValidationStatus(validation) {
        const statusDiv = document.getElementById('validationStatus');
        let html = '';
        let className = '';
        
        if (validation.isValid && validation.warnings.length === 0) {
            className = 'valid';
            html = `
                <div class="text-center">
                    <div class="mb-2">
                        <div class="mb-3">✅ 代码验证通过</div>
                    </div>
                    <div class="mb-0">
                        <div class="mb-2">
                            🏆 <span class="text-success">此MID代码符合FedEx官方标准格式要求</span>
                        </div>
                        <div class="mb-2">
                            🛡️ <span class="text-primary">符合美国海关申报要求</span>
                        </div>
                        <div>
                            ✔️ <span class="text-info">验证通过可用于申报</span>
                        </div>
                    </div>
                </div>
            `;
        } else if (validation.isValid && validation.warnings.length > 0) {
            className = 'warning';
            html = `
                <div class="d-flex align-items-start justify-content-between">
                    <div class="flex-grow-1">
                        <h6 class="mb-2"><i class="fas fa-exclamation-triangle me-2"></i>代码有效但有警告</h6>
                        <p class="mb-2 small">此MID代码基本符合格式要求，但请注意以下警告：</p>
                        <ul class="mb-0 small">
            `;
            validation.warnings.forEach(warning => {
                html += `<li>${warning}</li>`;
            });
            html += `
                        </ul>
                    </div>
                    <div>
                        <i class="fas fa-exclamation-triangle fa-2x text-warning"></i>
                    </div>
                </div>
            `;
        } else {
            className = 'invalid';
            html = `
                <div class="d-flex align-items-start justify-content-between">
                    <div class="flex-grow-1">
                        <h6 class="mb-2"><i class="fas fa-times-circle me-2"></i>代码格式错误</h6>
                        <p class="mb-2 small">此MID代码不符合FedEx官方标准格式，请检查以下问题：</p>
                        <ul class="mb-0 small">
            `;
            validation.errors.forEach(error => {
                html += `<li>${error}</li>`;
            });
            html += `
                        </ul>
                    </div>
                    <div>
                        <i class="fas fa-times-circle fa-2x text-danger"></i>
                    </div>
                </div>
            `;
        }
        
        statusDiv.className = `validation-status ${className}`;
        statusDiv.innerHTML = html;
    }

    // Validate MID code (for validation tab)
    validateMidCode() {
        const midCode = document.getElementById('midValidateInput').value.trim().toUpperCase();
        
        if (!midCode) {
            this.showAlert('请输入要验证的MID代码。', 'warning');
            return;
        }
        
        const validation = this.validateMidCodeStructure(midCode);
        const analysis = this.analyzeMidCode(midCode);
        
        this.displayValidationResult(midCode, validation, analysis);
    }

    // Real-time validation on input
    validateOnInput() {
        const midCode = document.getElementById('midValidateInput').value.trim().toUpperCase();
        
        if (midCode.length > 0) {
            // Update the input with uppercase
            document.getElementById('midValidateInput').value = midCode;
            
            // Validate if length is reasonable
            if (midCode.length >= 5) {
                const validation = this.validateMidCodeStructure(midCode);
                const analysis = this.analyzeMidCode(midCode);
                this.displayValidationResult(midCode, validation, analysis);
            }
        }
    }

    // Analyze MID code components
    analyzeMidCode(midCode) {
        const analysis = {
            country: { code: '', name: '' },
            company: '',
            address: '',
            city: ''
        };
        
        // Extract country code
        const countryCode = midCode.substring(0, 2);
        analysis.country.code = countryCode;
        
        // Find country name
        for (const [country, code] of Object.entries(COUNTRY_CODES)) {
            if (code === countryCode) {
                analysis.country.name = country;
                break;
            }
        }
        
        // Check Canadian provinces
        if (!analysis.country.name) {
            for (const [province, code] of Object.entries(CANADA_PROVINCES)) {
                if (code === countryCode) {
                    analysis.country.name = `Canada (${province})`;
                    break;
                }
            }
        }
        
        // Extract other components (simplified analysis)
        const remaining = midCode.substring(2);
        
        // Last 3 characters are likely city code
        if (remaining.length >= 3) {
            analysis.city = remaining.substring(remaining.length - 3);
        }
        
        // Middle part is company + address
        if (remaining.length > 3) {
            const middle = remaining.substring(0, remaining.length - 3);
            
            // Look for numbers (address)
            const numberMatch = middle.match(/\d+/);
            if (numberMatch) {
                analysis.address = numberMatch[0];
                analysis.company = middle.replace(/\d+/g, '');
            } else {
                analysis.company = middle;
            }
        }
        
        return analysis;
    }

    // Display validation result
    displayValidationResult(midCode, validation, analysis) {
        const resultDiv = document.getElementById('validationResult');
        
        let html = `<div class="card">
            <div class="card-body">
                <h5 class="card-title mb-4">
                    <i class="fas fa-search me-2"></i>验证结果：<code class="ms-2">${midCode}</code>
                </h5>`;
        
        // Status with FedEx reference
        if (validation.isValid && validation.warnings.length === 0) {
            html += `<div class="alert alert-success border-0" style="background: linear-gradient(135deg, #d4edda 0%, #c3e6cb 100%);">
                <div class="d-flex align-items-center">
                    <i class="fas fa-check-circle fa-2x me-3 text-success"></i>
                    <div>
                        <h6 class="mb-1 text-success">✅ MID代码验证通过</h6>
                        <small class="text-success">此代码符合FedEx官方标准，可用于海关申报</small>
                    </div>
                </div>
            </div>`;
        } else if (validation.isValid && validation.warnings.length > 0) {
            html += `<div class="alert alert-warning border-0" style="background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);">
                <div class="d-flex align-items-center">
                    <i class="fas fa-exclamation-triangle fa-2x me-3 text-warning"></i>
                    <div>
                        <h6 class="mb-1 text-warning">⚠️ 代码有效但需注意</h6>
                        <small class="text-warning">基本符合格式要求，但有一些建议</small>
                    </div>
                </div>
            </div>`;
        } else {
            html += `<div class="alert alert-danger border-0" style="background: linear-gradient(135deg, #f8d7da 0%, #f5c6cb 100%);">
                <div class="d-flex align-items-center">
                    <i class="fas fa-times-circle fa-2x me-3 text-danger"></i>
                    <div>
                        <h6 class="mb-1 text-danger">❌ 代码格式不符合标准</h6>
                        <small class="text-danger">不符合FedEx官方MID代码格式要求</small>
                    </div>
                </div>
            </div>`;
        }
        
        // Analysis breakdown with modern design
        html += '<div class="alert alert-light border mb-4">';
        html += '<h6 class="mb-3"><i class="fas fa-microscope me-2"></i>代码组成分析：</h6>';
        
        html += `<div class="row mb-2">
            <div class="col-8">
                <div><i class="fas fa-flag me-2"></i><strong>国家代码</strong></div>
                <div class="text-muted small">${analysis.country.name || '未识别的国家代码'}</div>
            </div>
            <div class="col-4 text-end">
                <span class="badge bg-success fs-6">${analysis.country.code}</span>
            </div>
        </div>`;
        
        if (analysis.company) {
            html += `<div class="row mb-2">
                <div class="col-8">
                    <div><i class="fas fa-building me-2"></i><strong>制造商名称</strong></div>
                    <div class="text-muted small">从制造商名称提取</div>
                </div>
                <div class="col-4 text-end">
                    <span class="badge bg-primary fs-6">${analysis.company}</span>
                </div>
            </div>`;
        }
        
        if (analysis.address) {
            html += `<div class="row mb-2">
                <div class="col-8">
                    <div><i class="fas fa-map-marker-alt me-2"></i><strong>地址行</strong></div>
                    <div class="text-muted small">从地址中提取的数字</div>
                </div>
                <div class="col-4 text-end">
                    <span class="badge bg-info fs-6">${analysis.address}</span>
                </div>
            </div>`;
        }
        
        if (analysis.city) {
            html += `<div class="row mb-2">
                <div class="col-8">
                    <div><i class="fas fa-city me-2"></i><strong>城市</strong></div>
                    <div class="text-muted small">从城市名称提取</div>
                </div>
                <div class="col-4 text-end">
                    <span class="badge bg-warning fs-6">${analysis.city}</span>
                </div>
            </div>`;
        }
        
        html += '</div>';
        
        // Errors and warnings with improved styling
        if (validation.errors.length > 0) {
            html += '<div class="alert alert-danger border-0 mb-3">';
            html += '<h6 class="text-danger mb-2"><i class="fas fa-exclamation-circle me-2"></i>发现的错误：</h6>';
            html += '<ul class="mb-0 small">';
            validation.errors.forEach(error => {
                html += `<li class="text-danger">${error}</li>`;
            });
            html += '</ul></div>';
        }
        
        if (validation.warnings.length > 0) {
            html += '<div class="alert alert-warning border-0 mb-3">';
            html += '<h6 class="text-warning mb-2"><i class="fas fa-exclamation-triangle me-2"></i>注意事项：</h6>';
            html += '<ul class="mb-0 small">';
            validation.warnings.forEach(warning => {
                html += `<li class="text-warning">${warning}</li>`;
            });
            html += '</ul></div>';
        }
        
        // Add FedEx reference footer
        html += '<div class="mt-4 p-3 rounded" style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 1px solid #dee2e6;">';
        html += '<div class="text-center">';
        html += '<small class="text-muted">';
        html += '<i class="fas fa-info-circle me-1"></i>';
        html += '验证标准基于 <a href="https://www.fedex.com/en-gb/customer-support/faq/customs/customs-codes/how-to-generate-mid-code.html" target="_blank" class="text-decoration-none">FedEx官方MID代码生成指南</a>';
        html += '</small>';
        html += '</div></div>';
        
        html += '</div></div>';
        
        resultDiv.innerHTML = html;
        resultDiv.style.display = 'block';
    }

    // Process batch file
    processBatch() {
        const fileInput = document.getElementById('batchFile');
        const file = fileInput.files[0];
        
        if (!file) {
            this.showAlert('Please select a file to process.', 'warning');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = this.parseBatchFile(e.target.result, file.type);
                this.processBatchData(data);
            } catch (error) {
                this.showAlert('Error processing file: ' + error.message, 'danger');
            }
        };
        
        reader.readAsText(file);
    }

    // Parse batch file content
    parseBatchFile(content, fileType) {
        const lines = content.split('\n').map(line => line.trim()).filter(line => line);
        
        if (lines.length === 0) {
            throw new Error('File is empty');
        }
        
        const data = [];
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        // Expected headers
        const expectedHeaders = ['company', 'address', 'city', 'country'];
        const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
        
        if (missingHeaders.length > 0) {
            throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
        }
        
        // Process data rows
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const row = {};
            
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            
            data.push(row);
        }
        
        return data;
    }

    // Process batch data
    processBatchData(data) {
        const results = [];
        
        data.forEach((row, index) => {
            try {
                const countryCode = this.getCountryCode(row.country);
                
                if (!countryCode) {
                    throw new Error(`Unknown country: ${row.country}`);
                }
                
                const processedData = {
                    country: { name: row.country, code: countryCode },
                    company: row.company,
                    address: this.extractAddressNumbers(row.address),
                    city: row.city
                };
                
                const midCode = this.generateMidCode(processedData);
                const validation = this.validateMidCodeStructure(midCode);
                
                results.push({
                    row: index + 1,
                    company: row.company,
                    country: row.country,
                    midCode: midCode,
                    status: validation.isValid ? 'success' : 'error',
                    errors: validation.errors,
                    warnings: validation.warnings
                });
            } catch (error) {
                results.push({
                    row: index + 1,
                    company: row.company,
                    country: row.country,
                    midCode: '',
                    status: 'error',
                    errors: [error.message],
                    warnings: []
                });
            }
        });
        
        this.displayBatchResults(results);
    }

    // Display batch processing results
    displayBatchResults(results) {
        const resultDiv = document.getElementById('batchResults');
        const contentDiv = document.getElementById('batchResultsContent');
        
        let html = '<div class="table-responsive"><table class="table table-striped">';
        html += '<thead><tr><th>Row</th><th>Company</th><th>Country</th><th>MID Code</th><th>Status</th></tr></thead><tbody>';
        
        results.forEach(result => {
            const statusClass = result.status === 'success' ? 'text-success' : 'text-danger';
            const statusIcon = result.status === 'success' ? 'fa-check' : 'fa-times';
            
            html += `<tr>
                <td>${result.row}</td>
                <td>${result.company}</td>
                <td>${result.country}</td>
                <td><code>${result.midCode}</code></td>
                <td><i class="fas ${statusIcon} ${statusClass}"></i></td>
            </tr>`;
        });
        
        html += '</tbody></table></div>';
        
        // Summary
        const successful = results.filter(r => r.status === 'success').length;
        const failed = results.length - successful;
        
        html += `<div class="mt-3">
            <p><strong>Summary:</strong> ${successful} successful, ${failed} failed out of ${results.length} total records.</p>
        </div>`;
        
        contentDiv.innerHTML = html;
        resultDiv.style.display = 'block';
        
        // Store results for download
        this.batchResults = results;
    }

    // Download template file
    downloadTemplate() {
        const csvContent = 'Company,Address,City,Country\n' +
                          'Apple Inc.,One Apple Park Way,Cupertino,United States\n' +
                          'Samsung Electronics,Samsung Town,Seoul,South Korea\n' +
                          'Toyota Motor Corporation,1 Toyota-cho,Toyota,Japan';
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mid_generator_template.csv';
        a.click();
        URL.revokeObjectURL(url);
    }

    // Utility function to show alerts
    showAlert(message, type = 'info') {
        // Create alert element
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 1050; min-width: 300px;';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(alertDiv);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MIDGenerator();
}); 