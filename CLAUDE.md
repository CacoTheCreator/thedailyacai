# The Daily Acai - Project Documentation

## Project Overview

**Name:** The Daily Grind by Jero
**Type:** Acai Bowl Customizer Web Application
**Platform:** Lovable AI-generated React application
**Live Project:** https://lovable.dev/projects/56cfb14c-c561-46e3-99cc-99e6c7488f50
**Repository:** Local Git with Lovable integration

### Business Context
Interactive bowl builder for "Nativo Acai" allowing customers to customize acai bowls with different sizes and unlimited toppings, then place orders via WhatsApp (pending integration).

---

## Tech Stack

### Core
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Build tool (port 8080)
- **React Router 6.30.1** - Client-side routing

### UI Framework
- **shadcn/ui** - 49 headless components
- **Radix UI** - Accessibility primitives
- **Tailwind CSS 3.4.17** - Utility-first styling
- **Lucide React** - Icon library

### State & Forms
- **TanStack React Query 5.83.0** - Server state (installed, not used)
- **React Hook Form 7.61.1** - Form management (installed, not used)
- **Zod 3.25.76** - Schema validation

### Additional
- **Sonner** - Toast notifications
- **Date-fns** - Date utilities
- **Next Themes** - Dark/light mode

---

## Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components (49)
│   ├── BowlBuilder.tsx     # Main bowl customization component
│   └── NavLink.tsx         # Router navigation wrapper
├── pages/
│   ├── Index.tsx           # Home page (renders BowlBuilder)
│   └── NotFound.tsx        # 404 page
├── hooks/
│   ├── use-mobile.tsx      # Mobile breakpoint detection
│   └── use-toast.ts        # Toast state management
├── lib/
│   └── utils.ts            # cn() class merge utility
├── assets/
│   └── acai-hero.jpg       # Hero image
├── App.tsx                 # Root component with routing
├── main.tsx                # React DOM entry
└── index.css               # Global styles & design system
```

---

## Key Component: BowlBuilder.tsx

### State
```typescript
selectedSize: string | null       // Bowl size ID
selectedToppings: string[]        // Selected topping names
lastToggled: string | null        // Animation tracking
```

### Data Structures
```typescript
interface BowlSize {
  id: string
  name: string
  size: string
  originalPrice: number
  price: number
  description: string
  popular?: boolean
}

interface Topping {
  name: string
  category: string
  popular?: boolean
  emoji?: string
}
```

### Bowl Sizes (Hardcoded)
| ID | Name | Size | Original | Price | Discount |
|----|------|------|----------|-------|----------|
| go1010 | Go 10/10 | 290ml | $6,500 | $5,500 | 15% |
| tipico | Tipico (Popular) | 350ml | $7,600 | $6,500 | 15% |
| clasico | Bowl Clasico de la Suerte | 420ml | $9,100 | $7,700 | 15% |

### Topping Categories
- **Crunch:** Granola crunchy sin azucar, Granola avena miel, Cacao nibs
- **Frutas:** Banana, Frutilla, Arandanos, Mango, Kiwi, Pina
- **Dulces Naturales:** Miel, Mantequilla de mani, Mantequilla de pistachos

---

## Design System

### Colors (HSL Variables)
```css
/* Light Mode */
--background: 60 8% 95%        /* Light cream */
--primary: 184 58% 43%         /* Medium cyan */
--accent: 276 47% 46%          /* Deep purple */

/* Dark Mode */
--background: 215 28% 17%      /* Dark blue-gray */
--primary: 187 100% 50%        /* Bright cyan */
--accent: 270 100% 85%         /* Light purple */
```

### Custom Animations
- `fade-in` - Opacity + Y translation
- `scale-in` - Scale + opacity
- `soft-pop` - Quick scale pulse
- `soft-glow` - Cyan glow expansion
- `check-in` - Checkmark rotation
- `slide-up` - Upward slide + fade
- `shimmer` - Horizontal shimmer

### Typography
- **Body:** Inter (sans-serif)
- **Display:** Space Grotesk (headings)

---

## Commands

```bash
npm run dev      # Start dev server (localhost:8080)
npm run build    # Production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

---

## Current Status

### Implemented
- [x] Bowl size selection with pricing
- [x] Unlimited topping selection
- [x] Real-time price calculation
- [x] Order summary with savings display
- [x] Responsive design (mobile-first)
- [x] Dark mode support (infrastructure)
- [x] Micro-interactions and animations

### Pending
- [ ] WhatsApp order integration
- [ ] Backend API connection
- [ ] User authentication
- [ ] Order history
- [ ] Admin dashboard

---

