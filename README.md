# Marketing Report Generator

This project generates marketing reports like product brochures and company brochures in PDF format.

## Features

- **React TypeScript Frontend**: Modern, responsive user interface
- **PDF Generation**: Creates professional PDF brochures using jsPDF and html2canvas
- **Image Upload**: Drag & drop image upload with preview
- **Multiple Report Types**: Product brochures, company brochures, and service brochures
- **Real-time Preview**: See your brochure as you build it
- **Material-UI Components**: Modern and clean interface

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The application will be available at `http://localhost:3000`

## Usage

1. **Select Report Type**: Choose between Product, Company, or Service brochure
2. **Fill Information**: Enter your company details, product information, features, and benefits
3. **Upload Images**: Drag and drop up to 5 images for your brochure
4. **Preview**: Review your brochure in the preview section
5. **Generate PDF**: Click the "Generate PDF Brochure" button to download your PDF

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **UI Framework**: Material-UI (MUI)
- **PDF Generation**: jsPDF + html2canvas
- **File Upload**: react-dropzone
- **Styling**: Material-UI + Custom CSS

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── BrochureGenerator.tsx
│   ├── App.tsx
│   ├── App.css
│   └── index.tsx
├── package.json
└── tsconfig.json
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Version History

- **v1.0**: Initial release with basic PDF generation functionality
