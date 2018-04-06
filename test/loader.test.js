/* eslint-disable
  prefer-destructuring,
*/
import webpack from './helpers/compiler';

describe('Loader', () => {
  test('Defaults', async () => {
    const config = {
      module: {
        rules: [{
          test: /\.coffee?$/,
          loader: `${__dirname}/../src/cjs?coffeeify`,
        }],
      },
    };

    const stats = await webpack('fixture.js', config);
    const { source } = stats.toJson().modules[1];

    expect(source).toMatchSnapshot();
  });
});
