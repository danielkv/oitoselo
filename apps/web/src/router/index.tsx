import Home from '@view/Dashboard/Home'
import Login from '@view/Dashboard/Login'
import Subscription from '@view/Dashboard/Subscription'
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

const routes = createRoutesFromElements(
    <>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="subscription" element={<Subscription />} />
    </>
)

export const router = createBrowserRouter(routes)
