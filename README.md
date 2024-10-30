# @reactopia/svg-animator 🎨✨

A professional SVG text animation library with React support. Create stunning text animations with ease!

[![npm version](https://badge.fury.io/js/@reactopia%2Fsvg-animator.svg)](https://www.npmjs.com/package/@reactopia/svg-animator)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🚀 Lightweight and performant
- ⚛️ React-first design
- 🎯 Full TypeScript support
- 🔄 SSR compatible
- 🎨 Customizable animations
- 📦 Simple API
- 🎭 Built-in font support
- 👀 Intersection Observer support

## Installation

Using pnpm:
```bash
pnpm add @reactopia/svg-animator
```

Using npm:
```bash
npm install @reactopia/svg-animator
```

Using bun:
```bash
bun add @reactopia/svg-animator
```

### Basic Example
```tsx
import { AnimatedText } from '@reactopia/svg-animator';

const App = () => {
  return (
    <AnimatedText
      text="Hello World!"
      font="Pinyon Script"
      textConfig={{
        x: "50%",
        y: "50%",
        textAnchor: "middle",
        dominantBaseline: "middle",
        fontSize: "48px"
      }}
    />
  );
}
```

### With Custom Animation
 ```tsx
import { AnimatedText } from '@reactopia/svg-animator';
    
const App = () => {
  return (
    <AnimatedText
      text="Animated Text"
      font="Dancing Script"
      textConfig={{
        x: "50%",
        y: "50%",
        textAnchor: "middle",
        fontSize: "64px"
      }}
      animationConfig={{
        duration: 3000,
        delay: 500,
        strokeColor: "#ff0000",
        fillColor: "#000000",
        strokeWidth: 2
      }}
      onAnimationStart={() => console.log('Animation started')}
      onAnimationEnd={() => console.log('Animation completed')}
    />
  );
}
```


## Configuration Options

### TextConfig
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| x | string \| number | required | X coordinate of the text |
| y | string \| number | required | Y coordinate of the text |
| fontSize | string | undefined | Font size of the text |
| textAnchor | 'start' \| 'middle' \| 'end' | undefined | Text anchor alignment |
| dominantBaseline | 'auto' \| 'middle' \| 'hanging' | undefined | Vertical text alignment |

### AnimationConfig
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| duration | number | 2000 | Animation duration in milliseconds |
| delay | number | 0 | Delay before animation starts |
| easing | string | 'ease' | CSS animation timing function |
| iterations | number | 1 | Number of animation iterations |
| direction | 'normal' \| 'reverse' \| 'alternate' \| 'alternate-reverse' | 'normal' | Animation direction |
| fillMode | 'none' \| 'forwards' \| 'backwards' \| 'both' | 'forwards' | CSS animation fill mode |
| strokeWidth | number | 2 | Width of the text stroke |
| strokeColor | string | '#000000' | Color of the text stroke |
| fillColor | string | '#000000' | Fill color of the text |

## Supported Fonts
- Pinyon Script
- Dancing Script
- Pacifico

## Browser Support
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
MIT © [Yash Mahajan](https://github.com/YashM20)

## Support
If you like this project, please consider supporting it by:
- ⭐ Starring the repository
- 🐛 Reporting bugs
- 🔥 Contributing to the code
- ☕ [Buying me a coffee](https://ko-fi.com/yash_mhj)