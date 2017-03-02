default:
	docker run -it -v ${PWD}:${PWD} -w ${PWD} --rm node npm install
	docker build -t gianarb/wikidiff .
deploy: default
	docker push gianarb/wikidiff
single:
	docker run -it -v ${PWD}:${PWD} -v ${HOME}/.aws/credentials:/root/.aws/credentials --network wikidiff_micro-net --name tmp-test -w ${PWD} --rm node node index.js
