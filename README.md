# TPM Impact Tracker

A web application for Technical Program Managers, Program Managers, Project Managers, and Business Operations professionals to track, quantify, and communicate their impact aligned with Intuit's Craft Skills framework.

**Live App:** https://tpm-impact-tracker-client.vercel.app

## Features

- **Impact Capture** - Log your contributions with AI-assisted classification
- **Dashboard** - Visualize your impact with charts and filters by job family and time period
- **Career Framework** - Browse craft skills and level expectations for TPM, PgM, PjM, and BizOps
- **Summary Generation** - Generate Mid-Year (H1) and End-Year (FY) PDF reports
- **Multi-User Support** - Secure authentication with Supabase
- **Intuit Fiscal Year** - Built around Intuit's Aug 1 - Jul 31 fiscal calendar

## Tech Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth)
- **Hosting:** Vercel
- **PDF Generation:** jsPDF

## Getting Started

### Prerequisites

- Node.js 18+
- A Supabase account

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/mudaud-boop/tpm-impact-tracker.git
   cd tpm-impact-tracker
   ```

2. **Create a Supabase project**
   - Go to [supabase.com](https://supabase.com) and create a new project
   - Run the SQL in `supabase-schema.sql` in the SQL Editor

3. **Configure environment variables**
   ```bash
   cp client/.env.example client/.env
   ```
   Edit `client/.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. **Install dependencies and run**
   ```bash
   cd client
   npm install
   npm run dev
   ```

5. **Access the app**
   - Open http://localhost:5173
   - Enter the access code (default: `impact2024`)
   - Sign up with your email

### Changing the Access Code

Edit `client/src/pages/AccessGate.tsx` line 10:
```typescript
const ACCESS_CODE = 'your-new-code';
```

## Job Families Supported

| Job Family | Specific Craft Skill |
|------------|---------------------|
| TPM | Technical Domain Expertise |
| PgM | Domain Expertise |
| PjM | Domain Expertise |
| BizOps | Solve Business Problems |

All job families share these craft skills:
- Connect Strategy to Execution
- Execute with Rigor
- Enable Scale and Velocity
- Lead Change

## Impact Categories

- Risk Prevented
- Decision Accelerated
- Launch Unblocked
- Time Saved
- Process Improved
- Change Delivered
- Technical Leadership

## License

MIT
