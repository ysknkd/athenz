# Athenz UI Design System Documentation

## Overview
This document outlines the **Denali Design System** implementation in the Athenz UI project, identifies discrepancies with current components, and defines unified design principles.

**IMPORTANT: This project follows the Denali Design System standards. All UI components, styling patterns, and design decisions must comply with Denali guidelines.**

## Denali Design System Integration

The Denali Design System is a comprehensive CSS framework that provides standardized components and styling patterns. Based on investigation of the Denali repositories:

### Denali Architecture
- **Framework**: CSS class-based system (not styled-components)
- **Component Pattern**: HTML elements with Denali CSS classes
- **Example**: `<button class="button is-solid">Button</button>`
- **Repository**: https://github.com/denali-design/denali-css
- **Documentation**: https://denali-design.github.io/denali-css/

### Core Denali Principles
- **CSS Classes Over Styled Components**: Use Denali's predefined CSS classes instead of custom styled components
- **Semantic Class Naming**: Classes like `.button`, `.input`, `.is-solid`, `.is-outline` follow semantic patterns
- **Modifier Classes**: State and variant classes (`.is-small`, `.is-large`, `.is-disabled`) modify base components
- **SCSS Foundation**: Built on SCSS with comprehensive variable system and mixins

### Integration Requirements
- **Existing Athenz Components**: Must be gradually migrated from custom styled components to Denali CSS classes
- **New Components**: Should use Denali CSS classes from the start
- **Custom Styling**: Only when absolutely necessary and not covered by Denali patterns
- **Compliance Priority**: High - All pagination and form components must follow Denali patterns

The Denali Design System provides:
- Consistent visual language across all components
- Standardized interaction patterns and behaviors
- Accessible design patterns and color schemes
- Unified typography and spacing systems

## Core Design Tokens

### Color Palette

#### Brand Colors (Primary)
```javascript
brand800: '#3448f7'  // Dark blue - Active states
brand700: '#3570f4'  // Medium blue - Hover states  
brand600: '#3697f2'  // Primary blue - Main interactive elements
brand500: '#8ac5ed'  // Light blue
brand400: '#5d8cf6'  // 
brand300: '#9ab7f9'  // 
brand200: '#d7e2fd'  // Light backgrounds
brand100: '#f5f8fe'  // Subtle backgrounds
```

#### Neutral Colors
```javascript
grey800: '#303030'  // Primary text (black)
grey700: '#606060'  // Secondary text  
grey600: '#9a9a9a'  // Muted text, labels, table headers
grey500: '#d5d5d5'  // Borders, dividers
grey400: '#e8e8e8'  // Input borders, light borders
grey300: '#f2f2f2'  // Light backgrounds
grey200: '#f8f8f8'  // Subtle backgrounds
grey100: '#fff'     // Main backgrounds (white)
```

#### Status Colors
```javascript
statusDanger:  '#ea0000'  // Error states
statusWarning: '#f4cb00'  // Warning states
statusSuccess: '#15c046'  // Success states
statusInfo:    '#0066df'  // Information states
```

#### Athenz Specific Colors
```javascript
icons: '#188fff'      // Icon color
row: '#3570f40D'      // Table row alternating background (brand700 + 5% opacity)
buttonBlue: '#3697F2' // Button accent color
```

### Typography System

#### Font Families
```javascript
fontFamily: 'Helvetica, Arial, sans-serif'
fontFamilyMonospace: 'Droid Sans Mono, monospace'
```

#### Font Sizes
```javascript
title: '20px'     // Page titles, section headers
heading: '16px'   // Subsection headers
default: '14px'   // Main content text (STANDARD)
subtitle: '12px'  // Small labels, metadata
```

#### Font Weights
```javascript
normal: 300  // Regular text
bold: 600    // Emphasized text, headers
```

#### Standardized Font Styles
```css
/* Default Text Style - MOST COMMON */
font-family: Helvetica, Arial, sans-serif;
font-size: 14px;
font-weight: 300;

/* Title Style */
font-family: Helvetica, Arial, sans-serif;
font-size: 20px;
font-weight: 600;

/* Subtitle Style */
color: #9a9a9a;
font-size: 12px;
font-weight: 300;
text-transform: uppercase;
```

