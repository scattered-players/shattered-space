#!/bin/bash -ex


# yarn run dist 
# cp -R root/* dist/
# cp how.md dist/how.md
# cp -R janus-demos dist/janus-demos
# cp -r login/* dist/login &
wait

aws s3 sync ./dist s3://mirrors.live

echo 'DONE!'
