# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SillyTavern Tracker Enhanced is a sophisticated extension for SillyTavern that provides comprehensive character and scene tracking with intelligent automation, drag-and-drop field management, and dynamic template generation. It operates as an independent system that doesn't interfere with SillyTavern's main chat connections.

## Architecture

### Core Structure
- **Entry Point**: `index.js` - Main extension initialization and slash command registration
- **Settings System**: `src/settings/` - Configuration management with presets support
- **UI Components**: `src/ui/` - Modular interface components for tracker management
- **Core Logic**: `src/` - Core tracker functionality and event handling
- **Utilities**: `lib/` - Shared utilities and interconnection management

### Key Architectural Components

#### Settings & Configuration (`src/settings/`)
- `defaultSettings.js` - Contains all default settings, templates, and presets
- `settings.js` - Settings initialization and management
- Supports three generation modes: Inline, Single-Stage, Two-Stage
- Preset system allows saving complete configurations for different story types

#### UI System (`src/ui/`)
- **Modular Design**: Each major UI component is separated into its own file
- `trackerInterface.js` - Main UI integration with SillyTavern
- `trackerPromptMakerModal.js` - Field configuration interface with drag-and-drop
- `trackerPreviewManager.js` - Live preview system for tracker templates
- `trackerEditorModal.js` - Template editing interface
- **Components Folder**: Contains reusable UI components like generators and renderers

#### Data Management (`src/trackerDataHandler.js`)
- Handles conversion between JSON/YAML formats
- Field presence options: DYNAMIC, STATIC, EPHEMERAL
- Type handlers for different field types (STRING, ARRAY, OBJECT, FOR_EACH_OBJECT)
- Tracker saving and retrieval from chat objects

#### Generation System (`src/generation.js` and `src/tracker.js`)
- Supports multiple generation modes with different prompt strategies
- Independent connection management to avoid interfering with main chat
- Automatic fallback and recovery mechanisms
- Message summarization for Two-Stage generation

### Extension Points

#### Field Types
The system supports multiple field types defined in `FIELD_TYPES_HANDLERS`:
- **STRING**: Simple text fields
- **ARRAY**: List-based fields
- **OBJECT**: Structured data fields
- **FOR_EACH_OBJECT**: Dynamic character-based fields
- **FOR_EACH_ARRAY**: Array iteration fields
- **ARRAY_OBJECT**: Combined array-object type

#### Gender-Specific Field System
Fields can be configured with `genderSpecific` property:
- `"all"` - Show for all characters (default)
- `"female"` - Show only for female characters
- `"male"` - Show only for male characters
- `"trans"` - Show only for trans characters

#### Generation Modes
1. **Inline Mode**: Prepends tracker to every character response
2. **Single-Stage Mode**: Generates tracker in one API call after messages
3. **Two-Stage Mode**: First detects changes, then generates updated tracker

## Development Commands

Since this is a client-side JavaScript extension, there are no build commands. Development is done directly with the source files.

### Extension Installation
The extension is installed by placing files in the SillyTavern extensions directory:
```
public/scripts/extensions/third-party/SillyTavern-Tracker-Enhanced/
```

### Debugging
- Enable debug mode in extension settings for detailed logging
- Check browser console for extension-specific logs prefixed with `[tracker-enhanced]`
- Use SillyTavern's built-in extension debugging features

## Key Development Patterns

### Event System Integration
The extension integrates with SillyTavern's event system:
```javascript
eventSource.on(event_types.CHAT_CHANGED, eventHandlers.onChatChanged);
eventSource.on(event_types.CHARACTER_MESSAGE_RENDERED, eventHandlers.onCharacterMessageRendered);
```

### Settings Management
Settings follow SillyTavern's extension pattern:
```javascript
export const extensionSettings = extension_settings[extensionName];
```

### Slash Commands
Five slash commands are registered:
- `/generate-tracker-enhanced` - Generate tracker for specific message
- `/tracker-enhanced-override` - Override tracker for next generation
- `/save-tracker-enhanced` - Save tracker to message
- `/get-tracker-enhanced` - Retrieve tracker from message
- `/tracker-enhanced-state` - Get/set extension enabled state

### Template System
Uses Handlebars-style templates for:
- HTML message rendering (`mesTrackerTemplate`)
- JavaScript field hiding logic (`mesTrackerJavascript`)
- Context generation templates for different generation modes

