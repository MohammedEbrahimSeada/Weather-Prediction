import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { WeatherAnalysis } from '../types';
import { AIInsight } from './aiInsightsService';
import { format } from 'date-fns';

export interface PDFExportOptions {
  includeCharts: boolean;
  includeMap: boolean;
  includeAIInsights: boolean;
  includeRawData: boolean;
}

const DEFAULT_OPTIONS: PDFExportOptions = {
  includeCharts: true,
  includeMap: true,
  includeAIInsights: true,
  includeRawData: false,
};

export async function generatePDFReport(
  analysis: WeatherAnalysis,
  aiInsights?: AIInsight,
  options: Partial<PDFExportOptions> = {}
): Promise<void> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 20;

  pdf.setFillColor(13, 17, 23);
  pdf.rect(0, 0, pageWidth, 60, 'F');

  pdf.setTextColor(240, 246, 252);
  pdf.setFontSize(28);
  pdf.text('Weather Probability Report', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 15;
  pdf.setFontSize(14);
  pdf.setTextColor(139, 148, 158);
  pdf.text(analysis.location.name, pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 8;
  pdf.setFontSize(11);
  pdf.text(
    `${format(analysis.dateRange.startDate, 'MMM d, yyyy')} - ${format(analysis.dateRange.endDate, 'MMM d, yyyy')}`,
    pageWidth / 2,
    yPosition,
    { align: 'center' }
  );

  yPosition = 75;
  pdf.setTextColor(0, 0, 0);

  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  pdf.text('Overall Risk Score', 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text(`${analysis.riskScore.toFixed(1)}%`, 15, yPosition);
  yPosition += 10;

  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  pdf.text('Probability Results', 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  for (const prob of analysis.probabilities) {
    if (yPosition > pageHeight - 30) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.text(`${prob.variableName}:`, 15, yPosition);
    pdf.text(`${prob.probability.toFixed(1)}%`, 80, yPosition);
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`(${prob.historicalOccurrences}/${prob.totalDays} days)`, 100, yPosition);
    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    yPosition += 6;
  }

  yPosition += 10;

  if (opts.includeAIInsights && aiInsights) {
    if (yPosition > pageHeight - 60) {
      pdf.addPage();
      yPosition = 20;
    }

    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('AI-Powered Insights', 15, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    const summaryLines = pdf.splitTextToSize(aiInsights.summary, pageWidth - 30);
    pdf.text(summaryLines, 15, yPosition);
    yPosition += summaryLines.length * 6 + 5;

    if (aiInsights.recommendations.length > 0) {
      pdf.setFont(undefined, 'bold');
      pdf.text('Recommendations:', 15, yPosition);
      yPosition += 6;
      pdf.setFont(undefined, 'normal');

      for (const rec of aiInsights.recommendations) {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        const recLines = pdf.splitTextToSize(`• ${rec}`, pageWidth - 30);
        pdf.text(recLines, 20, yPosition);
        yPosition += recLines.length * 5 + 3;
      }
    }

    yPosition += 5;

    if (aiInsights.risks.length > 0) {
      if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = 20;
      }

      pdf.setFont(undefined, 'bold');
      pdf.text('Potential Risks:', 15, yPosition);
      yPosition += 6;
      pdf.setFont(undefined, 'normal');

      for (const risk of aiInsights.risks) {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        const riskLines = pdf.splitTextToSize(`• ${risk}`, pageWidth - 30);
        pdf.text(riskLines, 20, yPosition);
        yPosition += riskLines.length * 5 + 3;
      }
    }
  }

  if (opts.includeCharts) {
    const chartElements = document.querySelectorAll('[data-chart-export]');
    for (const element of Array.from(chartElements)) {
      pdf.addPage();
      yPosition = 20;

      try {
        const canvas = await html2canvas(element as HTMLElement, {
          scale: 2,
          backgroundColor: '#ffffff',
        });

        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pageWidth - 30;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (imgHeight > pageHeight - 40) {
          const ratio = (pageHeight - 40) / imgHeight;
          pdf.addImage(imgData, 'PNG', 15, yPosition, imgWidth * ratio, (pageHeight - 40));
        } else {
          pdf.addImage(imgData, 'PNG', 15, yPosition, imgWidth, imgHeight);
        }
      } catch (error) {
        console.error('Failed to capture chart:', error);
      }
    }
  }

  pdf.addPage();
  yPosition = 20;
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'bold');
  pdf.text('Data Source & Metadata', 15, yPosition);
  yPosition += 8;

  pdf.setFontSize(10);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Source: ${analysis.historicalData.source}`, 15, yPosition);
  yPosition += 6;
  pdf.text(`Generated: ${format(analysis.generatedAt, 'MMM d, yyyy HH:mm')}`, 15, yPosition);
  yPosition += 6;
  pdf.text(`Location: ${analysis.location.name} (${analysis.location.latitude.toFixed(4)}, ${analysis.location.longitude.toFixed(4)})`, 15, yPosition);
  yPosition += 6;
  pdf.text(`Historical Data Points: ${analysis.historicalData.data.length}`, 15, yPosition);

  const fileName = `weather_report_${analysis.location.name.replace(/\s+/g, '_')}_${format(new Date(), 'yyyyMMdd')}.pdf`;
  pdf.save(fileName);
}

export async function captureElementAsImage(elementId: string): Promise<string | null> {
  const element = document.getElementById(elementId);
  if (!element) return null;

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      backgroundColor: '#ffffff',
    });
    return canvas.toDataURL('image/png');
  } catch (error) {
    console.error('Failed to capture element:', error);
    return null;
  }
}
