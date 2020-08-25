import React from "react";
import clsx from "clsx";
import Layout from "@theme/Layout";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import useBaseUrl from "@docusaurus/useBaseUrl";
import styles from "./styles.module.css";

const features = [
  {
    title: <>Modular</>,
    description: (
      <>
        Import only what you need. The library is split into separate packages so it's easy to
        update.
      </>
    ),
  },
  {
    title: <>Tailwind</>,
    description: (
      <>
        Components are written with tailwind in mind, but the helpers and scripts can work with any
        project.
      </>
    ),
  },
  {
    title: <>Open Source</>,
    description: <>Coming soon!</>,
  },
];

function Feature({ imageUrl, title, description }) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={clsx("col col--4", styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title={siteConfig.title} description="Uplift's frontend core library">
      <header className={clsx("hero", styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">
            {siteConfig.title} {siteConfig.tagline}
          </h1>
          <p className="hero__subtitle">
            A library to help build React+TypeScript apps with Django+Graphene APIs.
          </p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                "button button--outline button--primary button--lg",
                styles.getStarted
              )}
              to={useBaseUrl("docs/")}
            >
              Get Started
            </Link>
            <a
              className={clsx("button button--outline button--secondary button--lg")}
              href="https://github.com/uplift-ltd/nexus"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>
      <main>
        {features && features.length > 0 && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