## Component Standards

### Button System

#### Button Sizes (Denali Standard)
```css
/* Large Button */
font-size: 18px;
padding: 12px 28px;

/* Regular Button (DEFAULT) */
font-size: 14px;
padding: 10px 24px;

/* Small Button */
font-size: 12px;
padding: 8px 18px;
min-width: 70px;
```

#### Button Properties
```css
border-radius: 2px;
margin: 5px;
margin-left: 0 (first button);
transition: all 0.2s ease-in;
line-height: 1;
font-family: Helvetica, Arial, sans-serif;
font-weight: 300;
```

#### Button Variants
- **Primary**: Blue gradient background (`brand600` to `brand700`) with white text
- **Secondary**: Transparent background with blue border (`brand600`)
- **Danger**: Red background with white text
- **Pagination**: Variant of secondary button for page navigation controls

### Input System

#### Input Dimensions
```css
/* Default Input */
height: 36px;
width: 250px (or 100% if fluid);
padding: 0 1rem;

/* Small Input */
height: 28px;
```

#### Input Styling
```css
background: rgba(brand700, 0.05); /* Very light blue tint */
border: 2px solid transparent;
border-radius: 2px;
font-size: 14px;

/* Focus State */
border: 2px solid #3570f4; /* brand700 */

/* Error State */
border: 2px solid #d01111; /* red600 */
```

### Table System

#### Table Structure
```css
/* Table Container */
width: 100%;
border-spacing: 0;
box-shadow: 0 1px 4px #d9d9d9;
border: 1px solid #fff;

/* Table Headers */
border-bottom: 2px solid #d5d5d5;
color: #9a9a9a; /* grey600 */
font-weight: 600;
text-transform: uppercase;
padding: 5px 0 5px 15px;

/* Table Rows */
padding: 5px 0 5px 15px;
/* Alternating background: #3570f40D (brand700 + 5% opacity) */
```

## Pagination Button Standards

### Standard Pagination Button (Must Follow Denali Secondary Button)

**IMPORTANT: Pagination buttons must comply with Denali Design System standards from `/src/components/denali/Button.js`**

**Usage**: Page numbers, navigation controls in pagination components

#### Design Tokens
```css
/* Non-active pagination button */
background: transparent;
border: 1px solid ${colors.brand600}; /* Blue border #3697f2 */
color: ${colors.brand600}; /* Blue text #3697f2 */
font-size: 14px;
padding: 8px 12px;
min-width: 32px;
border-radius: 4px;

/* Active pagination button */
background: ${colors.brand600}; /* Blue background #3697f2 */
color: ${colors.white}; /* White text */
border: 1px solid ${colors.brand600};

/* Hover state */
&:hover:not(:disabled) {
    background: ${colors.brand200}; /* Light blue background #d7e2fd */
    border-color: ${colors.brand600};
    color: ${colors.brand600}; /* Keep blue text on hover */
}

/* Focus state */
&:focus {
    outline: 2px solid ${colors.brand600};
    outline-offset: 2px;
}

/* Disabled state */
&:disabled {
    background: transparent;
    border-color: ${colors.grey400};
    color: ${colors.grey400};
    cursor: not-allowed;
    opacity: 0.5;
}
```

