import React from 'react';
import Loadable, { LoadingComponentProps } from 'react-loadable';
import { ILoadableOptions } from './interfaces';

const LoadingComponent = (props: LoadingComponentProps) => {
  if (props.error) {
    return (
      <React.Fragment>
        <div>
          An error occured while loading the component <button onClick={props.retry}>Retry</button>
        </div>
        <div>{JSON.stringify(props.error)}</div>
      </React.Fragment>
    );
  }

  return null;
};

const ComponentLoader = (options: ILoadableOptions) => {
  return Loadable({
    loader: options.loader,
    loading: options.loading || LoadingComponent,
    timeout: typeof options.timeOut === 'undefined' ? 10000 : options.timeOut,
    delay: typeof options.delay === 'undefined' ? 200 : options.delay,
    modules: options.modules,
    webpack: options.webpack
  });
};

export { ComponentLoader };
