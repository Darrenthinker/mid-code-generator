# MID Code Generator & Validator

A comprehensive web-based tool for generating and validating Manufacturer Identification Codes (MID) used in US customs import declarations.

## 🚀 Features

### 🧠 Smart Information Parsing
- **One-click input**: Paste complete manufacturer information and let the system automatically parse country, company, address, and city
- **Intelligent recognition**: Advanced algorithm identifies and extracts relevant information from unstructured text
- **Manual override**: Switch to manual input mode for precise control

### 🛠️ MID Code Generation
- **Real-time generation**: Generate MID codes instantly as you type
- **Detailed breakdown**: See exactly how each part of the MID code is constructed
- **Validation**: Automatic validation of generated codes

### ✅ MID Code Validation
- **Structure validation**: Check if MID codes follow the correct format
- **Component analysis**: Break down existing MID codes to understand their components
- **Real-time feedback**: Get instant validation results as you type

### 📊 Batch Processing
- **File upload**: Process multiple manufacturers at once using CSV or Excel files
- **Template download**: Get a pre-formatted template for batch processing
- **Results export**: Download processing results with validation status

### 💾 History & Privacy
- **Local storage**: All processing happens locally in your browser
- **History tracking**: Keep track of recently generated MID codes
- **Privacy first**: No data is sent to external servers

## 🌐 Live Demo

Start the application and visit: `http://localhost:3005`

## 📦 Installation & Setup

### Prerequisites
- Node.js (version 14.0.0 or higher)
- npm (Node Package Manager)

### Quick Start

1. **Clone or download the project**
   ```bash
   # If you have git
   git clone <repository-url>
   cd mid-code-generator
   
   # Or simply download and extract the files
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   - The application will automatically open at `http://localhost:3005`
   - If it doesn't open automatically, visit the URL manually

### Alternative Setup (No Node.js required)

If you prefer not to install Node.js, you can:

1. **Using Python** (if you have Python installed):
   ```bash
       # Python 3
    python -m http.server 3005
    
    # Python 2
    python -m SimpleHTTPServer 3005
   ```

2. **Using any other local server**:
   - Use any local web server of your choice
   - Ensure it serves the files from the project directory

## 📋 How to Use

### 1. Generate MID Code

#### Smart Parse Mode (Recommended)
1. Click on the **"Generate MID Code"** tab
2. Ensure **"Smart Parse"** is selected
3. Paste complete manufacturer information in the text area:
   ```
   Apple Inc.
   One Apple Park Way
   Cupertino, CA 95014
   United States
   ```
4. Click **"Parse Information"**
5. Review the parsed results
6. Click **"Generate MID Code"** to create the code

#### Manual Input Mode
1. Select **"Manual Input"** mode
2. Fill in the required fields:
   - **Country**: United States
   - **Company Name**: Apple Inc.
   - **Address**: One Apple Park Way
   - **City**: Cupertino
3. Click **"Generate MID Code"**

### 2. Validate MID Code

1. Click on the **"Validate MID Code"** tab
2. Enter the MID code you want to validate
3. Click **"Validate MID Code"**
4. Review the validation results and component breakdown

### 3. Batch Processing

1. Click on the **"Batch Processing"** tab
2. Download the CSV template by clicking **"Download Template"**
3. Fill in the template with your manufacturer data
4. Upload the completed file
5. Click **"Process Batch"**
6. Review results and download the processed file

## 🎯 MID Code Structure

A MID code consists of the following components:

```
US + APP + 1 + CUP = USAPP1CUP
│    │     │   │
│    │     │   └── City Code (3 characters)
│    │     └────── Address Number (up to 4 digits)
│    └──────────── Company Code (3-6 characters)
└───────────────── Country Code (2 characters)
```

### Rules:
- **Country Code**: 2-character ISO code (US, GB, DE, etc.)
- **Company Code**: 3-6 characters from company name (removing common suffixes)
- **Address Number**: Largest number found in the address (up to 4 digits)
- **City Code**: First 3 alphabetic characters from city name

## 🌍 Supported Countries

The system supports all ISO 3166-1 alpha-2 country codes, including:
- United States (US)
- United Kingdom (GB)
- Germany (DE)
- China (CN)
- Japan (JP)
- And many more...

**Special handling for Canada**: Uses province codes (XA, XB, XC, etc.) instead of CA.

## 📁 File Structure

```
mid-code-generator/
├── index.html          # Main HTML file
├── style.css           # CSS styles
├── script.js           # JavaScript logic
├── package.json        # NPM configuration
├── README.md          # This file
└── MID识别码生成器.txt # Reference links
```

## 🔒 Privacy & Security

- **Local Processing**: All data processing happens in your browser
- **No Data Upload**: No manufacturer information is sent to external servers
- **Local Storage**: History is stored locally on your device
- **HTTPS Ready**: Can be deployed with HTTPS for enhanced security

## 🛠️ Technical Details

### Technologies Used
- **HTML5**: Modern semantic markup
- **CSS3**: Responsive design with custom properties
- **JavaScript**: Vanilla JS, no external dependencies
- **Bootstrap 5**: UI framework for responsive design
- **Font Awesome**: Icons

### Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Performance
- **Lightweight**: No external API calls
- **Fast**: Instant processing and validation
- **Responsive**: Works on desktop, tablet, and mobile

## 🆘 Troubleshooting

### Common Issues

1. **Port 3005 already in use**
   ```bash
   # Use a different port
   npx http-server . -p 3006 -o
   ```

2. **Parsing not working correctly**
   - Ensure information is formatted properly
   - Try manual input mode for complex cases
   - Check that country name is spelled correctly

3. **File upload not working**
   - Ensure file is in CSV format
   - Check that all required columns are present
   - Verify file encoding is UTF-8

### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Verify all files are in the correct location
3. Try refreshing the page
4. Clear browser cache if needed

## 🤝 Contributing

This is a standalone project. If you'd like to contribute:
1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔗 References

- [US Customs MID Requirements](https://www.cbp.gov/)
- [ISO 3166-1 Country Codes](https://www.iso.org/iso-3166-country-codes.html)
- [CBP Form 7501 Instructions](https://www.cbp.gov/trade/rulings/informed-compliance-publications)

---

**Note**: This tool is for educational and business purposes. Always verify MID codes with official customs authorities before using in actual import declarations. 