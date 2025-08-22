
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Upload, FileSpreadsheet, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ImportLeads = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [file, setFile] = useState<File | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/admin')} className="mr-2">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="bg-primary text-primary-foreground p-2 rounded-lg mr-3">
                <Upload className="h-5 w-5" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Import New Leads</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNumber 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`h-1 w-20 mx-2 ${
                    step > stepNumber ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Upload</span>
            <span>Map Fields</span>
            <span>Preview</span>
            <span>Import</span>
          </div>
        </div>

        {/* Step Content */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>
              {step === 1 && 'Upload CSV File'}
              {step === 2 && 'Map CSV Fields'}
              {step === 3 && 'Preview Data'}
              {step === 4 && 'Import Complete'}
            </CardTitle>
            <CardDescription>
              {step === 1 && 'Select and upload your CSV file containing lead data'}
              {step === 2 && 'Map your CSV columns to our lead fields'}
              {step === 3 && 'Review the data before importing'}
              {step === 4 && 'Your leads have been successfully imported'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <div className="mb-4">
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <span className="text-primary font-medium">Click to upload</span> or drag and drop
                    </Label>
                    <Input
                      id="file-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </div>
                  <p className="text-xs text-gray-500">CSV files only (MAX. 10MB)</p>
                  {file && (
                    <div className="mt-4 p-2 bg-green-50 rounded text-sm text-green-700">
                      Selected: {file.name}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>CSV Column</Label>
                    <div className="space-y-2 mt-2">
                      <div className="p-2 bg-gray-50 rounded">Name</div>
                      <div className="p-2 bg-gray-50 rounded">Email</div>
                      <div className="p-2 bg-gray-50 rounded">Phone</div>
                      <div className="p-2 bg-gray-50 rounded">Country</div>
                    </div>
                  </div>
                  <div>
                    <Label>Map to Field</Label>
                    <div className="space-y-2 mt-2">
                      <div className="p-2 bg-primary/10 rounded">Lead Name ✓</div>
                      <div className="p-2 bg-primary/10 rounded">Email Address ✓</div>
                      <div className="p-2 bg-primary/10 rounded">Phone Number ✓</div>
                      <div className="p-2 bg-primary/10 rounded">Preferred Country ✓</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">John Smith</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">john@email.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">+1234567890</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Canada</td>
                      </tr>
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Sarah Johnson</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">sarah@email.com</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">+1234567891</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Australia</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-gray-600">2 leads ready to import</p>
              </div>
            )}

            {step === 4 && (
              <div className="text-center py-8">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Import Successful!</h3>
                <p className="text-gray-600 mb-6">2 new leads have been added to your CRM</p>
                <Button onClick={() => navigate('/admin')}>
                  Return to Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        {step < 4 && (
          <div className="flex justify-between">
            <Button 
              variant="outline" 
              onClick={handleBack}
              disabled={step === 1}
            >
              Back
            </Button>
            <Button 
              onClick={handleNext}
              disabled={step === 1 && !file}
            >
              {step === 3 ? 'Import Leads' : 'Next'}
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default ImportLeads;
