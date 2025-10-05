import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { DateRange } from '../../types';

interface DateRangePickerProps {
  onDateRangeChange: (range: DateRange) => void;
  dateRange?: DateRange;
}

export function DateRangePicker({ onDateRangeChange, dateRange }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState<string>(
    dateRange ? format(dateRange.startDate, 'yyyy-MM-dd') : ''
  );
  const [endDate, setEndDate] = useState<string>(
    dateRange ? format(dateRange.endDate, 'yyyy-MM-dd') : ''
  );

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    if (value && endDate) {
      onDateRangeChange({
        startDate: new Date(value),
        endDate: new Date(endDate)
      });
    }
  };

  const handleEndDateChange = (value: string) => {
    setEndDate(value);
    if (startDate && value) {
      onDateRangeChange({
        startDate: new Date(startDate),
        endDate: new Date(value)
      });
    }
  };

  const handlePresetSelect = (preset: string) => {
    const today = new Date();
    const currentYear = today.getFullYear();
    let start: Date;
    let end: Date;

    switch (preset) {
      case 'summer':
        start = new Date(currentYear, 5, 1);
        end = new Date(currentYear, 7, 31);
        break;
      case 'winter':
        start = new Date(currentYear, 11, 1);
        end = new Date(currentYear + 1, 1, 28);
        break;
      case 'spring':
        start = new Date(currentYear, 2, 1);
        end = new Date(currentYear, 4, 31);
        break;
      case 'fall':
        start = new Date(currentYear, 8, 1);
        end = new Date(currentYear, 10, 30);
        break;
      default:
        return;
    }

    setStartDate(format(start, 'yyyy-MM-dd'));
    setEndDate(format(end, 'yyyy-MM-dd'));
    onDateRangeChange({ startDate: start, endDate: end });
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Date Range
      </label>

      <div className="flex gap-4 flex-wrap">
        <button
          onClick={() => handlePresetSelect('summer')}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
        >
          Summer
        </button>
        <button
          onClick={() => handlePresetSelect('winter')}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
        >
          Winter
        </button>
        <button
          onClick={() => handlePresetSelect('spring')}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
        >
          Spring
        </button>
        <button
          onClick={() => handlePresetSelect('fall')}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium text-gray-700 transition-colors"
        >
          Fall
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Start Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              max={format(new Date(), 'yyyy-MM-dd')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            End Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              min={startDate}
              max={format(new Date(), 'yyyy-MM-dd')}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {startDate && endDate && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900">
            Analyzing historical data for: <span className="font-medium">
              {format(new Date(startDate), 'MMM dd, yyyy')} - {format(new Date(endDate), 'MMM dd, yyyy')}
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
