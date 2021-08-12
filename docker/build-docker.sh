appname="xybot-console"
ver=$1
if [ -z "$ver" ]; then
  echo 'docker image tag is require!'
  exit 1
fi

echo "docker image ${appname}:${ver}"

ver=$1
docker build -t registry-vpc.cn-hangzhou.aliyuncs.com/winrobot/${appname}:${ver} .
docker push registry-vpc.cn-hangzhou.aliyuncs.com/winrobot/${appname}:${ver}
