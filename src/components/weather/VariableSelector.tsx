import { useState } from 'react';
import { Thermometer, CloudRain, Wind, Snowflake, CircleDot, Cloud, ChevronDown } from 'lucide-react';
import { WeatherThreshold } from '../../types';
import { WEATHER_VARIABLES, ACTIVITY_PRESETS, DEFAULT_THRESHOLDS } from '../../utils/constants';

interface VariableSelectorProps {
  selectedVariables: string[];
  onVariablesChange: (variables: string[]) => void;
  thresholds: WeatherThreshold[];
  onThresholdsChange: (thresholds: WeatherThreshold[]) => void;
}

const iconMap: Record<string, any> = {
  thermometer: Thermometer,
  'cloud-rain': CloudRain,
  wind: Wind,
  snowflake: Snowflake,
  'circle-dot': CircleDot,
  cloud: Cloud
};

export function VariableSelector({
  selectedVariables,
  onVariablesChange,
  thresholds,
  onThresholdsChange
}: VariableSelectorProps) {
  const [showThresholds, setShowThresholds] = useState<Record<string, boolean>>({});

  const handleVariableToggle = (variableId: string) => {
    if (selectedVariables.includes(variableId)) {
      onVariablesChange(selectedVariables.filter(v => v !== variableId));
      onThresholdsChange(thresholds.filter(t => t.variableId !== variableId));
    } else {
      onVariablesChange([...selectedVariables, variableId]);
      const defaultThreshold = getDefaultThreshold(variableId);
      if (defaultThreshold) {
        onThresholdsChange([...thresholds, defaultThreshold]);
      }
    }
  };

  const getDefaultThreshold = (variableId: string): WeatherThreshold | null => {
    switch (variableId) {
      case 'temperature':
        return {
          variableId: 'temperature',
          operator: 'gte',
          value: DEFAULT_THRESHOLDS.temperature.veryHot,
          label: `Very hot (≥${DEFAULT_THRESHOLDS.temperature.veryHot}°C)`
        };
      case 'rainfall':
        return {
          variableId: 'rainfall',
          operator: 'gte',
          value: DEFAULT_THRESHOLDS.rainfall.veryWet,
          label: `Very wet (≥${DEFAULT_THRESHOLDS.rainfall.veryWet}mm)`
        };
      case 'windspeed':
        return {
          variableId: 'windspeed',
          operator: 'gte',
          value: DEFAULT_THRESHOLDS.windspeed.veryWindy,
          label: `Very windy (≥${DEFAULT_THRESHOLDS.windspeed.veryWindy}m/s)`
        };
      case 'cloudCover':
        return {
          variableId: 'cloudCover',
          operator: 'gte',
          value: DEFAULT_THRESHOLDS.cloudCover.veryCloudy,
          label: `Very cloudy (≥${DEFAULT_THRESHOLDS.cloudCover.veryCloudy}%)`
        };
      case 'snowfall':
        return {
          variableId: 'snowfall',
          operator: 'gt',
          value: 5,
          label: 'Significant snowfall (>5cm)'
        };
      case 'dustConcentration':
        return {
          variableId: 'dustConcentration',
          operator: 'gt',
          value: 100,
          label: 'High dust levels (>100μg/m³)'
        };
      default:
        return null;
    }
  };

  const handlePresetSelect = (presetId: string) => {
    const preset = ACTIVITY_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    const variables = preset.thresholds.map(t => t.variableId);
    onVariablesChange(variables);
    onThresholdsChange(preset.thresholds);
  };

  const handleThresholdChange = (variableId: string, value: number, operator: 'gt' | 'lt' | 'gte' | 'lte' | 'between') => {
    const updatedThresholds = thresholds.map(t => {
      if (t.variableId === variableId) {
        const variable = WEATHER_VARIABLES.find(v => v.id === variableId);
        return {
          ...t,
          value,
          operator,
          label: `${variable?.name} ${operator === 'gte' ? '≥' : operator === 'lte' ? '≤' : operator === 'gt' ? '>' : '<'} ${value}${variable?.unit}`
        };
      }
      return t;
    });
    onThresholdsChange(updatedThresholds);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Activity Presets
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {ACTIVITY_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => handlePresetSelect(preset.id)}
              className="p-3 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
            >
              <div className="text-sm font-medium text-gray-900">{preset.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Weather Variables
        </label>
        <div className="space-y-3">
          {WEATHER_VARIABLES.map(variable => {
            const IconComponent = iconMap[variable.icon];
            const isSelected = selectedVariables.includes(variable.id);
            const threshold = thresholds.find(t => t.variableId === variable.id);

            return (
              <div key={variable.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-4 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleVariableToggle(variable.id)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <IconComponent className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{variable.name}</div>
                    <div className="text-sm text-gray-500">{variable.description}</div>
                  </div>
                  {isSelected && (
                    <button
                      onClick={() => setShowThresholds(prev => ({ ...prev, [variable.id]: !prev[variable.id] }))}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform ${showThresholds[variable.id] ? 'rotate-180' : ''}`}
                      />
                    </button>
                  )}
                </div>

                {isSelected && showThresholds[variable.id] && threshold && (
                  <div className="px-4 pb-4 bg-gray-50 border-t border-gray-200">
                    <div className="space-y-3 pt-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Threshold Value ({variable.unit})
                        </label>
                        <input
                          type="number"
                          value={threshold.value}
                          onChange={(e) => handleThresholdChange(variable.id, Number(e.target.value), threshold.operator)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Condition
                        </label>
                        <select
                          value={threshold.operator}
                          onChange={(e) => handleThresholdChange(variable.id, threshold.value, e.target.value as any)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="gte">Greater than or equal (≥)</option>
                          <option value="lte">Less than or equal (≤)</option>
                          <option value="gt">Greater than (&gt;)</option>
                          <option value="lt">Less than (&lt;)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
