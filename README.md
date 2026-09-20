# Digital Adoption Readiness Tool

A human-centred web tool that helps small-business owners identify one realistic digital improvement and start with a practical next step.

## Academic project

- **Subject:** Design Thinking and Innovation
- **Student:** Paurash Jha
- **Programme:** BE CSE AI & ML
- **Institution:** Chandigarh University
- **Academic level:** Semester 1

## Live website

[Open the Digital Adoption Readiness Tool](https://digital-adoption-readiness-tool.netlify.app/)

## Project report

The polished semester-project report is available in [`docs/Digital_Adoption_Readiness_Tool_Semester_Project_Report.pdf`](docs/Digital_Adoption_Readiness_Tool_Semester_Project_Report.pdf).

## What the tool does

The tool uses a short seven-question check-in to understand a business's current digital readiness. It covers four areas:

1. Digital payments
2. Online presence
3. Records and organisation
4. Marketing and customer connection

It then calculates a readiness percentage and creates a prioritised roadmap with practical, free-to-try recommendations. The interface supports English, Hindi, and Punjabi.

## Design thinking process

The project follows the five stages of design thinking:

- **Empathise:** understand the daily reality and confidence levels of small-business owners.
- **Define:** identify the need for a clear, manageable starting point.
- **Ideate:** combine a short assessment with a practical action roadmap.
- **Prototype:** build a responsive, multilingual web experience.
- **Test:** validate the browser flow, production build, automated tests, and database save.

## Technology

- React and TypeScript
- Vite
- Express and tRPC
- Drizzle ORM
- MySQL-compatible database
- Netlify for the public frontend deployment

## Local development

```bash
pnpm install
pnpm dev
```

For validation:

```bash
pnpm check
pnpm test
pnpm build
```

The database-backed version requires the appropriate environment variables, including `DATABASE_URL`. Never commit `.env` files, database credentials, OAuth secrets, or API keys.

## Repository contents

- `client/` — frontend pages and components
- `server/` — Express, tRPC, authentication, and persistence logic
- `drizzle/` — database schema and migrations
- `docs/` — semester project report and interface screenshot
- `shared/` — shared constants and types
