import React from 'react';

const SimpleDashboard: React.FC = () => {
  console.log('SimpleDashboard рендерится!');
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>Админ-панель Oyna</h1>
      <p>Тест: компонент загружается корректно!</p>
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => console.log('Кнопка работает!')}>
          Тестовая кнопка
        </button>
      </div>
    </div>
  );
};

export default SimpleDashboard;
