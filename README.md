# bun-supertokens-issue

A reproduction repo for an issue of Bun v1.1.26 incompatible with SuperTokens.

## How to reproduce the issue
1. `asdf install` (it installs Bun v1.1.26 and Node.js v20.17.0 locally.)
2. `npm install`
3. `node main.mjs` (it works well.)
4. `bun main.mjs` (it shows the following error!)

```
JsonWebTokenError: error in secret or public key callback: The JWKS endpoint did not contain any signing keys
```