### Interconnection Management (`lib/interconnection.js`)
Manages generation mutex to prevent conflicts with other extensions and ensure proper sequencing of tracker operations.

## Configuration

### Default Tracker Definition
The `trackerDef` object in `defaultSettings.js` defines the complete field structure including:
- Field types and presence rules
- Gender-specific visibility settings
- Prompt instructions for each field
- Example values for generation consistency

### Preset System
Three default presets are provided:
- **Default-SingleStage**: Standard single-call generation
- **Default-TwoStage**: Change detection followed by tracker update
- **Default-Inline**: Inline tracker generation with character responses

## Important Implementation Notes

### Gender-Specific Field Hiding
The JavaScript template automatically hides female-specific fields (FertilityCycle, Pregnancy, BustWaistHip) for non-female characters using DOM manipulation.

### Connection Independence
The extension maintains separate connections from SillyTavern's main chat to avoid interference, with automatic fallback handling.

### Template Generation
The system can auto-generate HTML templates and JavaScript field hiding logic based on field definitions, reducing manual template maintenance.

### Preset Compatibility System
Visual indicators show preset compatibility with connection profiles, helping users choose appropriate presets for their API configuration.

## SillyTavern Internal Implementation Documentation

### Character Card Management

#### Data Structure and Storage
Characters in SillyTavern use the TavernCard V2 specification with the following key structure:

```javascript
{
  "spec": "chara_card_v2",
  "spec_version": "2.0",
  "name": "Character Name",
  "avatar": "filename.png",  // Avatar filename
  "json_data": "...",         // Serialized character data
  "data": {
    "name": "Character Name",
    "description": "Character description",
    "personality": "Personality traits",
    "scenario": "Scenario description",
    "first_mes": "First message",
    "mes_example": "Example messages",
    "creator_notes": "Creator's notes",
    "system_prompt": "System prompt",
    "alternate_greetings": [],
    "tags": [],
    "extensions": {
      "talkativeness": 0.5,
      "fav": false,
      "world": "",
      "depth_prompt": {
        "prompt": "",
        "depth": 4,
        "role": "system"
      }
    }
  }
}
```

#### Key Internal Functions

**Character Creation/Import (`src/endpoints/characters.js`):**
- `charaFormatData()` - Formats character data to V2 spec
- `writeCharacterData()` - Writes character to PNG file with embedded metadata
- `importFromPng/Json/Yaml()` - Import characters from various formats
- `convertToV2()` - Converts V1 characters to V2 format
- Characters stored as PNG files in `<user_dir>/characters/`

**Character Reading/Loading:**
- `readCharacterData()` - Reads character from PNG with caching
- `processCharacter()` - Processes character data and calculates stats
- Uses memory cache and optional disk cache for performance
- Character metadata embedded in PNG tEXt/exif chunks

**Character Editing:**
- `/api/characters/edit` - Updates character data
- `/api/characters/edit-attribute` - Updates specific attributes
- `/api/characters/merge-attributes` - Merges attributes with validation
- `/api/characters/rename` - Renames character and updates references

**Character Deletion:**
- `/api/characters/delete` - Deletes character file
- Optional deletion of associated chat files
- Invalidates thumbnails and caches

### Group Chat Implementation

#### Group Data Structure
Groups are stored as JSON files with the following structure:

```javascript
{
  "id": "unique_id",
  "name": "Group Name",
  "members": ["avatar1.png", "avatar2.png"],  // Array of character avatar filenames
  "avatar_url": "data:image/png;base64...",   // Optional custom avatar
  "disabled_members": [],                      // Members excluded from responses
  "allow_self_responses": false,               // Allow character to respond to self
  "activation_strategy": 0,                    // 0=NATURAL, 1=LIST, 2=MANUAL, 3=POOLED
  "generation_mode": 0,                        // 0=SWAP, 1=APPEND, 2=APPEND_DISABLED
  "chat_id": "current_chat_id",
  "chats": ["chat_id_1", "chat_id_2"],        // Array of associated chat IDs
  "chat_metadata": {},                          // Metadata for current chat
  "past_metadata": {},                          // Metadata for past chats
  "fav": false,                                 // Favorite status
  "auto_mode_delay": 5,                        // Delay for auto-mode in seconds
  "generation_mode_join_prefix": "",           // Prefix for joined fields
  "generation_mode_join_suffix": ""            // Suffix for joined fields
}
```

