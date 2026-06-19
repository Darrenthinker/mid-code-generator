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
        this.updateFooterYear();

        // Load saved data if any
        this.lastParsedData = null;
    }

    updateFooterYear() {
        const yearElement = document.getElementById('footerCurrentYear');
        if (!yearElement) return;

        yearElement.textContent = Math.max(2026, new Date().getFullYear()).toString();
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

    // Intelligently classify lines to identify company vs address
    classifyLines(lines) {
        const result = {
            companyLine: '',
            addressLine: '',
            companyLineIndex: -1,
            addressLineIndex: -1
        };

        // Company indicators (case insensitive) - strong indicators
        const companyIndicators = [
            'co.', 'ltd.', 'ltd', 'inc.', 'inc', 'corp.', 'corp', 'corporation',
            'company', 'limited', 'incorporated', 'llc', 'plc', 'gmbh', 'ag',
            'sa', 'spa', 'srl', 'bv', 'nv', 'oy', 'ab', 'as', 'technology',
            'technologies', 'tech', 'systems', 'solutions', 'group', 'holding',
            'industrial', 'manufacturing', 'factory', 'enterprise', 'international'
        ];

        // Strong address indicators
        const strongAddressIndicators = [
            'no.', 'number', '#', 'zone', 'district', 'community', 'street', 'road',
            'avenue', 'building', 'floor', 'unit', 'suite', 'room', 'block', 'lot'
        ];

        let bestCompany = { line: '', score: 0, index: -1 };
        let bestAddress = { line: '', score: 0, index: -1 };

        // Score each line
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const lowerLine = line.toLowerCase();

            let companyScore = 0;
            let addressScore = 0;

            // Strong company indicators
            companyIndicators.forEach(indicator => {
                if (lowerLine.includes(indicator)) {
                    companyScore += 20; // Increased weight for company indicators
                }
            });

            // Strong address indicators
            strongAddressIndicators.forEach(indicator => {
                if (lowerLine.includes(indicator)) {
                    addressScore += 15;
                }
            });

            // Numbers pattern analysis
            const numberMatches = line.match(/\d+/g);
            if (numberMatches) {
                // Building numbers like "No.7-3" strongly indicate address
                if (/no\.?\s*\d+[-\s]?\d*/i.test(line)) {
                    addressScore += 25;
                }
                // Multiple numbers often indicate address
                else if (numberMatches.length >= 2) {
                    addressScore += 10;
                } else {
                    // Single number could be company (like year) or address
                    addressScore += 3;
                }
            }

            // Comma count analysis - addresses often have more geographical hierarchy
            const commaCount = (line.match(/,/g) || []).length;
            if (commaCount >= 4) {
                addressScore += 15; // Very likely address with geographic hierarchy
            } else if (commaCount >= 2) {
                addressScore += 8;
            }

            // Country detection strongly indicates address line
            if (this.isCountryLine(line)) {
                addressScore += 20;
            }

            // Length and structure analysis
            if (line.length > 60 && commaCount >= 3) {
                addressScore += 10; // Long lines with commas likely addresses
            }

            // Update best scores
            if (companyScore > addressScore && companyScore > bestCompany.score) {
                bestCompany = { line, score: companyScore, index: i };
            }

            if (addressScore > companyScore && addressScore > bestAddress.score) {
                bestAddress = { line, score: addressScore, index: i };
            }
        }

        // Apply results if scores are significant
        if (bestCompany.score >= 10) {
            result.companyLine = bestCompany.line;
            result.companyLineIndex = bestCompany.index;
        }

        if (bestAddress.score >= 15) {
            result.addressLine = bestAddress.line;
            result.addressLineIndex = bestAddress.index;
        }

        // Fallback logic - use position and content heuristics
        if (!result.companyLine || !result.addressLine) {
            for (let i = 0; i < lines.length; i++) {
                const line = lines[i];
                const lowerLine = line.toLowerCase();

                // Look for company line
                if (!result.companyLine && i !== result.addressLineIndex) {
                    // Lines with company suffixes but no address indicators
                    if (companyIndicators.some(ind => lowerLine.includes(ind)) &&
                        !strongAddressIndicators.some(ind => lowerLine.includes(ind))) {
                        result.companyLine = line;
                        result.companyLineIndex = i;
                    }
                    // Short lines without numbers or commas are likely company names
                    else if (line.length < 60 && !/\d/.test(line) && !line.includes(',')) {
                        result.companyLine = line;
                        result.companyLineIndex = i;
                    }
                }

                // Look for address line
                if (!result.addressLine && i !== result.companyLineIndex) {
                    // Lines starting with "No." or containing geographic terms
                    if (/^no\.?\s*\d+/i.test(line) ||
                        /zone|district|community|street|road/i.test(line)) {
                        result.addressLine = line;
                        result.addressLineIndex = i;
                    }
                    // Long lines with numbers and commas
                    else if (line.length > 40 && /\d/.test(line) && line.includes(',')) {
                        result.addressLine = line;
                        result.addressLineIndex = i;
                    }
                }
            }
        }

        return result;
    }

    // Helper function to calculate line score
    getLineScore(line, indicators, type) {
        let score = 0;
        const lowerLine = line.toLowerCase();

        indicators.forEach(indicator => {
            if (lowerLine.includes(indicator)) {
                score += 10;
            }
        });

        if (type === 'address') {
            const numberMatches = line.match(/\d+/g);
            if (numberMatches) {
                score += numberMatches.length * 5;
            }
        }

        return score;
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
            console.log('解析结果:', parsedData); // 调试信息

            // 验证解析结果是否符合FedEx四条规则
            const validationResult = this.validateMidRequirements(parsedData);
            console.log('验证结果:', validationResult); // 调试信息

            if (!validationResult.isValid) {
                console.log('验证失败，显示错误信息'); // 调试信息
                this.showAlert(validationResult.message, 'warning');
                return;
            }

            // 直接生成MID码，不显示中间解析步骤
            const midCode = this.generateMidCode(parsedData);
            this.displayMidCode(midCode, parsedData);
        } catch (error) {
            console.log('生成失败:', error); // 调试信息
            this.showAlert('生成MID代码失败：' + error.message, 'danger');
        }
    }

            // Enhanced intelligent parsing
    intelligentParse(fullInfo) {
        const lines = fullInfo.split('\n').map(line => line.trim()).filter(line => line);

        // 不再要求至少2行，单行也可以解析（但会缺少公司名）
        if (lines.length === 0) {
            throw new Error('请输入制造商信息');
        }

        const result = {
            company: '',
            address: '',
            city: '',
            country: { name: '', code: '' },
            confidence: 0
        };

        // Intelligent line classification
        const lineClassification = this.classifyLines(lines);

        // Extract company name - 如果智能识别没找到，尝试从非地址行中找
        result.company = lineClassification.companyLine || '';

        // 如果没有找到公司行，尝试找一个不是地址的行作为公司名
        if (!result.company && lines.length > 1) {
            for (let i = 0; i < lines.length; i++) {
                if (i !== lineClassification.addressLineIndex) {
                    const line = lines[i];
                    // 避免明显的地址行（包含太多地理信息）
                    if (!(/\b(district|zone|community|street|road|guangdong|china|mainland)\b/i.test(line))) {
                        result.company = line;
                        break;
                    }
                }
            }
        }

        // 如果只有一行，并且这行看起来是地址，则公司名为空
        if (!result.company && lines.length === 1) {
            const singleLine = lines[0];
            // 检查是否包含明显的地址信息
            if (/\b(no\.|number|district|zone|community|street|road|china|mainland)\b/i.test(singleLine)) {
                // 这行看起来是地址，公司名保持为空
                result.company = '';
            } else {
                // 这行可能是公司名
                result.company = singleLine;
            }
        }

        // Parse country
        const countryInfo = this.extractCountry(fullInfo);
        result.country = { name: countryInfo, code: this.getCountryCode(countryInfo) };

        // Parse city
        result.city = this.extractCity(fullInfo);

        // Parse address numbers from address line or full text
        result.address = this.extractAddressNumbers(lineClassification.addressLine || fullInfo);

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

        // Known major cities for better recognition - 扩展澳洲城市
        const majorCities = [
            // 中国城市
            'beijing', 'shanghai', 'shenzhen', 'guangzhou', 'chengdu', 'hangzhou', 'wuhan', 'nanjing',
            'tianjin', 'chongqing', 'suzhou', 'xi\'an', 'qingdao', 'dalian', 'ningbo', 'xiamen',
            // 英国城市
            'london', 'manchester', 'birmingham', 'liverpool', 'leeds', 'glasgow', 'bristol',
            // 美国城市
            'new york', 'los angeles', 'chicago', 'houston', 'phoenix', 'philadelphia', 'san antonio',
            'san diego', 'dallas', 'san jose', 'austin', 'jacksonville', 'san francisco', 'columbus',
            'charlotte', 'indianapolis', 'seattle', 'denver', 'washington', 'boston', 'el paso',
            'detroit', 'nashville', 'portland', 'oklahoma city', 'las vegas', 'louisville', 'baltimore',
            'milwaukee', 'albuquerque', 'tucson', 'fresno', 'sacramento', 'mesa', 'kansas city',
            'atlanta', 'colorado springs', 'omaha', 'raleigh', 'miami', 'long beach', 'virginia beach',
            'oakland', 'minneapolis', 'tulsa', 'arlington', 'tampa', 'new orleans', 'wichita',
            'cleveland', 'bakersfield', 'aurora', 'anaheim', 'honolulu', 'santa ana', 'corpus christi',
            'riverside', 'lexington', 'stockton', 'toledo', 'st. paul', 'newark', 'greensboro',
            'plano', 'henderson', 'lincoln', 'buffalo', 'jersey city', 'chula vista', 'fort wayne',
            'orlando', 'st. petersburg', 'chandler', 'laredo', 'norfolk', 'durham', 'madison',
            // 澳洲城市 - 新增
            'melbourne', 'sydney', 'brisbane', 'perth', 'adelaide', 'gold coast', 'newcastle', 'canberra',
            'sunshine coast', 'wollongong', 'hobart', 'geelong', 'townsville', 'cairns', 'toowoomba',
            'darwin', 'ballarat', 'bendigo', 'albury', 'launceston', 'mackay', 'rockhampton', 'bunbury',
            // 加拿大城市
            'toronto', 'montreal', 'vancouver', 'calgary', 'edmonton', 'ottawa', 'winnipeg', 'quebec city',
            // 其他国际主要城市
            'tokyo', 'seoul', 'singapore', 'hong kong', 'bangkok', 'kuala lumpur', 'jakarta', 'manila',
            'mumbai', 'delhi', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad'
        ];

        // First, try to find known cities in any line
        for (const line of lines) {
            const lowerLine = line.toLowerCase();
            for (const city of majorCities) {
                if (lowerLine.includes(city)) {
                    // Extract the city name from the line
                    const cityRegex = new RegExp(`\\b${city}\\b`, 'i');
                    const match = line.match(cityRegex);
                    if (match) {
                        return match[0];
                    }
                }
            }
        }

        // If no known city found, use pattern-based extraction
        for (const line of lines) {
            // Look for patterns where city appears after district/county but before province/state
            const parts = line.split(',').map(part => part.trim());

            if (parts.length >= 2) {
                // 优先查找真正的城市，避免州/省名
                let cityCandidate = '';
                let stateProvince = '';

                // 识别州/省和国家
                const stateProvinces = ['victoria', 'nsw', 'queensland', 'western australia', 'south australia', 'tasmania', 'act', 'nt', 'california', 'ca', 'texas', 'tx', 'florida', 'fl', 'new york', 'ny', 'guangdong', 'beijing', 'shanghai', 'jiangsu', 'zhejiang'];

                // Check each part for city-like patterns
                for (let i = 0; i < parts.length; i++) {
                    const part = parts[i];
                    const lowerPart = part.toLowerCase();

                    // Skip parts that look like building numbers, districts, or countries
                    if (/^\d+/.test(part)) continue; // Starts with number
                    if (/district|zone|area|region|county|province|state|country/i.test(part)) continue;
                    if (this.getCountryCode(part)) continue; // Is a country

                    // 检查是否是州/省名
                    if (stateProvinces.some(sp => lowerPart.includes(sp))) {
                        stateProvince = part;
                        continue; // 跳过州/省名
                    }

                    // Look for city-like parts (usually single word or two words, no numbers)
                    if (part.length > 2 && part.length < 20 && !/\d/.test(part)) {
                        // If it contains common city identifiers
                        if (/city|town|village/i.test(part)) {
                            return part.replace(/city|town|village/gi, '').trim();
                        }

                        // 如果是可能的城市候选（不是州/省）
                        if (!cityCandidate) {
                            cityCandidate = part;
                        }

                        // If it's in a position where cities usually appear (after districts, before provinces)
                        if (i > 0 && i < parts.length - 1) {
                            const prevPart = parts[i-1].toLowerCase();
                            const nextPart = parts[i+1].toLowerCase();

                            // Previous part mentions district/area, next part mentions province/state
                            if ((prevPart.includes('district') || prevPart.includes('zone') || prevPart.includes('area')) &&
                                (nextPart.includes('province') || nextPart.includes('state') || this.getCountryCode(nextPart) || stateProvinces.some(sp => nextPart.includes(sp)))) {
                                return part;
                            }
                        }

                        // If it's the last non-country part but not a state/province
                        if (i === parts.length - 2 && this.getCountryCode(parts[parts.length - 1]) && !stateProvinces.some(sp => lowerPart.includes(sp))) {
                            return part;
                        }
                    }
                }

                // 如果找到了城市候选而且不是州/省，返回它
                if (cityCandidate && cityCandidate !== stateProvince) {
                    return cityCandidate;
                }
            }
        }

        // Fallback: try to extract city from address-like lines
        for (const line of lines) {
            if (line.includes(',')) {
                const parts = line.split(',').map(part => part.trim());
                // Look for parts that could be cities (no numbers, reasonable length)
                for (const part of parts) {
                    if (part.length > 2 && part.length < 20 && !/^\d/.test(part) && !this.getCountryCode(part)) {
                        // Remove common non-city words
                        const cleanPart = part.replace(/\b(district|zone|area|street|road|avenue|building|floor|no\.?|#)\b/gi, '').trim();
                        if (cleanPart.length > 2) {
                            return cleanPart;
                        }
                    }
                }
            }
        }

        return '';
    }

    // Get country code from country name or code - 支持国家名称和国家代码输入
    getCountryCode(countryName) {
        if (!countryName) return '';

        const inputName = countryName.trim();
        const lowerInputName = inputName.toLowerCase();

        // 1. 直接检查是否是有效的国家代码（2位大写）
        if (inputName.length === 2) {
            const upperCode = inputName.toUpperCase();
            // 检查这个代码是否存在于我们的国家代码映射中
            for (const [country, code] of Object.entries(COUNTRY_CODES)) {
                if (code === upperCode) {
                    return upperCode;
                }
            }
        }

        // 2. 直接查找国家名称
        if (COUNTRY_CODES[lowerInputName]) {
            return COUNTRY_CODES[lowerInputName];
        }

        // 3. 检查国家变体名称
        if (COUNTRY_VARIATIONS[lowerInputName]) {
            const standardName = COUNTRY_VARIATIONS[lowerInputName];
            if (COUNTRY_CODES[standardName]) {
                return COUNTRY_CODES[standardName];
            }
        }

        // 4. 部分匹配国家名称
        for (const [country, code] of Object.entries(COUNTRY_CODES)) {
            if (country.toLowerCase().includes(lowerInputName) ||
                lowerInputName.includes(country.toLowerCase())) {
                return code;
            }
        }

        return '';
    }

    // Get country name from country code - 从国家代码获取国家名称
    getCountryNameFromCode(countryCode) {
        if (!countryCode) return '';

        // 常用国家的中英文对照
        const countryNames = {
            'CN': 'China',
            'US': 'United States',
            'GB': 'United Kingdom',
            'FR': 'France',
            'DE': 'Germany',
            'IT': 'Italy',
            'JP': 'Japan',
            'KR': 'South Korea',
            'CA': 'Canada',
            'AU': 'Australia',
            'IN': 'India',
            'BR': 'Brazil',
            'MX': 'Mexico',
            'ES': 'Spain',
            'NL': 'Netherlands',
            'CH': 'Switzerland',
            'SE': 'Sweden',
            'DK': 'Denmark',
            'NO': 'Norway',
            'FI': 'Finland',
            'SG': 'Singapore',
            'TH': 'Thailand',
            'VN': 'Vietnam',
            'MY': 'Malaysia',
            'PH': 'Philippines',
            'ID': 'Indonesia',
            'TW': 'Taiwan',
            'TR': 'Turkey',
            'AE': 'United Arab Emirates',
            'SA': 'Saudi Arabia',
            'EG': 'Egypt',
            'ZA': 'South Africa',
            'AR': 'Argentina',
            'CL': 'Chile',
            'CO': 'Colombia',
            'PE': 'Peru'
        };

        return countryNames[countryCode.toUpperCase()] || countryCode;
    }

    // 验证MID生成所需信息是否完整 - 按照FedEx四条规则验证
    validateMidRequirements(data) {
        const missing = [];
        const warnings = [];

        // FedEx规则第1条：国家代码（必填）
        if (!data.country || !data.country.name || data.country.name.trim() === '') {
            missing.push('国家名称或代码');
        }

        // FedEx规则第2条：制造商名称（必填）
        if (!data.company || data.company.trim() === '') {
            missing.push('制造商名称');
        } else {
            // 检查制造商名称是否足够长以生成有效代码
            const cleanCompany = data.company.trim().toUpperCase();
            const words = cleanCompany.replace(/[^\w\s]/g, ' ').split(/\s+/).filter(word => word.length > 0);
            if (words.length === 0 || (words.length === 1 && words[0].length < 3)) {
                warnings.push('制造商名称可能太短，建议提供更完整的公司名称');
            }
        }

        // FedEx规则第3条：地址编号（可选，但如果提供需要是数字）
        if (!data.address || data.address.trim() === '') {
            warnings.push('缺少地址编号 - 根据FedX官方示例AUOZR92MEL，地址编号92对生成完整MID代码很重要');
        } else {
            const addressNum = data.address.trim();
            if (!/^\d+$/.test(addressNum)) {
                warnings.push('地址编号应为纯数字（如：92、73、1640等）');
            } else if (addressNum.length > 4) {
                warnings.push('地址编号超过4位，建议控制在4位以内');
            }
        }

        // FedEx规则第4条：城市名称（必填）
        if (!data.city || data.city.trim() === '') {
            missing.push('城市名称');
        } else {
            // 检查城市名称是否足够长以生成有效代码
            const cleanCity = data.city.trim().replace(/[^\w]/g, '');
            if (cleanCity.length < 3) {
                warnings.push('城市名称可能太短，建议提供完整的城市名称');
            }
        }

        // 生成错误信息
        if (missing.length > 0) {
            let message = '<strong>请补充完整信息以符合FedEx四条规则：</strong><br><br>';
            message += '<span style="color: #dc3545;">缺少以下必填信息：</span><br>';
            missing.forEach((item, index) => {
                message += `${index + 1}. <strong>${item}</strong><br>`;
            });

            message += '<br><span style="color: #6c757d;">FedEx标准要求：</span><br>';
            message += '✓ <strong>第1条</strong>：国家名称或代码（如：中国、China、CN）<br>';
            message += '✓ <strong>第2条</strong>：制造商完整名称（如：Shenzhen Calux Purification Technology Co., Ltd.）<br>';
            message += '• <strong>第3条</strong>：地址编号（可选，如：73、1640）<br>';
            message += '✓ <strong>第4条</strong>：城市名称（如：深圳、Shenzhen）';

            return {
                isValid: false,
                message: message
            };
        }

        // 如果有警告，但信息完整
        if (warnings.length > 0) {
            let message = '<strong>信息已接收，但建议优化：</strong><br><br>';
            warnings.forEach((warning, index) => {
                message += `${index + 1}. <span style="color: #856404;">${warning}</span><br>`;
            });
            message += '<br><span style="color: #6c757d;">点击生成按钮继续创建MID代码</span>';

            return {
                isValid: true,
                hasWarnings: true,
                message: message
            };
        }

        return {
            isValid: true,
            hasWarnings: false
        };
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

    // Extract address numbers with improved logic - 修复地址编号提取
    extractAddressNumbers(addressText) {
        if (!addressText) return '';

        // If we have a specific address line, use it directly
        let targetText = addressText;

        // If it's multi-line text, extract from all lines looking for address-like content
        const lines = addressText.split('\n').map(line => line.trim()).filter(line => line);

        // 优先从包含street/road/avenue等地址关键词的行提取数字
        let addressLine = '';
        for (const line of lines) {
            if (/\b(street|st|road|rd|avenue|ave|way|drive|dr|lane|ln|springs|place|pl)\b/i.test(line)) {
                addressLine = line;
                break;
            }
        }

        // 如果找到了地址行，优先使用它
        if (addressLine) {
            targetText = addressLine;
        }

        const normalizedText = targetText.replace(/[\uFF0C]/g, ',');
        const addressNumberCandidates = [];
        const numberPattern = /\d+(?![A-Za-z0-9])(?:\s*[-,]\s*\d+(?![A-Za-z0-9])|\s+\d+(?![A-Za-z0-9]))*/g;
        let match;

        while ((match = numberPattern.exec(normalizedText)) !== null) {
            const rawValue = match[0];
            const digits = rawValue.replace(/\D/g, '');

            if (!digits || parseInt(digits, 10) <= 0) continue;

            addressNumberCandidates.push({
                digits,
                value: parseInt(digits, 10),
                index: match.index
            });
        }

        if (addressNumberCandidates.length === 0) return '';

        // FedEx/CBP rule: use the largest number from the address, then limit it to four digits.
        const bestCandidate = addressNumberCandidates.reduce((best, candidate) => {
            if (!best) return candidate;
            if (candidate.value > best.value) return candidate;
            if (candidate.value === best.value && candidate.index < best.index) return candidate;
            return best;
        }, null);

        return bestCandidate.digits.substring(0, 4);
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
        // 验证手动输入是否符合FedEx四条规则
        const validationResult = this.validateMidRequirements(data);
        if (!validationResult.isValid) {
            this.showAlert(validationResult.message, 'warning');
            return;
        }

        // Extract country code and validate
        data.country.code = this.getCountryCode(data.country.name);
        if (!data.country.code) {
            this.showAlert('无法识别国家名称或代码，请检查拼写。支持格式：中国、China、CN', 'warning');
            return;
        }

        // 如果输入的是国家代码，更新为完整国家名称用于显示
        if (data.country.name.length === 2) {
            const fullCountryName = this.getCountryNameFromCode(data.country.code);
            if (fullCountryName) {
                data.country.name = fullCountryName;
            }
        }
        // 只从addressInput字段提取最大数字
        const addressInput = document.getElementById('addressInput').value.trim();
        data.address = this.extractAddressNumbers(addressInput);

        try {
            const midCode = this.generateMidCode(data);
            this.displayMidCode(midCode, data);
        } catch (error) {
            this.showAlert('生成MID代码失败：' + error.message, 'danger');
        }
    }

    // Generate MID code from parsed data - 严格按照FedEx四点标准
    generateMidCode(data) {
        let midCode = '';

        // FedEx标准第1点：国家代码 (2位字母)
        const countryCode = data.country.code || 'XX';
        midCode += countryCode;

        // FedEx标准第2点：制造商名称代码 (3-6位字母)
        const companyCode = this.generateCompanyCode(data.company);
        if (companyCode.length < 3) {
            throw new Error('制造商名称太短，无法生成有效的MID代码');
        }
        midCode += companyCode;

        // FedEx标准第3点：地址编号 (数字，可选，最多4位)
        if (data.address && data.address.length > 0) {
            const addressNum = data.address.substring(0, 4);
            midCode += addressNum;
        }

        // FedX标准第4点：城市代码 (3位字母)
        const cityCode = this.generateCityCode(data.city);
        if (cityCode.length < 3) {
            throw new Error('城市名称太短，无法生成有效的城市代码');
        }
        midCode += cityCode;

        return midCode.toUpperCase();
    }

    // Generate company code from company name - 严格按照FedEx四点规则
    generateCompanyCode(company) {
        if (!company) return '';

        const commonWords = new Set(['A', 'AN', 'AND', 'OF', 'THE']);
        const removableSuffixes = new Set([
            'INC', 'INCORPORATED', 'LLC', 'LTD', 'LIMITED', 'CORP', 'CORPORATION',
            'ENTERPRISE', 'ENTERPRISES', 'GROUP', 'INTERNATIONAL', 'GLOBAL',
            'WORLDWIDE', 'HOLDINGS', 'TECHNOLOGIES', 'TECH', 'SOLUTIONS'
        ]);
        const conditionalSuffixes = new Set(['CO', 'COMPANY', 'COMPANIES']);
        const rawWords = company.match(/[A-Za-z]+/g) || [];
        const tokens = [];

        for (let i = 0; i < rawWords.length; i++) {
            const word = rawWords[i];
            const upperWord = word.toUpperCase();

            if (/^[A-Za-z]$/.test(word)) {
                const initials = [upperWord];
                let j = i + 1;

                while (j < rawWords.length && /^[A-Za-z]$/.test(rawWords[j])) {
                    initials.push(rawWords[j].toUpperCase());
                    j++;
                }

                if (initials.length > 1) {
                    tokens.push({ value: initials.join(''), isInitial: false });
                    i = j - 1;
                } else {
                    tokens.push({ value: upperWord, isInitial: true });
                }

                continue;
            }

            tokens.push({ value: upperWord, isInitial: false });
        }

        let words = tokens.filter(token =>
            !token.isInitial &&
            !commonWords.has(token.value) &&
            !removableSuffixes.has(token.value)
        );

        words = words.filter((token, index) => {
            if (!conditionalSuffixes.has(token.value)) return true;

            const previousWords = words.slice(0, index).filter(previous => !conditionalSuffixes.has(previous.value));
            return previousWords.length < 2;
        });

        if (words.length === 0) {
            const fallback = company.replace(/[^A-Za-z]/g, '').toUpperCase();
            return fallback.substring(0, 3);
        }

        if (words.length === 1) {
            return words[0].value.substring(0, 3);
        }

        return (words[0].value.substring(0, 3) + words[1].value.substring(0, 3)).substring(0, 6);
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

    escapeHtml(value) {
        return String(value ?? '').replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[char]));
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
        const safeCountryName = this.escapeHtml(data.country?.name || '');
        const safeCountryCode = this.escapeHtml(data.country?.code || '');
        const safeCompany = this.escapeHtml(data.company || '');
        const safeCompanyCode = this.escapeHtml(this.generateCompanyCode(data.company || ''));
        const safeAddress = this.escapeHtml(data.address || '');
        const safeCity = this.escapeHtml(data.city || '');
        const safeCityCode = this.escapeHtml(this.generateCityCode(data.city || ''));
        const safeConfidence = this.escapeHtml(data.confidence || '');

        let html = '<div class="alert alert-light border mb-3">';
        html += '<h6 class="mb-3"><i class="fas fa-microscope me-2"></i>MID代码组成分析：</h6>';

        html += `<div class="row mb-2">
            <div class="col-8">
                <div class="part-name"><i class="fas fa-flag me-2"></i>国家代码</div>
                <div class="part-source text-muted small">来源：${safeCountryName} → ISO代码</div>
            </div>
            <div class="col-4 text-end">
                <span class="badge bg-success fs-6">${countryPart}</span>
            </div>
        </div>`;

        html += `<div class="row mb-2">
            <div class="col-8">
                <div class="part-name"><i class="fas fa-building me-2"></i>制造商名称</div>
                <div class="part-source text-muted small">来源：${safeCompany} → 取前3-6字母</div>
            </div>
            <div class="col-4 text-end">
                <span class="badge bg-primary fs-6">${companyPart}</span>
            </div>
        </div>`;

        if (addressPart) {
            html += `<div class="row mb-2">
                <div class="col-8">
                    <div class="part-name"><i class="fas fa-map-marker-alt me-2"></i>地址行</div>
                    <div class="part-source text-muted small">来源：${safeAddress} → 最高数字</div>
                </div>
                <div class="col-4 text-end">
                    <span class="badge bg-info fs-6">${addressPart}</span>
                </div>
            </div>`;
        }

        html += `<div class="row mb-2">
            <div class="col-8">
                <div class="part-name"><i class="fas fa-city me-2"></i>城市</div>
                <div class="part-source text-muted small">来源：${safeCity} → 前3字母</div>
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
                        <strong>国家代码：</strong> ${safeCountryName}
                    </div>
                    <span class="badge bg-success">${safeCountryCode}</span>
                </div>
            </div>`;
        }

        if (data.company) {
            html += `<div class="parse-item mb-2">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>制造商名称：</strong> ${safeCompany}
                    </div>
                    <span class="badge bg-primary">${safeCompanyCode}</span>
                </div>
            </div>`;
        }

        if (data.address) {
            html += `<div class="parse-item mb-2">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>地址行：</strong> ${safeAddress}
                    </div>
                    <span class="badge bg-info">${safeAddress}</span>
                </div>
            </div>`;
        }

        if (data.city) {
            html += `<div class="parse-item mb-2">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <strong>城市：</strong> ${safeCity}
                    </div>
                    <span class="badge bg-warning">${safeCityCode}</span>
                </div>
            </div>`;
        }

        if (data.confidence) {
            html += `<div class="mt-2">
                <small class="text-muted">解析置信度：${safeConfidence}%</small>
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

    // Validate MID code structure - 按照FedEx四条规则严格验证
    validateMidCodeStructure(midCode) {
        const validation = {
            isValid: true,
            errors: [],
            warnings: [],
            breakdown: {}
        };

        // 检查基本格式
        if (!/^[A-Z0-9]+$/.test(midCode)) {
            validation.isValid = false;
            validation.errors.push('MID代码只能包含大写字母和数字');
            return validation;
        }

        // FedX四条规则验证
        const analysis = this.analyzeMidCodeDetailed(midCode);

        // 规则1：国家代码验证（前2位，必须是有效的国家代码）
        if (midCode.length < 2) {
            validation.isValid = false;
            validation.errors.push('MID代码太短，缺少国家代码（FedEx规则第1条）');
        } else {
            const countryCode = midCode.substring(0, 2);
            const validCountryCodes = Object.values(COUNTRY_CODES).concat(Object.values(CANADA_PROVINCES));

            validation.breakdown.country = {
                value: countryCode,
                valid: validCountryCodes.includes(countryCode)
            };

            if (!validCountryCodes.includes(countryCode)) {
                validation.isValid = false;
                validation.errors.push(`国家代码"${countryCode}"无效，请检查是否为有效的ISO国家代码（FedX规则第1条）`);
            }
        }

        // 规则2：制造商名称验证（3-6位字母）
        if (analysis.company) {
            validation.breakdown.company = {
                value: analysis.company,
                valid: true
            };

            if (analysis.company.length < 3) {
                validation.isValid = false;
                validation.errors.push(`制造商代码"${analysis.company}"太短，至少需要3位字母（FedX规则第2条）`);
            } else if (analysis.company.length > 6) {
                validation.warnings.push(`制造商代码"${analysis.company}"超过6位，建议控制在6位以内（FedX规则第2条）`);
            }

            // 检查是否包含数字（制造商代码应该只有字母）
            if (/\d/.test(analysis.company)) {
                validation.warnings.push(`制造商代码"${analysis.company}"包含数字，建议只使用字母（FedX规则第2条）`);
            }
        } else {
            validation.isValid = false;
            validation.errors.push('缺少制造商名称代码（FedX规则第2条）');
        }

        // 规则3：地址编号验证（可选，但如果存在必须是数字，最多4位）
        if (analysis.address) {
            validation.breakdown.address = {
                value: analysis.address,
                valid: true
            };

            if (!/^\d+$/.test(analysis.address)) {
                validation.warnings.push(`地址编号"${analysis.address}"应该只包含数字（FedX规则第3条）`);
            } else if (analysis.address.length > 4) {
                validation.warnings.push(`地址编号"${analysis.address}"超过4位，建议控制在4位以内（FedX规则第3条）`);
            }
        }

        // 规则4：城市代码验证（3位字母）
        if (analysis.city) {
            validation.breakdown.city = {
                value: analysis.city,
                valid: true
            };

            if (analysis.city.length !== 3) {
                validation.warnings.push(`城市代码"${analysis.city}"应该为3位字母（FedX规则第4条）`);
            }

            // 检查是否包含数字（城市代码应该只有字母）
            if (/\d/.test(analysis.city)) {
                validation.warnings.push(`城市代码"${analysis.city}"包含数字，应该只使用字母（FedX规则第4条）`);
            }
        } else {
            validation.isValid = false;
            validation.errors.push('缺少城市代码（FedX规则第4条）');
        }

        // 整体长度检查
        if (midCode.length < 5) {
            validation.isValid = false;
            validation.errors.push('MID代码总长度不足，至少需要5位（国家2位+制造商3位）');
        } else if (midCode.length > 15) {
            validation.warnings.push('MID代码总长度超过15位，可能影响系统识别');
        }

        return validation;
    }

    // 详细分析MID代码组成 - 用于验证
    analyzeMidCodeDetailed(midCode) {
        const analysis = {
            country: { code: '', name: '' },
            company: '',
            address: '',
            city: ''
        };

        if (midCode.length < 2) return analysis;

        // 提取国家代码（前2位）
        analysis.country.code = midCode.substring(0, 2);

        // 查找国家名称
        for (const [country, code] of Object.entries(COUNTRY_CODES)) {
            if (code === analysis.country.code) {
                analysis.country.name = country;
                break;
            }
        }

        // 检查加拿大省份代码
        if (!analysis.country.name) {
            for (const [province, code] of Object.entries(CANADA_PROVINCES)) {
                if (code === analysis.country.code) {
                    analysis.country.name = `Canada (${province})`;
                    break;
                }
            }
        }

        const remaining = midCode.substring(2);
        if (remaining.length === 0) return analysis;

        // 按照FedX标准解析：制造商名称+地址编号+城市代码
        // 最后3位是城市代码
        if (remaining.length >= 3) {
            analysis.city = remaining.substring(remaining.length - 3);

            // 检查城市代码是否只包含字母
            if (!/^[A-Z]+$/.test(analysis.city)) {
                // 如果包含数字，可能解析有误，尝试重新解析
                const letters = remaining.match(/[A-Z]+/g) || [];
                const numbers = remaining.match(/\d+/g) || [];

                if (letters.length > 0) {
                    // 最后一个字母组合可能是城市
                    analysis.city = letters[letters.length - 1];
                    // 第一个字母组合是制造商
                    if (letters.length > 1) {
                        analysis.company = letters[0];
                    }
                }

                if (numbers.length > 0) {
                    analysis.address = numbers[0];
                }
            } else {
                // 城市代码正常，解析制造商和地址
                const beforeCity = remaining.substring(0, remaining.length - 3);

                // 查找数字（地址编号）
                const addressMatch = beforeCity.match(/\d+/);
                if (addressMatch) {
                    analysis.address = addressMatch[0];
                    // 制造商名称是剩余的字母部分
                    analysis.company = beforeCity.replace(/\d+/g, '');
                } else {
                    // 没有地址编号，全部是制造商名称
                    analysis.company = beforeCity;
                }
            }
        } else {
            // 长度不足3位城市代码，全部当作制造商名称
            analysis.company = remaining;
        }

        return analysis;
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
                html += `<li>${this.escapeHtml(warning)}</li>`;
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
                html += `<li>${this.escapeHtml(error)}</li>`;
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
        const analysis = this.analyzeMidCodeDetailed(midCode);

        this.displayValidationResult(midCode, validation, analysis);
    }

    // Real-time validation on input
    validateOnInput() {
        const midCode = document.getElementById('midValidateInput').value.trim().toUpperCase();

        if (midCode.length > 0) {
            // Update the input with uppercase
            document.getElementById('midValidateInput').value = midCode;

            // Validate if length is reasonable
            if (midCode.length >= 2) {  // 降低实时验证门槛
                const validation = this.validateMidCodeStructure(midCode);
                const analysis = this.analyzeMidCodeDetailed(midCode);
                this.displayValidationResult(midCode, validation, analysis);
            }
        }
    }

    // Display validation result
    displayValidationResult(midCode, validation, analysis) {
        const resultDiv = document.getElementById('validationResult');
        const safeMidCode = this.escapeHtml(midCode);
        const safeCountryName = this.escapeHtml(analysis.country.name || '未识别的国家代码');
        const safeCountryCode = this.escapeHtml(analysis.country.code || '');
        const safeCompany = this.escapeHtml(analysis.company || '');
        const safeAddress = this.escapeHtml(analysis.address || '');
        const safeCity = this.escapeHtml(analysis.city || '');

        let html = `<div class="card">
            <div class="card-body">
                <h5 class="card-title mb-4">
                    <i class="fas fa-search me-2"></i>验证结果：<code class="ms-2">${safeMidCode}</code>
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
                <div class="text-muted small">${safeCountryName}</div>
            </div>
            <div class="col-4 text-end">
                <span class="badge bg-success fs-6">${safeCountryCode}</span>
            </div>
        </div>`;

        if (analysis.company) {
            html += `<div class="row mb-2">
                <div class="col-8">
                    <div><i class="fas fa-building me-2"></i><strong>制造商名称</strong></div>
                    <div class="text-muted small">从制造商名称提取</div>
                </div>
                <div class="col-4 text-end">
                    <span class="badge bg-primary fs-6">${safeCompany}</span>
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
                    <span class="badge bg-info fs-6">${safeAddress}</span>
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
                    <span class="badge bg-warning fs-6">${safeCity}</span>
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
                html += `<li class="text-danger">${this.escapeHtml(error)}</li>`;
            });
            html += '</ul></div>';
        }

        if (validation.warnings.length > 0) {
            html += '<div class="alert alert-warning border-0 mb-3">';
            html += '<h6 class="text-warning mb-2"><i class="fas fa-exclamation-triangle me-2"></i>注意事项：</h6>';
            html += '<ul class="mb-0 small">';
            validation.warnings.forEach(warning => {
                html += `<li class="text-warning">${this.escapeHtml(warning)}</li>`;
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
                this.showAlert('Error processing file: ' + this.escapeHtml(error.message), 'danger');
            }
        };

        reader.readAsText(file);
    }

    parseCsvRows(content) {
        const rows = [];
        let row = [];
        let field = '';
        let inQuotes = false;

        for (let i = 0; i < content.length; i++) {
            const char = content[i];
            const nextChar = content[i + 1];

            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    field += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
                continue;
            }

            if (char === ',' && !inQuotes) {
                row.push(field.trim());
                field = '';
                continue;
            }

            if ((char === '\n' || char === '\r') && !inQuotes) {
                if (char === '\r' && nextChar === '\n') {
                    i++;
                }
                row.push(field.trim());
                if (row.some(value => value !== '')) {
                    rows.push(row);
                }
                row = [];
                field = '';
                continue;
            }

            field += char;
        }

        row.push(field.trim());
        if (row.some(value => value !== '')) {
            rows.push(row);
        }

        if (inQuotes) {
            throw new Error('CSV contains an unclosed quoted field');
        }

        return rows;
    }

    // Parse batch file content
    parseBatchFile(content, fileType) {
        const rows = this.parseCsvRows(content);

        if (rows.length === 0) {
            throw new Error('File is empty');
        }

        const data = [];
        const headers = rows[0].map(h => h.replace(/^\uFEFF/, '').trim().toLowerCase());

        // Expected headers
        const expectedHeaders = ['company', 'address', 'city', 'country'];
        const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));

        if (missingHeaders.length > 0) {
            throw new Error(`Missing required columns: ${missingHeaders.join(', ')}`);
        }

        // Process data rows
        for (let i = 1; i < rows.length; i++) {
            const values = rows[i];
            const row = {};

            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });

            data.push(row);
        }

        return data;
    }

    // Process batch data - 按照FedX四条规则验证
    processBatchData(data) {
        const results = [];

        data.forEach((row, index) => {
            try {
                // 预处理数据
                const processedData = {
                    country: { name: row.country.trim(), code: '' },
                    company: row.company.trim(),
                    address: this.extractAddressNumbers(row.address),
                    city: row.city.trim()
                };

                // 获取国家代码
                const countryCode = this.getCountryCode(processedData.country.name);
                if (countryCode) {
                    processedData.country.code = countryCode;
                } else {
                    results.push({
                        row: index + 1,
                        company: row.company,
                        country: row.country,
                        midCode: '',
                        status: 'error',
                        errors: [`Unknown country "${row.country}"`],
                        warnings: []
                    });
                    return;
                }

                // 先进行FedX四条规则验证
                const requirementsValidation = this.validateMidRequirements(processedData);

                if (!requirementsValidation.isValid) {
                    // 如果不符合基本要求，直接返回错误
                    results.push({
                        row: index + 1,
                        company: row.company,
                        country: row.country,
                        midCode: '',
                        status: 'error',
                        errors: requirementsValidation.errors,
                        warnings: requirementsValidation.warnings
                    });
                    return;
                }

                // 生成MID代码
                const midCode = this.generateMidCode(processedData);

                // 验证生成的MID代码结构
                const structureValidation = this.validateMidCodeStructure(midCode);

                results.push({
                    row: index + 1,
                    company: row.company,
                    country: row.country,
                    midCode: midCode,
                    status: structureValidation.isValid ? 'success' : 'warning',
                    errors: structureValidation.errors,
                    warnings: [...(requirementsValidation.warnings || []), ...(structureValidation.warnings || [])]
                });

            } catch (error) {
                results.push({
                    row: index + 1,
                    company: row.company || '',
                    country: row.country || '',
                    midCode: '',
                    status: 'error',
                    errors: [error.message],
                    warnings: []
                });
            }
        });

        this.displayBatchResults(results);
    }

    // Display batch processing results - 按照FedX标准显示详细结果
    displayBatchResults(results) {
        const resultDiv = document.getElementById('batchResults');
        const contentDiv = document.getElementById('batchResultsContent');

        let html = '<div class="table-responsive"><table class="table table-striped table-hover">';
        html += `<thead class="table-dark">
            <tr>
                <th width="5%">行号</th>
                <th width="20%">制造商名称</th>
                <th width="15%">国家</th>
                <th width="15%">MID代码</th>
                <th width="10%">状态</th>
                <th width="35%">详细信息</th>
            </tr>
        </thead><tbody>`;

        results.forEach(result => {
            let statusClass, statusIcon, statusText;

            if (result.status === 'success') {
                statusClass = 'text-success';
                statusIcon = 'fa-check-circle';
                statusText = '成功';
            } else if (result.status === 'warning') {
                statusClass = 'text-warning';
                statusIcon = 'fa-exclamation-triangle';
                statusText = '警告';
            } else {
                statusClass = 'text-danger';
                statusIcon = 'fa-times-circle';
                statusText = '错误';
            }

            // 构建详细信息
            let details = '';
            if (result.errors && result.errors.length > 0) {
                details += '<div class="small text-danger mb-1">';
                details += '<i class="fas fa-exclamation-circle me-1"></i>错误：<br>';
                result.errors.forEach(error => {
                    details += `• ${this.escapeHtml(error)}<br>`;
                });
                details += '</div>';
            }

            if (result.warnings && result.warnings.length > 0) {
                details += '<div class="small text-warning">';
                details += '<i class="fas fa-exclamation-triangle me-1"></i>警告：<br>';
                result.warnings.forEach(warning => {
                    details += `• ${this.escapeHtml(warning)}<br>`;
                });
                details += '</div>';
            }

            if (!details && result.status === 'success') {
                details = '<span class="small text-success"><i class="fas fa-check me-1"></i>符合FedX四条标准</span>';
            }

            const safeCompany = this.escapeHtml(result.company || '');
            const safeCompanyTitle = this.escapeHtml(result.company || '');
            const safeCompanyDisplay = this.escapeHtml((result.company || '').length > 20 ? result.company.substring(0, 20) + '...' : result.company || '');
            const safeCountry = this.escapeHtml(result.country || '');
            const safeMidCode = this.escapeHtml(result.midCode || '-');

            html += `<tr>
                <td class="text-center">${result.row}</td>
                <td title="${safeCompanyTitle}">${safeCompanyDisplay || safeCompany}</td>
                <td>${safeCountry}</td>
                <td><code class="bg-light px-2 py-1 rounded">${safeMidCode}</code></td>
                <td class="text-center">
                    <i class="fas ${statusIcon} ${statusClass} me-1"></i>
                    <span class="${statusClass} small">${statusText}</span>
                </td>
                <td>${details}</td>
            </tr>`;
        });

        html += '</tbody></table></div>';

        // 改进的汇总信息
        const successful = results.filter(r => r.status === 'success').length;
        const warnings = results.filter(r => r.status === 'warning').length;
        const failed = results.filter(r => r.status === 'error').length;
        const total = results.length;

        html += `<div class="mt-4 p-3 bg-light rounded border">
            <h6 class="mb-3"><i class="fas fa-chart-pie me-2"></i>批量处理汇总</h6>
            <div class="row text-center">
                <div class="col-md-3">
                    <div class="card border-success">
                        <div class="card-body py-2">
                            <h5 class="text-success mb-1">${successful}</h5>
                            <small class="text-muted">成功生成</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-warning">
                        <div class="card-body py-2">
                            <h5 class="text-warning mb-1">${warnings}</h5>
                            <small class="text-muted">有警告</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-danger">
                        <div class="card-body py-2">
                            <h5 class="text-danger mb-1">${failed}</h5>
                            <small class="text-muted">生成失败</small>
                        </div>
                    </div>
                </div>
                <div class="col-md-3">
                    <div class="card border-primary">
                        <div class="card-body py-2">
                            <h5 class="text-primary mb-1">${total}</h5>
                            <small class="text-muted">总计</small>
                        </div>
                    </div>
                </div>
            </div>
            <div class="mt-3 text-center">
                <small class="text-muted">
                    <i class="fas fa-info-circle me-1"></i>
                    所有验证均基于 <strong>FedX官方四条标准</strong>：国家代码、制造商名称、地址编号、城市代码
                </small>
            </div>
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

    // Utility function to show alerts - 显示在表单正前面
    showAlert(message, type = 'info') {
        // 移除之前的错误信息
        const existingAlert = document.getElementById('dynamicAlert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // 创建新的错误信息元素
        const alertDiv = document.createElement('div');
        alertDiv.id = 'dynamicAlert';
        alertDiv.className = `alert alert-${type} alert-dismissible fade show mb-4`;
        alertDiv.innerHTML = `
            <div class="d-flex align-items-start">
                <i class="fas fa-${type === 'danger' ? 'exclamation-triangle' : type === 'warning' ? 'exclamation-circle' : type === 'success' ? 'check-circle' : 'info-circle'} me-2 mt-1"></i>
                <div class="flex-grow-1">${message}</div>
                <button type="button" class="btn-close ms-2" onclick="this.parentElement.parentElement.remove()"></button>
            </div>
        `;

        // 插入到表单前面 - 使用更精确的选择器
        let targetContainer = null;

        // 尝试找到输入信息卡片的body
        const inputInfoCard = document.querySelector('#inputInfo .card-body');
        if (inputInfoCard) {
            targetContainer = inputInfoCard;
        } else {
            // 备选方案：找到任何包含表单的card-body
            const cardBodies = document.querySelectorAll('.card-body');
            for (let i = 0; i < cardBodies.length; i++) {
                const cardBody = cardBodies[i];
                if (cardBody.querySelector('#fullInfo') || cardBody.querySelector('#countryInput')) {
                    targetContainer = cardBody;
                    break;
                }
            }
        }

        if (targetContainer) {
            targetContainer.insertBefore(alertDiv, targetContainer.firstChild);
        } else {
            // 最后的后备方案：插入到主容器开头
            const mainContainer = document.querySelector('.container');
            if (mainContainer) {
                mainContainer.insertBefore(alertDiv, mainContainer.firstChild);
            } else {
                // 如果都找不到，就插入到body开头
                document.body.insertBefore(alertDiv, document.body.firstChild);
            }
        }

        // 自动移除（成功信息3秒，其他5秒）
        const timeout = type === 'success' ? 3000 : 5000;
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, timeout);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MIDGenerator();
});
