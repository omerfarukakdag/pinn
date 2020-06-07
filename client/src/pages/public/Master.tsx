import React from 'react';

interface IMainProps {}

const Master: React.FunctionComponent<IMainProps> = (props) => {
  const { children } = props;

  return <React.Fragment>{children}</React.Fragment>;
};

export default Master;
