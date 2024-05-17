FROM node:20.11-slim as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
USER node
WORKDIR /tracka
COPY --chown=node:node package.json .
COPY --chown=node:node pnpm-lock.yaml .
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
COPY --chown=node:node . .

FROM base as build
USER node
ENV NODE_ENV production
RUN pnpm build && pnpm prune --prod

FROM node:20.11.1-alpine as production
USER node
WORKDIR /tracka
COPY --chown=node:node --from=build /tracka/node_modules ./node_modules
COPY --chown=node:node --from=build /tracka/dist ./dist
EXPOSE 3333
CMD [ "node", "dist/main.js" ]
