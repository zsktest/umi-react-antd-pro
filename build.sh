#!/bin/bash

NODE_ENV=$(echo $1)
echo "env ${NODE_ENV}"
echo "start npm install"
npm install --unsafe-perm=true --allow-root
if [ "$NODE_ENV" = "dev" ]
then
  echo "start build dev"
  npm run dev
elif [ "$NODE_ENV" = "staging" ]
then
  echo "start build staging"
  npm run staging
elif [ "$NODE_ENV" = "private" ]
then
  echo "start build private"
  npm run staging
else
  echo "start build online"
  npm run online
fi

data_dir="./docker/data/html"
rm -Rf ${data_dir}
mkdir -p ${data_dir}
cp -R ./dist/* ${data_dir}
echo "finish cp dist file to ${data_dir}"
