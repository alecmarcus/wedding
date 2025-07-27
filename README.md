# wedding

Website for managing a wedding event. Built with RedwoodSDK for Cloudflare Workers.

---

## First time setup

### Prerequisites

- bun v1.2+
- Node.js >= 18.x
- [Resend](https://resend.com) account

### Setup

1. Install dependencies
   ```sh
   bun install
   ```

1. Generate the Prisma client
   ```sh
   bun run prisma generate
   ```

1. (Optional) Create an initial migration
   ```sh
   bun run migrate:new --name init
   ```

1. Start the dev server
   ```sh
   bun run dev
   ```

1. Run first-time setup (dev server must be running)
   ```sh
   bun run init
   ```

### Auth setup (one time)

These instructions are also available from the [rwsdk docs](https://docs.rwsdk.com/core/authentication/).

#### Session signing

You can use any string for your auth secret key during local dev, but production should use a cryptographically secure key for session signing. To set one:

1. Generate a 32-byte random key and encode it as base64
   ```sh
   openssl rand -base64 32
   ```

2. Copy the output and put the secret to Cloudflare:
   ```sh
   bunx wrangler secret put AUTH_SECRET_KEY
   ```

   Paste the output into the following prompt.


#### Turnstile

The site is also configured to use Turnstile for bot protection.

1. [Set up Turnstile in Cloudflare](https://dash.cloudflare.com/?to=/:account/turnstile):
  - Set `Widget Mode` to invisible
  - Add your site’s hostname to `Allowed hostnames`, e.g., my-app.example.com

1. Copy your `Site Key` and set the corresponding secret in production:
   ```sh
   bunx wrangler secret put TURNSTILE_SITE_KEY
   ```
   Note: don't update the local key, it's already set to [a development key provided by Cloudflare](https://developers.cloudflare.com/turnstile/troubleshooting/testing/).

1. Do the same for your `Turnstile Secret Key`:
   ```sh
   bunx wrangler secret put TURNSTILE_SECRET_KEY
   ```
   As above, the local key is already set for testing.


### Resend (emails)

1. Create a Resend account and get your API key. Paste it into your local `.env` file, and put it to Cloudflare:
   ```sh
   bunx wrangler secret put RESEND_API
   ```
1. [Configure your domain](https://resend.com/domains) to send mail via Resend
1. Update your local `.env` and remote secret with an email address at the configured domain:
   ```sh
   bunx wrangler secret put FROM_EMAIL
   ```

---

## Local dev & worker environment

```sh
bun run dev
```

### Managing local worker state

Reset local state (wipe D1, migrations, durable state)
```sh
bun run clean:worker
```

#### D1 Databases

Apply migrations locally
```sh
bun run migrate:dev
```

Seed initial data
```sh
bun run seed
```

#### R2 Storage

Make sure your `.env` R2 binding matches the one in `wrangler.jsonc`.
Interact with R2 via the Workers API using the `R2_BUCKET` binding in your code.

---

## Production & deployment

### Environments
Use Wrangler environment aliases for multiple stages: `production` (default) and `staging`.
- Preview staging: `wrangler publish --env staging --dry-run`
- Deploy to staging: `wrangler publish --env staging`
- Deploy to production: `wrangler publish`

### DNS & Custom Domains
Configure your custom domains and routes in the Cloudflare dashboard under Workers → Routes.

### Wrangler & D1 Setup

1. Create a remote D1 database (if you haven’t already):
   ```sh
   bunx wrangler d1 create my-wedding-db
   ```
1. Copy the returned `database_id` into `wrangler.jsonc` under `d1_databases`.

### Remote Migrations

Apply migrations to your production D1:

```sh
bun run migrate:prd
```

### Build & Deploy

Run the release script to build, bundle, and deploy:

```sh
bun run release
```

This will:
- Ensure required env is present
- Clean and build your assets
- Run `prisma generate`
- Deploy to your Cloudflare Workers environment

You can monitor deployments via the Cloudflare dashboard or with `wrangler tail`.

---

## Tips & troubleshooting

- Stream logs: `wrangler tail --env production` for real-time insights.
- Schema updates: always create new migrations (`bun run migrate:new`) instead of altering existing ones.
- R2 cache: version your object keys or purge Worker cache when updating assets.
- Debug Durable Objects using the Workers Inspector: https://developers.cloudflare.com/workers/view/logs/#inspector


## Further reading

- RedwoodSDK Docs: https://docs.rwsdk.com
- Cloudflare Workers: https://developers.cloudflare.com/workers
- Prisma (D1) Guide: https://www.prisma.io/docs
- R2 Storage: https://developers.cloudflare.com/r2/
