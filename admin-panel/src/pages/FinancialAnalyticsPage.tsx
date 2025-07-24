import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';

const FinancialAnalyticsPage: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
        💰 AI Финансовая аналитика (заглушка)
      </Typography>
      <Typography variant="subtitle1" sx={{ color: '#666', mb: 4 }}>
        Здесь появится прогнозирование доходов, анализ расходов, финансовые дашборды и другие AI-инструменты для управления финансами.
      </Typography>
      <Card sx={{ maxWidth: 600, mx: 'auto', mt: 6, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 1 }}>
            🚧 Раздел в разработке
          </Typography>
          <Typography color="text.secondary">
            Уже скоро здесь появятся AI-финансовые отчёты, прогнозы и рекомендации!
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FinancialAnalyticsPage;
