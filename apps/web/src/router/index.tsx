import Home from '@view/Dashboard/Home'
import Login from '@view/Dashboard/Login'
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

const routes = createRoutesFromElements(
    <>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
    </>
)

export const router = createBrowserRouter(routes)
