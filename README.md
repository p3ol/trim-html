![CI](https://github.com/p3ol/trim-html/workflows/CI/badge.svg)

# trim-html #

> Cutting a HTML String without breaking HTML Tags

This is a fork of unmaintained https://github.com/brankosekulic/trimHtml that's designed to be a drop-in replacement.

The API is unchanged, but it's now esm first, everything is now typed and it allows for special unicode spaces like `、` from Han script.

## Installation ##

### Node.js ###

```bash
  yarn add @poool/trim-html
```

## Usage ##

```ts
import { trimHtml } from '@poool/trim-html';

const html = `<div><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit,
  sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p><p>Ut
  enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
  ex ea commodo consequat. </p><p>Duis aute irure dolor in reprehenderit in
  voluptate velit esse cillum dolore eu fugiat nulla pariatur. </p><p>Excepteur
  sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit
  anim id est laborum.</p></div>`;

const trimmed = trimHtml(html);

console.log(trimmed);
// {
//    html: `<div><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit,
//    sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p><p>Ut
//    enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut...
//    </p></div>`,
//    more: true // indicates if limit is reached
// }
```


## Options ##

### limit
- Type: `number`
- Default: `100`

Char limit

### wordBreak
- Type: `boolean`
- Default: `false`

Allow to break text on part of words

### preserveTags
- Type: `boolean`
- Default: `true`

Maintain HTML tags

### suffix
- Type: `string`
- Default: `'...'`

string that will be appended at the end

### moreLink
- Type: `string`

link to access full content

### spaceChars
- Type: `string[]`
- Default: `[' ', ' ', '、', '。']`

All allowed space chars for the html string to be split from


## Contributing

[![](https://contrib.rocks/image?repo=p3ol/trim-html)](https://github.com/p3ol/trim-html/graphs/contributors)

Please check the [CONTRIBUTING.md](https://github.com/p3ol/trim-html/blob/master/CONTRIBUTING.md) doc for contribution guidelines.

## Development

Install dependencies:

```bash
yarn install
```

And test your code:

```bash
yarn test
```

## License

This software is licensed under [MIT](https://github.com/p3ol/trim-html/blob/master/LICENSE).
