import React from 'react'
import { Routes, Route } from 'react-router-dom'
import pageRoutes from './pageRoutes'
import NoPageFound from '../presentation/screens/NoPageFound'
import Home from '../presentation/screens/Home'
import Product from '../presentation/components/Product'
import Auth from '../presentation/screens/Auth'

const AppRoutes= () => {
  return (
    <Routes>
      <Route path={pageRoutes.AUTH} element={<Auth />} />
      <Route path={pageRoutes.HOME} element={<Home />} />
      <Route path={pageRoutes.ADD_PRODUCTS} element={<Product />} />
      <Route path="*" element={<NoPageFound />} />
    </Routes>
  )
}

export default AppRoutes