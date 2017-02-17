FROM node:boron

# Copy application files
COPY . /usr/src/app
WORKDIR /usr/src/app

# Install Node.js dependencies
RUN npm install pm2 -g --silent
RUN npm install --production --silent
RUN npm run compile
CMD ["pm2-docker", "app.json"]
