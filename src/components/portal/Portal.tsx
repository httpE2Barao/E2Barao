import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface PortalProps {
  children: React.ReactNode;
  container?: Element | DocumentFragment;
}

export const Portal = ({ children, container }: PortalProps) => {
  const containerRef = useRef<Element | DocumentFragment | null>(null);

  useEffect(() => {
    containerRef.current = container || document.body;
  }, [container]);

  return containerRef.current ? createPortal(children, containerRef.current) : null;
};