#### Denali Compliance Checklist
- ✅ Uses brand600 (#3697f2) for primary interactive color (matches Denali secondary button)
- ✅ Follows secondary button pattern from `/src/components/denali/Button.js`
- ✅ Includes Denali transition: `transition: all 0.2s ease-in`
- ✅ Maintains focus/hover state consistency with Denali standards
- ✅ 14px font size (Denali default)
- ✅ Transparent background for non-active state (Denali secondary pattern)
- ✅ Consistent padding with Denali button system

#### Alternative Implementation
```css
/* Alternative border implementation using Denali box-shadow pattern */
box-shadow: 0 0 0 1px ${colors.brand600} inset;
border: none;
```

### Navigation Button Standards

**Usage**: Previous/Next buttons in pagination

```css
/* Navigation button styling */
min-width: 80px; /* Wider for text + icon */
gap: 8px; /* Icon-text spacing */
display: flex;
align-items: center;
justify-content: center;

/* Same color scheme as pagination buttons */
background: transparent;
border: 1px solid ${colors.brand600};
color: ${colors.brand600};

/* Hover/focus states identical to pagination buttons */
```

## Current Pagination Issues

### Identified Inconsistencies

#### ✅ COMPLETED: Denali CSS Migration for Pagination Components
**Previous Issue**: Pagination components used custom styled components instead of Denali CSS classes

**✅ SUCCESSFULLY MIGRATED** (`/src/components/member/Pagination.js`):

**Denali Toggle System for Page Numbers**:
```javascript
// ✅ Current implementation using Denali toggle system
<div className="toggle is-small">
    <ul>
        {visiblePages.map((page) =>
            page === '...' ? (
                <Ellipsis key={`ellipsis-${index}`}>...</Ellipsis>
            ) : (
                <li
                    key={page}
                    className={page === currentPage ? 'is-active' : ''}
                    onClick={() => handlePageClick(page)}
                    role="button"
                    tabIndex={0}
                >
                    <a>{page}</a>
                </li>
            )
        )}
    </ul>
</div>
```

**Denali Navigation Buttons**:
```javascript
// ✅ Previous/Next buttons using Denali classes
<button
    className="button is-outline is-small"
    disabled={!hasPrevious}
    onClick={handlePreviousClick}
>
    <Icon icon='arrow-left' />
    Previous
</button>
```

**✅ Migration Achievements**:
- ✅ Replaced all styled components with standard HTML elements
- ✅ Applied proper Denali CSS classes (.toggle, .button, .is-outline, .is-small, .is-active)
- ✅ Implemented Denali toggle system for unified page number grouping
- ✅ Removed 100+ lines of custom CSS styling
- ✅ Achieved visual consistency with Denali Design System

#### ❌ CRITICAL: Missing Denali CSS Framework Integration
**Issue**: Project lacks proper Denali CSS framework integration

**Current State**:
- Components use Emotion styled-components with custom CSS
- No systematic use of Denali CSS classes
- Inconsistent styling patterns across components

**Required Integration**:
- Import Denali CSS framework stylesheets
- Convert styled components to HTML + CSS classes
- Establish Denali class naming conventions
- Update component architecture to use Denali patterns

#### ❌ HIGH: Inconsistent Button Styling Patterns
**Issue**: Pagination buttons don't follow Denali button system patterns

**Current Implementation**:
```css
/* ❌ Non-standard button patterns */
border: 1px solid ${colors.grey400}; /* Gray border */
color: ${colors.grey800}; /* Black text */
background: ${colors.grey100}; /* Light gray background */
```

**Denali Standard**:
```css
/* ✅ Standard Denali button classes */
.button.is-outline {
    border: 1px solid ${colors.brand600}; /* Blue border */
    color: ${colors.brand600}; /* Blue text */
    background: transparent; /* Transparent background */
}

.button.is-solid {
    background: ${colors.brand600}; /* Blue active background */
    color: ${colors.white}; /* White text */
}
```

#### Font Size Misalignment
**Issue**: Previously identified - All elements now standardized to 14px ✅

**Denali Standard**:
```css
/* All standard UI elements should use */
font-size: 14px; /* ✅ Default font size */
```

#### Button Size Inconsistency
**Issue**: Pagination buttons don't follow Denali button sizing

**Current Implementation**:
```css
/* Pagination Buttons - In Table */
height: 30px;
padding: 6px 10px;
/* ❌ Non-standard dimensions */
```

**Denali Standard**:
```css
/* Small Button Standard */
font-size: 12px;
padding: 8px 18px;
min-width: 70px;

/* Regular Button Standard (RECOMMENDED) */
font-size: 14px;
padding: 10px 24px;
```

#### Color Usage Inconsistency
**Issue**: Mixed use of hardcoded colors vs. design tokens

**Current Implementation**:
```css
/* Mixed approach */
color: '#9a9a9a';     /* ✅ Matches grey600 */
color: '#6c757d';     /* ❌ Not in Denali palette */
color: '#495057';     /* ❌ Not in Denali palette */
background: '#ffffff'; /* ✅ Matches grey100 */
border: '#d5d5d5';    /* ✅ Matches grey500 */
```

**Recommended Denali Tokens**:
```css
/* Use design system tokens */
color: colors.grey600;     /* #9a9a9a */
color: colors.grey700;     /* #606060 - for better contrast */
color: colors.grey800;     /* #303030 - for primary text */
background: colors.grey100; /* #fff */
border: colors.grey500;    /* #d5d5d5 */
```

## Spacing System

### Standard Spacings
```css
/* Micro spacing */
2px-4px  /* Compact layouts, tight elements */

/* Small spacing */
5px-8px  /* Close related elements */

/* Medium spacing (MOST COMMON) */
10px-15px /* Standard spacing between components */

/* Large spacing */
20px-28px /* Section separation */

/* XL spacing */
35px+     /* Major section separation */
```

### Component-Specific Spacing
```css
/* Button margin */
margin: 5px;
margin-left: 0; /* first button */

/* Input padding */
padding: 0 1rem; /* 16px horizontal */

/* Table cell padding */
padding: 5px 0 5px 15px;

/* Modal padding */
padding: 0 20px; /* header */
padding: 6px 10px; /* content */
```

## Denali Migration Plan for Pagination Components

### ✅ COMPLETED: Phase 1 - Denali CSS Classes Migration

#### ✅ Successfully Implemented Migration
The `/src/components/member/Pagination.js` has been fully migrated to Denali CSS classes:

**✅ BEFORE**: Custom styled components:
```javascript
// ❌ Old: Custom styled components (REMOVED)
const PaginationButton = styled.button`...`;
const NavigationButton = styled.button`...`;
```

**✅ AFTER**: Denali CSS classes implementation:
```javascript
// ✅ Current: Denali toggle system for page numbers
<div className="toggle is-small">
    <ul>
        <li className={currentPage === page ? 'is-active' : ''}>
            <a>{page}</a>
        </li>
    </ul>
</div>

// ✅ Current: Denali navigation buttons
<button className="button is-outline is-small">Previous</button>
<button className="button is-outline is-small">Next</button>
```

### ✅ COMPLETED: Phase 2 - Denali Toggle System Implementation

#### ✅ Implemented Solution: Denali Toggle System
Instead of individual buttons, pagination now uses the superior Denali toggle system:

**✅ Current Implementation - Denali Toggle System**:
```html
<div className="toggle is-small">
    <ul>
        <li className="is-active">
            <a>2</a>  <!-- Current page -->
        </li>
        <li>
            <a>3</a>  <!-- Other pages -->
        </li>
    </ul>
</div>
```

**Benefits of Toggle System over Individual Buttons**:
- ✅ **Visual Unity**: Page numbers appear as a cohesive grouped element
- ✅ **Framework Compliance**: Uses Denali's official toggle component
- ✅ **Better UX**: Clear visual grouping shows these elements work together
- ✅ **Consistent Styling**: Automatic hover and active states from Denali CSS

**Navigation Buttons (Separate from Toggle)**:
```html
<button className="button is-outline is-small" disabled={isFirstPage}>
  <Icon icon='arrow-left' />
  Previous
</button>
```
- Navigation buttons remain as individual Denali buttons
- `button`: Base Denali button class
- `is-outline`: Transparent background with brand border
- `is-small`: Small size variant for compact layout

### ✅ COMPLETED: Phase 3 - Denali Transition Integration

#### ✅ Automatic Transitions Implemented
Denali CSS provides built-in transitions that are now active:

**✅ Benefits Realized**:
- ✅ **No custom CSS needed** - All transitions handled by Denali framework
- ✅ **Consistent timing** - 300ms transitions across all interactive elements
- ✅ **Automatic state management** - Hover, focus, and active states work out-of-box
- ✅ **Built-in accessibility** - Proper disabled state handling and ARIA support

**Toggle System Transitions**:
```scss
// Denali toggle provides smooth transitions for:
.toggle li:hover,     // Hover state
.toggle li.is-active, // Active state
.toggle li:focus      // Focus state
```

**Button Transitions**:
```scss
// Navigation buttons inherit Denali button transitions:
.button:hover,        // Hover effects
.button:focus,        // Focus rings  
.button:disabled      // Disabled state
```

### Phase 4: Implementation Steps

#### Step 1: Component Conversion
```javascript
// Replace styled components with standard HTML
const renderPageButton = (page, isActive) => (
  <button
    key={page}
    className={`button ${isActive ? 'is-solid' : 'is-outline'} is-small`}
    onClick={() => onPageChange(page)}
    disabled={disabled}
    aria-current={isActive ? 'page' : undefined}
    data-testid={testId ? `${testId}-page-${page}` : undefined}
  >
    {page}
  </button>
);
```

#### Step 2: Navigation Button Conversion
```javascript
const renderNavigationButton = (direction, isDisabled, onClick) => (
  <button
    className="button is-outline is-small"
    onClick={onClick}
    disabled={isDisabled || disabled}
    aria-label={`Go to ${direction} page`}
    data-testid={testId ? `${testId}-${direction.toLowerCase()}` : undefined}
  >
    {direction}
  </button>
);
```

#### Step 3: Remove Custom Styled Components
```javascript
// ❌ DELETE: All styled component definitions
// const PaginationButton = styled.button`...`;
// const NavigationButton = styled.button`...`;
// const PaginationContainer = styled.div`...`;
```

#### Step 4: Update Container Styling
```javascript
// ✅ Simple container with minimal styling
const PaginationContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
`;
```

### Phase 5: Benefits of Denali Migration

#### Immediate Benefits
- ✅ **Consistent Transitions**: Automatic 300ms background transitions
- ✅ **Standard Styling**: Follows Denali brand colors and patterns
- ✅ **Reduced Code**: Eliminates 100+ lines of custom CSS
- ✅ **Better Accessibility**: Built-in focus states and ARIA patterns

#### Long-term Benefits  
- ✅ **Maintainability**: Uses framework-standard components
- ✅ **Consistency**: Matches other Denali buttons in the application
- ✅ **Updates**: Automatically inherits Denali framework improvements
- ✅ **Performance**: Leverages optimized CSS instead of runtime styled components

### Phase 6: Testing Strategy

#### Visual Testing
1. Compare button appearance with other Denali buttons
2. Verify hover/focus transitions work smoothly
3. Test active/inactive state visual differences
4. Validate disabled state appearance

#### Functional Testing
1. Ensure all click handlers work correctly
2. Verify keyboard navigation (Tab, Enter, Space)
3. Test screen reader announcements
4. Validate page change functionality

#### Integration Testing
1. Test with different pagination configurations
2. Verify responsive behavior
3. Check with various item counts and page sizes
4. Test error states and edge cases

## Implementation Guidelines

### Denali Design System Compliance

**All components must follow Denali Design System standards:**

### For New Components
1. **Always use Denali design tokens** instead of hardcoded values
2. **Follow Denali font sizing**: 14px default, 12px for small, 16px for headings, 20px for titles
3. **Use Denali button dimensions** from the standard button system (`/src/components/denali/Button.js`)
4. **Apply Denali spacing system** for consistent layouts
5. **Use Denali semantic color mappings** (grey600 for muted text, grey800 for primary text)
6. **Include Denali transition effects**: `transition: all 0.2s ease-in` for interactive elements

### For Existing Components
1. **Audit against Denali standards** - Check font sizes, colors, spacing, transitions
2. **Replace hardcoded values** with Denali design tokens from `/src/components/denali/styles/`
3. **Align with Denali button system** - Use consistent dimensions and behaviors
4. **Standardize interactions** - Ensure hover, focus, and active states match Denali patterns

### Testing Consistency
1. **Visual comparison** with existing Denali components
2. **Cross-component alignment** check
3. **Responsive behavior** validation
4. **Accessibility compliance** verification

## Migration Strategy

### Phase 1: Font Standardization
- Update all pagination text to 14px (Denali default)
- Ensure font-family consistency
- Standardize font-weights

### Phase 2: Button Alignment
- Align pagination buttons with Denali button dimensions
- Standardize padding and margins
- Ensure consistent min-width

### Phase 3: Color Token Migration
- Replace hardcoded colors with design tokens
- Ensure semantic color usage
- Validate contrast ratios

### Phase 4: Spacing Harmonization
- Apply standard spacing units
- Ensure consistent gaps and margins
- Validate responsive behavior

## UI Simplification Guidelines

### Progressive Simplification Principles

Based on successful MemberFilter component simplification, these guidelines help reduce visual noise while maintaining functionality:

#### Visual Noise Reduction Patterns
```css
/* BEFORE: Visual clutter */
.filter-container {
    border: 1px solid ${colors.grey400};
    background: ${colors.grey100};
    padding: 12px;
    display: flex;
    gap: 8px;
}

/* AFTER: Clean, minimal design */
.filter-container {
    margin-bottom: 16px;
    max-width: 400px;
}
```

#### Simplification Checklist
- ✅ **Remove unnecessary borders** - Only use borders when they provide semantic value
- ✅ **Eliminate redundant visual elements** - Remove member counts, status indicators if not essential
- ✅ **Consolidate action buttons** - Prefer keyboard shortcuts over visible buttons when appropriate
- ✅ **Preserve core functionality** - Ensure simplification doesn't remove necessary features
- ✅ **Maintain accessibility** - All features must remain accessible via keyboard/screen reader

### Button Elimination Strategy

When removing UI buttons, ensure alternative access methods:

```javascript
// ✅ GOOD: Replace visible clear button with keyboard shortcut
const handleKeyDown = (event) => {
    if (event.key === 'Escape' && value && onChange) {
        onChange('');
        event.preventDefault();
    }
};

// ❌ BAD: Removing functionality entirely
// <ClearButton onClick={onClear}>Clear</ClearButton> // Just delete
```

#### Alternative Interaction Patterns
- **Escape key**: Clear/cancel operations
- **Enter key**: Submit/confirm operations  
- **Arrow keys**: Navigation within components
- **Tab/Shift+Tab**: Focus management

## Filter Component Patterns

### Simple Filter Design

The MemberFilter component demonstrates the ideal filter pattern:

#### Core Structure
```javascript
// ✅ Minimal prop interface
const SimpleFilter = ({
    value,           // Current filter text
    onChange,        // Filter change handler
    testId,          // Testing identifier
    disabled,        // Disabled state
}) => {
    const handleKeyDown = (event) => {
        if (event.key === 'Escape' && value && onChange) {
            onChange('');
            event.preventDefault();
        }
    };

    return (
        <FilterContainer data-testid={testId}>
            <SearchInput
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={PLACEHOLDER_TEXT}
                aria-label={`${ARIA_LABEL}${value ? ' (filtered)' : ''}`}
                disabled={disabled}
                fluid
            />
        </FilterContainer>
    );
};
```

#### Filter Design Principles
1. **Single input focus** - One search input, no additional controls
2. **Keyboard-first interaction** - Escape to clear, immediate typing to filter
3. **Dynamic accessibility** - Update aria-labels based on filter state
4. **Minimal visual footprint** - No borders, backgrounds, or extra decorations
5. **Immediate feedback** - Filter on every keystroke, no submit button needed

### Filter State Management

Use custom hooks to encapsulate filter logic:

```javascript
// ✅ Encapsulated filter logic
const useMemberFilter = (data, initialFilter = '') => {
    const [filterText, setFilterText] = useState(initialFilter);
    
    const filteredMembers = useMemo(() => 
        data.filter(member => 
            member.memberName.toLowerCase().includes(filterText.toLowerCase()) ||
            (member.memberFullName && member.memberFullName.toLowerCase().includes(filterText.toLowerCase()))
        ),
        [data, filterText]
    );
    
    const clearFilter = useCallback(() => setFilterText(''), []);
    
    return {
        filterText,
        setFilterText,
        clearFilter,
        filteredMembers,
        hasFilter: filterText.length > 0,
    };
};
```

## Component API Design Principles

### Prop Interface Minimization

Based on MemberFilter simplification:

#### Before: Complex Interface
```javascript
// ❌ Too many props expose internal complexity
<MemberFilter
    value={filterText}
    onChange={setFilterText}
    onClear={clearFilter}        // ❌ Internal logic exposed
    hasFilter={hasFilter}        // ❌ Derived state exposed
    totalMembers={total}         // ❌ Display logic exposed  
    filteredCount={filtered}     // ❌ Display logic exposed
    testId="member-filter"
/>
```

#### After: Minimal Interface
```javascript
// ✅ Clean, focused interface
<MemberFilter
    value={filterText}           // ✅ Essential data
    onChange={setFilterText}     // ✅ Essential handler
    testId="member-filter"       // ✅ Testing support
    disabled={loading}           // ✅ State indicator
/>
```

#### API Design Guidelines
1. **Essential props only** - Expose only what parent components need to control
2. **Hide implementation details** - Keep internal state management hidden
3. **Combine related props** - Use objects for related configuration
4. **Prefer callback patterns** - Use onChange over separate onX handlers
5. **Support testing** - Always include testId support

### Progressive Enhancement Patterns

Build components with progressive enhancement:

```javascript
// ✅ Progressive enhancement approach
const AdvancedFilter = ({ basic, enhanced = false }) => {
    return (
        <div>
            {/* Core functionality always available */}
            <SearchInput {...basic} />
            
            {/* Enhanced features only when needed */}
            {enhanced && (
                <>
                    <FilterOptions />
                    <SortControls />
                    <SavedFilters />
                </>
            )}
        </div>
    );
};
```

## Accessibility-First Interaction Patterns

### Dynamic ARIA Labels

Update accessibility attributes based on component state:

```javascript
// ✅ Dynamic accessibility
const getAriaLabel = (baseLabel, isFiltered) => 
    `${baseLabel}${isFiltered ? ' (filtered)' : ''}`;

<SearchInput
    aria-label={getAriaLabel('Filter members by name', hasFilter)}
    placeholder="Filter members by name"
/>
```

### Keyboard Navigation Standards

#### Essential Keyboard Shortcuts
- **Escape**: Clear/cancel current operation
- **Enter**: Submit/confirm current operation
- **Arrow keys**: Navigate within component
- **Tab/Shift+Tab**: Move between components
- **Space**: Activate buttons/toggles

#### Implementation Pattern
```javascript
const handleKeyDown = (event) => {
    switch (event.key) {
        case 'Escape':
            if (hasValue && onClear) {
                onClear();
                event.preventDefault();
            }
            break;
        case 'Enter':
            if (hasValue && onSubmit) {
                onSubmit();
                event.preventDefault();
            }
            break;
        // Additional shortcuts as needed
    }
};
```

### Screen Reader Support

Ensure all interactive elements are properly announced:

```javascript
// ✅ Proper screen reader support
<SearchInput
    role="searchbox"
    aria-label="Filter members by name"
    aria-describedby={hasError ? 'error-message' : 'help-text'}
    aria-invalid={hasError}
/>
```

## Testing Strategies for Simplified Components

### Test Approach Evolution

When simplifying components, update tests to focus on user behavior:

#### Before: Implementation-Focused Tests
```javascript
// ❌ Testing internal implementation
expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument();
expect(mockOnClear).toHaveBeenCalled();
```

#### After: Behavior-Focused Tests  
```javascript
// ✅ Testing user behavior
const input = screen.getByPlaceholderText('Filter members by name');
fireEvent.keyDown(input, { key: 'Escape' });
expect(input.value).toBe('');
```

### Test Migration Strategy

1. **Identify behavior tests** - Keep tests that verify user-facing behavior
2. **Remove implementation tests** - Delete tests tied to removed UI elements
3. **Update interaction tests** - Change from button clicks to keyboard events
4. **Preserve accessibility tests** - Ensure ARIA attributes and keyboard navigation work
5. **Maintain integration tests** - Verify component works within larger contexts

## Denali Toggle System Implementation Pattern

### Overview

The Denali toggle system provides a unified grouped interface for related interactive elements. This is superior to individual buttons when elements are conceptually related (like pagination numbers).

### Basic Toggle Structure

#### HTML Pattern
```html
<div class="toggle">
    <ul>
        <li><a>Option 1</a></li>
        <li class="is-active"><a>Option 2</a></li>
        <li><a>Option 3</a></li>
        <li class="is-disabled"><a>Option 4</a></li>
    </ul>
</div>
```

#### React Implementation Pattern
```javascript
const DenaliToggle = ({ options, activeOption, onOptionSelect, size = 'normal' }) => {
    return (
        <div className={`toggle ${size === 'small' ? 'is-small' : ''}`}>
            <ul>
                {options.map((option) => (
                    <li
                        key={option.value}
                        className={option.value === activeOption ? 'is-active' : ''}
                        onClick={() => onOptionSelect(option.value)}
                        role="button"
                        tabIndex={0}
                        aria-current={option.value === activeOption ? 'page' : undefined}
                    >
                        <a>{option.label}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};
```

### Toggle Variants

#### Size Variants
```html
<!-- Normal Toggle -->
<div class="toggle">
    <ul>...</ul>
</div>

<!-- Small Toggle (for compact layouts) -->
<div class="toggle is-small">
    <ul>...</ul>
</div>
```

#### State Classes
- `is-active`: Currently selected/active option
- `is-disabled`: Disabled option (non-interactive)

### Pagination-Specific Implementation

#### Complete Pagination Toggle
```javascript
const PaginationToggle = ({ 
    visiblePages, 
    currentPage, 
    onPageClick, 
    disabled = false 
}) => {
    return (
        <div className="toggle is-small">
            <ul>
                {visiblePages.map((page, index) =>
                    page === '...' ? (
                        <EllipsisSpan key={`ellipsis-${index}`}>...</EllipsisSpan>
                    ) : (
                        <li
                            key={page}
                            className={page === currentPage ? 'is-active' : ''}
                            onClick={() => !disabled && onPageClick(page)}
                            onKeyDown={(e) => {
                                if ((e.key === 'Enter' || e.key === ' ') && !disabled) {
                                    onPageClick(page);
                                    e.preventDefault();
                                }
                            }}
                            role="button"
                            tabIndex={disabled ? -1 : 0}
                            aria-label={`Page ${page}`}
                            aria-current={page === currentPage ? 'page' : undefined}
                            aria-disabled={disabled}
                        >
                            <a>{page}</a>
                        </li>
                    )
                )}
            </ul>
        </div>
    );
};
```

### Best Practices

#### When to Use Toggle System
- **Related Options**: When elements represent related choices (pagination numbers, tab navigation)
- **Single Selection**: When only one option can be active at a time
- **Visual Grouping**: When you want to show elements work together conceptually

#### When NOT to Use Toggle System
- **Independent Actions**: For unrelated actions (Save, Cancel, Delete)
- **Multiple Selection**: When users can select multiple options
- **Complex Interactions**: When elements need individual styling or behavior

#### Accessibility Requirements
```javascript
// Essential ARIA attributes for toggles
<li
    role="button"                    // Identifies as interactive element
    tabIndex={0}                     // Makes keyboard accessible
    aria-current="page"              // Identifies current selection (pagination)
    aria-label="Page 3"             // Descriptive label for screen readers
    aria-disabled={disabled}         // Indicates disabled state
>
```

#### Keyboard Navigation
```javascript
const handleKeyDown = (event, action) => {
    switch (event.key) {
        case 'Enter':
        case ' ':                    // Space key
            action();
            event.preventDefault();
            break;
        case 'ArrowLeft':           // Navigate within toggle
        case 'ArrowRight':
            // Handle arrow key navigation between options
            break;
    }
};
```

### Implementation Guidelines

#### Toggle vs Buttons Decision Matrix
| Use Case | Toggle System | Individual Buttons |
|----------|---------------|-------------------|
| Pagination numbers | ✅ Preferred | ❌ Avoid |
| Tab navigation | ✅ Preferred | ❌ Avoid |
| Action buttons | ❌ Avoid | ✅ Preferred |
| Form controls | ❌ Avoid | ✅ Preferred |
| Toolbar actions | ❌ Avoid | ✅ Preferred |

#### Migration Strategy
1. **Identify Related Elements**: Look for groups of buttons that represent related choices
2. **Check Denali Components**: Verify if toggle system applies to your use case
3. **Convert Structure**: Replace individual buttons with toggle HTML structure
4. **Update Interactions**: Modify click handlers and keyboard navigation
5. **Test Accessibility**: Ensure ARIA attributes and keyboard navigation work correctly

This design system documentation serves as the foundation for maintaining visual consistency across the Athenz UI, ensuring that all components follow established patterns and provide a cohesive user experience.