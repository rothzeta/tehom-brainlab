# P2-FIX1 derived arithmetic input (E52)

`multiplier-overflow.json` copies the API-generated Girtablilu parity seed and
changes only the embedded Rupture Venom multiplier to `2147483647`, reproducing
review finding F2. The replay CLI must reject it at content validation with the
specific bound `B2 poison`. The source parity fixture is unchanged.
