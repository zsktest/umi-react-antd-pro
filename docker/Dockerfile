# 依赖镜像：https://hub.docker.com/_/nginx
FROM nginx:1.19.0
RUN mkdir -p /etc/nginx/logs/
ADD data/html/ /usr/share/nginx/html/
ADD config/nginx.conf /etc/nginx/nginx.conf
RUN chmod -R 755 /usr/share/nginx/html/
