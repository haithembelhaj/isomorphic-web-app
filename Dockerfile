FROM node:boron

EXPOSE 3000

# Copy application files
COPY . /usr/src/app
WORKDIR /usr/src/app

# Install Node.js dependencies
RUN npm install pm2 -g --silent
RUN npm install --production --silent

# Add `node_modules/.bin` to $PATH
ENV PATH /usr/src/node_modules/.bin:$PATH

RUN npm run compile

CMD ["pm2-docker", "app.json"]


