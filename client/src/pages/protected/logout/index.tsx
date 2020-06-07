import React, { useEffect } from 'react';
import { useAuth } from '../../../core/context/AuthProvider';

interface ILogoutProps {}

function Logout(props: ILogoutProps) {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, []);

  return <></>;
}

export default Logout;
