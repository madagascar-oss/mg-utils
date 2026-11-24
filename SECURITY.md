# Security policy

Report vulnerabilities privately through
[GitHub private vulnerability reporting](https://github.com/madagascar-oss/mg-utils-js/security/advisories/new).
Never use public issues. We reply within 72 hours.

Only the latest minor release of each package receives security fixes.

How the project limits risk:

- Zero runtime dependencies; dev dependencies are kept current by Renovate.
- Packages are published only from CI with npm trusted publishing and provenance.
- Parsers that read user input (phone numbers, Ariary amounts) have fuzz-style tests and
  bounded input length.

See also the [organisation security policy](https://github.com/madagascar-oss/.github/blob/main/SECURITY.md).
