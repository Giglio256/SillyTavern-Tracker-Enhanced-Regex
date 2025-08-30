# SillyTavern Tracker Enhanced Extension

An advanced, feature-rich tracker extension for SillyTavern that provides comprehensive character and scene monitoring with intelligent automation, drag-and-drop field management, and dynamic template generation.

## 🚀 Enhanced Features

This enhanced version significantly expands upon the original tracker with major improvements and new capabilities:

### 🎯 **Advanced Prompt Maker System**
- **Smart Positioning**: Automatic scroll adjustment during drag operations in long forms 
- **Auto-Template Generation**: One-click HTML template generation from your field definitions
- **Auto-JavaScript Generation**: Dynamic gender-specific field hiding with intelligent detection
- **New Default Entries for Cultured People**: Fertility Cycles and Pregnancy simulation 🥵  
- **Gender-Specific Fields**: Configurable field visibility based on character gender (all, female, male, trans)

### 🔄 **Independent Connection System**  
- **Non-Disruptive Operation**: Maintains separate connection from main SillyTavern API
- **No Connection Interference**: Never switches or interrupts your primary chat connection
- **Reliable Background Processing**: Stable tracker generation without affecting chat flow
- **Smart Connection Management**: Automatic fallback and recovery mechanisms

## 🎮 **How to Use**

### 1. **Setting Up Fields**
1. Open SillyTavern Settings → Extensions → Tracker Enhanced
2. Click **"Prompt Maker"** to open the field editor
3. **Add Fields**: Use "Add Field" to create tracker properties
4. **Configure Fields**: Set name, type, presence, and gender-specific visibility
5. **Drag & Drop**: Reorder fields by dragging with the hamburger icon ☰

### 2. **Generating Templates**
1. After defining your fields, click **"Generate Template"**
2. The HTML template will be automatically created and applied
3. Preview how your tracker will appear in messages
4. Customize the generated template if needed

### 3. **Setting Up Gender-Specific Fields**
1. In Prompt Maker, select any character field
2. Use the **"Gender Specific"** dropdown:
   - **All Genders**: Show for everyone (default)
   - **Female Only**: Show only for female characters
   - **Male Only**: Show only for male characters  
   - **Trans Only**: Show only for trans characters
3. Click **"Generate JavaScript"** to create hiding logic
4. Fields will automatically hide based on character gender

### 4. **Advanced Configuration**
- **Presets**: Save complete configurations for different story types
- **Generation Modes**: Choose between Inline, Single-Stage, or Two-Stage generation
- **Custom Templates**: Modify HTML/JavaScript for specific formatting needs
- **Smart Preset Compatibility**: Visual indicators show preset compatibility with your selected connection profile
- **Debug Mode**: Enable detailed logging for troubleshooting

### 5. **Understanding Preset Compatibility**
Unlike the original tracker which forces you to use a matching conncetion profile and completion preset.    
I have unlinked them to give you maximum flexibility with fair warnings.     
When selecting a "Dedicated Completion Preset", you'll see compatibility indicators:
- **✅ Compatible**: Preset matches your connection profile's API - recommended for best results
- **⚠️ May have issues**: Preset may work but could have parameter conflicts - use with caution  
- **❌ Likely incompatible**: Preset is for a different API and may cause errors - not recommended

*Tip: You can still use any preset, but compatible ones will provide the most reliable results.*

## 📚 **Migration from Original**

- I recommend using only the original or my enhanced version - choose one. 
- If you keep both, you will probably see two tracker infos. They should not conflict because of unique IDs and labels.

## 🛠️ **Troubleshooting**

### Common Issues:
- **Fields not hiding**: Click "Generate JavaScript" after changing gender-specific settings
- **Alignment problems**: The enhanced alignment system fixes table spacing automatically
- **Connection issues**: The enhanced version uses independent connections - no interference
- **Template errors**: Use "Generate Template" to create properly formatted HTML
- **Preset compatibility warnings**: Choose presets with ✅ indicators for best results, or create new presets optimized for your connection profile

### Debug Mode:
Enable debug mode in settings to see detailed logs of:
- Field generation process
- Template compilation
- Gender-specific hiding logic
- Connection status and API calls

## 📜 **Credits**

- **SillyTavern**: https://github.com/SillyTavern/SillyTavern
- **Original Tracker**: https://github.com/kaldigo/SillyTavern-Tracker
