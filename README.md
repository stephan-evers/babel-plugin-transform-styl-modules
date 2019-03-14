
# babel-plugin-transform-styl-modules

> Transforms "styl" tagged template literals into css modules. 🚀

Write your stylus code this way:

```javascript
  const css = styl`
    .your-class
      background: tomato
  `
```

And it will be transpiled into:

```javascript
  const css = {
    'your-class': '_your-class_<hash>'
  }
```

It exports the generated css into the `<dest>/.modules` folder where your .babelrc is found.

## Usage

For an explanation of css-modules go [here](https://github.com/css-modules/css-modules) and for stylus-lang [here](http://stylus-lang.com).

#### Install

1. Install via yarn or npm

  ```bash
  yarn add --dev babel-plugin-transform-styl-modules
  ```

  ```bash
  npm install --save-dev babel-plugin-transform-styl-modules
  ```

2. Add to babel configuration (usually in .babelrc)

  ```JSON
  {
    "plugins": [
      ["transform-styl-modules", { "dest": "any/dir" }]
    ]
  }
  ```

  The "dest"-parameter is optional. You can use it to pipe the generated output into your watch-directory for your build process.

#### Basic example

Write some front-end component:

```javascript
// cwd/path/to/component/Icon.js

import {h} from 'your-favorite-framework' // react/vue whatever

const css = styl`
  .icon
    fill: currentColor
    // ... rest of your styles
`

export default ({href}) =>
  h('svg', {class: css.icon},
    h('use', {href: href}))
```

After transpiling:

```javascript
// CWD/path/to/component/Icon.js

import {h} from 'your-favorit-framework' // react/vue whatever

const css = {
  'icon': '_icon_11j4s_1'
}
`

export default ({href}) =>
  h('svg', {class: css.icon},
    h('use', {href: href}))
```

Generates the following files:

```css
// CWD/any/dir/.modules/path/to/component/Icon.css

._icon_11j4s_1 {
  fill: currentColor
}
```

```Stylus
// CWD/any/dir/.modules/bundle.styl

@require "./**/*.css"
```

Include these files into your build pipeline.

## Limitations

Global styles are currently ignored 😢

## License

MIT
