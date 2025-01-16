# Base stage with the correct Node.js version
FROM node:18.20.2-alpine as base

# Builder stage
FROM base as builder

WORKDIR /app

COPY package*.json yarn.lock ./  
RUN yarn install

COPY . .

RUN yarn build

# Runtime stage
FROM base as runtime

ENV NODE_ENV=production

WORKDIR /app

COPY package*.json yarn.lock ./  
COPY --from=builder /app /app

EXPOSE 3000

CMD ["yarn", "start"]





# FROM node:20 as builder

# WORKDIR /app

# COPY package.json yarn.lock ./

# RUN yarn install

# COPY . .
# RUN yarn build

# WORKDIR /app

# COPY --from=builder /app /app

# RUN yarn install --production

# EXPOSE 3000

# # Start the application
# CMD ["yarn", "start"]
