import React from 'react';
import { TooltipArrow } from '@radix-ui/react-tooltip';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../components/ui/tooltip';

type AmlTooltipProps = {
  children: React.ReactNode;
  tooltip: React.ReactNode;
};

const AmlTooltip = ({ children, tooltip }: AmlTooltipProps) => (
  <TooltipProvider delayDuration={150}>
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>
        {tooltip}
        <TooltipArrow />
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default AmlTooltip;
