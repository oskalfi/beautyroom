// The persistent first-screen loader owns the delay across the route boundary.
export default function Loading() {
  return <div data-page-loading aria-busy="true" />;
}
