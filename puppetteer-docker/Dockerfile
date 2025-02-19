FROM node:latest

# We don't need the standalone Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

# Install Google Chrome Stable and fonts
# Note: this installs the necessary libs to make the browser work with Puppeteer.
RUN apt-get update && apt-get install gnupg wget -y && \
    wget --quiet --output-document=- https://dl-ssl.google.com/linux/linux_signing_key.pub | gpg --dearmor > /etc/apt/trusted.gpg.d/google-archive.gpg && \
    sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' && \
    apt-get update && \
    apt-get install google-chrome-stable -y --no-install-recommends && \
    rm -rf /var/lib/apt/lists/*


# Set the working directory
WORKDIR /app


# Copy the rest of the application code
COPY . .


# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install the dependencies
RUN npm install

RUN npm i puppeteer

RUN npm i puppeteer-core

RUN npm install nodemailer

RUN npm install xlsx

RUN  npm install -g json-diff


#Install Cron
RUN apt-get update
RUN apt-get -y install cron

# Add the cron job
#RUN crontab -l | { cat; echo "* * * * * /usr/local/bin/node /app/app.js"; } | crontab -

# Expose the default Puppeteer port
EXPOSE 6000


# Set the entrypoint script
ENTRYPOINT [ "node", "app.js" ]
#CMD cron && tail -f /app/app.js