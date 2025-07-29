# TheodoreAI Portfolio - Vue.js

A modern portfolio website built with Vue.js 3, featuring a 3D business card and responsive design.

## 🚀 Features

- **Vue.js 3** with Composition API
- **Vite** for fast development and building
- **Vue Router** for client-side routing
- **Three.js** for 3D graphics
- **Bootstrap 5** for responsive design
- **Local development** optimized

## 📁 Project Structure

```
src/
├── components/          # Reusable Vue components
│   ├── Layout.vue      # Main layout with navigation
│   ├── ThreeJSCard.vue # 3D business card component
│   └── Card.vue        # Project card component
├── views/              # Page components
│   ├── Home.vue        # Landing page
│   ├── About.vue       # About page
│   ├── Projects.vue    # Projects showcase
│   ├── Contact.vue     # Contact page
│   └── Test.vue        # Debug/test page
├── assets/             # Static assets
│   ├── css/           # Stylesheets
│   ├── images/        # Images
│   └── pdf/           # PDF files
├── router.js          # Vue Router configuration
├── main.js            # App entry point
└── App.vue            # Root component
```

## 🛠️ Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TheodoreAI/TheodoreAI.github.io.git
cd TheodoreAI.github.io/vue-project
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5176/`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier


## 🚀 Deployment

### Manual Deployment

1. Build the project:
```bash
npm run build
```

2. Copy the contents of the `dist` folder to your web server

### Local Development

1. Start the development server:
```bash
npm run dev
```

2. Open your browser to `http://localhost:5176/`

## 🎨 Customization

### Adding New Pages

1. Create a new component in `src/views/`
2. Add the route in `src/router.js`
3. Add navigation link in `src/components/Layout.vue`

### Styling

- Main styles are in `src/assets/css/index.css`
- Bootstrap 5 is included via CDN
- Component-specific styles use scoped CSS

### 3D Business Card

The 3D business card component (`ThreeJSCard.vue`) can be:
- Enabled/disabled in `Home.vue`
- Customized by modifying textures in `public/assets/`
- Styled by adjusting Three.js parameters

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Contact

- GitHub: [@TheodoreAI](https://github.com/TheodoreAI)
- Email: mateoej12@gmail.com 