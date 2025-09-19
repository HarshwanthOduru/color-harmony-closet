/**
 * Local storage utilities for the AI Wardrobe Stylist app
 */

const STORAGE_KEYS = {
  WARDROBE_ITEMS: 'wardrobe_items',
  SAVED_OUTFITS: 'saved_outfits',
  APP_SETTINGS: 'app_settings'
};

/**
 * Save wardrobe items to localStorage
 * @param {Object[]} items - Array of wardrobe items
 */
export const saveWardrobeItems = (items) => {
  try {
    localStorage.setItem(STORAGE_KEYS.WARDROBE_ITEMS, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to save wardrobe items:', error);
  }
};

/**
 * Load wardrobe items from localStorage
 * @returns {Object[]} Array of wardrobe items
 */
export const loadWardrobeItems = () => {
  try {
    const items = localStorage.getItem(STORAGE_KEYS.WARDROBE_ITEMS);
    return items ? JSON.parse(items) : [];
  } catch (error) {
    console.error('Failed to load wardrobe items:', error);
    return [];
  }
};

/**
 * Save a single outfit to saved outfits
 * @param {Object} outfit - Outfit object to save
 */
export const saveOutfit = (outfit) => {
  try {
    const savedOutfits = loadSavedOutfits();
    const outfitToSave = {
      ...outfit,
      id: outfit.id || `saved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      savedAt: Date.now()
    };
    
    savedOutfits.push(outfitToSave);
    localStorage.setItem(STORAGE_KEYS.SAVED_OUTFITS, JSON.stringify(savedOutfits));
    return outfitToSave;
  } catch (error) {
    console.error('Failed to save outfit:', error);
    return null;
  }
};

/**
 * Load saved outfits from localStorage
 * @returns {Object[]} Array of saved outfits
 */
export const loadSavedOutfits = () => {
  try {
    const outfits = localStorage.getItem(STORAGE_KEYS.SAVED_OUTFITS);
    return outfits ? JSON.parse(outfits) : [];
  } catch (error) {
    console.error('Failed to load saved outfits:', error);
    return [];
  }
};

/**
 * Delete a saved outfit
 * @param {string} outfitId - ID of outfit to delete
 */
export const deleteSavedOutfit = (outfitId) => {
  try {
    const savedOutfits = loadSavedOutfits();
    const filteredOutfits = savedOutfits.filter(outfit => outfit.id !== outfitId);
    localStorage.setItem(STORAGE_KEYS.SAVED_OUTFITS, JSON.stringify(filteredOutfits));
  } catch (error) {
    console.error('Failed to delete saved outfit:', error);
  }
};

/**
 * Delete a wardrobe item and update localStorage
 * @param {string} itemId - ID of item to delete
 */
export const deleteWardrobeItem = (itemId) => {
  try {
    const items = loadWardrobeItems();
    const filteredItems = items.filter(item => item.id !== itemId);
    saveWardrobeItems(filteredItems);
    return filteredItems;
  } catch (error) {
    console.error('Failed to delete wardrobe item:', error);
    return loadWardrobeItems();
  }
};

/**
 * Add a wardrobe item
 * @param {Object} item - Wardrobe item to add
 */
export const addWardrobeItem = (item) => {
  try {
    const items = loadWardrobeItems();
    const newItem = {
      ...item,
      id: item.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      addedAt: Date.now()
    };
    
    items.push(newItem);
    saveWardrobeItems(items);
    return newItem;
  } catch (error) {
    console.error('Failed to add wardrobe item:', error);
    return null;
  }
};

/**
 * Group wardrobe items by category
 * @param {Object[]} items - Array of wardrobe items
 * @returns {Object} Object with items grouped by category
 */
export const groupItemsByCategory = (items) => {
  return items.reduce((groups, item) => {
    const category = item.category.toLowerCase();
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});
};

/**
 * Save app settings
 * @param {Object} settings - Settings object
 */
export const saveAppSettings = (settings) => {
  try {
    localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save app settings:', error);
  }
};

/**
 * Load app settings
 * @returns {Object} Settings object
 */
export const loadAppSettings = () => {
  try {
    const settings = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
    return settings ? JSON.parse(settings) : {
      strictFormal: false,
      maxSuggestions: 3
    };
  } catch (error) {
    console.error('Failed to load app settings:', error);
    return {
      strictFormal: false,
      maxSuggestions: 3
    };
  }
};

/**
 * Clear all app data
 */
export const clearAllData = () => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.error('Failed to clear app data:', error);
  }
};