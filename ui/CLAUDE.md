# Athenz UI - Claude Development Guide

## Project Overview

Athenz UI is a React-based interface for managing Athenz domains, roles, policies, services, and access control. Built with Next.js, it provides a comprehensive UI for the Athenz authorization system.

**IMPORTANT: All source code must be written in English only:**
- Variable names, function names, class names
- Comments and documentation
- String literals and error messages
- API endpoints and parameters
- Configuration keys and values
- Test descriptions

**For UI design guidelines, styling patterns, and component standards, see [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md).**

## Architecture

### Technology Stack
- **Frontend**: React 18.2.0, Next.js 14.2.26
- **State Management**: Redux Toolkit with Redux Thunk
- **Styling**: Emotion CSS-in-JS, Denali Design System
- **Testing**: Jest with React Testing Library
- **Build Tools**: Next.js, Webpack

### Project Structure
```
/
├── src/
│   ├── components/          # Reusable React components
│   │   ├── constants/       # Application constants
│   │   ├── denali/         # Denali design system components
│   │   ├── domain/         # Domain management components
│   │   ├── group/          # Group management components
│   │   ├── header/         # Header and navigation components
│   │   ├── member/         # Member management components
│   │   ├── microsegmentation/ # Network segmentation components
│   │   ├── modal/          # Modal dialogs
│   │   ├── policy/         # Policy management components
│   │   ├── role/           # Role management components
│   │   ├── service/        # Service management components
│   │   └── utils/          # Utility functions
│   ├── config/             # Configuration files
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Next.js pages (file-based routing)
│   ├── redux/              # Redux store, actions, reducers, selectors
│   ├── server/             # Express server components
│   └── __tests__/          # Test files
├── static/                 # Static assets
└── keys/                   # SSL certificates and keys
```

## Configuration

### Primary Configuration Files

#### 1. `/src/config/default-config.js`
Main configuration file with environment-specific settings:
- **Server URLs**: ZMS, ZTS, MSD, UMS endpoints
- **Authentication**: Cookie settings, auth headers, SSL configuration
- **UI Settings**: Header links, user data, feature flags
- **Security**: CSRF, CSP, cipher suites
- **Templates**: Available domain templates

Key configuration sections:
```javascript
const config = {
    local: {
        zms: process.env.ZMS_SERVER_URL || 'https://localhost:4443/zms/v1/',
        authHeader: 'Athenz-Principal-Auth',
        cookieName: 'Athenz-Principal-Auth',
        featureFlag: true,
        pageFeatureFlag: {
            microsegmentation: { policyValidation: true },
            roleGroupReview: { roleGroupReviewFeatureFlag: true }
        }
    },
    unittest: { /* test-specific config */ }
}
```

#### 2. `/src/config/config.js`
Configuration loader that:
- Loads default configuration
- Merges with optional `extended-config.js` (if exists)
- Supports environment-based configuration via `APP_ENV`

#### 3. Service Configuration Files
- `/src/config/zms.json` - ZMS service configuration
- `/src/config/zts.json` - ZTS service configuration  
- `/src/config/msd.json` - MSD service configuration
- `/src/config/ums.json` - UMS service configuration

### Environment Variables
- `APP_ENV` - Environment (local, unittest, production)
- `ZMS_SERVER_URL` - ZMS server endpoint
- `ZTS_LOGIN_URL` - ZTS login endpoint
- `MSD_LOGIN_URL` - MSD login endpoint
- `UMS_LOGIN_URL` - UMS login endpoint
- `PORT` - Server port (default: 443)
- `NODE_ENV` - Node environment
- `NEXT_PUBLIC_USER_DOMAIN` - Public user domain

## String Literals and Constants

### Primary Constants File: `/src/components/constants/constants.js`

#### UI Constants
```javascript
export const MODAL_TIME_OUT = 2000;
export const DISPLAY_SPACE = '\u23b5';
export const USER_DOMAIN = process.env.NEXT_PUBLIC_USER_DOMAIN || 'user';
export const DELETE_AUDIT_REFERENCE = 'deleted using Athenz UI';
```

