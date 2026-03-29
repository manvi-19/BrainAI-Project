# BrainAI Database Setup Guide

## Prerequisites

You need to have MySQL server installed and running on your system.

### Windows Installation

1. Download MySQL Community Server from https://dev.mysql.com/downloads/mysql/
2. Run the installer and follow the setup wizard
3. Remember the root password you set
4. MySQL typically runs on `localhost:3306`

### macOS Installation

```bash
brew install mysql
brew services start mysql
mysql_secure_installation
```

### Linux Installation

```bash
sudo apt-get install mysql-server
sudo mysql_secure_installation
sudo systemctl start mysql
```

## Database Setup

### 1. Create the Database

Open MySQL command line or MySQL Workbench:

```sql
CREATE DATABASE brainai;
USE brainai;
```

### 2. Update Environment Variables

Edit `.env.local` in the BrainAI folder:

```env
DATABASE_URL="mysql://root:your_password@localhost:3306/brainai"
```

Replace:

- `root` with your MySQL username
- `your_password` with your MySQL password
- `localhost:3306` if running on a different host/port

### 3. Run Prisma Migrations

From the BrainAI directory, run:

```bash
npx prisma migrate dev --name init
```

This will:

- Create all the database tables
- Generate the Prisma client

### 4. Verify Database Setup

You can view the database schema using:

```bash
npx prisma studio
```

This opens a web interface to view/manage your database.

## Database Schema

The database includes the following tables:

- **User**: Stores user credentials and profile information
- **MriUpload**: Stores uploaded MRI images (as binary data)
- **Analysis**: Stores analysis results linked to uploads

## Testing

After setup, the app will:

1. Allow users to register with email/password
2. Save uploaded MRI images to the database
3. Store analysis results with references to the images

## Troubleshooting

### Connection Error

- Check that MySQL is running
- Verify DATABASE_URL is correct
- Ensure the database `brainai` exists

### Permission Denied

- Check your MySQL username and password
- Verify the user has privileges on the `brainai` database

### Table Not Found

- Run: `npx prisma migrate dev --name init`
- Check Prisma generated files in `prisma/` folder

## Backup

To backup your database:

```bash
mysqldump -u root -p brainai > brainai_backup.sql
```

To restore:

```bash
mysql -u root -p brainai < brainai_backup.sql
```
