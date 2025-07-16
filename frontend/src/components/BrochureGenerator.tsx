import React, { useState, useRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Divider,
  Alert,
} from '@mui/material';
import { SelectChangeEvent } from '@mui/material/Select';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDropzone } from 'react-dropzone';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface FormData {
  reportType: string;
  companyName: string;
  productName: string;
  description: string;
  features: string;
  benefits: string;
  contactInfo: string;
  additionalText: string;
}

interface UploadedImage {
  file: File;
  preview: string;
  name: string;
}

const BrochureGenerator: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    reportType: 'product',
    companyName: '',
    productName: '',
    description: '',
    features: '',
    benefits: '',
    contactInfo: '',
    additionalText: '',
  });

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
    },
    maxFiles: 5,
    onDrop: (acceptedFiles) => {
      const newImages = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        name: file.name,
      }));
      setImages((prev) => [...prev, ...newImages]);
    },
  });

  const handleInputChange = (field: keyof FormData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const generatePDF = async () => {
    if (!formData.companyName || !formData.description) {
      setAlert({ type: 'error', message: 'Please fill in at least Company Name and Description' });
      return;
    }

    setIsGenerating(true);
    setAlert(null);

    try {
      if (previewRef.current) {
        const canvas = await html2canvas(previewRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        const fileName = `${formData.reportType}-brochure-${Date.now()}.pdf`;
        pdf.save(fileName);

        setAlert({ type: 'success', message: `PDF generated successfully: ${fileName}` });
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      setAlert({ type: 'error', message: 'Error generating PDF. Please try again.' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box>
      {alert && (
        <Alert severity={alert.type} sx={{ mb: 2 }} onClose={() => setAlert(null)}>
          {alert.message}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Form Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Brochure Information
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Report Type</InputLabel>
                    <Select
                      value={formData.reportType}
                      label="Report Type"
                      onChange={handleInputChange('reportType')}
                    >
                      <MenuItem value="product">Product Brochure</MenuItem>
                      <MenuItem value="company">Company Brochure</MenuItem>
                      <MenuItem value="service">Service Brochure</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Company Name"
                    value={formData.companyName}
                    onChange={handleInputChange('companyName')}
                    required
                  />
                </Grid>

                {formData.reportType === 'product' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Product Name"
                      value={formData.productName}
                      onChange={handleInputChange('productName')}
                    />
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    value={formData.description}
                    onChange={handleInputChange('description')}
                    required
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Key Features"
                    multiline
                    rows={2}
                    value={formData.features}
                    onChange={handleInputChange('features')}
                    placeholder="List key features separated by commas"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Benefits"
                    multiline
                    rows={2}
                    value={formData.benefits}
                    onChange={handleInputChange('benefits')}
                    placeholder="List benefits separated by commas"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Contact Information"
                    multiline
                    rows={2}
                    value={formData.contactInfo}
                    onChange={handleInputChange('contactInfo')}
                    placeholder="Email, phone, website, address"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Additional Text"
                    multiline
                    rows={2}
                    value={formData.additionalText}
                    onChange={handleInputChange('additionalText')}
                    placeholder="Any additional information"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Image Upload Section */}
              <Typography variant="h6" gutterBottom>
                Upload Images
              </Typography>

              <Paper
                {...getRootProps()}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'grey.300',
                  backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
                  mb: 2,
                }}
              >
                <input {...getInputProps()} />
                <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                <Typography variant="body1">
                  {isDragActive
                    ? 'Drop the images here...'
                    : 'Drag & drop images here, or click to select'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Supports: JPG, PNG, GIF (Max 5 images)
                </Typography>
              </Paper>

              {images.length > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Uploaded Images:
                  </Typography>
                  <Grid container spacing={1}>
                    {images.map((image, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <Box position="relative">
                          <img
                            src={image.preview}
                            alt={image.name}
                            style={{
                              width: '100%',
                              height: '80px',
                              objectFit: 'cover',
                              borderRadius: '4px',
                            }}
                          />
                          <Button
                            size="small"
                            color="error"
                            onClick={() => removeImage(index)}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              right: 0,
                              minWidth: 'auto',
                              p: 0.5,
                            }}
                          >
                            ×
                          </Button>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}

              <Button
                variant="contained"
                fullWidth
                size="large"
                startIcon={<PictureAsPdfIcon />}
                onClick={generatePDF}
                disabled={isGenerating}
                sx={{ mt: 3 }}
              >
                {isGenerating ? 'Generating PDF...' : 'Generate PDF Brochure'}
              </Button>
            </CardContent>
          </Card>
        </Grid>

        {/* Preview Section */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Preview
              </Typography>

              <div ref={previewRef}>
                <Paper sx={{ p: 3, minHeight: '600px', backgroundColor: 'white' }}>
                  {/* Header */}
                  <Box textAlign="center" mb={3}>
                    <Typography variant="h3" component="h1" gutterBottom sx={{ color: '#1976d2' }}>
                      {formData.companyName || 'Your Company Name'}
                    </Typography>
                    {formData.productName && (
                      <Typography variant="h5" color="text.secondary" gutterBottom>
                        {formData.productName}
                      </Typography>
                    )}
                  </Box>

                  {/* Images */}
                  {images.length > 0 && (
                    <Box mb={3}>
                      <Grid container spacing={1}>
                        {images.slice(0, 3).map((image, index) => (
                          <Grid item xs={images.length === 1 ? 12 : 4} key={index}>
                            <img
                              src={image.preview}
                              alt={image.name}
                              style={{
                                width: '100%',
                                height: images.length === 1 ? '250px' : '150px',
                                objectFit: 'cover',
                                borderRadius: '8px',
                              }}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* Description */}
                  {formData.description && (
                    <Box mb={3}>
                      <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
                        Description
                      </Typography>
                      <Typography variant="body1" paragraph>
                        {formData.description}
                      </Typography>
                    </Box>
                  )}

                  {/* Features */}
                  {formData.features && (
                    <Box mb={3}>
                      <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
                        Key Features
                      </Typography>
                      <ul>
                        {formData.features.split(',').map((feature, index) => (
                          <li key={index}>
                            <Typography variant="body2">{feature.trim()}</Typography>
                          </li>
                        ))}
                      </ul>
                    </Box>
                  )}

                  {/* Benefits */}
                  {formData.benefits && (
                    <Box mb={3}>
                      <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
                        Benefits
                      </Typography>
                      <ul>
                        {formData.benefits.split(',').map((benefit, index) => (
                          <li key={index}>
                            <Typography variant="body2">{benefit.trim()}</Typography>
                          </li>
                        ))}
                      </ul>
                    </Box>
                  )}

                  {/* Additional Text */}
                  {formData.additionalText && (
                    <Box mb={3}>
                      <Typography variant="body1" paragraph>
                        {formData.additionalText}
                      </Typography>
                    </Box>
                  )}

                  {/* Contact Info */}
                  {formData.contactInfo && (
                    <Box mt={4} pt={2} borderTop="2px solid #1976d2">
                      <Typography variant="h6" gutterBottom sx={{ color: '#1976d2' }}>
                        Contact Us
                      </Typography>
                      <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
                        {formData.contactInfo}
                      </Typography>
                    </Box>
                  )}
                </Paper>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default BrochureGenerator;