## Conventions

### Code Style
- Functional components only
- TypeScript interfaces for all data
- Tailwind utilities in JSX (no external CSS)
- shadcn/ui for all UI primitives

### File Naming
- Components: PascalCase (`BowlBuilder.tsx`)
- Hooks: kebab-case (`use-mobile.tsx`)
- Utils: kebab-case (`utils.ts`)

### State Management
- Local state with useState for UI
- TanStack Query ready for server state
- No global state currently needed

---

# BRIEFS - Technical Specifications

## Brief System Documentation

Each brief is a technical specification for a feature implementation. Briefs maintain consistency across chat sessions by tracking:

1. **Context** - Background and requirements
2. **Timeline** - Progress history with dates
3. **Learnings** - Discoveries during implementation
4. **Changes** - Modifications made to the codebase
5. **Tasks** - Pending, in progress, and completed items

### Brief Template

```markdown
## BRIEF-XXX: [Feature Name]

### Context
[Background, requirements, user stories]

### Timeline
| Date | Event | Notes |
|------|-------|-------|
| YYYY-MM-DD | Created | Initial brief |

### Learnings
- [Discovery 1]
- [Discovery 2]

### Changes
- `file.tsx` - [Description of change]

### Tasks
#### Pending
- [ ] Task 1
- [ ] Task 2

#### In Progress
- [ ] Task 3

#### Completed
- [x] Task 4
```

---

## BRIEF-001: WhatsApp Order Integration

### Context
Enable customers to send their customized bowl order directly to the business via WhatsApp. The button currently exists but is disabled with the message "Integracion de WhatsApp proximamente".

### Timeline
| Date | Event | Notes |
|------|-------|-------|
| 2025-12-01 | Created | Initial brief during codebase analysis |

### Learnings
- WhatsApp Business API or simple wa.me links can be used
- Order data needs to be formatted as a message string
- Button component already exists in BowlBuilder.tsx (line ~280)

### Changes
- None yet

### Tasks
#### Pending
- [ ] Define WhatsApp number for orders
- [ ] Create order message formatter function
- [ ] Implement wa.me link generation
- [ ] Add UTM tracking parameters
- [ ] Test on mobile and desktop
- [ ] Remove "proximamente" text and enable button

#### In Progress
- None

#### Completed
- [x] Identify integration point in codebase

---

## BRIEF-002: Backend API Integration

### Context
Connect the frontend to a backend service for dynamic pricing, product management, and order persistence. TanStack Query is already installed.

### Timeline
| Date | Event | Notes |
|------|-------|-------|
| 2025-12-01 | Created | Initial brief during codebase analysis |

### Learnings
- TanStack React Query 5.83.0 is installed and configured
- QueryClient is initialized in App.tsx
- No API endpoints currently exist

### Changes
- None yet

### Tasks
#### Pending
- [ ] Define API architecture (REST vs GraphQL)
- [ ] Choose backend platform (Supabase, Firebase, custom)
- [ ] Create API service layer
- [ ] Migrate hardcoded bowl sizes to API
- [ ] Migrate hardcoded toppings to API
- [ ] Implement order submission endpoint
- [ ] Add loading and error states

#### In Progress
- None

#### Completed
- [x] Analyze current data structures

---

## BRIEF-003: Product Customization Enhancements

### Context
Expand the bowl customization options with additional features like extras, portions, and special requests.

### Timeline
| Date | Event | Notes |
|------|-------|-------|
| 2025-12-01 | Created | Initial brief during codebase analysis |

### Learnings
- Current toppings are unlimited and free
- No portion sizes for toppings
- No premium/paid extras system

### Changes
- None yet

### Tasks
#### Pending
- [ ] Define premium toppings with prices
- [ ] Add topping portion sizes (normal, extra)
- [ ] Implement special requests text field
- [ ] Add dietary preference filters
- [ ] Create topping recommendations

#### In Progress
- None

#### Completed
- None

---

## BRIEF-004: UI/UX Improvements

### Context
Ongoing UI/UX refinements based on user feedback and best practices.

### Timeline
| Date | Event | Notes |
|------|-------|-------|
| 2025-12-01 | Created | Initial brief during codebase analysis |
| Previous | Stars removed | Removed star indicators from toppings |
| Previous | Mobile toppings | Updated toppings UI for mobile |
| Previous | Micro-interactions | Added animations |

### Learnings
- Mobile-first approach is working well
- Users appreciate smooth animations
- Sticky order summary improves UX

### Changes
- `BowlBuilder.tsx` - Removed stars from toppings
- `BowlBuilder.tsx` - Updated mobile topping layout
- Various - Added micro-interactions