#### Key Group Functions

**Group Creation (`public/scripts/group-chats.js` & `src/endpoints/groups.js`):**
- `createNewGroup()` - Creates new group with members
- Groups stored as JSON in `<user_dir>/groups/`
- Auto-generates unique ID using timestamp
- Creates associated chat file in `<user_dir>/group_chats/`

**Adding/Removing Members:**
- Members managed through `group.members` array
- Members referenced by character avatar filename (not name)
- `editGroup()` - Saves group changes
- `validateGroup()` - Validates members exist and removes invalid references
- `renameGroupMember()` - Updates member references when character renamed

**Converting Solo Chat to Group:**
- `convertSoloToGroupChat()` - Converts existing 1-on-1 chat to group
- Creates new group with single member
- Preserves chat history with proper group formatting
- Adds force_avatar and original_avatar fields to messages
- Cannot be reverted once converted

**Group Chat Management:**
- `loadGroupChat()` - Loads specific group chat
- `saveGroupChat()` - Saves current group chat
- `createNewGroupChat()` - Creates new chat for existing group
- `deleteGroupChat()` - Deletes specific chat from group
- Group chats stored as JSONL in `<user_dir>/group_chats/`

**Group Generation Modes:**
- **SWAP (0)**: Replace current character, one at a time
- **APPEND (1)**: Combine all member cards into single context
- **APPEND_DISABLED (2)**: Append but include disabled members

**Activation Strategies:**
- **NATURAL (0)**: Based on conversation flow and keywords
- **LIST (1)**: Sequential order from member list
- **MANUAL (2)**: User selects who responds
- **POOLED (3)**: Random selection from pool

**Group Member Management:**
- `getGroupMembers()` - Returns character objects for group members
- `findGroupMemberId()` - Finds member by index or name
- Members can be disabled (excluded from responses)
- Supports self-responses setting per group

### Important Implementation Details

1. **Character Avatar References:**
   - Characters identified by avatar filename (e.g., "character.png")
   - Avatar serves as unique identifier throughout system
   - Renaming updates all references in groups and chats

2. **Chat Storage:**
   - Solo chats: `<user_dir>/chats/<character_name>/`
   - Group chats: `<user_dir>/group_chats/<chat_id>.jsonl`
   - Messages stored in JSONL format (one JSON object per line)

3. **Character/Group Relationship:**
   - Characters can belong to multiple groups
   - Groups maintain member list by avatar reference
   - Character deletion removes from all groups
   - Character rename updates all group references

4. **Metadata Management:**
   - Characters have embedded metadata in PNG files
   - Groups store metadata separately in JSON
   - Chat metadata maintained per conversation
   - Supports extensions and custom fields

5. **API Endpoints:**
   - Characters: `/api/characters/*`
   - Groups: `/api/groups/*`
   - Group Chats: `/api/chats/group/*`
   - All require authentication headers

## Extension Import Patterns

### Directory Structure Understanding
The extension is located at:
```
public/scripts/extensions/third-party/SillyTavern-Tracker-Enhanced/
```

### Correct Import Paths
When importing from extension files in subdirectories (e.g., `src/`, `src/ui/`), the relative paths are:

**From files in `src/` directory:**
- To `script.js`: `../../../../../script.js`
- To `scripts/group-chats.js`: `../../../../group-chats.js`
- To `scripts/tags.js`: `../../../../tags.js`
- To `scripts/popup.js`: `../../../../popup.js`

**From files in `src/ui/` directory:**
- To `script.js`: `../../../../../../script.js`
- To `scripts/group-chats.js`: `../../../../../group-chats.js`
- To `scripts/tags.js`: `../../../../../tags.js`
- To `scripts/popup.js`: `../../../../../popup.js`

**From `index.js` (extension root):**
- To `script.js`: `../../../../script.js`
- To `scripts/extensions.js`: `../../../../../../scripts/extensions.js`

### Import Pattern Rules
1. **Core Script**: `script.js` is at the root (`public/`)
2. **Scripts Modules**: Most modules are in `public/scripts/`
3. **Extensions**: Extensions are in `public/scripts/extensions/`
4. **Third-Party**: Third-party extensions are in `public/scripts/extensions/third-party/`

