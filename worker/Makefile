default:
	docker run -it -v ${PWD}:${PWD} -w ${PWD} --rm node npm install
	docker build -t gianarb/wikidiff-worker .
deploy: default
	docker push gianarb/wikidiff
single:
	docker run -it -v ${PWD}:${PWD} --cpus 1 --memory 500MB -v ${HOME}/.aws/credentials:/root/.aws/credentials --network micro-net --name tmp-test -w ${PWD} --rm node node index.js
