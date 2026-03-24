# Digital Library Management System

Modern web system for library management with an elegant and professional design based on Material-UI. This project implements all the required features for the **Mini Library Management System Challenge**.

## ✨ Main Features

### 📚 Book Management (Complete CRUD)
- ✅ **Add books**: Complete form with title, author, ISBN, publisher, year, genre and description
- ✅ **Edit books**: Modification of all fields of an existing book
- ✅ **Delete books**: Deletion with security confirmation
- ✅ **Complete list**: Display of all books with detailed information

### 🔄 Check-in/Check-out System
- ✅ **Check-out (Lend)**: Mark books as borrowed with borrower information
  - Borrower's name
  - Borrower's email
  - Due date
- ✅ **Check-in (Return)**: Mark books as returned and available
- ✅ **Visual states**: Clear indicators of each book's status

### 🔍 Search System
- ✅ **Real-time search** by:
  - Book title
  - Author
  - ISBN
  - Genre
  - Publisher
- ✅ **Filters by status**:
  - All books
  - Available only
  - Checked out only

### 🎨 User Interface
- Modern and professional design with Material-UI
- Responsive design for mobile and tablets
- Intuitive sidebar navigation
- SweetAlert2 confirmations for critical actions
- Visual effects and smooth animations
- **Fixed input visibility issue**: Text is now clearly visible when typing

## 🚀 Project Structure

```
front-libreria/
├── public/              # Static files
├── src/
│   ├── assets/         # Resources (images, icons)
│   ├── components/     # Reusable components
│   │   ├── atoms/     # Atomic components (BookDialog, CheckOutDialog)
│   │   ├── layouts/   # Application layouts
│   │   └── router/    # Routing components
│   ├── config/        # Configurations
│   ├── context/       # Context API (AuthContext)
│   ├── data/          # Static data
│   ├── hooks/         # Custom hooks
│   ├── interface/     # TypeScript interfaces
│   ├── modulos/       # Application modules
│   │   └── pages/    # Main pages (LoginPage, DashboardPage)
│   ├── services/      # API services (bookService, apiClient)
│   ├── styles/        # Theme and styles
│   ├── test/          # Organized tests
│   ├── utils/         # Utility functions
│   ├── App.tsx        # Main component
│   ├── main.tsx       # Entry point
│   └── routes.tsx     # Routes configuration
└── package.json
```

## 🛠️ Technologies

- **React 18** with TypeScript
- **Material-UI v6** (components, icons)
- **React Router v7** for navigation
- **Zustand** for state management
- **Axios** for HTTP calls
- **SweetAlert2** for dialogs and confirmations
- **Vite** as build tool
- **ESLint + Prettier** for code quality
- **Jest + Testing Library** for unit tests

## 📦 Installation and Execution

### Prerequisites
- Node.js 18 or higher
- npm or yarn

### Installation Steps

1. **Clone the repository** (if applicable):
```bash
git clone <repository-url>
cd front-libreria
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables** (optional):

Create `.env` file in the project root:
```bash
VITE_API_URL=http://localhost:5000/api
```

**Note**: If the API URL is not configured, the application will work in local mode with sample data.

4. **Start the development server**:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

### Login Credentials (Local Mode)
- **User**: any username
- **Password**: any password

*Note: In local mode, authentication is simulated for demonstration purposes.*

## 🚀 Available Scripts

### Development
```bash
npm run dev
```
Starts the development server at `http://localhost:8080`

### Build
```bash
npm run build          # Production
npm run build-dev      # Development
npm run build-test     # Testing
```

### Code Quality
```bash
npm run lint           # Run linter
npm run format         # Format code
npm run format-check   # Check format
```

### Testing
```bash
npm run test           # Tests with coverage
npm run test:watch     # Tests in watch mode
npm run test:coverage  # Coverage report
```

## 📱 Implemented Features

### 1. Main Dashboard
- Complete view of all books in the library
- Visual cards with detailed information for each book
- Status indicators (Available/Checked Out)
- Quick actions on each book

### 2. Book Management