### Path Calculation Example
From: `public/scripts/extensions/third-party/SillyTavern-Tracker-Enhanced/src/sillyTavernHelper.js`
To: `public/script.js`
Path: Go up 5 levels (`../../../../../script.js`)

From: `public/scripts/extensions/third-party/SillyTavern-Tracker-Enhanced/src/ui/developmentTestUI.js`
To: `public/scripts/popup.js`
Path: Go up 5 levels to scripts (`../../../../../popup.js`)

### Common Import Mistakes and Fixes

#### 1. Wrong Module Sources
**Mistake**: Importing `humanizedDateTime` from `script.js`
**Fix**: Import from `RossAscends-mods.js` instead
```javascript
// Wrong
import { humanizedDateTime } from '../../../../../script.js';

// Correct
import { humanizedDateTime } from '../../../../RossAscends-mods.js';
```

#### 2. Incorrect DOM Selectors
**Mistake**: Using `extensionName` variable for DOM IDs when HTML uses different naming
**Fix**: Check actual HTML IDs in settings.html
```javascript
// Wrong
document.querySelector(`#${extensionName}_settings`); // looks for #tracker-enhanced_settings

// Correct
document.querySelector('#tracker_enhanced_settings'); // matches actual HTML ID
```

#### 3. Global Variables
**Note**: Some utilities like `toastr` are available globally in SillyTavern
```javascript
// Access global toastr
const toastr = window.toastr;
```

## Development Session Summary (2025-09-02)

### Objectives Completed

#### 1. Created SillyTavern Helper System
**Location**: `src/sillyTavernHelper.js`
- Comprehensive helper class for character and group management
- Methods for CRUD operations on characters using TavernCard V2 format
- Group management functions (create, add/remove members, convert solo to group)
- Proper API integration with authentication headers

#### 2. Added Test Data
**Location**: `src/settings/defaultSettings.js`
- `testTavernCardV2`: Complete character card with all fields for testing
- `testGroupData`: Group configuration for testing group operations
- Ready-to-use test data eliminates need for manual input during development

#### 3. Created Development Test UI
**Location**: `src/ui/developmentTestUI.js`
- Collapsible "Development Test" section in extension settings
- Organized buttons for all helper functions:
  - Character Management: Create, Read, Edit, Delete
  - Group Management: Create, Add/Remove Members, Convert to Group
  - Status Display: List characters/groups, show current status
- Built-in console for operation logging with timestamps
- Visual feedback through toastr notifications

#### 4. Fixed Extension Loading Issues
- Corrected import paths for SillyTavern modules
- Fixed module export issues (humanizedDateTime from correct source)
- Fixed DOM selector to match actual HTML structure
- Documented all import patterns for future reference

#### 5. Enhanced Group Integration with createAndJoin (Latest)
**Location**: `src/sillyTavernHelper.js:412-486`, `src/ui/developmentTestUI.js:82-85, 441-462`
- Added `createAndJoin` method that creates character and handles group integration automatically
- **Smart Context Handling**:
  - If in solo chat: Converts to group, switches to new group chat, adds character
  - If in group chat: Simply adds new character to current group
- **Chat Switching**: Integrates with SillyTavern's `openGroupById` for seamless group transition
- **Enhanced Development UI**: Added "Create & Join Group" test button with detailed logging
- **Comprehensive Error Handling**: Reports success/failure at each step with context
- **Return Values**: Provides detailed information about character creation, group status, and chat switching

### Key Learnings

1. **Import Path Structure**: Extensions in `third-party` folder need careful path calculation
2. **Module Exports**: Not all functions are in `script.js` - check actual export locations
3. **DOM Integration**: Always verify actual HTML IDs vs. variable-based assumptions
4. **Global Scope**: Some utilities (toastr) are globally available in SillyTavern
5. **Group Conversion Process**: SillyTavern's `convertSoloToGroupChat` and `openGroupById` work together to provide seamless chat switching - extensions should follow this pattern for consistent user experience

### Usage Instructions

1. Open SillyTavern and navigate to Extensions settings
2. Find "Tracker Enhanced" and expand it
3. Scroll down to find "Development Test" section
4. Use the buttons to test character/group operations
5. Monitor the console output for detailed logs

### Future Development Notes

- The helper class provides a clean API for any tracker features needing character/group interaction
- Test data can be extended for more complex scenarios
- Development UI can be hidden in production or moved to a debug mode
- All operations respect SillyTavern's data integrity and use proper APIs