### Tasks
#### Pending
- [ ] Add image previews for toppings
- [ ] Implement bowl visualization
- [ ] Add order confirmation modal
- [ ] Improve accessibility (ARIA labels review)
- [ ] Add keyboard shortcuts

#### In Progress
- None

#### Completed
- [x] Remove star indicators from toppings
- [x] Update mobile toppings UI
- [x] Add micro-interactions

---

## Lovable Prompts Guide

### How to Use These Prompts
Copy and paste these prompts into Lovable to implement features. Each prompt references the corresponding brief for context.

### Prompt Format
```
[BRIEF-XXX] [Feature Name]

Context: [Brief summary]

Implementation:
1. [Step 1]
2. [Step 2]
...

Technical Details:
- [Detail 1]
- [Detail 2]

Acceptance Criteria:
- [ ] [Criterion 1]
- [ ] [Criterion 2]
```

---

## Next Steps Prompts for Lovable

### PROMPT-001: WhatsApp Integration
```
[BRIEF-001] WhatsApp Order Integration

Context: We need to enable the WhatsApp order button that's currently
disabled in BowlBuilder.tsx. When clicked, it should open WhatsApp
with a pre-formatted order message.

Implementation:
1. Create a function formatOrderMessage() that generates a readable
   order summary including:
   - Selected bowl size and price
   - All selected toppings grouped by category
   - Total price and savings
   - Customer-friendly formatting with emojis

2. Create a function generateWhatsAppLink(message, phoneNumber) that:
   - URL-encodes the message
   - Returns a wa.me link with the phone number and message
   - Phone number format: 56XXXXXXXXX (Chile)

3. Update the order button in the Order Summary section:
   - Remove disabled state
   - Remove "proximamente" text
   - Add onClick handler that opens WhatsApp link
   - Change button text to "Pedir por WhatsApp"

4. Add the WhatsApp phone number as a constant at the top of
   BowlBuilder.tsx (to be provided)

Technical Details:
- Use window.open() with _blank target for the WhatsApp link
- Format: https://wa.me/56XXXXXXXXX?text=ENCODED_MESSAGE
- Include line breaks (%0A) in the message for readability

Acceptance Criteria:
- [ ] Button is enabled when bowl is complete (size + topping selected)
- [ ] Clicking opens WhatsApp with correct phone number
- [ ] Message includes all order details in readable format
- [ ] Works on both mobile (opens WhatsApp app) and desktop (opens web)
- [ ] Message is in Spanish
```

### PROMPT-002: Loading States
```
[BRIEF-002] Add Loading States for Future API Integration

Context: Prepare the UI for backend integration by adding proper
loading states. This is foundational work for BRIEF-002.

Implementation:
1. Create a loading skeleton for bowl size cards:
   - Use the existing Skeleton component from shadcn/ui
   - Match the card dimensions and layout
   - Animate with shimmer effect

2. Create a loading skeleton for toppings section:
   - Grid of skeleton buttons matching topping layout
   - Maintain responsive grid (3 columns mobile, 4 desktop)

3. Add isLoading state to BowlBuilder component:
   - Default to false (current behavior)
   - Show skeletons when true
   - Add smooth transition between loading and loaded states

4. Add subtle loading indicator to order summary:
   - Show when order is being processed
   - Use existing animation utilities

Technical Details:
- Import Skeleton from @/components/ui/skeleton
- Use Tailwind animate-pulse or custom shimmer animation
- Maintain layout stability (no content shifting)

Acceptance Criteria:
- [ ] Loading skeletons match final component dimensions
- [ ] Smooth transitions between states
- [ ] No layout shift when loading completes
- [ ] Accessible loading indicators (aria-busy)
```

### PROMPT-003: Bowl Visualization
```
[BRIEF-004] Add Interactive Bowl Visualization

Context: Help customers visualize their customized bowl as they
add toppings. This enhances the ordering experience and reduces
uncertainty.

Implementation:
1. Create a new component BowlPreview.tsx:
   - Circular bowl shape with acai base
   - Visual representation of selected toppings
   - Animated topping additions

2. Design the bowl visualization:
   - Use CSS for the bowl shape (gradient background)
   - Position toppings in a visually appealing arrangement
   - Each topping category has a distinct visual style
   - Scale bowl size based on selected size

3. Add topping icons/images:
   - Use emoji as fallback
   - Position randomly but aesthetically within bowl
   - Animate entrance when topping is selected

4. Integrate into BowlBuilder:
   - Show above or beside the toppings section
   - Mobile: Above toppings, smaller size
   - Desktop: Sticky sidebar position

5. Add visual feedback:
   - Topping appears with soft-pop animation
   - Subtle glow when complete
   - Size change animation when bowl size changes

Technical Details:
- Use absolute positioning within relative container
- CSS gradients for acai base appearance
- Framer Motion or CSS animations for entrance effects
- Responsive sizing with Tailwind

Acceptance Criteria:
- [ ] Bowl accurately reflects selected size
- [ ] All selected toppings are visible
- [ ] Smooth animations for additions/removals
- [ ] Responsive layout on all screen sizes
- [ ] Doesn't obstruct topping selection
```