#### Add New Book
1. Click on the "Add New Book" button
2. Complete the form with:
   - **Title** (required)
   - **Author** (required)
   - **ISBN** (required)
   - Publisher (optional)
   - Publication year (optional)
   - Genre (optional, selector with predefined options)
   - Description (optional)
3. Click on "Add Book"

#### Edit Existing Book
1. Click on the edit icon (pencil) on any book
2. Modify the desired fields
3. Click on "Save Changes"

#### Delete Book
1. Click on the delete icon (trash) on any book
2. Confirm the action in the confirmation dialog

### 3. Loan System

#### Check Out a Book
1. Click on the "Check Out" button on an available book
2. Complete borrower information:
   - Borrower's name
   - Borrower's email
   - Due date
3. Click on "Check Out Book"
4. The book will change its status to "Checked Out"

#### Check In a Book
1. Click on the "Check In" button on a borrowed book
2. Confirm the return
3. The book will be available again

### 4. Search and Filters

#### Text Search
- Use the search bar at the top
- Search is real-time and searches in:
  - Title
  - Author
  - ISBN
  - Genre
  - Publisher

#### Status Filters
- Dropdown selector with options:
  - **All**: Shows all books
  - **Available**: Only books that can be borrowed
  - **Checked Out**: Only books currently on loan

### Login Page
- Two-column design with editorial branding
- Left panel with image and brand value
- Authentication form with validation
- Visual effects and smooth animations

### Dashboard Page
- Sidebar navigation with persistent menu
- Top bar with notifications and settings
- Global search system
- List of books with states (checked-in/checked-out)
- Cards with hover effect and "book spine"
- Quick actions (edit, delete, check-in/out)

## 🌐 API Services

The application is designed to work with a REST API backend, but includes a **local mode** that works offline for demonstration purposes.

### Expected Endpoints

```
GET    /api/books              # Get all books
GET    /api/books/:id          # Get a book by ID
POST   /api/books              # Create a new book
PUT    /api/books/:id          # Update a book
DELETE /api/books/:id          # Delete a book
POST   /api/books/:id/checkout # Mark book as checked out
POST   /api/books/:id/checkin  # Mark book as returned
GET    /api/books/search?q=    # Search books
```

### API Client Structure

- `apiClient.ts`: Axios client configured with:
  - Configurable base URL by environment variable
  - Interceptors to automatically add authentication token
  - Automatic handling of 401 errors (logout)
  - 10-second timeout

- `bookService.ts`: Specific service for book operations with:
  - Complete CRUD methods
  - Check-in/check-out handling
  - Book search
  - Error handling with fallback to local mode

### Local Mode

If the backend is not available, the application automatically:
- Uses preloaded sample data
- Saves changes in local memory
- Shows notifications informing the operating mode
- Allows testing all features without backend

## 🎨 Design System

The project implements the **"The Digital Curator"** design system, which treats library management as a high-end editorial experience:

### Design Principles
- **Tonal Architecture**: Space definition through subtle changes in background values
- **Professional Color Palette**: Based on deep blues and architectural grays
- **Dual Typography**: Manrope for titles and headings, Inter for content and data
- **No Traditional Borders**: Use of background layers to create visual hierarchy
- **Glassmorphism Effects**: Floating indicators with blur and transparency

### Implementation Guidelines
- **Don't use 1px borders**: Separation by background changes
- **Surface hierarchy**: Visual layers like sheets of paper
- **Gradients in primary actions**: From primary to primary-container
- **Intentional spacing**: Minimum 1.5rem between sections
- **No traditional shadows**: Ambient shadows with primary tint
- **Rounded borders**: Minimum 12px, preference for 16px

## 🎨 Color System

```css
Primary: #00478d (main), #005eb8 (light)
Secondary: #4c6074
Success: #005412, #1d6e25 (container)
Error: #ba1a1a, #ffdad6 (container)
Background: #f7fafc (surface), #ffffff (paper)
Surface Variants: 
  - surface-container-lowest: #ffffff
  - surface-container-low: #f1f4f6
  - surface-container: #ebeef0
  - surface-container-high: #e5e9eb
Text:
  - primary: #181c1e (clearly visible in all inputs)
  - secondary: #424752
  - disabled: #727783
```

