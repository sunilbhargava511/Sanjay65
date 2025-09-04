# Database Export/Import Functionality

This application now includes database export and import functionality for backup and restoration purposes.

## Features

### Database Export
- Download a complete backup of your SQLite database
- Exported as a `.db` file with timestamp
- Access via `/admin/database` page or API endpoint `/api/admin/export-db`

### Database Import
- Upload a database backup file to replace current database
- Automatic backup creation before import
- Validates file type (.db files only)
- Access via `/admin/database` page or API endpoint `/api/admin/import-db`

## Usage

### Via Web Interface
1. Navigate to `/admin/database`
2. Use the Export button to download current database
3. Use the Import section to upload a backup file

### Via API

#### Export Database
```bash
curl http://localhost:3000/api/admin/export-db -o backup.db
```

#### Import Database
```bash
curl -X POST http://localhost:3000/api/admin/import-db \
  -F "database=@backup.db"
```

## File Locations
- Database location: `data/zerofinanx.db`
- Automatic backups: `data/zerofinanx_backup_[timestamp].db`

## Security Notes
- These endpoints should be protected with authentication in production
- Consider adding role-based access control
- Validate uploaded files thoroughly before import