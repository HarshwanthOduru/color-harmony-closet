import React, { useState } from 'react';
import Dashboard from '../components/Dashboard.jsx';
import UploadWardrobe from '../components/UploadWardrobe.jsx';
import OutfitSuggestions from '../components/OutfitSuggestions.jsx';
import MyWardrobe from '../components/MyWardrobe.jsx';
import SavedOutfits from '../components/SavedOutfits.jsx';

/**
 * Main app component with navigation between different views
 */
const Index = () => {
  const [currentView, setCurrentView] = useState('dashboard');

  /**
   * Handle navigation between different views
   * @param {string} view - The view to navigate to
   */
  const handleNavigate = (view) => {
    setCurrentView(view);
  };

  /**
   * Render the current view based on state
   */
  const renderCurrentView = () => {
    switch (currentView) {
      case 'upload':
        return <UploadWardrobe onNavigate={handleNavigate} />;
      case 'casual':
        return <OutfitSuggestions onNavigate={handleNavigate} isFormal={false} />;
      case 'formal':
        return <OutfitSuggestions onNavigate={handleNavigate} isFormal={true} />;
      case 'wardrobe':
        return <MyWardrobe onNavigate={handleNavigate} />;
      case 'saved':
        return <SavedOutfits onNavigate={handleNavigate} />;
      case 'dashboard':
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderCurrentView()}
    </div>
  );
};

export default Index;
