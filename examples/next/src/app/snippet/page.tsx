import { layoutTester } from '@/lib/dev';

// Next.JS isn't exporting a type for the server component props unfortunately
export default async function Snippet(props: {
  searchParams: Record<string, string>;
}) {
  await layoutTester(props.searchParams);

  return (
    <div>
      <h1>Snippet</h1>
    </div>
  );
}
