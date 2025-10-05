import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw, AlertCircle, Lightbulb, TrendingUp } from 'lucide-react';
import { Card, CardBody } from '../common/Card';
import { Button } from '../common/Button';
import { AIInsight } from '../../services/aiInsightsService';

interface AIInsightsPanelProps {
  insights: AIInsight | null;
  loading: boolean;
  onRegenerate?: () => void;
}

export function AIInsightsPanel({ insights, loading, onRegenerate }: AIInsightsPanelProps) {
  const [expanded, setExpanded] = useState(true);

  if (!insights && !loading) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="bg-gradient-to-br from-nasa-blue/10 to-nasa-blue-light/5 border-nasa-blue/30 dark:from-nasa-blue/20 dark:to-nasa-blue-dark/10">
        <CardBody>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-nasa-blue" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-text-primary">
                AI-Powered Insights
              </h3>
            </div>
            {onRegenerate && !loading && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRegenerate}
                className="flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </Button>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-dark-tertiary rounded animate-pulse w-full" />
              <div className="h-4 bg-gray-200 dark:bg-dark-tertiary rounded animate-pulse w-5/6" />
              <div className="h-4 bg-gray-200 dark:bg-dark-tertiary rounded animate-pulse w-4/6" />
            </div>
          ) : insights ? (
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="prose dark:prose-invert max-w-none"
              >
                <p className="text-gray-700 dark:text-text-secondary text-base leading-relaxed">
                  {insights.summary}
                </p>
              </motion.div>

              {insights.recommendations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-2"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Lightbulb className="w-5 h-5 text-accent-green" />
                    <h4 className="font-semibold text-gray-900 dark:text-text-primary">
                      Recommendations
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {insights.recommendations.map((rec, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.1 }}
                        className="flex items-start gap-2 text-gray-700 dark:text-text-secondary"
                      >
                        <span className="text-nasa-blue mt-1">•</span>
                        <span>{rec}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {insights.risks.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-2 bg-accent-red/10 dark:bg-accent-red/20 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle className="w-5 h-5 text-accent-red" />
                    <h4 className="font-semibold text-gray-900 dark:text-text-primary">
                      Potential Risks
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {insights.risks.map((risk, idx) => (
                      <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1 }}
                        className="flex items-start gap-2 text-gray-700 dark:text-text-secondary"
                      >
                        <span className="text-accent-red mt-1">•</span>
                        <span>{risk}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {insights.bestDays && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex items-start gap-2 text-sm text-gray-600 dark:text-text-tertiary bg-gray-100 dark:bg-dark-tertiary rounded-lg p-3"
                >
                  <TrendingUp className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{insights.bestDays}</span>
                </motion.div>
              )}
            </div>
          ) : null}
        </CardBody>
      </Card>
    </motion.div>
  );
}
