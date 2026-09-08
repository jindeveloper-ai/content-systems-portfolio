import type { ComponentProps } from 'react';

// Static pages use native navigation, including hash anchors and downloads.
// It does not need the framework's client-side RSC navigation or prefetch cache.
export default function SiteLink({ children, ...props }: ComponentProps<'a'>) {
  return <a {...props}>{children}</a>;
}
