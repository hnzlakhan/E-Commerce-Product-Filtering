import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
const RequireAuth = ({ isAdmin = false }) => {
  const { loading, userInfo } = useSelector((state) => state.userLogin);

  if (!loading && !userInfo) {
    return <Navigate to='/login' />;
  }

  if (isAdmin && userInfo && !userInfo.isAdmin) {
    return <Navigate to='/login?redirect=/admin' />;
  }

  return <Outlet />;
};

export default RequireAuth;