#### Pagination Constants
```javascript
export const PAGINATION_DEFAULT_ITEMS_PER_PAGE = 30;
export const PAGINATION_ITEMS_PER_PAGE_OPTIONS = [30, 50, 100];
export const PAGINATION_SHOW_THRESHOLD = 30;
export const PAGINATION_MAX_VISIBLE_PAGES = 5;

// Pagination UI Labels
export const PAGINATION_ITEMS_PER_PAGE_LABEL = 'Show';
export const PAGINATION_PER_PAGE_SUFFIX = 'per page';
export const PAGINATION_SHOWING_TEXT = 'Showing';
export const PAGINATION_OF_TEXT = 'of';
export const PAGINATION_MEMBERS_TEXT = 'members';
export const PAGINATION_PREVIOUS_TEXT = 'Previous';
export const PAGINATION_NEXT_TEXT = 'Next';
```

#### Service Types
```javascript
export const SERVICE_TYPE_DYNAMIC = 'dynamic';
export const SERVICE_TYPE_STATIC = 'static';
export const SERVICE_TYPE_MICROSEGMENTATION = 'microsegmentation';
export const SERVICE_TYPE_MICROSEGMENTATION_LABEL = 'Microsegmentation';
export const SERVICE_TYPE_DYNAMIC_LABEL = 'Dynamic Instances';
export const SERVICE_TYPE_STATIC_LABEL = 'Static Instances';
```

#### Segmentation Constants
```javascript
export const SEGMENTATION_TYPE_OUTBOUND = 'outbound';
export const SEGMENTATION_TYPE_INBOUND = 'inbound';
export const SEGMENTATION_PROTOCOL_TYPE_TCP = 'TCP';
export const SEGMENTATION_PROTOCOL_TYPE_UDP = 'UDP';
```

#### Validation Patterns and Regex
```javascript
export const GROUP_NAME_REGEX = '([a-zA-Z0-9_][a-zA-Z0-9_-]*\\.)*[a-zA-Z0-9_][a-zA-Z0-9_-]*';
export const GROUP_MEMBER_NAME_REGEX = '([a-zA-Z0-9_][a-zA-Z0-9_-]*\\.)*[a-zA-Z0-9_][a-zA-Z0-9_-]*';
export const MICROSEGMENTATION_SERVICE_NAME_REGEX = '\\*|([a-zA-Z0-9_][a-zA-Z0-9_-]*\\.)*[a-zA-Z0-9_][a-zA-Z0-9_-]*';
```

#### Static Workload Types
```javascript
export const StaticWorkloadType = [
    { name: 'VIP', value: 'VIP', pattern: '...' },
    { name: 'Enterprise Appliance', value: 'ENTERPRISE_APPLIANCE', pattern: '...' },
    // ... see constants.js for complete list
];
```

#### Workflow and UI Labels
```javascript
export const WORKFLOW_PENDING_MEMBERS_APPROVAL_ADMIN_VIEW_TAB = 'Pending Members Approval (Admin View)';
export const WORKFLOW_PENDING_MEMBERS_APPROVAL_DOMAIN_VIEW_TAB = 'Pending Members Approval (Domain View)';
export const WORKFLOW_TITLE = 'Action Required';
```

#### Form Placeholders and Descriptions
```javascript
export const GROUP_MEMBER_PLACEHOLDER = `${USER_DOMAIN}.<userid> or <domain>.<service>`;
export const ADD_ROLE_MEMBER_PLACEHOLDER = `${USER_DOMAIN}.<userid> or <domain>.<service> or <domain>:group.<group>`;
export const ADD_ROLE_JUSTIFICATION_PLACEHOLDER = 'Enter justification here';
```

#### Enums and States
```javascript
export const PENDING_APPROVAL_TYPE_ENUM = Object.freeze({
    EXPIRY: 'expiry',
    REVIEW: 'review',
});

export const PENDING_STATE_ENUM = Object.freeze({
    ADD: 'ADD',
    DELETE: 'DELETE',
});
```


## Development Commands

### Available Scripts
```bash
# Development
npm run dev              # Start development server with debug
npm run build           # Production build
npm start              # Start production server

# Testing
npm test               # Run unit tests with coverage
npm run regen-snap     # Update Jest snapshots
npm run single-test    # Run specific test
npm run ci-unit-test   # CI unit tests

# Code Quality
npm run fix-lint       # Format code with Prettier
npm run ci-lint        # Check code formatting

# Functional Testing
npm run functional     # Run WebDriver tests
npm run func:local:ui  # Run local functional tests
```

### Development Setup
1. Install dependencies: `npm install`
2. Set up SSL certificates in `/keys/` directory
3. Configure environment variables
4. Start development server: `npm run dev`
5. Access at `https://localhost:443`

