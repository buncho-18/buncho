// import Page from '../../[slug]/page';

// export const dynamic = 'force-dynamic';

// export default Page;

import Page, { generateMetadata, generateStaticParams } from '../../[slug]/page';

// Same cached page as /problems/[slug]. `revalidate` has to be written out in each route file.
export const revalidate = 86400;

export { generateMetadata, generateStaticParams };
export default Page;