## 🔐 Authentication

The system has a basic authentication context:

- **AuthContext**: Provides authentication state
- **useAuth**: Hook to access context
- **ProtectedRoute**: Component to protect private routes

## 🎯 Design Guidelines

The project follows specific design principles:

- **Don't use 1px borders**: Separation by background changes
- **Surface hierarchy**: Visual layers like sheets of paper
- **Gradients in primary actions**: From primary to primary-container
- **Intentional spacing**: Minimum 1.5rem between sections
- **No traditional shadows**: Ambient shadows with primary tint
- **Rounded borders**: Minimum 12px, preference for 16px

## 📄 Code Structure

### Main Components

#### `DashboardPage.tsx`
Main component that handles:
- Book state
- Search and filters
- CRUD operations
- Confirmation dialogs

#### `BookDialog.tsx`
Modal form to add/edit books with:
- Required field validation
- Genre selection
- Optional fields

#### `CheckOutDialog.tsx`
Form to register loans with:
- Borrower information
- Email validation
- Due date selection

### Services

#### `bookService.ts`
Service that encapsulates all API operations:
- getAllBooks()
- getBookById(id)
- createBook(book)
- updateBook(id, book)
- deleteBook(id)
- checkOutBook(id, borrowerInfo)
- checkInBook(id)
- searchBooks(query)

### TypeScript Interfaces

```typescript
interface Book {
   id?: number;
   title: string;
   author: string;
   isbn: string;
   publisher?: string;
   publicationYear?: number;
   genre?: string;
   description?: string;
   status: 'checked-in' | 'checked-out';
   borrowerName?: string;
   borrowerEmail?: string;
   borrowDate?: string;
   dueDate?: string;
}
```

## 🧪 Testing

```bash
npm run test           # Tests with coverage
npm run test:watch     # Tests in watch mode
npm run test:coverage  # Coverage report
```

## 🚀 Build and Deployment

### Build for Production
```bash
npm run build
```
Generates optimized files in the `dist/` folder

### Preview Build
```bash
npm run preview
```
Preview production build locally

### Deployment
The project can be deployed on:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Google Cloud Platform
- Heroku

**Note**: Make sure to configure appropriate environment variables on the deployment platform.

## 📝 Features Checklist (Assignment)

### Minimum Features ✅
- ✅ **Book Management**: Add, edit and delete books with complete metadata
  - Title, author, ISBN (required)
  - Publisher, publication year, genre, description (optional)
- ✅ **Check-in/Check-out**: Complete loan system
  - Mark books as borrowed with borrower information
  - Return books and mark them as available
  - Visual status tracking
- ✅ **Search**: Search by title, author, ISBN, genre and publisher
  - Real-time search
  - Status filters (all/available/checked out)

### Additional Features
- ✅ Modern and responsive interface
- ✅ Confirmations for critical actions
- ✅ Form validation
- ✅ Visual status indicators
- ✅ Local mode without backend needed
- ✅ Error handling with informative messages
- ✅ Scalable and maintainable architecture
- ✅ **Fixed input visibility**: Text is now clearly visible when typing

### Suggested Future Improvements
- [ ] SSO authentication system
- [ ] User roles and permissions (admin, librarian, reader)
- [ ] Admin dashboard with statistics
- [ ] Complete transaction history
- [ ] Reports and data export
- [ ] Email notification system
- [ ] QR/ISBN code scanning with camera
- [ ] Integration with book APIs (Google Books, Open Library)
- [ ] AI book recommendations
- [ ] Reservation system
- [ ] Automatic late fees
- [ ] Public search catalog
- [ ] Native mobile app

## 🐛 Bug Fixes

### Input Visibility Issue (Fixed)
**Problem**: Text was not visible when typing in input fields due to color contrast issues.

**Solution**: Updated theme configuration in `styles/theme.ts` to explicitly set input text color:
```typescript
'& input': {
   color: '#181c1e',
},
'& textarea': {
   color: '#181c1e',
},
```

## 🌍 Language
All interface text is in English for international accessibility.

## 📄 License

Academic project for library management system.
