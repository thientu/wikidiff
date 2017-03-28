default:
	docker run -it -v ${PWD}:${PWD} -w ${PWD} --rm node npm install
	docker build -t gianarb/wikidiff-worker .
single:
	docker run -it -v ${PWD}:${PWD} --cpus 1 --memory 500MB -v ${HOME}/.aws/credentials:/root/.aws/credentials --network browserworker_default --name tmp-test -w ${PWD} --rm node npm start
deploy:
	docker push gianarb/wikidiff-worker
