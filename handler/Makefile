default:
	docker run -it -v ${PWD}:${PWD} -w ${PWD} --rm node:7.7-alpine npm install
	docker build -t gianarb/wikidiff-handler .
single:
	docker run -it -v ${PWD}:${PWD} --cpus 1 --memory 500MB -v ${HOME}/.aws/credentials:/root/.aws/credentials --network micro-net --name tmp-handler -w ${PWD} --rm node node:7.7-alpine index.js
deploy:
	docker push gianarb/wikidiff-handler
