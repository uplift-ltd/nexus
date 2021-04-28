module.exports = {
  title: "Nexus",
  tagline: "by Uplift.ltd",
  url: "https://nexus.uplift.sh",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "uplift-ltd",
  projectName: "nexus",
  themeConfig: {
    sidebarCollapsible: false,
    navbar: {
      title: "Nexus",
      logo: {
        alt: "Uplift.ltd",
        src: "img/apple-touch-icon.png",
      },
      items: [
        {
          to: "docs/",
          activeBasePath: "docs",
          label: "Docs",
          position: "left",
        },
        {
          href: "https://github.com/uplift-ltd/nexus",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Installation",
              to: "docs/",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Twitter",
              href: "https://twitter.com/upliftltd",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/uplift-ltd/nexus",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Uplift Agency Ltd. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl: "https://github.com/uplift-ltd/nexus/edit/master/website/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
