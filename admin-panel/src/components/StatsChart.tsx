import React from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Box, Typography, Paper } from '@mui/material';

interface StatsChartProps {
  title: string;
  data: any[];
  type?: 'line' | 'bar' | 'pie';
  dataKey: string;
  valueKey: string;
  colors?: string[];
}

const COLORS = ['#1976d2', '#00bcd4', '#ff9800', '#e91e63', '#4caf50', '#f44336', '#9c27b0'];


const StatsChart: React.FC<StatsChartProps> = ({ title, data, type = 'line', dataKey, valueKey, colors = COLORS }) => {
  let chart: React.ReactElement | null = null;

  if (type === 'line') {
    chart = (
      <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={dataKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={valueKey} stroke={colors[0]} strokeWidth={3} dot={{ r: 5 }} />
      </LineChart>
    );
  } else if (type === 'bar') {
    chart = (
      <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={dataKey} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={valueKey} fill={colors[1]} radius={[8, 8, 0, 0]} />
      </BarChart>
    );
  } else if (type === 'pie') {
    chart = (
      <PieChart>
        <Pie data={data} dataKey={valueKey} nameKey={dataKey} cx="50%" cy="50%" outerRadius={100} label>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 2, mb: 2 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>{title}</Typography>
      {chart ? (
        <ResponsiveContainer width="100%" height={300}>
          {chart}
        </ResponsiveContainer>
      ) : null}
    </Paper>
  );
};

export default StatsChart;
