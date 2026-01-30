import { BrowserRouter, Routes, Route } from "react-router-dom";
import Projects from './pages/Projects'
import ProjectDetails from './pages/ProjectDetails'
import NotFound from './pages/NotFound'

const App=()=>
(
    <BrowserRouter>
      <Routes>
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId" element={<ProjectDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
)

export default App