### PROMPT-004: Order Confirmation Modal
```
[BRIEF-004] Add Order Confirmation Modal

Context: Before sending to WhatsApp, show a confirmation modal
so customers can review their order. This reduces errors and
improves trust.

Implementation:
1. Use the existing Dialog component from shadcn/ui

2. Create OrderConfirmationModal component:
   - Header: "Confirma tu pedido"
   - Order summary with clear formatting
   - Bowl size with description
   - Toppings list by category
   - Price breakdown (original, discount, final)
   - Edit button to go back
   - Confirm button to proceed to WhatsApp

3. Update order flow:
   - Primary button opens confirmation modal first
   - Modal confirm button triggers WhatsApp
   - Modal has close/back functionality

4. Styling:
   - Match existing design system
   - Clear visual hierarchy
   - Mobile-optimized layout

Technical Details:
- Import Dialog, DialogContent, DialogHeader, etc.
- Pass order data as props
- Handle onConfirm and onCancel callbacks

Acceptance Criteria:
- [ ] Modal shows complete order summary
- [ ] Price breakdown is clear and accurate
- [ ] User can close and edit order
- [ ] Confirm proceeds to WhatsApp
- [ ] Accessible (focus trap, keyboard navigation)
- [ ] Mobile-friendly layout
```

### PROMPT-005: Premium Toppings
```
[BRIEF-003] Add Premium Toppings with Additional Cost

Context: Introduce premium toppings that have an additional cost,
allowing for business differentiation and upselling.

Implementation:
1. Update Topping interface:
   - Add optional price field
   - Add isPremium boolean flag

2. Add premium toppings to the catalog:
   - Premium category with items like:
     - Acai extra (+$1,000)
     - Proteina whey (+$1,200)
     - Mantequilla de almendras (+$800)
   - Visual distinction (gold/special styling)

3. Update price calculation:
   - Sum base bowl price + premium topping prices
   - Show breakdown in order summary
   - Update savings calculation

4. Update UI:
   - Premium badge on special toppings
   - Price shown on premium topping buttons
   - Clear indication in order summary

5. Update WhatsApp message:
   - Include premium toppings with prices
   - Show detailed price breakdown

Technical Details:
- Extend existing Topping interface
- Group premium toppings separately or with badge
- Use gold/accent color for premium items

Acceptance Criteria:
- [ ] Premium toppings show price
- [ ] Total updates correctly with premium items
- [ ] Visual distinction for premium options
- [ ] WhatsApp message includes premium details
- [ ] Clear price breakdown in order summary
```

---

## Session Continuity Guidelines

### Starting a New Session
1. Reference this CLAUDE.md file for project context
2. Check the relevant brief for the feature being worked on
3. Review the timeline and learnings sections
4. Pick up from the in-progress or next pending task

### During a Session
1. Update brief timeline with significant events
2. Document learnings as discoveries are made
3. Track file changes in the changes section
4. Move tasks between pending/in-progress/completed

### Ending a Session
1. Update task statuses in relevant briefs
2. Add any new learnings discovered
3. Document all file changes made
4. Note any blockers or dependencies for next session

### Cross-Session Communication
When referencing previous work:
```
Continuing from BRIEF-XXX:
- Last session completed: [task]
- Current status: [in-progress task]
- Next steps: [pending tasks]
```

---

## Appendix: File Reference

### Main Files to Modify
| Feature | Primary Files |
|---------|--------------|
| Bowl Builder | `src/components/BowlBuilder.tsx` |
| Styling | `src/index.css`, `tailwind.config.ts` |
| Routing | `src/App.tsx` |
| New Components | `src/components/` |
| UI Primitives | `src/components/ui/` |

### Configuration Files
| File | Purpose |
|------|---------|
| `package.json` | Dependencies and scripts |
| `tailwind.config.ts` | Theme and design tokens |
| `vite.config.ts` | Build configuration |
| `tsconfig.app.json` | TypeScript settings |
| `components.json` | shadcn/ui configuration |

---

*Last Updated: 2025-12-01*
*Version: 1.0.0*
