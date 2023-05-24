import {
  ComponentRenderData,
  extractPlasmicQueryData,
  PlasmicComponent,
  PlasmicRootProvider
} from "@plasmicapp/loader-nextjs";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import React from "react";
import { PLASMIC } from "../plasmic-provider/plasmic";

export const getStaticProps = async () => {
  const plasmicData = await PLASMIC.fetchComponentData("Homepage");
  const { params, displayName } = plasmicData.entryCompMetas[0];

  return {
    props: {
      plasmicData,
      queryCache: await extractPlasmicQueryData(
        <PlasmicRootProvider
          loader={PLASMIC}
          prefetchedData={plasmicData}
          pageParams={params}
          skipFonts
        >
          <PlasmicComponent component={displayName} />
        </PlasmicRootProvider>
      )
    },
    revalidate: 1
  };
};

export const getStaticPaths = async () => ({
  paths: (await PLASMIC.fetchPages()).map((page) => ({
    params: { catchall: page.path.substring(1).split("/") }
  })),
  fallback: false
});

const Catchall = ({ plasmicData, queryCache }: {
  plasmicData: ComponentRenderData;
  queryCache?: Record<string, any>
}) => {
  const { query } = useRouter();

  return (
    <PlasmicRootProvider
      loader={PLASMIC}
      prefetchedData={plasmicData}
      prefetchedQueryData={queryCache}
      pageParams={plasmicData.entryCompMetas[0].params}
      pageQuery={query}
    >
      <PlasmicComponent component={plasmicData.entryCompMetas[0].displayName} />
    </PlasmicRootProvider>
  );
};

export default dynamic(() => Promise.resolve(Catchall), { ssr: false });
