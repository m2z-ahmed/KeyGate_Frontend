const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

# App Project

Use this repository to run and edit the app locally.

## Prerequisites

1. Clone the repository using the project's Git URL.
2. Navigate to the project directory.
3. Install dependencies: `npm install`.

## Run Locally

Run the frontend from the project root:

```bash
npm run dev
```

This starts the local frontend dev server. Open the local URL printed by Vite in your browser.

For example, if you have a backend service configured separately, you can still use this frontend with the appropriate API base URL.

```json5
{
  "site": {
    "serveCommand": "npm run dev"
  }
}
```

## Run Only The Frontend

Run the frontend with:

```bash
npm run dev
```

Open the local URL printed by Vite.

## Use a Hosted Backend

For frontend-only development, create or update `.env.local` in the project root:

```bash
VITE_APP_ID=your_app_id
VITE_APP_BASE_URL=https://your-backend.example.com
```

`VITE_APP_ID` identifies the app.

`VITE_APP_BASE_URL` is used by the frontend when making API requests.

## Publish Your Changes

After pushing your changes to git, publish the app through your normal deployment flow.

## Docs & Support

Documentation: [https://docs.example.com](https://docs.example.com)

Support: [https://app.example.com/support](https://app.example.com/support)
