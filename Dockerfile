FROM node:18

# Bundle app source
ADD . .

# Expose
EXPOSE 5000

# Run
CMD ["yarn", "start"]
