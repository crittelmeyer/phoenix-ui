import { Routes, Route } from 'react-router';
import Root from '@/routes/root';
import Components from '@/routes/components';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/components" element={<Components />} />
    </Routes>
  );
}
