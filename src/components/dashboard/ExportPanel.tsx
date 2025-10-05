import { Download, FileJson, FileSpreadsheet } from 'lucide-react';
import { WeatherAnalysis } from '../../types';
import { Card, CardHeader, CardBody } from '../common/Card';
import { Button } from '../common/Button';
import { exportAnalysisAsCSV, exportAnalysisAsJSON } from '../../utils/exportData';

interface ExportPanelProps {
  analysis: WeatherAnalysis;
}

export function ExportPanel({ analysis }: ExportPanelProps) {
  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Download className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">Export Data</h2>
        </div>
      </CardHeader>
      <CardBody>
        <p className="text-gray-600 mb-4">
          Download the complete weather analysis data including historical observations,
          probability calculations, and metadata.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => exportAnalysisAsCSV(analysis)}
            variant="primary"
            className="flex-1"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Download CSV
          </Button>
          <Button
            onClick={() => exportAnalysisAsJSON(analysis)}
            variant="outline"
            className="flex-1"
          >
            <FileJson className="w-4 h-4 mr-2" />
            Download JSON
          </Button>
        </div>
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-xs text-blue-900">
            <strong>Note:</strong> Exported files include complete metadata with data sources,
            API information, and calculation methods for transparency and reproducibility.
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
