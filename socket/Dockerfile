FROM node:13.7.0-alpine

# Set working directory. Paths will be relative this WORKDIR.
WORKDIR /etc/chatbot/socket

COPY package*.json ./
RUN npm install

EXPOSE 7000

COPY . .

# Run the app
CMD [ "npm", "start" ]
