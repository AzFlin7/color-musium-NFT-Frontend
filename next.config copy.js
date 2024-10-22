const client = require('./client');

module.exports = {
  exportPathMap: async function (defaultPathMap) {
    const paths = await client
      .fetch('*[_type == "post" && defined(slug)].slug.current')
      .then((data) =>
        data.reduce(
          (acc, slug) => ({
            '/': { page: '/' },
            ...acc,
            [`/comms/${slug}`]: { page: '/comms/[slug]', query: { slug } },
          }),
          defaultPathMap
        )
      )
      .catch(console.error);
    return paths;
  },
};
