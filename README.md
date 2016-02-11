# Webpack code splitting

OK, this topic is fairly convoluted, at least in my mind, so forgive any inaccuracies
or poor explanations. Improvements in the form of issues or PRs more than welcome.

## Running the example

1. `npm i` to install dependencies
2. `npm run watch` to build the bundles any time a file in `src` changes
3. In a separate terminal window, `npm start` to serve `dist` on http://localhost:3000

## Explanation

The dependency graph of this demo is this: `index.js` depends on `DYNAMIC_SECTION.js`,
which in turn depends on `DYNAMIC_SECTION_ASSET.js`. All dependencies are
loaded dynamically via `require.ensure`.

Because of this, three bundles are generated.

* `bundle.js` is the main bundle, aka `index.js` (and the Webpack runtime)
* `1.bundle.js` is `DYNAMIC_SECTION.js` (and the Webpack wrapper)
* `2.bundle.js` is `DYNAMIC_SECTION_ASSET.js` (and the Webpack wrapper)

Now load http://localhost:3000/ in your browser and open the Console and Network
tabs of Dev Tools. You will see `bundle.js` has been loaded, and the message
"MAIN BUNDLE loaded" is printed to the console.

When you click the button on the page it will run the following code.

```javascript
require.ensure([], function (require) {
  console.log(require('./DYNAMIC_SECTION'), 'loaded');
}, 'DYNAMIC_SECTION')
```

You will see that both `1.bundle.js` and `2.bundle.js` are loaded, and the
messages from both will be printed to the console.

Now, if you go into `index.js` and uncomment line 5 and comment out line 6, you
are changing the code that runs in response to the button click to this:

```javascript
require.ensure(['./DYNAMIC_SECTION_ASSET'], function (require) {
  console.log(require('./DYNAMIC_SECTION'), 'loaded');
}, 'DYNAMIC_SECTION')
```

If you look at the terminal window where you ran `npm run watch`, you will also
notice that only two bundles were generated this time.

`bundle.js` is unchanged. It is still the main bundle, aka `index.js`,
and the Webpack runtime. `1.bundle.js`, however, now houses both `DYNAMIC_SECTION.js`
and `DYNAMIC_SECTION_ASSET.js`.

**This is the key part.**

By listing `'./DYNAMIC_SECTION_ASSET'` in the dependencies array when we
called `require.ensure`, we told Webpack that anything `require`ed in the
corresponding callback depends on the module identified as `'./DYNAMIC_SECTION_ASSET'`.

Put another way, Webpack will bundle anything listed in the array argument along
with anything that is required in the callback argument.

Since we require `require('./DYNAMIC_SECTION')` and list
`'./DYNAMIC_SECTION_ASSET'` in the array, `DYNAMIC_SECTION_ASSET.js` gets included
in `DYNAMIC_SECTION.js`'s bundle.

## Whew, that was rough

I'm still getting my head fully around this stuff but it mostly makes sense to me now.
Again, if you have anything to add or clarify please file an issue or PR, or
[tweet at me](https://twitter.com/bclinkinbeard) or [send me an email](mailto:ben@knowbetter.io).
