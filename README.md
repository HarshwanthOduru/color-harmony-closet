# AI Wardrobe Stylist

A sophisticated color-based wardrobe styling web application that uses intelligent color harmony analysis to suggest perfect outfit combinations. Built with React, Vite, and Tailwind CSS - completely client-side with no backend required.

## 🌟 Features

### Core Functionality
- **Upload Wardrobe**: Add clothing items across 4 categories (Tops, Bottoms, Footwear, Accessories)
- **Automatic Color Extraction**: Uses ColorThief to extract dominant colors from uploaded images
- **Outfit Suggestions**: AI-powered outfit combinations for both Casual and Formal styles
- **Color Harmony Analysis**: Implements professional color theory rules for complementary, analogous, and neutral pairings
- **Persistent Storage**: All data saved locally using localStorage (no backend required)
- **Responsive Design**: Mobile-first design that works beautifully on all devices

### Smart Color Matching Algorithm
The app implements sophisticated color theory rules:

- **Complementary Colors**: Opposite colors on color wheel (150°-210° difference) → +2 points
- **Analogous Colors**: Close colors on color wheel (≤30° difference) → +1 point  
- **High Contrast**: Light vs dark combinations (L<30 vs L>70) → +1 point
- **Neutral Detection**: Low saturation (<12%) or specific color ranges → bonus for formal wear
- **Style Preferences**: 
  - Formal: Favors neutrals and lower saturation
  - Casual: Rewards vibrant, bold combinations

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn

### Installation & Setup

```bash
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to project directory
cd ai-wardrobe-stylist

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Quick Demo with Sample Images

1. **Start the app** and navigate to "Upload Wardrobe"
2. **Use sample images** in `public/test-images/` folder:
   - `navy-shirt.jpg` (Tops)
   - `beige-pants.jpg` (Bottoms) 
   - `black-shoes.jpg` (Footwear)
   - `red-tie.jpg` (Accessories)
3. **Upload items** by dragging/dropping or clicking to browse
4. **Get suggestions** by clicking "Casual Outfit Suggestions" or "Formal Outfit Suggestions"
5. **Save favorites** by clicking the heart icon on any outfit

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx           # Main landing page with action tiles
│   ├── UploadWardrobe.jsx      # File upload and wardrobe management
│   ├── OutfitSuggestions.jsx   # Outfit generation and display
│   ├── MyWardrobe.jsx          # Browse and manage wardrobe items
│   └── SavedOutfits.jsx        # View and manage saved outfits
├── utils/
│   ├── colorExtraction.js      # ColorThief integration and color utilities
│   ├── colorMatching.js        # Color harmony algorithm implementation
│   └── storage.js              # localStorage data persistence
├── pages/
│   └── Index.tsx               # Main app component with routing
└── components/ui/              # Shadcn UI components

public/
└── test-images/                # Sample clothing images for demo
    ├── navy-shirt.jpg
    ├── beige-pants.jpg
    ├── black-shoes.jpg
    ├── red-tie.jpg
    ├── white-tshirt.jpg
    └── blue-jeans.jpg
```

## 🎨 Color Harmony Algorithm Explained

### Color Space Conversion
1. **RGB → HSL**: Convert image colors to Hue, Saturation, Lightness for better color analysis
2. **Hue Distance**: Calculate minimal angular difference on color wheel (0-180°)

### Harmony Rules Implementation
```javascript
// Complementary colors (opposite on wheel)
if (hueDistance >= 150 && hueDistance <= 210) {
    score += 2; // Strong harmony
}

// Analogous colors (neighbors on wheel)  
else if (hueDistance <= 30) {
    score += 1; // Gentle harmony
}

// High contrast (light + dark)
if ((lightness1 < 30 && lightness2 > 70) || vice versa) {
    score += 1; // Good contrast
}

// Neutral pairing bonus
if (isNeutral(color1) || isNeutral(color2)) {
    if (formalContext) score += 1; // Neutrals preferred in formal
}
```

### Style-Specific Scoring
- **Formal**: Bonus for neutrals, penalty for high saturation (>55%)
- **Casual**: Bonus for vibrant colors and complementary combinations

## 💾 Data Storage

All data is stored locally in your browser using localStorage:

- **Wardrobe Items**: `wardrobe_items` key stores uploaded clothing with extracted color data
- **Saved Outfits**: `saved_outfits` key stores favorite outfit combinations  
- **App Settings**: `app_settings` key for user preferences

No external servers or databases required!

## 🛠 Technologies Used

- **React 18**: Modern React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first styling framework
- **ColorThief**: Client-side color extraction library
- **Shadcn/ui**: Beautiful, accessible UI components
- **Lucide React**: Professional icon library

## 🎯 Usage Guide

### 1. Upload Your Wardrobe
- Navigate to "Upload Wardrobe"
- Drag & drop or click to upload images in each category
- Watch as colors are automatically extracted and displayed

### 2. Get Outfit Suggestions  
- Click "Casual Outfit Suggestions" for everyday wear
- Click "Formal Outfit Suggestions" for professional settings
- View top 3 AI-generated combinations with color harmony explanations

### 3. Manage Your Collection
- Use "My Wardrobe" to browse, filter, and delete items
- View detailed color information (HEX, RGB, HSL values)
- Check category statistics and item counts

### 4. Save Favorites
- Save any outfit combination to your collection
- View saved outfits with full details and color analysis
- Export or share outfit combinations

## ⚙️ Configuration

The app includes configurable parameters in the color matching algorithm:

- **Max Suggestions**: Default 3 outfits per request
- **Color Tolerance**: Hue difference thresholds for harmony detection
- **Neutral Detection**: Saturation thresholds for neutral color identification
- **Scoring Weights**: Formal vs casual style preferences

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Structure Guidelines

- **Components**: Functional React components with hooks
- **Utils**: Pure functions for color analysis and data management
- **Design System**: Consistent styling using Tailwind CSS variables
- **TypeScript**: Gradual typing for better developer experience

## 🎨 Design System

The app uses a sophisticated design system with:

- **Color Palette**: Fashion-inspired purple primary with elegant gradients
- **Typography**: Inter font family with proper font features
- **Shadows**: Soft, medium, and strong elevation levels
- **Animations**: Smooth transitions with custom easing curves
- **Responsive**: Mobile-first approach with breakpoint consistency

## 📱 Browser Support

- ✅ Chrome/Chromium (recommended)
- ✅ Firefox
- ✅ Safari  
- ✅ Edge
- ⚠️ IE11+ (limited support)

## 🤝 Contributing

This project was built as a demonstration of client-side color analysis and outfit recommendation. Feel free to:

- Report bugs or suggest improvements
- Extend the color harmony algorithm
- Add new styling categories or features
- Improve the UI/UX design

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using Lovable AI** - A sophisticated wardrobe styling application showcasing the power of client-side color analysis and intelligent outfit recommendations.
