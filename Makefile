b:
	docker-compose build
d:
	docker-compose down --remove-orphans
u:
	docker-compose up -d
ud:
	docker-compose up

#https://www.percona.com/blog/2019/08/21/cleaning-docker-disk-space-usage/
#https://www.omgubuntu.co.uk/2016/08/5-ways-free-up-space-on-ubuntu
prune:
	docker system prune --volumes
	docker image prune -a -f
	du -sh /var/cache/apt/archives

