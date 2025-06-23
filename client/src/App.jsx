
import { lazy, Suspense } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
const Home=lazy(()=>import('./pages/Home'))
const Chat=lazy(()=>import('./pages/Chat'))
const NotFound=lazy(()=>import('./pages/NotFound'))
const Login=lazy(()=>import('./pages/Login'))
const Groups=lazy(()=>import('./pages/Groups'))
const Loader=lazy(()=>import('./component/loader/Loader'))
const Signup=lazy(()=>import('./pages/Signup'))
import ProctoredRoutes from './component/proctoredRoutes/ProctoredRoutes'
import Navbar from './component/Navbar'
function App() {
  return (
    <Suspense  fallback={<Loader/>}>
      
      <Routes>
        <Route path='/' element={<ProctoredRoutes><Navbar/><Home/></ProctoredRoutes>}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/chat/:id' element={<ProctoredRoutes><Navbar/><Chat/></ProctoredRoutes>}/>
        <Route path='/group' element={<ProctoredRoutes><Navbar/><Groups/></ProctoredRoutes>}/>
        <Route path='/signup' element={<Signup/>}/>
        <Route path='*' element={<NotFound/>}/>

      </Routes>
    </Suspense>
  )
}

export default App
