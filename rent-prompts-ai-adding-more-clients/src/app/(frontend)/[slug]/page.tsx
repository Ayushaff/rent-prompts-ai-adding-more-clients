import type { Metadata } from "next";

import { PayloadRedirects } from "@/components/PayloadRedirects";
import configPromise from "@payload-config";
import { getPayloadHMR } from "@payloadcms/next/utilities";
import { draftMode } from "next/headers";
import React, { cache } from "react";
import { homeStatic } from "@/endpoints/seed/home-static";

import type { Page as PageType } from "@/payload-types";
import { generateMeta } from "@/utilities/generateMeta";
import HeroSection from "@/components/heroSection/HeroSection";

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise });
  const pages = await payload.find({
    collection: "pages",
    draft: false,
    limit: 1000,
    overrideAccess: false,
  });

  return pages.docs
    ?.filter((doc) => {
      return doc.slug !== "home";
    })
    .map(({ slug }) => slug);
}

export default async function Page({ params: { slug = "home" } }) {
  const url = "/" + slug;

  let page: PageType | null;

  page = await queryPageBySlug({
    slug,
  });

  // Remove this code once your website is seeded
  if (!page) {
    page = homeStatic;
  }

  if (!page) {
    return <PayloadRedirects url={url} />;
  }

  const { hero, layout } = page;

  return (
    <>
      <HeroSection/>
    </>
  );
}

export async function generateMetadata({
  params: { slug = "home" },
}): Promise<Metadata> {
  const page = await queryPageBySlug({
    slug,
  });

  return generateMeta({ doc: page });
}

const queryPageBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = draftMode();

  const payload = await getPayloadHMR({ config: configPromise });

  const result = await payload.find({
    collection: "pages",
    draft,
    limit: 1,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  });

  return result.docs?.[0] || null;
});
