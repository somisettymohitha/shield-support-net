

# Gender-Responsive Domestic Violence Support Platform

## Design System
- **Calm & supportive** palette: soft lavender, teal accents, warm neutrals
- Rounded corners, gentle shadows, accessible fonts
- Panic/quick-exit button on every page (discreet but accessible)
- Mobile-first responsive design (victims may only have phone access)

## Pages & Features

### 1. Landing Page
- Hero with helpline numbers (Women Helpline 181, Police 100, NCW 7827-170-170)
- Quick-exit button that redirects to Google instantly
- Overview cards: Get Help, Know Your Rights, Types of Counseling, Contact Police

### 2. Sign Up / Login
- Role-based registration: Victim/Survivor, Counsellor, Legal Advisor
- Admin created manually (not public registration)
- Email & password authentication via Supabase/Lovable Cloud
- User profiles table with role assignments

### 3. Dashboard (Role-based)
- **Victim/Survivor**: Access resources, upload evidence (photo/video), file FIR link, contact police, connect with counsellor
- **Counsellor**: View assigned cases, provide guidance, monitor progress, update session notes
- **Legal Advisor**: Update legal resources, provide legal advice, assist with case actions
- **Admin**: Manage users & roles, manage content (laws, resources), view analytics

### 4. Know Your Rights — Indian Laws by Year
- Categorized legal information:
  - Protection of Women from Domestic Violence Act, 2005
  - Indian Penal Code Section 498A
  - Dowry Prohibition Act, 1961
  - Sexual Harassment of Women at Workplace Act, 2013
  - Criminal Law Amendment Act, 2013
  - Recent amendments and landmark judgments
- Filterable by year and category
- Legal advisors can add/edit law entries via admin panel

### 5. File an FIR
- Step-by-step guide on how to file an FIR
- Direct link to the National Commission for Women online complaint portal
- Link to state-specific e-FIR portals
- Option to upload evidence (photos/videos) stored securely in Supabase Storage

### 6. Contact Police
- One-tap call buttons for emergency numbers (100, 181, 112)
- List of nearby police stations (state-wise directory)
- WhatsApp helpline links where available

### 7. Evidence Upload
- Secure photo and video upload for victims
- Files stored privately (only accessible to the victim, assigned counsellor, and legal advisor)
- Upload history with timestamps
- RLS policies ensuring strict access control

### 8. Types of Counseling
- **Crisis Counseling** — immediate emotional support
- **Trauma/PTSD Therapy** — long-term recovery (highlighted as primary)
- **Legal Counseling** — understanding legal options
- **Group Support** — peer support sessions
- Each type with description, what to expect, and how to connect
- Link to request a counseling session

### 9. Resources Page
- Shelter homes directory (state-wise)
- NGO listings and helplines
- Health resources (physical and mental health impacts of DV)
- Financial assistance programs
- Admin-managed content (add/edit/delete resources)

### 10. Support Chat / Connect
- Request form to connect with a counsellor or legal advisor
- Counsellors can view and respond to requests from their dashboard
- Session progress tracking

## Database Structure
- **profiles** — user profile data linked to auth
- **user_roles** — separate roles table (admin, victim, counsellor, legal_advisor)
- **laws** — legal resources with year, category, description
- **resources** — support services, shelters, helplines
- **evidence_uploads** — file references with access control
- **counseling_requests** — victim-to-counsellor connection requests
- **session_notes** — counsellor progress notes
- Storage bucket for secure evidence files

## Security
- Row-Level Security on all tables
- Evidence files only accessible to uploader + assigned professionals
- Quick-exit button clears session visually
- No browsing history hints in page titles (generic titles like "Support Resources")

