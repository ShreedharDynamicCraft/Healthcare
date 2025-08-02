# Git Workflow Instructions

## Automatic Updates

The repository now includes an auto-update system to keep all changes synchronized.

### Quick Update Script
```bash
# Run this anytime to update the repository
./scripts/auto-update.sh
```

### Manual Git Commands
```bash
# Check current status
git status

# Add all changes
git add .

# Commit with message
git commit -m "Your commit message here"

# Push to remote
git push

# Pull latest changes
git pull
```

### Development Workflow

1. **Make your changes** to the codebase
2. **Test locally** to ensure everything works
3. **Run auto-update script** or commit manually:
   ```bash
   ./scripts/auto-update.sh
   ```
4. **Verify** changes are pushed to GitHub

### Branch Information
- **Current branch**: main
- **Remote**: origin (GitHub: ShreedharDynamicCraft/Healthcare)

### Recent Improvements
- ✅ Fixed sidebar navigation without page refresh
- ✅ Added active navigation states with visual feedback
- ✅ Implemented proper Next.js routing
- ✅ Created dedicated pages for Appointments, Queue, Specialists, and Patients
- ✅ Auto-close mobile sidebar on navigation
- ✅ Complete Allo Health branding consistency
- ✅ **NEW: Persistent Dark Mode Toggle** - Available on all pages
- ✅ **NEW: Comprehensive Specialists Management** - Real data fetching, sorting, filtering
- ✅ **NEW: Complete Patients Management** - Full CRUD interface with export capabilities
- ✅ **NEW: Advanced Filtering & Sorting** - Multi-column sorting and comprehensive filters
- ✅ **NEW: Data Export (CSV/PDF)** - Export filtered data with professional formatting
- ✅ **NEW: Responsive Data Tables** - Mobile-friendly table layouts
- ✅ **NEW: Real-time Search** - Instant search across all data fields

### Navigation Features
- **No page refresh** when clicking sidebar items
- **Active state highlighting** for current page
- **Mobile-responsive** sidebar with auto-close
- **Smooth animations** and transitions
- **Professional admin interface**
- **Dark mode toggle** available in both mobile and desktop sidebars
- **Persistent theme** - remembers user preference across sessions

### Data Management Features
- **Real-time filtering** across all data fields
- **Multi-column sorting** with visual indicators
- **Bulk selection** for mass operations
- **CSV/PDF export** with professional formatting
- **Advanced search** with instant results
- **Responsive tables** that work on all screen sizes
- **Smart pagination** for large datasets

### Project Structure
```
frontend/
├── src/app/
│   ├── dashboard/
│   │   ├── page.tsx (Overview)
│   │   ├── appointments/page.tsx (Appointment Management)
│   │   ├── queue/page.tsx (Live Queue Management)
│   │   ├── specialists/page.tsx (Healthcare Specialists)
│   │   └── patients/page.tsx (Patient Records)
│   └── page.tsx (Landing)
├── components/
│   ├── layouts/DashboardLayout.tsx (Main layout with dark mode)
│   ├── DarkModeToggle.tsx (Theme switcher)
│   └── ThemeProvider.tsx (Theme context)
├── lib/
│   ├── stores/
│   │   ├── auth-store.ts
│   │   └── theme-store.ts (Dark mode persistence)
│   ├── api.ts (Enhanced API functions)
│   └── exportUtils.ts (CSV/PDF export utilities)
└── ...
```

All navigation now works seamlessly without page refreshes, dark mode persists across sessions, and comprehensive data management is available with export capabilities!
