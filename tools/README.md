# Repository tools

Supporting repository utility resources belong here when needed. Script implementations live in root `scripts/`, executable entry points in root `bin/`, and CLI orchestration in the root `justfile`.

Keep application-specific development, test, build, and Docker configuration inside the owning prototype, including its own `scripts/` and `bin/` when needed. Root just recipes may delegate to those commands. Do not introduce utilities before there is a concrete workflow to support.
