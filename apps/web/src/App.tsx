import Components from '@/routes/components'
import Root from '@/routes/root'
import { Route, Routes } from 'react-router'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Root />} />
      <Route path="/components" element={<Components />} />
    </Routes>
  )
}
