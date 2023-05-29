import { FunctionComponent } from 'preact';
import type { AnchorHTMLAttributes } from 'react';

interface ExternalLinkProps extends Omit<AnchorHTMLAttributes<Element>, 'href'> {
  href: string;
}
const ExternalLink: FunctionComponent<ExternalLinkProps> = ({
  href,
  children,
  rel,
  ...rest
}: ExternalLinkProps) => (
  <a target="_blank" rel={`noopener noreferrer${rel ? ` ${rel}` : ''}`} href={href} {...rest}>
    {children ?? href}
  </a>
);
export default ExternalLink;