## Testing Strategy

### Unit Tests
- Located in `/src/__tests__/`
- Uses Jest + React Testing Library
- Update snapshots after UI changes: `npm run regen-snap`
- Mock data in `/src/mock/`

### Functional Tests
- WebDriver-based tests in `/src/__tests__/spec/`
- Cross-browser testing support

## Key Features

- **Domain Management**: Create and manage Athenz domains, templates, settings
- **Access Control**: Role-based access control (RBAC), policy management, group management
- **Member Management**: Member lists with expiration/review, pagination support
- **Service Management**: Service registration, dynamic/static instances, microsegmentation
- **Workflow Management**: Pending approval workflows, review processes, audit trails
- **Security**: SSL/TLS encryption, CSRF protection, Athenz token authentication

## API Integration

- **ZMS (AuthoriZation Management System)**: Domain, role, policy management
- **ZTS (AuthoriZation Token Service)**: Token generation and validation

## Customization

### Extending Configuration
Create `/src/config/extended-config.js` to override default settings:
```javascript
module.exports = function() {
    return {
        // Custom configuration overrides
        customFeature: true,
        headerLinks: [...],
    };
};
```

### Adding New Constants
Add new constants to `/src/components/constants/constants.js` following the existing patterns:
```javascript
export const NEW_FEATURE_CONSTANT = 'value';
export const NEW_FEATURE_REGEX = /pattern/;
```

### Feature Flags

#### Global Feature Flags
Control application-wide features via `default-config.js`:
```javascript
featureFlag: true  // Global enable/disable
```

#### Page-Specific Feature Flags
Control features per page using the `pageFeatureFlag` pattern:
```javascript
pageFeatureFlag: {
    newFeature: {
        enabled: true
    }
}
```

**Important**: Page feature flags require different handling than global configuration:
- **Access Pattern**: Use `api.getPageFeatureFlag('pageName')` instead of Redux selectors
- **Component Integration**: Store in local component state with useEffect
- **Error Handling**: Always provide fallback values for failed API calls

### Configuration Architecture

**Dual configuration system**:
1. **Server-Side**: Global settings, feature flags in `default-config.js`
2. **Client-Side**: Access via Redux (`headerDetails`, `featureFlag`) or direct API calls (`pageFeatureFlag`)

**Critical Implementation Pattern**:
```javascript
// ✅ CORRECT: Page feature flag access
useEffect(() => {
    let isMounted = true;
    
    api.getPageFeatureFlag('pageName')
        .then((data) => {
            if (isMounted && data && typeof data.featureName === 'boolean') {
                setFeatureEnabled(data.featureName);
            }
        })
        .catch(() => {
            if (isMounted) {
                setFeatureEnabled(true); // Fail-safe default
            }
        });
        
    return () => { isMounted = false; };
}, []);
```

## Development Best Practices

### Component Development Guidelines

#### Custom Hooks
- Place in `/src/hooks/` with descriptive names starting with `use`
- Include comprehensive unit tests
- Document parameters and return values

**Critical React Hooks Rules**:
- Never use conditional early returns - always call hooks in same order
- Handle conditional logic inside hook functions
- Maintain hook call consistency across renders

```javascript
// ❌ WRONG: Conditional early return violates Hook rules
export const useFeature = (enabled) => {
    if (!enabled) {
        return { disabled: true }; // Violates Hook rules!
    }
    const [state] = useState(); // Hooks called conditionally
    // ...
};

// ✅ CORRECT: Conditional logic inside hook functions
export const useFeature = (enabled) => {
    const [state] = useState(); // Always called
    
    const result = useMemo(() => {
        if (!enabled) {
            return { disabled: true };
        }
        // Normal processing
    }, [enabled, state]);
    
    return result;
};
```

#### Reusable UI Components

**CRITICAL: Denali Design System Priority**
- **Always use Denali CSS classes over custom styled components**
- Prefer Denali's prepared styles instead of creating independent CSS
- Only use Emotion CSS-in-JS when Denali doesn't provide equivalent functionality
- **Migration Priority**: Convert existing styled components to Denali CSS classes

**Implementation Requirements**:
- **Follow the Denali Design System** - See [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) for implementation details
- All components must comply with Denali standards for colors, typography, spacing, and interactions
- Use Denali CSS classes: `.button`, `.input`, `.toggle`, `.is-solid`, `.is-outline`, `.is-small`, etc.
- Implement proper accessibility (ARIA labels, keyboard navigation)
- Include `testId` props for testing

