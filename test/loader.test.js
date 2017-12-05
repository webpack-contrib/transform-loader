/* eslint-disable
  prefer-destructuring,
*/
import loader from '../src/cjs';
import webpack from './helpers/compiler';

describe('Loader', () => {
  test('Defaults', async () => {
    const config = {
      loader: {
        test: /\.coffee$/,
        loader: `${loader}?coffeeify`,
        options: {},
      },
    };

    const stats = await webpack('fixture.js', config);
    const { source } = stats.toJson().modules[1];

    expect(source).toMatchSnapshot();
  });
});
