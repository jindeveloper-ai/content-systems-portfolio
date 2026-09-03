import type { ComponentProps } from 'react';

// A static two-page document uses native navigation, including hash anchors.
// It does not need the framework's client-side RSC navigation or prefetch cache.
export default function SiteLink({ children, ...props }: ComponentProps<'a'>) {
  return <a {...props}>{children}</a>;
}