**Denali CSS Class Examples**:
```javascript
// ✅ CORRECT: Using Denali CSS classes
<button className="button is-outline is-small">
    Click me
</button>

<div className="input has-arrow">
    <select>...</select>
</div>

<div className="toggle is-small">
    <ul>
        <li className="is-active"><a>Active</a></li>
        <li><a>Inactive</a></li>
    </ul>
</div>

// ❌ WRONG: Custom styled components when Denali exists
const CustomButton = styled.button`
    background: #fff;
    border: 1px solid #ccc;
    // ... custom styles
`;
```

#### Testing Strategy
- Follow Test-Driven Development (TDD) for new features
- Achieve high test coverage (90%+ for new components)
- Use React Testing Library for component testing
- Test edge cases and error conditions

**Best Practices**:
- Always provide `testId` props for deterministic testing
- Test hooks separately from UI components when debugging
- Use React DevTools to inspect hook states and re-render causes

#### State Management Best Practices

**useEffect Dependencies**:
```javascript
// ❌ BAD - causes unnecessary re-renders
useEffect(() => {
    setCurrentPage(1);
}, [data]);

// ✅ GOOD - only reacts to data length changes
useEffect(() => {
    setCurrentPage(1);
}, [data.length]);
```

**Array Reference Stability**:
```javascript
// ✅ Always memoize sort operations
const sortedData = useMemo(() => 
    [...data].sort((a, b) => a.name.localeCompare(b.name)),
    [data]
);
```

**Anti-patterns to Avoid**:
- Duplicate state management between components
- Using entire arrays as dependencies when only length matters
- Missing return values from custom hooks

#### Performance Optimization

**Memoization**:
- Use `useMemo` for sorting, filtering, and data transformations
- Always spread arrays before sorting: `[...array].sort()`
- Prefer specific dependencies (`data.length` vs `data`)

**API Calls**:
- Always implement cleanup to prevent setting state on unmounted components

```javascript
// ✅ CORRECT: Safe API call with cleanup
useEffect(() => {
    let isMounted = true;
    
    api.fetchData()
        .then((data) => {
            if (isMounted) {
                setState(data);
            }
        })
        .catch((err) => {
            if (isMounted) {
                setError(err);
            }
        });
        
    return () => {
        isMounted = false;
    };
}, []);
```

#### Pagination Implementation

**Key Components**:
- `usePagination` hook in `/src/hooks/usePagination.js`
- `Pagination` component in `/src/components/member/Pagination.js`
- `PageSizeSelector` component

**Denali Design System Implementation**:
```javascript
// ✅ CORRECT: Using Denali toggle system for page numbers
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

// ✅ CORRECT: Navigation buttons with Denali classes
<button
    className="button is-outline is-small"
    disabled={!hasPrevious}
    onClick={handlePreviousClick}
>
    <Icon icon='arrow-left' />
    Previous
</button>

// ✅ CORRECT: Page size selector with Denali input
<div className={`input has-arrow ${compact ? 'is-small' : ''}`}>
    <select value={value} onChange={handleChange}>
        {options.map((option) => (
            <option key={option} value={option}>
                {option}
            </option>
        ))}
    </select>
</div>
```

**Critical Requirements**:
```javascript
// Use data.length, not data, to prevent page resets
useEffect(() => {
    setCurrentPage(1);
}, [data.length]);

// Memoize sort operations
const sortedData = useMemo(() => 
    [...data].sort((a, b) => a.memberName.localeCompare(b.memberName)),
    [data]
);

const pagination = usePagination(sortedData, PAGINATION_DEFAULT_ITEMS_PER_PAGE);
```

**Denali Component Patterns**:
- **Page Numbers**: Use `toggle` system with `is-active` for current page
- **Navigation**: Use `button is-outline is-small` classes
- **Dropdowns**: Use `input has-arrow` with proper sizing (`is-small`)
- **Unified Styling**: All components follow Denali size and state conventions

#### State Management
- Use Redux for global state
- Implement proper selectors
- Handle loading states consistently

#### Error Handling
- Implement error boundaries
- Display user-friendly error messages
- Handle network failures gracefully
- Always provide fallback values for configuration flags

### Code Quality
- Follow ESLint rules and Prettier formatting
- Use meaningful variable and function names
- Write self-documenting code

This guide provides the essential information needed to understand and develop the Athenz UI codebase effectively.
