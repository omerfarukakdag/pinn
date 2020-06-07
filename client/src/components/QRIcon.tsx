import React from 'react';
import { SvgIcon } from '@material-ui/core';

interface IQrIconProps {
  className?: string;
}

const QrIcon: React.FunctionComponent<IQrIconProps> = (props) => {
  return (
    <SvgIcon fontSize={'default'} {...props} viewBox={'0 0 512 512'}>
      <g>
        <g>
          <path d="M0,0v170h170V0H0z M130,130H40V40h90V130z" />
        </g>
      </g>
      <g>
        <g>
          <rect x="65" y="65" width="40" height="40" />
        </g>
      </g>
      <g>
        <g>
          <path d="M342,0v170h170V0H342z M472,130h-90V40h90V130z" />
        </g>
      </g>
      <g>
        <g>
          <rect x="407" y="65" width="40" height="40" />
        </g>
      </g>
      <g>
        <g>
          <path d="M0,342v170h170V342H0z M130,472H40v-90h90V472z" />
        </g>
      </g>
      <g>
        <g>
          <rect x="65" y="407" width="40" height="40" />
        </g>
      </g>
      <g>
        <g>
          <rect x="40" y="197" width="40" height="40" />
        </g>
      </g>
      <g>
        <g>
          <polygon points="120,277 120,237 80,237 80,277 119,277 119,317 159,317 159,277 		" />
        </g>
      </g>
      <g>
        <g>
          <rect x="280" y="77" width="40" height="40" />
        </g>
      </g>
      <g>
        <g>
          <rect x="200" y="40" width="40" height="77" />
        </g>
      </g>
      <g>
        <g>
          <rect x="240" width="40" height="40" />
        </g>
      </g>
      <g>
        <g>
          <polygon points="240,117 240,157 200,157 200,197 280,197 280,117 		" />
        </g>
      </g>
      <g>
        <g>
          <polygon points="280,355 280,316 240,316 240,237 200,237 200,317 240,317 240,356 280,356 280,395 360,395 360,355 		" />
        </g>
      </g>
      <g>
        <g>
          <rect x="280" y="197" width="40" height="80" />
        </g>
      </g>
      <g>
        <g>
          <path d="M472,236v-39h-73v40h-39v40h40v39h112v-80H472z M472,276h-72v-39h72V276z" />
        </g>
      </g>
      <g>
        <g>
          <rect x="472" y="355" width="40" height="80" />
        </g>
      </g>
      <g>
        <g>
          <rect x="320" y="277" width="40" height="40" />
        </g>
      </g>
      <g>
        <g>
          <rect x="360" y="395" width="40" height="40" />
        </g>
      </g>
      <g>
        <g>
          <rect x="400" y="355" width="40" height="40" />
        </g>
      </g>
      <g>
        <g>
          <polygon points="400,435 400,512 440,512 440,475 472,475 472,435 		" />
        </g>
      </g>
      <g>
        <g>
          <rect x="200" y="356" width="40" height="76" />
        </g>
      </g>
      <g>
        <g>
          <polygon points="320,472 320,432 240,432 240,512 280,512 280,472 319,472 319,512 359,512 359,472 		" />
        </g>
      </g>
      <g>
        <g>
          <rect x="120" y="197" width="80" height="40" />
        </g>
      </g>
      <g>
        <g>
          <rect y="237" width="40" height="80" />
        </g>
      </g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </SvgIcon>
  );
};

export { QrIcon };