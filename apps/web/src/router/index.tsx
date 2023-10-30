import Home from '@view/Dashboard/Home'
import Login from '@view/Dashboard/Login'
import Reports from '@view/Dashboard/Reports'
import Subscription from '@view/Dashboard/Subscription'
import Users from '@view/Dashboard/Users'
import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'

const routes = createRoutesFromElements(
    <>
        <Route index element={<Home />} />
        <Route path="users" element={<Users />} />
        <Route path="reports" element={<Reports />} />
        <Route path="login" element={<Login />} />
        <Route path="subscription" element={<Subscription />} />
    </>
)

export const router = createBrowserRouter(routes)
