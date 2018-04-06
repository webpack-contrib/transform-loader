import webpack from './helpers/compiler';

describe('Loader', () => {
  test('Defaults', async () => {
    const config = {
      module: {
        rules: [
          {
            test: /\.coffee?$/,
            loader: `${__dirname}/../src/cjs?coffeeify`,
          },
        ],
      },
    };

    const stats = await webpack('fixture.js', config);
    const { modules } = stats.toJson();
    const [module] = modules;
    const { source } = module;

    expect(source).toMatchSnapshot();
  });
});
