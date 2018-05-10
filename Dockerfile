FROM node:8.11.1

# install dependencies
WORKDIR /opt/app
COPY package.json package-lock.json* ./
RUN npm install && npm cache clean --force

# copy app source to image _after_ npm install so that
# application code changes don't bust the docker cache of npm install step
COPY . /opt/app

# set application PORT and expose docker PORT, 80 is what Elastic Beanstalk expects
ENV PORT 80
EXPOSE 80

CMD [ "npm", "run", "start" ]